// Usage: pnpm ops:import [--file ops/data/catalogo.csv] [--apply] [--active]
// Loads products, variants, cost and inventory per branch (Shopify location) from one CSV.
// Dry-run by default: prints the plan and the problems, writes nothing.
// Copy to ops/import-catalog.mjs; needs ops/lib/admin.mjs from the agentic-shop template.
//
// Verified against shopify.dev (Admin GraphQL 2026-10, checked 2026-11-03):
//   productSet(input: ProductSetInput!, synchronous: Boolean, identifier: ProductSetIdentifiers)  scope write_products
//   variants[].inventoryQuantities[] { locationId, name: "available", quantity }
// [UNVERIFIED] identifier { handle }, input.files[] { originalSource, contentType: IMAGE }.
import { readFileSync, mkdirSync, appendFileSync } from "node:fs";
import { assertNoUserErrors, gql, hasAdminCredentials } from "./lib/admin.mjs";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const fileArg = args.indexOf("--file");
const file = fileArg >= 0 ? args[fileArg + 1] : "ops/data/catalogo.csv";
const doApply = flag("apply");
const status = flag("active") ? "ACTIVE" : "DRAFT";

// --- CSV (RFC 4180: quotes, commas and newlines inside quotes) ---
function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.some((v) => v.trim() !== ""));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

const rows = parseCsv(readFileSync(file, "utf8").replace(/^﻿/, ""));
const branchCols = Object.keys(rows[0] ?? {}).filter((k) => k.startsWith("inv:"));
const branches = branchCols.map((k) => k.slice(4).trim());
const problems = [];
const num = (v) => (v == null || v === "" ? null : Number(v.replace(/[$,\s]/g, "")));

// --- Group rows into products ---
const products = new Map();
const skus = new Set();
rows.forEach((r, i) => {
  const line = i + 2; // header is line 1
  if (!r.handle) return problems.push(`línea ${line}: sin handle`);
  if (!products.has(r.handle)) products.set(r.handle, { handle: r.handle, title: r.title, description: r.description, vendor: r.vendor,
    productType: r.product_type, tags: r.tags ? r.tags.split(";").map((t) => t.trim()).filter(Boolean) : [], image: r.image_url, variants: [] });
  const p = products.get(r.handle);
  if (!p.title && r.title) p.title = r.title;
  if (!r.sku) problems.push(`línea ${line}: sin SKU`);
  else if (skus.has(r.sku)) problems.push(`línea ${line}: SKU repetido ${r.sku}`);
  skus.add(r.sku);
  const price = num(r.price);
  if (price == null || Number.isNaN(price)) problems.push(`línea ${line} (${r.sku}): sin precio`);
  const cost = num(r.cost);
  if (cost == null) problems.push(`línea ${line} (${r.sku}): sin costo (no habrá margen)`);
  const stock = {};
  branchCols.forEach((col, j) => {
    const q = num(r[col]);
    if (q != null && (!Number.isInteger(q) || q < 0)) problems.push(`línea ${line} (${r.sku}): inventario inválido en ${branches[j]}: "${r[col]}"`);
    stock[branches[j]] = Number.isInteger(q) && q >= 0 ? q : 0;
  });
  const options = [];
  if (r.option1_name && r.option1_value) options.push({ optionName: r.option1_name, name: r.option1_value });
  if (r.option2_name && r.option2_value) options.push({ optionName: r.option2_name, name: r.option2_value });
  p.variants.push({ sku: r.sku, price, compareAt: num(r.compare_at_price), cost, options, stock });
});
for (const p of products.values()) if (!p.title) problems.push(`${p.handle}: sin título`);

// --- Plan ---
const totals = Object.fromEntries(branches.map((b) => [b, 0]));
let variantCount = 0;
for (const p of products.values()) for (const v of p.variants) {
  variantCount++;
  for (const b of branches) totals[b] += v.stock[b];
}
console.log(`${doApply ? "APLICANDO" : "DRY-RUN"} · ${file}`);
console.log(`- ${products.size} productos, ${variantCount} variantes, estado ${status}`);
for (const b of branches) console.log(`- ${b}: ${totals[b]} piezas`);

