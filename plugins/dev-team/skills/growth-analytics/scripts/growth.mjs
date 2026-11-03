// Usage: pnpm ops:growth [--mock] [--days 30]
// Reads GA4 (traffic, funnel, product views) and joins it with the latest Shopify snapshot by SKU:
//   ops/data/growth-<date>.json + ops/reports/growth-<date>.md
// Copy to ops/growth.mjs; needs ops/lib/util.mjs from the agentic-shop template and a snapshot (pnpm ops:snapshot).
//
// GA4 Data API v1beta (checked 2026-11-03): POST https://analyticsdata.googleapis.com/v1beta/properties/{id}:runReport
// Auth: service account (JSON key outside the repo) added as Viewer on the GA4 property; scope analytics.readonly.
// Env: GA4_PROPERTY_ID (numbers only), GA4_KEY_FILE (path to the JSON key). Never print the key.
import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";
import path from "node:path";
import { DIRS, findLatest, localDate, parseArgs, readJson, writeJson, writeText } from "./lib/util.mjs";

const { flags } = parseArgs();
const daysIdx = process.argv.indexOf("--days");
const DAYS = daysIdx > 0 ? Number(process.argv[daysIdx + 1]) : 30;
const propertyId = process.env.GA4_PROPERTY_ID;
const keyFile = process.env.GA4_KEY_FILE;
const useMock = flags.has("mock") || !propertyId || !keyFile;

// --- Google auth: JWT bearer grant signed with the service account key ---
async function googleToken() {
  const key = JSON.parse(readFileSync(keyFile, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: key.client_email, scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  if (!res.ok) throw new Error(`No se pudo obtener el token de Google (HTTP ${res.status}). Revisa GA4_KEY_FILE.`);
  return (await res.json()).access_token;
}

async function runReport(token, body) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ dateRanges: [{ startDate: `${DAYS}daysAgo`, endDate: "yesterday" }], limit: 1000, ...body }),
  });
  if (!res.ok) throw new Error(`GA4 respondió HTTP ${res.status}. ¿La cuenta de servicio es Viewer de la propiedad ${propertyId}?`);
  const json = await res.json();
  const dims = (json.dimensionHeaders ?? []).map((h) => h.name);
  const mets = (json.metricHeaders ?? []).map((h) => h.name);
  return (json.rows ?? []).map((r) => ({
    ...Object.fromEntries(dims.map((d, i) => [d, r.dimensionValues[i].value])),
    ...Object.fromEntries(mets.map((m, i) => [m, Number(r.metricValues[i].value)])),
  }));
}

