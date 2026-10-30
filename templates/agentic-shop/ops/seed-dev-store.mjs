// Usage: pnpm ops:seed [--apply] [--i-know]
// Fills an EMPTY development store with test data so the agent has something to analyze:
//   - sets unitCost (45% of price) on variants that have no cost  (inventoryItemUpdate)
//   - creates ~25 test orders with draftOrderCreate + draftOrderComplete (marked as paid)
// Dry-run by default. Refuses to run unless the store is a partner development store,
// unless you pass --i-know. Note: Shopify sets createdAt = now; orders can't be backdated.
import { assertNoUserErrors, gql, hasAdminCredentials, storeDomain } from "./lib/admin.mjs";
import { config, parseArgs, round2, seededRandom } from "./lib/util.mjs";

const ORDER_COUNT = 25;
const COST_RATIO = 0.45;
const { flags } = parseArgs();
const doApply = flags.has("apply");
const iKnow = flags.has("i-know");

if (!hasAdminCredentials()) {
  console.log("Faltan credenciales de Admin API en .env.local. Revisa el README (Setup real).");
  process.exit(1);
}

// 1) Safety: the domain must look like a dev store and Shopify must say it is one.
const domain = storeDomain();
if (!domain.endsWith(".myshopify.com") && !iKnow) {
  console.error(`"${domain}" no es un dominio *.myshopify.com. Usa el dominio de la tienda dev o --i-know.`);
  process.exit(1);
}
// ShopPlan.partnerDevelopment and publicDisplayName are verified; the Shop.plan field itself was not. // [UNVERIFIED]
const { shop } = await gql(`{ shop { name myshopifyDomain plan { partnerDevelopment publicDisplayName } } }`);
if (!shop.plan.partnerDevelopment && !iKnow) {
  console.error(`"${shop.name}" (${shop.plan.publicDisplayName}) no es una tienda de desarrollo. No hago nada. (--i-know para forzar)`);
  process.exit(1);
}

// 2) Read the catalog.
const { products } = await gql(`{
  products(first: 20, query: "status:active") {
    nodes {
      title
      variants(first: 5) { nodes { id title price inventoryItem { id unitCost { amount } } } }
    }
  }
}`);
const variants = products.nodes.flatMap((p) => p.variants.nodes.map((v) => ({ ...v, product: p.title })));
if (!variants.length) {
  console.error("La tienda no tiene productos activos. Agrega productos (o datos demo) primero.");
  process.exit(1);
}

// 3) Plan (deterministic).
const rnd = seededRandom(config.mock.seed);
const costUpdates = variants
  .filter((v) => !v.inventoryItem.unitCost)
  .map((v) => ({ inventoryItemId: v.inventoryItem.id, label: `${v.product} / ${v.title}`, cost: round2(Number(v.price) * COST_RATIO) }));

const orders = Array.from({ length: ORDER_COUNT }, (_, i) => {
  const lines = new Map();
  for (let n = rnd.int(1, 3); n > 0; n--) {
    const v = rnd.pick(variants);
    lines.set(v.id, { variantId: v.id, quantity: (lines.get(v.id)?.quantity ?? 0) + rnd.int(1, 2) });
  }
  // 12 distinct emails for 25 orders -> some returning customers.
  return { email: `clienta${(i % 12) + 1}@example.com`, lineItems: [...lines.values()] };
});

console.log(`${doApply ? "APLICANDO" : "DRY-RUN"} en ${shop.name} (${shop.myshopifyDomain})`);
console.log(`- ${costUpdates.length} variantes sin costo recibirán unitCost = ${COST_RATIO * 100}% del precio`);
console.log(`- ${orders.length} pedidos de prueba (draftOrderCreate + draftOrderComplete, pagados)`);
if (!doApply) {
  for (const c of costUpdates.slice(0, 5)) console.log(`    costo ${c.label}: ${c.cost}`);
  for (const o of orders.slice(0, 3)) console.log(`    pedido ${o.email}: ${o.lineItems.map((l) => `${l.quantity}×${l.variantId.split("/").pop()}`).join(", ")}`);
  console.log("\nNada se cambió. Corre con --apply para ejecutar.");
  process.exit(0);
}

// 4) Apply.
for (const c of costUpdates) {
  const res = await gql(
    `mutation Cost($id: ID!, $input: InventoryItemInput!) {
      inventoryItemUpdate(id: $id, input: $input) { inventoryItem { id unitCost { amount } } userErrors { field message } }
    }`,
    { id: c.inventoryItemId, input: { cost: c.cost } },
  );
  assertNoUserErrors(res.inventoryItemUpdate, `inventoryItemUpdate ${c.label}`);
}
console.log(`✓ ${costUpdates.length} costos actualizados`);

let created = 0;
for (const o of orders) {
  try {
    const draft = await gql(
      `mutation Draft($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) { draftOrder { id } userErrors { field message } }
      }`,
      { input: { email: o.email, lineItems: o.lineItems, note: "Pedido de prueba (agentic-shop seed)", tags: ["agentic-shop-seed"] } },
    );
    const { draftOrder } = assertNoUserErrors(draft.draftOrderCreate, "draftOrderCreate");
    const done = await gql(
      `mutation Complete($id: ID!) {
        draftOrderComplete(id: $id) { draftOrder { id order { id name } } userErrors { field message } }
      }`,
      { id: draftOrder.id },
    );
    const completed = assertNoUserErrors(done.draftOrderComplete, "draftOrderComplete");
    created++;
    console.log(`  ✓ ${completed.draftOrder.order?.name ?? draftOrder.id} (${o.email})`);
  } catch (err) {
    console.log(`  ✗ ${o.email}: ${err.message}`);
  }
}
console.log(`\n${created}/${orders.length} pedidos creados. Ahora corre: pnpm ops:daily`);