// --- Locations (needs credentials; dry-run without them still validates the CSV) ---
let locationIds = {};
if (hasAdminCredentials()) {
  const { locations } = await gql(`{ locations(first: 50) { nodes { id name isActive } } }`);
  const byName = new Map(locations.nodes.filter((l) => l.isActive).map((l) => [l.name.trim().toLowerCase(), l.id]));
  for (const b of branches) {
    const id = byName.get(b.toLowerCase());
    if (id) locationIds[b] = id;
    else problems.push(`sucursal "${b}" no existe en Shopify (ubicaciones activas: ${locations.nodes.map((l) => l.name).join(", ")})`);
  }
} else {
  console.log("- Sin credenciales de Admin API: solo validé el CSV (no revisé sucursales en Shopify).");
}

if (problems.length) {
  console.log(`\nProblemas (${problems.length}):`);
  for (const p of problems) console.log(`  · ${p}`);
}
const blocking = problems.filter((p) => !p.includes("sin costo"));
if (!doApply) {
  console.log("\nNada se cambió. Corre con --apply cuando la dueña lo apruebe.");
  process.exit(0);
}
if (!hasAdminCredentials()) { console.error("Faltan credenciales de Admin API en .env.local."); process.exit(1); }
if (blocking.length) { console.error("Hay problemas que impiden cargar. Corrige el CSV y vuelve a correr el dry-run."); process.exit(1); }

// --- Apply: one productSet per product ---
mkdirSync("ops/logs", { recursive: true });
const log = `ops/logs/import-${new Date().toISOString().slice(0, 10)}.jsonl`;
const optionNames = (p) => [...new Set(p.variants.flatMap((v) => v.options.map((o) => o.optionName)))];
let ok = 0;
for (const p of products.values()) {
  const names = optionNames(p);
  const input = {
    handle: p.handle, title: p.title, status, vendor: p.vendor || undefined, productType: p.productType || undefined, tags: p.tags,
    descriptionHtml: p.description ? `<p>${p.description.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c])}</p>` : undefined,
    productOptions: names.length
      ? names.map((n) => ({ name: n, values: [...new Set(p.variants.flatMap((v) => v.options.filter((o) => o.optionName === n).map((o) => o.name)))].map((name) => ({ name })) }))
      : [{ name: "Title", values: [{ name: "Default Title" }] }],
    files: p.image ? [{ originalSource: p.image, contentType: "IMAGE" }] : undefined,
    variants: p.variants.map((v) => ({
      optionValues: v.options.length ? v.options : [{ optionName: "Title", name: "Default Title" }],
      sku: v.sku, price: v.price, compareAtPrice: v.compareAt ?? undefined,
      inventoryItem: { tracked: true, ...(v.cost != null ? { cost: v.cost } : {}) },
      inventoryQuantities: branches.filter((b) => locationIds[b]).map((b) => ({ locationId: locationIds[b], name: "available", quantity: v.stock[b] })),
    })),
  };
  try {
    const res = await gql(
      `mutation Set($input: ProductSetInput!, $identifier: ProductSetIdentifiers) {
        productSet(input: $input, identifier: $identifier, synchronous: true) {
          product { id handle variants(first: 100) { nodes { sku } } }
          userErrors { field message }
        }
      }`,
      { input, identifier: { handle: p.handle } },
    );
    const { product } = assertNoUserErrors(res.productSet, `productSet ${p.handle}`);
    ok++;
    appendFileSync(log, JSON.stringify({ at: new Date().toISOString(), handle: p.handle, id: product.id, variants: product.variants.nodes.length, status: "ok" }) + "\n");
    console.log(`  ✓ ${p.handle} (${product.variants.nodes.length} variantes)`);
  } catch (err) {
    appendFileSync(log, JSON.stringify({ at: new Date().toISOString(), handle: p.handle, status: "failed", error: err.message }) + "\n");
    console.log(`  ✗ ${p.handle}: ${err.message}`);
  }
}
console.log(`\n${ok}/${products.size} productos cargados. Bitácora: ${log}. Ahora corre: pnpm ops:snapshot`);
