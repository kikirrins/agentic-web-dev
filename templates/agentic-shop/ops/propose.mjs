// Usage: pnpm ops:propose [YYYY-MM-DD]
// Turns the analysis into actions the owner approves or rejects:
//   ops/proposals/<date>.json     { actions: [{ id, type, title, detail, payload, status }] }
//   ops/proposals/po-<date>.md    purchase-order draft for the supplier (never touches Shopify)
// Re-running keeps the status of actions that already existed (approvals are not lost).
import { existsSync } from "node:fs";
import path from "node:path";
import { DIRS, findLatest, money, parseArgs, readJson, writeJson, writeText } from "./lib/util.mjs";

const numericId = (gid) => gid.split("/").pop();

export function buildActions(a) {
  const m = (n) => money(n, a.currency);
  const actions = [];

  // 1) Restock: one draft PO line per variant. Approving only means "send it to the supplier".
  for (const i of a.restock) {
    actions.push({
      id: `restock-${numericId(i.variantId)}`,
      type: "restock_po",
      title: `Resurtir ${i.productTitle} / ${i.variantTitle}: ${i.restock.suggestedQty} u.`,
      detail: i.restock.reason,
      payload: {
        variantId: i.variantId,
        sku: i.sku,
        product: i.productTitle,
        variant: i.variantTitle,
        quantity: i.restock.suggestedQty,
        unitCost: i.unitCost,
        estimatedCost: i.unitCost != null ? Math.round(i.unitCost * i.restock.suggestedQty * 100) / 100 : null,
      },
      status: "pending",
    });
  }

  // 2) Orders that need attention.
  for (const o of a.orderStatus.attention) {
    if (o.type === "paid_unfulfilled") {
      actions.push({
        id: `fulfill-${numericId(o.id)}`,
        type: "fulfill_order",
        title: `Marcar como enviado el pedido ${o.name}`,
        detail: `${o.reason}. Total ${m(o.total)}. Se cumple el fulfillment order abierto completo, sin notificar a la clienta.`,
        payload: { orderId: o.id, orderName: o.name, notifyCustomer: false },
        status: "pending",
      });
    } else if (o.type === "pending_payment") {
      actions.push({
        id: `followup-${numericId(o.id)}`,
        type: "followup_payment",
        title: `Dar seguimiento al pago del pedido ${o.name}`,
        detail: `${o.reason}. Total ${m(o.total)}. Enviar recordatorio a la clienta (manual, no cambia Shopify).`,
        payload: { orderId: o.id, orderName: o.name, total: o.total },
        status: "pending",
      });
    }
  }

  // 3) Negative stock at a location is always a data error: propose correcting it to 0.
  for (const i of a.inventory.filter((x) => x.alerts.includes("negative_stock"))) {
    for (const loc of i.locations.filter((l) => l.available < 0)) {
      actions.push({
        id: `adjust-${numericId(i.inventoryItemId)}-${loc.name.toLowerCase().replace(/\W+/g, "-")}`,
        type: "inventory_adjust",
        title: `Corregir inventario negativo de ${i.productTitle} / ${i.variantTitle} en ${loc.name}`,
        detail: `Shopify marca ${loc.available} disponibles en ${loc.name}. Ajustar +${-loc.available} para dejarlo en 0 (motivo: correction).`,
        payload: {
          inventoryItemId: i.inventoryItemId,
          locationName: loc.name,
          delta: -loc.available,
          expectedQuantity: loc.available, // compare-and-swap: fail if it changed since the snapshot
          reason: "correction",
        },
        status: "pending",
      });
    }
  }

  return actions;
}

function renderPurchaseOrder(a, actions) {
  const lines = actions.filter((x) => x.type === "restock_po");
  const m = (n) => money(n, a.currency);
  const out = [
    `# Orden de compra (borrador) · ${a.date}`,
    "",
    a.source === "mock" ? "> **Datos de demostración.**\n" : "",
    `Tienda: ${a.shop}. Tiempo de entrega supuesto: ${a.settings.leadTimeDays} días; cobertura objetivo: ${a.settings.coverDays} días.`,
    "",
    "Este documento es solo un borrador para el proveedor. No modifica Shopify.",
    "",
    "| SKU | Producto | Variante | Cantidad | Costo unit. | Subtotal |",
    "|---|---|---|---:|---:|---:|",
  ];
  let total = 0;
  for (const { payload: p } of lines) {
    total += p.estimatedCost ?? 0;
    out.push(`| ${p.sku ?? "—"} | ${p.product} | ${p.variant} | ${p.quantity} | ${p.unitCost != null ? m(p.unitCost) : "sin costo"} | ${p.estimatedCost != null ? m(p.estimatedCost) : "—"} |`);
  }
  out.push("", `**Total estimado (solo líneas con costo): ${m(total)}**`, "");
  if (!lines.length) out.push("_No hay productos que resurtir hoy._", "");
  return out.join("\n");
}

export async function propose(date) {
  const analysisFile = await findLatest(DIRS.data, "analysis-", date);
  const a = await readJson(analysisFile);
  const file = path.join(DIRS.proposals, `${a.date}.json`);

  const previous = existsSync(file) ? await readJson(file) : { actions: [] };
  const prevStatus = new Map(previous.actions.map((x) => [x.id, x]));
  const actions = buildActions(a).map((x) => {
    const old = prevStatus.get(x.id);
    return old ? { ...x, status: old.status, ...(old.result ? { result: old.result } : {}) } : x;
  });

  await writeJson(file, { date: a.date, source: a.source, generatedAt: new Date().toISOString(), actions });
  const po = await writeText(path.join(DIRS.proposals, `po-${a.date}.md`), renderPurchaseOrder(a, actions));
  console.log(`Propuesta: ${actions.length} acciones -> ${path.relative(process.cwd(), file)} · OC -> ${path.relative(process.cwd(), po)}`);
  return { file, actions };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { positional } = parseArgs();
  await propose(positional[0]);
}
