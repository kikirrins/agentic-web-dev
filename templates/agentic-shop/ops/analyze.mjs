// Usage: pnpm ops:analyze [YYYY-MM-DD]
// Reads ops/data/snapshot-<date>.json and writes:
//   ops/data/analysis-<date>.json  (for the /ops panel and propose.mjs)
//   ops/reports/<date>.md          (human report in Spanish)
import path from "node:path";
import {
  DAY_MS, DIRS, addDays, config, findLatest, localDate, money, parseArgs, readJson, round2, writeJson, writeText,
} from "./lib/util.mjs";

const EXCLUDED = new Set(["VOIDED", "EXPIRED"]); // not real sales

export function analyzeSnapshot(snap) {
  const now = new Date(snap.generatedAt);
  const date = localDate(now);
  const tz = config.timezone;
  const orders = snap.orders.filter((o) => !EXCLUDED.has(o.financialStatus));

  // Index variants -> product info.
  const variants = new Map();
  for (const p of snap.products) {
    for (const v of p.variants) variants.set(v.id, { ...v, productId: p.id, productTitle: p.title });
  }
  const variantsWithoutCost = [...variants.values()].filter((v) => v.unitCost == null).length;

  // ---- KPIs per period ------------------------------------------------------
  const periods = {
    today: { label: "Hoy", from: date },
    d7: { label: "Últimos 7 días", from: addDays(date, -6) },
    d30: { label: "Últimos 30 días", from: addDays(date, -29) },
  };

  // A customer is "nueva" in a period if her first-ever order is inside it:
  // lifetime order count == orders we see from her since the period started (or earlier in the window).
  const ordersByCustomer = new Map();
  for (const o of orders) {
    if (!o.customerId) continue;
    const list = ordersByCustomer.get(o.customerId) ?? [];
    list.push(o);
    ordersByCustomer.set(o.customerId, list);
  }

  const kpis = {};
  for (const [key, period] of Object.entries(periods)) {
    const inPeriod = orders.filter((o) => localDate(o.createdAt, tz) >= period.from);
    let gross = 0, discounts = 0, refunds = 0, marginRevenue = 0, marginCost = 0;
    const byProduct = new Map();
    const newCustomers = new Set(), returning = new Set();
    let guests = 0;

    for (const o of inPeriod) {
      discounts += o.discounts;
      refunds += o.refunded;
      for (const li of o.lineItems) {
        const revenue = li.price * li.quantity;
        gross += revenue;
        const v = variants.get(li.variantId);
        if (v?.unitCost != null) {
          marginRevenue += revenue;
          marginCost += v.unitCost * li.quantity;
        }
        const name = v?.productTitle ?? li.title;
        const row = byProduct.get(name) ?? { product: name, units: 0, sales: 0 };
        row.units += li.quantity;
        row.sales += revenue;
        byProduct.set(name, row);
      }
      if (!o.customerId) guests++;
      else {
        const seen = ordersByCustomer.get(o.customerId).length;
        const isNew = o.customerOrdersCount != null && o.customerOrdersCount <= seen &&
          ordersByCustomer.get(o.customerId).every((x) => localDate(x.createdAt, tz) >= period.from);
        (isNew ? newCustomers : returning).add(o.customerId);
      }
    }

    const net = gross - discounts - refunds;
    const rows = [...byProduct.values()].map((r) => ({ ...r, sales: round2(r.sales) }));
    kpis[key] = {
      label: period.label,
      from: period.from,
      to: date,
      grossSales: round2(gross),
      discounts: round2(discounts),
      refunds: round2(refunds),
      netSales: round2(net),
      orders: inPeriod.length,
      avgTicket: inPeriod.length ? round2(net / inPeriod.length) : 0,
      grossMargin: {
        amount: round2(marginRevenue - marginCost),
        pct: marginRevenue ? round2(((marginRevenue - marginCost) / marginRevenue) * 100) : null,
        coveredSales: round2(marginRevenue),
        variantsWithoutCost,
      },
      customers: { new: newCustomers.size, returning: returning.size, guests },
      topByUnits: [...rows].sort((a, b) => b.units - a.units).slice(0, 5),
      topBySales: [...rows].sort((a, b) => b.sales - a.sales).slice(0, 5),
    };
  }

  // ---- Net sales per day (30 days) -------------------------------------------
  const dailyNet = [];
  for (let i = 29; i >= 0; i--) {
    const day = addDays(date, -i);
    const net = orders
      .filter((o) => localDate(o.createdAt, tz) === day)
      .reduce((s, o) => s + o.lineItems.reduce((t, li) => t + li.price * li.quantity, 0) - o.discounts - o.refunded, 0);
    dailyNet.push({ date: day, net: round2(net) });
  }

  // ---- Order status -----------------------------------------------------------
  const count = (key) => orders.reduce((acc, o) => ({ ...acc, [o[key]]: (acc[o[key]] ?? 0) + 1 }), {});
  const { paidUnfulfilledHours, pendingPaymentHours, recentRefundDays } = config.attention;
  const attention = [];
  for (const o of snap.orders) {
    const hours = Math.round((now - new Date(o.createdAt)) / 36e5);
    const base = { id: o.id, name: o.name, createdAt: o.createdAt, total: o.total, hours,
      financialStatus: o.financialStatus, fulfillmentStatus: o.fulfillmentStatus };
    if (o.financialStatus === "PAID" && ["UNFULFILLED", "PARTIALLY_FULFILLED"].includes(o.fulfillmentStatus) && hours > paidUnfulfilledHours) {
      attention.push({ ...base, type: "paid_unfulfilled", reason: `Pagado y sin enviar desde hace ${hours} h` });
    } else if (o.financialStatus === "PENDING" && hours > pendingPaymentHours) {
      attention.push({ ...base, type: "pending_payment", reason: `Pago pendiente desde hace ${hours} h` });
    }
    // We only know when the order was created, not when it was refunded.
    if (o.refunded > 0 && hours <= recentRefundDays * 24) {
      attention.push({ ...base, type: "recent_refund", reason: `Reembolso de ${money(o.refunded, snap.currency)} (pedido de hace ${hours} h)` });
    }
  }
  attention.sort((a, b) => b.hours - a.hours);

  // ---- Inventory ----------------------------------------------------------------
  const { leadTimeDays, coverDays, velocityWindowDays, lowCoverDays, deadStock } = config;
  const unitsSince = (variantId, days) =>
    orders
      .filter((o) => now - new Date(o.createdAt) <= days * DAY_MS)
      .flatMap((o) => o.lineItems)
      .filter((li) => li.variantId === variantId)
      .reduce((s, li) => s + li.quantity, 0);

  const inventory = [...variants.values()].map((v) => {
    const unitsWindow = unitsSince(v.id, velocityWindowDays);
    const units30 = unitsSince(v.id, deadStock.noSalesDays);
    const velocity = round2(unitsWindow / velocityWindowDays);
    const stock = Math.max(v.available, 0);
    const coverage = velocity > 0 ? round2(stock / velocity) : null;

    const alerts = [];
    if (v.locations.some((l) => l.available < 0)) alerts.push("negative_stock");
    if (v.available <= 0) alerts.push("out_of_stock");
    else if (coverage != null && coverage < lowCoverDays) alerts.push("low_cover");
    if (units30 === 0 && v.available > deadStock.minUnits) alerts.push("dead_stock");

    const suggestedQty = Math.ceil(velocity * (leadTimeDays + coverDays)) - stock;
    const restock = velocity > 0 && suggestedQty > 0
      ? {
          suggestedQty,
          reason: `Vende ${velocity}/día (${unitsWindow} u. en ${velocityWindowDays} d); con ${stock} u. cubre ${coverage} días y necesitas ${leadTimeDays + coverDays} (entrega ${leadTimeDays} + cobertura ${coverDays}).`,
        }
      : null;

    return {
      variantId: v.id,
      inventoryItemId: v.inventoryItemId,
      productTitle: v.productTitle,
      variantTitle: v.title,
      sku: v.sku,
      unitCost: v.unitCost,
      available: v.available,
      locations: v.locations,
      units14: unitsWindow,
      units30,
      velocity,
      coverDays: coverage,
      alerts,
      restock,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    snapshotGeneratedAt: snap.generatedAt,
    date,
    source: snap.source,
    shop: snap.shop,
    currency: snap.currency,
    settings: { leadTimeDays, coverDays, velocityWindowDays, lowCoverDays, deadStock, attention: config.attention },
    kpis,
    dailyNet,
    orderStatus: {
      byFinancialStatus: count("financialStatus"),
      byFulfillmentStatus: count("fulfillmentStatus"),
      attention,
    },
    inventory: inventory.sort((a, b) => b.alerts.length - a.alerts.length || (a.coverDays ?? 1e9) - (b.coverDays ?? 1e9)),
    restock: inventory.filter((i) => i.restock).sort((a, b) => b.restock.suggestedQty - a.restock.suggestedQty),
  };
}

// ---- Markdown report (Spanish) -----------------------------------------------------
const ALERT_LABEL = {
  out_of_stock: "Agotado",
  low_cover: "Cobertura baja",
  dead_stock: "Stock muerto",
  negative_stock: "Inventario negativo",
};
const FIN_LABEL = { PAID: "Pagado", PENDING: "Pendiente", REFUNDED: "Reembolsado", PARTIALLY_REFUNDED: "Reembolso parcial", PARTIALLY_PAID: "Pago parcial", AUTHORIZED: "Autorizado", VOIDED: "Anulado", EXPIRED: "Vencido", UNKNOWN: "Desconocido" };
const FUL_LABEL = { FULFILLED: "Enviado", UNFULFILLED: "Sin enviar", PARTIALLY_FULFILLED: "Envío parcial", IN_PROGRESS: "En proceso", ON_HOLD: "En espera", SCHEDULED: "Programado", RESTOCKED: "Reabastecido", PENDING_FULFILLMENT: "Envío pendiente", OPEN: "Abierto" };

export function renderReport(a) {
  const m = (n) => money(n, a.currency);
  const lines = [];
  lines.push(`# Reporte diario · ${a.shop} · ${a.date}`, "");
  if (a.source === "mock") lines.push("> **Datos de demostración** (generados con `--mock`). No son ventas reales.", "");

  lines.push("## Ventas", "", "| Indicador | Hoy | 7 días | 30 días |", "|---|---:|---:|---:|");
  const k = a.kpis;
  const row = (label, fn) => lines.push(`| ${label} | ${fn(k.today)} | ${fn(k.d7)} | ${fn(k.d30)} |`);
  row("Ventas brutas", (p) => m(p.grossSales));
  row("Descuentos", (p) => m(p.discounts));
  row("Reembolsos", (p) => m(p.refunds));
  row("**Ventas netas**", (p) => `**${m(p.netSales)}**`);
  row("Pedidos", (p) => p.orders);
  row("Ticket promedio", (p) => m(p.avgTicket));
  row("Margen bruto est.", (p) => (p.grossMargin.pct == null ? "—" : `${m(p.grossMargin.amount)} (${p.grossMargin.pct}%)`));
  row("Clientas nuevas / recurrentes", (p) => `${p.customers.new} / ${p.customers.returning}`);
  lines.push("");
  if (k.d30.grossMargin.variantsWithoutCost) {
    lines.push(`_El margen solo considera variantes con costo; ${k.d30.grossMargin.variantsWithoutCost} variantes no tienen costo capturado._`, "");
  }

  lines.push("### Top 5 productos (30 días)", "", "| Por unidades | u. | Por ventas | Ventas |", "|---|---:|---|---:|");
  for (let i = 0; i < 5; i++) {
    const u = k.d30.topByUnits[i], s = k.d30.topBySales[i];
    lines.push(`| ${u?.product ?? ""} | ${u?.units ?? ""} | ${s?.product ?? ""} | ${s ? m(s.sales) : ""} |`);
  }
  lines.push("");

  lines.push("## Pedidos", "");
  const fin = Object.entries(a.orderStatus.byFinancialStatus).map(([s, n]) => `${FIN_LABEL[s] ?? s}: ${n}`).join(" · ");
  const ful = Object.entries(a.orderStatus.byFulfillmentStatus).map(([s, n]) => `${FUL_LABEL[s] ?? s}: ${n}`).join(" · ");
  lines.push(`- Pago: ${fin}`, `- Envío: ${ful}`, "");
  lines.push(`### Requieren atención (${a.orderStatus.attention.length})`, "");
  if (!a.orderStatus.attention.length) lines.push("Nada pendiente.", "");
  else {
    lines.push("| Pedido | Motivo | Total |", "|---|---|---:|");
    for (const o of a.orderStatus.attention) lines.push(`| ${o.name} | ${o.reason} | ${m(o.total)} |`);
    lines.push("");
  }

  lines.push("## Inventario", "");
  const alerted = a.inventory.filter((i) => i.alerts.length);
  if (!alerted.length) lines.push("Sin alertas.", "");
  else {
    lines.push("| Producto | Variante | Disponible | Vel./día | Cobertura | Alertas |", "|---|---|---:|---:|---:|---|");
    for (const i of alerted) {
      lines.push(`| ${i.productTitle} | ${i.variantTitle} | ${i.available} | ${i.velocity} | ${i.coverDays ?? "—"} | ${i.alerts.map((x) => ALERT_LABEL[x]).join(", ")} |`);
    }
    lines.push("");
  }

  lines.push(`### Resurtido sugerido (entrega ${a.settings.leadTimeDays} d + cobertura ${a.settings.coverDays} d)`, "");
  if (!a.restock.length) lines.push("No hace falta resurtir.", "");
  for (const i of a.restock) lines.push(`- **${i.productTitle} / ${i.variantTitle}** (${i.sku ?? "sin SKU"}): pedir **${i.restock.suggestedQty}** u. ${i.restock.reason}`);
  lines.push("", "---", "_Generado por `ops/analyze.mjs`. El agente propone; el dueño aprueba; `ops:apply` ejecuta._", "");
  return lines.join("\n");
}

export async function analyze(date) {
  const snapFile = await findLatest(DIRS.data, "snapshot-", date);
  const snap = await readJson(snapFile);
  const analysis = analyzeSnapshot(snap);
  const out = path.join(DIRS.data, `analysis-${analysis.date}.json`);
  const report = path.join(DIRS.reports, `${analysis.date}.md`);
  await writeJson(out, analysis);
  await writeText(report, renderReport(analysis));
  console.log(`Análisis -> ${path.relative(process.cwd(), out)} · Reporte -> ${path.relative(process.cwd(), report)}`);
  return { file: out, report, analysis };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { positional } = parseArgs();
  await analyze(positional[0]);
}
