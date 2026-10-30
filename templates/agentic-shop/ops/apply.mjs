// Usage: pnpm ops:apply [--apply] [YYYY-MM-DD]
// Executes ONLY actions with status "approved" in ops/proposals/<date>.json.
//   (no flag)  dry-run: prints what it would do, changes nothing, writes no log.
//   --apply    runs them, marks each one "applied" or "failed", and appends one JSON line
//              per change to ops/logs/audit.jsonl.
// Mock proposals (source: "mock") are simulated: nothing is sent to Shopify, but the log is written.
import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { assertNoUserErrors, gql, hasAdminCredentials, storeDomain } from "./lib/admin.mjs";
import { DIRS, findLatest, parseArgs, readJson, writeJson } from "./lib/util.mjs";

// ---- Shopify operations (fields checked in Admin GraphQL 2026-10) -----------------------

/** fulfill_order: fulfill every open fulfillment order of the order. Scope: write_merchant_managed_fulfillment_orders. */
async function fulfillOrder({ orderId, notifyCustomer = false }) {
  // Order.fulfillmentOrders is a verified FulfillmentOrderConnection; its `first` argument was not checked. // [UNVERIFIED]
  const data = await gql(
    `query OpenFOs($id: ID!) {
      order(id: $id) {
        name
        fulfillmentOrders(first: 10) { nodes { id status } }
      }
    }`,
    { id: orderId },
  );
  if (!data.order) throw new Error(`No existe el pedido ${orderId}`);
  const open = data.order.fulfillmentOrders.nodes.filter((fo) => ["OPEN", "IN_PROGRESS"].includes(fo.status));
  if (!open.length) throw new Error(`El pedido ${data.order.name} no tiene fulfillment orders abiertos`);

  const res = await gql(
    `mutation Fulfill($fulfillment: FulfillmentInput!) {
      fulfillmentCreate(fulfillment: $fulfillment) {
        fulfillment { id status }
        userErrors { field message }
      }
    }`,
    {
      fulfillment: {
        notifyCustomer,
        // Omitting fulfillmentOrderLineItems fulfills all remaining items of each fulfillment order.
        lineItemsByFulfillmentOrder: open.map((fo) => ({ fulfillmentOrderId: fo.id })),
      },
    },
  );
  const payload = assertNoUserErrors(res.fulfillmentCreate, "fulfillmentCreate");
  return { fulfillmentId: payload.fulfillment.id, fulfillmentOrders: open.map((fo) => fo.id) };
}

/** inventory_adjust: relative change on "available" with compare-and-swap. Scope: write_inventory. */
async function adjustInventory({ inventoryItemId, locationName, delta, expectedQuantity, reason }) {
  // Resolve the location by name (the snapshot stores names, not IDs).
  const data = await gql(
    `query Levels($id: ID!) {
      inventoryItem(id: $id) {
        inventoryLevels(first: 50) {
          nodes { location { id name } quantities(names: ["available"]) { name quantity } }
        }
      }
    }`,
    { id: inventoryItemId },
  );
  const level = data.inventoryItem?.inventoryLevels.nodes.find((l) => l.location.name === locationName);
  if (!level) throw new Error(`No encontré la ubicación "${locationName}" para ${inventoryItemId}`);

  const res = await gql(
    `mutation Adjust($input: InventoryAdjustQuantitiesInput!, $key: String!) {
      inventoryAdjustQuantities(input: $input) @idempotent(key: $key) {
        inventoryAdjustmentGroup { createdAt reason changes { name delta } }
        userErrors { field message }
      }
    }`,
    {
      key: randomUUID(), // required for inventory mutations since 2026-04
      input: {
        name: "available",
        reason, // e.g. "correction"
        changes: [
          {
            inventoryItemId,
            locationId: level.location.id,
            delta,
            // Fails with CHANGE_FROM_QUANTITY_STALE if stock moved since the snapshot.
            changeFromQuantity: expectedQuantity,
          },
        ],
      },
    },
  );
  const payload = assertNoUserErrors(res.inventoryAdjustQuantities, "inventoryAdjustQuantities");
  return { locationId: level.location.id, group: payload.inventoryAdjustmentGroup };
}

// Actions that are recorded but never change Shopify.
const MANUAL = {
  restock_po: "Borrador de OC: enviarlo al proveedor (ver ops/proposals/po-*.md). Shopify no cambia.",
  followup_payment: "Recordatorio de pago: se envía a mano. Shopify no cambia.",
};

function describe(action) {
  const p = action.payload;
  switch (action.type) {
    case "fulfill_order":
      return `fulfillmentCreate en los fulfillment orders abiertos de ${p.orderName} (notifyCustomer=${p.notifyCustomer})`;
    case "inventory_adjust":
      return `inventoryAdjustQuantities name=available reason=${p.reason} delta=${p.delta} en "${p.locationName}" (esperado ${p.expectedQuantity})`;
    default:
      return MANUAL[action.type] ?? "Tipo desconocido";
  }
}

async function execute(action, mode) {
  if (MANUAL[action.type]) return { note: MANUAL[action.type] };
  if (mode === "mock") return { simulated: true, note: `Simulado: ${describe(action)}` };
  if (action.type === "fulfill_order") return fulfillOrder(action.payload);
  if (action.type === "inventory_adjust") return adjustInventory(action.payload);
  throw new Error(`Tipo de acción desconocido: ${action.type}`);
}

export async function apply({ doApply = false, date } = {}) {
  const file = await findLatest(DIRS.proposals, "", date);
  const proposal = await readJson(file);
  const approved = proposal.actions.filter((a) => a.status === "approved");
  const mode = proposal.source === "mock" ? "mock" : "shopify";

  if (mode === "shopify" && !hasAdminCredentials()) {
    throw new Error("La propuesta es de Shopify real pero faltan credenciales de Admin API.");
  }

  console.log(`${doApply ? "APLICANDO" : "DRY-RUN"} · ${path.relative(process.cwd(), file)} · modo ${mode}${mode === "shopify" ? ` (${storeDomain()})` : ""}`);
  console.log(`${approved.length} acciones aprobadas de ${proposal.actions.length}.`);

  if (!doApply) {
    for (const a of approved) console.log(`  · [${a.type}] ${a.title}\n      -> ${describe(a)}`);
    if (approved.length) console.log("\nNada se cambió. Corre con --apply para ejecutar.");
    return { applied: 0, failed: 0 };
  }

  await mkdir(DIRS.logs, { recursive: true });
  const auditFile = path.join(DIRS.logs, "audit.jsonl");
  let applied = 0, failed = 0;

  for (const action of approved) {
    const entry = { ts: new Date().toISOString(), proposal: proposal.date, actionId: action.id, type: action.type, mode, payload: action.payload };
    try {
      const result = await execute(action, mode);
      action.status = "applied";
      action.result = { at: entry.ts, ...result };
      Object.assign(entry, { status: "applied", result });
      applied++;
      console.log(`  ✓ ${action.title}`);
    } catch (err) {
      action.status = "failed";
      action.result = { at: entry.ts, error: err.message };
      Object.assign(entry, { status: "failed", error: err.message });
      failed++;
      console.log(`  ✗ ${action.title}: ${err.message}`);
    }
    await appendFile(auditFile, JSON.stringify(entry) + "\n");
    await writeJson(file, proposal); // save after each action so a crash never loses state
  }

  console.log(`\n${applied} aplicadas, ${failed} fallidas. Bitácora: ${path.relative(process.cwd(), auditFile)}`);
  return { applied, failed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { flags, positional } = parseArgs();
  await apply({ doApply: flags.has("apply"), date: positional[0] });
}
