// Usage: pnpm ops:snapshot [--mock]
// Writes ops/data/snapshot-YYYY-MM-DD.json (products + stock + last 30 days of orders).
import path from "node:path";
import { gql, hasAdminCredentials, paginate, storeDomain } from "./lib/admin.mjs";
import { buildMockSnapshot } from "./lib/mock.mjs";
import { DAY_MS, DIRS, localDate, parseArgs, writeJson } from "./lib/util.mjs";

const num = (moneyBag) => (moneyBag ? Number(moneyBag.shopMoney.amount) : 0);

// All fields below were checked in the Admin GraphQL 2026-10 reference.
const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($after: String) {
    products(first: 25, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id title handle status
        variants(first: 100) {
          nodes {
            id sku title price
            inventoryItem {
              id
              unitCost { amount }
              inventoryLevels(first: 20) {
                nodes {
                  location { name }
                  quantities(names: ["available"]) { name quantity }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Notes:
// - read_orders only returns the last 60 days (enough for our 30-day window).
// - customer { id numberOfOrders } may require customer-data access for the app. // [UNVERIFIED] exact protected-data level needed
const ORDERS_QUERY = /* GraphQL */ `
  query Orders($after: String, $query: String!) {
    orders(first: 50, after: $after, query: $query, sortKey: CREATED_AT, reverse: true) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id name createdAt
        displayFinancialStatus
        displayFulfillmentStatus
        currentTotalPriceSet { shopMoney { amount } }
        subtotalPriceSet { shopMoney { amount } }
        totalDiscountsSet { shopMoney { amount } }
        totalRefundedSet { shopMoney { amount } }
        customer { id numberOfOrders }
        lineItems(first: 100) {
          nodes {
            variant { id }
            sku title quantity
            originalUnitPriceSet { shopMoney { amount } }
          }
        }
      }
    }
  }
`;

async function buildShopifySnapshot(now = new Date()) {
  const { shop } = await gql(`{ shop { name currencyCode myshopifyDomain } }`);

  const products = [];
  for await (const p of paginate(PRODUCTS_QUERY, {}, (d) => d.products)) {
    products.push({
      id: p.id,
      title: p.title,
      handle: p.handle,
      status: p.status,
      variants: p.variants.nodes.map((v) => {
        const locations = v.inventoryItem.inventoryLevels.nodes.map((lvl) => ({
          name: lvl.location.name,
          available: lvl.quantities.find((q) => q.name === "available")?.quantity ?? 0,
        }));
        return {
          id: v.id,
          sku: v.sku,
          title: v.title,
          price: Number(v.price),
          unitCost: v.inventoryItem.unitCost ? Number(v.inventoryItem.unitCost.amount) : null,
          inventoryItemId: v.inventoryItem.id,
          available: locations.reduce((s, l) => s + l.available, 0),
          locations,
        };
      }),
    });
  }

  const since = new Date(now.getTime() - 30 * DAY_MS).toISOString();
  const orders = [];
  for await (const o of paginate(ORDERS_QUERY, { query: `created_at:>='${since}'` }, (d) => d.orders)) {
    orders.push({
      id: o.id,
      name: o.name,
      createdAt: o.createdAt,
      financialStatus: o.displayFinancialStatus ?? "UNKNOWN",
      fulfillmentStatus: o.displayFulfillmentStatus,
      total: num(o.currentTotalPriceSet),
      subtotal: num(o.subtotalPriceSet),
      discounts: num(o.totalDiscountsSet),
      refunded: num(o.totalRefundedSet),
      customerId: o.customer?.id ?? null,
      customerOrdersCount: o.customer ? Number(o.customer.numberOfOrders) : null,
      lineItems: o.lineItems.nodes.map((li) => ({
        variantId: li.variant?.id ?? null,
        sku: li.sku,
        title: li.title,
        quantity: li.quantity,
        price: num(li.originalUnitPriceSet),
      })),
    });
  }

  return {
    generatedAt: now.toISOString(),
    source: "shopify",
    shop: shop.name || shop.myshopifyDomain,
    currency: shop.currencyCode,
    products,
    orders,
  };
}

export async function snapshot({ mock = false } = {}) {
  const useMock = mock || !hasAdminCredentials();
  if (useMock && !mock) console.warn("Sin credenciales de Admin API: genero datos de demostración (--mock).");
  else if (!useMock) console.log(`Leyendo ${storeDomain()}…`);

  const data = useMock ? await buildMockSnapshot() : await buildShopifySnapshot();
  const file = path.join(DIRS.data, `snapshot-${localDate()}.json`);
  await writeJson(file, data);
  console.log(
    `Snapshot (${data.source}): ${data.products.length} productos, ${data.orders.length} pedidos -> ${path.relative(process.cwd(), file)}`,
  );
  return { file, data };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { flags } = parseArgs();
  await snapshot({ mock: flags.has("mock") });
}