async function fetchGa4() {
  const token = await googleToken();
  const funnelMetrics = ["sessions", "addToCarts", "checkouts", "ecommercePurchases", "purchaseRevenue"].map((name) => ({ name }));
  const [channels, items, landing, devices] = await Promise.all([
    runReport(token, { dimensions: [{ name: "sessionDefaultChannelGroup" }], metrics: funnelMetrics }),
    runReport(token, { dimensions: [{ name: "itemId" }, { name: "itemName" }],
      metrics: ["itemsViewed", "itemsAddedToCart", "itemsPurchased", "itemRevenue"].map((name) => ({ name })) }),
    runReport(token, { dimensions: [{ name: "landingPage" }], metrics: [{ name: "sessions" }, { name: "ecommercePurchases" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 15 }),
    runReport(token, { dimensions: [{ name: "deviceCategory" }], metrics: funnelMetrics }),
  ]);
  return { source: "ga4", channels, items, landing, devices };
}

// Deterministic demo data shaped like the GA4 rows, using the snapshot's SKUs.
function mockGa4(snapshot) {
  const skus = snapshot.products.flatMap((p) => p.variants.map((v) => ({ sku: v.sku, name: p.title })));
  const items = skus.map(({ sku, name }, i) => {
    const viewed = 40 + ((i * 37) % 260);
    const added = Math.round(viewed * (0.04 + ((i * 7) % 10) / 100));
    return { itemId: sku, itemName: name, itemsViewed: viewed, itemsAddedToCart: added, itemsPurchased: Math.round(added * 0.4), itemRevenue: 0 };
  });
  const ch = (name, s) => ({ sessionDefaultChannelGroup: name, sessions: s, addToCarts: Math.round(s * 0.08), checkouts: Math.round(s * 0.035),
    ecommercePurchases: Math.round(s * 0.018), purchaseRevenue: Math.round(s * 0.018) * 520 });
  return {
    source: "mock",
    channels: [ch("Organic Social", 1240), ch("Direct", 610), ch("Organic Search", 380), ch("Paid Social", 290), ch("Referral", 60)],
    items,
    landing: [{ landingPage: "/", sessions: 1300, ecommercePurchases: 22 }, { landingPage: "/collections/all", sessions: 420, ecommercePurchases: 9 }],
    devices: [ch("mobile", 2150), ch("desktop", 430)],
  };
}

// --- Join with Shopify by SKU ---
const snapFile = await findLatest(DIRS.data, "snapshot-");
const snapshot = await readJson(snapFile);
const ga = useMock ? mockGa4(snapshot) : await fetchGa4();
if (useMock && !flags.has("mock")) console.warn("Sin GA4_PROPERTY_ID / GA4_KEY_FILE: uso datos de demostración (--mock).");

const sold = new Map();
for (const o of snapshot.orders) for (const li of o.lineItems) if (li.sku) sold.set(li.sku, (sold.get(li.sku) ?? 0) + li.quantity);
const bySku = new Map(ga.items.map((r) => [r.itemId, r]));
const products = snapshot.products.flatMap((p) => p.variants.map((v) => {
  const g = bySku.get(v.sku) ?? {};
  const views = g.itemsViewed ?? 0;
  const units = sold.get(v.sku) ?? 0;
  const alerts = [];
  if (views >= 100 && units / views < 0.01) alerts.push("mucha_vista_poca_venta"); // review photo, price, size guide
  if (views >= 50 && v.available <= 3) alerts.push("demanda_con_poco_stock");      // restock first
  if (views < 20 && v.available >= 10) alerts.push("poca_visibilidad");            // SEO, collection placement, content
  if (!g.itemId && views === 0) alerts.push("sin_datos_ga4");                      // item_id is not the SKU, or no traffic
  return { sku: v.sku, product: p.title, variant: v.title, views, addToCart: g.itemsAddedToCart ?? 0, unitsSold30d: units,
    viewToSale: views ? Math.round((units / views) * 1000) / 10 : null, available: v.available, locations: v.locations, flags: alerts };
}));

const sum = (rows, k) => rows.reduce((s, r) => s + (r[k] ?? 0), 0);
const funnel = { sessions: sum(ga.channels, "sessions"), addToCarts: sum(ga.channels, "addToCarts"), checkouts: sum(ga.channels, "checkouts"),
  purchasesGa4: sum(ga.channels, "ecommercePurchases"), ordersShopify: snapshot.orders.length };
const pct = (a, b) => (b ? `${Math.round((a / b) * 1000) / 10}%` : "—");
const date = localDate();
const out = { date, days: DAYS, source: { ga4: ga.source, shopify: snapshot.source }, funnel, channels: ga.channels, devices: ga.devices,
  landing: ga.landing, products };
const file = await writeJson(path.join(DIRS.data, `growth-${date}.json`), out);

const demo = ga.source === "mock" || snapshot.source === "mock";
const flagged = (f) => products.filter((p) => p.flags.includes(f));
const md = [
  `# Crecimiento · ${date} · últimos ${DAYS} días${demo ? " · DATOS DE DEMOSTRACIÓN" : ""}`,
  "",
  "## Embudo",
  `Sesiones ${funnel.sessions} → carrito ${funnel.addToCarts} (${pct(funnel.addToCarts, funnel.sessions)}) → checkout ${funnel.checkouts} (${pct(funnel.checkouts, funnel.addToCarts)}) → compras GA4 ${funnel.purchasesGa4} · pedidos Shopify ${funnel.ordersShopify}`,
  funnel.ordersShopify && Math.abs(funnel.purchasesGa4 - funnel.ordersShopify) / funnel.ordersShopify > 0.2
    ? "⚠️ GA4 y Shopify difieren más de 20%: revisar consentimiento, el pixel del checkout o pedidos fuera del sitio (tienda física, draft orders)." : null,
  "",
  "## Canales",
  "| Canal | Sesiones | Carrito | Compras | Conversión |", "|---|---:|---:|---:|---:|",
  ...ga.channels.sort((a, b) => b.sessions - a.sessions).map((c) => `| ${c.sessionDefaultChannelGroup} | ${c.sessions} | ${c.addToCarts} | ${c.ecommercePurchases} | ${pct(c.ecommercePurchases, c.sessions)} |`),
  "",
  "## Productos a revisar",
  `- Mucha vista, poca venta (${flagged("mucha_vista_poca_venta").length}): ${flagged("mucha_vista_poca_venta").slice(0, 5).map((p) => `${p.product} ${p.variant} (${p.views} vistas, ${p.unitsSold30d} u.)`).join("; ") || "ninguno"}`,
  `- Demanda con poco stock (${flagged("demanda_con_poco_stock").length}): ${flagged("demanda_con_poco_stock").slice(0, 5).map((p) => `${p.product} ${p.variant} (${p.available} pzas: ${p.locations.map((l) => `${l.name} ${l.available}`).join(", ")})`).join("; ") || "ninguno"}`,
  `- Poca visibilidad (${flagged("poca_visibilidad").length}): ${flagged("poca_visibilidad").slice(0, 5).map((p) => `${p.product} ${p.variant}`).join("; ") || "ninguno"}`,
  `- Sin datos de GA4 (${flagged("sin_datos_ga4").length}): revisar que item_id sea el SKU.`,
].filter((l) => l !== null).join("\n") + "\n";
const report = await writeText(path.join(DIRS.reports, `growth-${date}.md`), md);
console.log(md);
console.log(`-> ${path.relative(process.cwd(), file)} · ${path.relative(process.cwd(), report)}`);
