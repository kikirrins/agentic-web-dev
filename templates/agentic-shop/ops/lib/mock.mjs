// Synthetic, seeded snapshot for demos. Same seed + same date => same data.
// Starts from the real mock.shop catalog (titles, handles, variants) and invents
// costs, stock and 30 days of orders. Always marked source: "mock".
import { DAY_MS, config, hashSeed, round2, seededRandom } from "./util.mjs";

const FALLBACK_CATALOG = [
  { id: "gid://shopify/Product/1", title: "Sudadera", handle: "sudadera", variants: ["Chica", "Mediana", "Grande"], price: 45 },
  { id: "gid://shopify/Product/2", title: "Playera", handle: "playera", variants: ["Chica", "Mediana", "Grande"], price: 25 },
  { id: "gid://shopify/Product/3", title: "Gorro", handle: "gorro", variants: ["Único"], price: 15 },
];

async function loadCatalog(limit, perProduct) {
  try {
    const res = await fetch("https://mock.shop/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ products(first: ${limit}) { nodes { id title handle
          variants(first: ${perProduct}) { nodes { id title price { amount } } } } } }`,
      }),
    });
    const json = await res.json();
    return json.data.products.nodes.map((p) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      variants: p.variants.nodes.map((v) => ({ id: v.id, title: v.title, price: Number(v.price.amount) })),
    }));
  } catch {
    console.warn("mock.shop no respondió; uso un catálogo mínimo integrado.");
    return FALLBACK_CATALOG.map((p, i) => ({
      ...p,
      variants: p.variants.map((t, j) => ({ id: `gid://shopify/ProductVariant/${i * 10 + j + 1}`, title: t, price: p.price })),
    }));
  }
}

const toMxn = (cad) => Math.round((cad * 13) / 10) * 10 - 1; // e.g. 25 CAD -> $329 MXN

export async function buildMockSnapshot(now = new Date()) {
  const { seed, products: productLimit, variantsPerProduct } = config.mock;
  const today = now.toISOString().slice(0, 10);
  const rnd = seededRandom(hashSeed(seed, today));
  const catalog = await loadCatalog(productLimit, variantsPerProduct);

  // --- Products and stock --------------------------------------------------
  let skuN = 1000;
  const products = catalog.map((p, pi) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    status: "ACTIVE",
    variants: p.variants.map((v) => {
      const price = toMxn(v.price);
      const bodega = rnd.int(4, 40);
      const tienda = rnd.int(0, 12);
      return {
        id: v.id,
        sku: `AS-${++skuN}`,
        title: v.title,
        price,
        // One product without costs, so the report shows "variantes sin costo".
        unitCost: pi === 3 ? null : round2(price * (0.35 + rnd.next() * 0.2)),
        inventoryItemId: v.id.replace("ProductVariant", "InventoryItem"),
        available: bodega + tienda,
        locations: [
          { name: "Bodega Monterrey", available: bodega },
          { name: "Tienda CDMX", available: tienda },
        ],
      };
    }),
  }));

  const allVariants = products.flatMap((p) => p.variants.map((v) => ({ ...v, productTitle: p.title })));
  const setStock = (v, bodega, tienda) => {
    v.locations[0].available = bodega;
    v.locations[1].available = tienda;
    v.available = bodega + tienda;
  };

  // Scenarios the agent should catch:
  const bestSeller = products[0].variants[0]; // sells a lot, low stock
  setStock(bestSeller, 3, 1);
  const soldOut = products[1].variants[0]; // sold out
  setStock(soldOut, 0, 0);
  const deadStock = products.at(-1).variants.at(-1); // lots of stock, no sales
  setStock(deadStock, 45, 10);
  const negative = products[2].variants.at(-1); // data error -> inventory_adjust proposal
  setStock(negative, 6, -2);

  // Sales weights: best seller and sold-out variant sell more; dead stock never sells.
  const weighted = allVariants.flatMap((v) => {
    if (v.id === deadStock.id) return [];
    const w = v.id === bestSeller.id ? 8 : v.id === soldOut.id ? 4 : 1;
    return Array(w).fill(v);
  });

  // --- Customers -----------------------------------------------------------
  const customers = Array.from({ length: 45 }, (_, i) => ({
    id: `gid://shopify/Customer/${7000 + i}`,
    previousOrders: rnd.chance(0.4) ? rnd.int(1, 6) : 0,
    ordersInWindow: 0,
  }));

  // --- Orders: 30 days back from now ----------------------------------------
  const orders = [];
  let orderNumber = 1001;
  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const count = rnd.int(2, 7);
    for (let k = 0; k < count; k++) {
      // Spread across the day; today's orders stay in the past.
      const offsetMs = daysAgo * DAY_MS + rnd.int(1, 22) * 60 * 60 * 1000 * (daysAgo === 0 ? 0.3 : 1);
      const createdAt = new Date(now.getTime() - offsetMs);
      const ageHours = (now - createdAt) / 36e5;

      const lineItems = [];
      for (let n = rnd.int(1, 3); n > 0; n--) {
        const v = rnd.pick(weighted);
        const existing = lineItems.find((li) => li.variantId === v.id);
        if (existing) existing.quantity += 1;
        else lineItems.push({ variantId: v.id, sku: v.sku, title: `${v.productTitle} - ${v.title}`, quantity: rnd.int(1, 2), price: v.price });
      }
      const gross = lineItems.reduce((s, li) => s + li.price * li.quantity, 0);
      const discounts = rnd.chance(0.25) ? round2(gross * 0.1) : 0;
      const subtotal = round2(gross - discounts);

      // Status mix: most are paid; older ones are fulfilled.
      let financialStatus = "PAID";
      let fulfillmentStatus = ageHours > 30 ? "FULFILLED" : "UNFULFILLED";
      let refunded = 0;
      const r = rnd.next();
      if (r < 0.04) {
        financialStatus = "PENDING";
        fulfillmentStatus = "UNFULFILLED";
      } else if (r < 0.08) {
        financialStatus = "REFUNDED";
        refunded = subtotal;
      } else if (r < 0.11) {
        financialStatus = "PARTIALLY_REFUNDED";
        refunded = round2(subtotal * 0.4);
      } else if (r < 0.12 && ageHours > 48) {
        fulfillmentStatus = "UNFULFILLED"; // paid but stuck: needs attention
      } else if (r < 0.14 && ageHours > 30) {
        fulfillmentStatus = "PARTIALLY_FULFILLED";
      }

      const guest = rnd.chance(0.1);
      const customer = guest ? null : rnd.pick(customers);
      if (customer) customer.ordersInWindow += 1;

      orders.push({
        id: `gid://shopify/Order/${5000000 + orderNumber}`,
        name: `#${orderNumber++}`,
        createdAt: createdAt.toISOString(),
        financialStatus,
        fulfillmentStatus,
        total: round2(subtotal - refunded),
        subtotal,
        discounts,
        refunded,
        customerId: customer?.id ?? null,
        customerOrdersCount: null, // filled below with the lifetime count
        lineItems,
      });
    }
  }

  const byId = new Map(customers.map((c) => [c.id, c]));
  for (const o of orders) {
    const c = o.customerId && byId.get(o.customerId);
    if (c) o.customerOrdersCount = c.previousOrders + c.ordersInWindow;
  }

  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    generatedAt: now.toISOString(),
    source: "mock",
    shop: "Tienda demo (mock.shop)",
    currency: "MXN",
    products,
    orders,
  };
}
