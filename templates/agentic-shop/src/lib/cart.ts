import "server-only";
import { cookies } from "next/headers";
import { getBuyerIp, storefront } from "./storefront";
import type { Image, Money } from "./shop";

/**
 * Cart = Shopify's cart. We only keep the cart ID in a cookie;
 * every total comes from Shopify (never computed here or in the browser).
 */

const CART_COOKIE = "cartId";

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    image: Image | null;
    product: { title: string; handle: string };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: CartLine[] };
};

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText width height }
            product { title handle }
          }
        }
      }
    }
  }
`;

async function call<T>(query: string, variables: Record<string, unknown>) {
  return storefront<T>(`${CART_FIELDS}\n${query}`, variables, { buyerIp: await getBuyerIp() });
}

async function saveCartId(id: string) {
  (await cookies()).set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function getCart(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return null;
  const data = await call<{ cart: Cart | null }>(
    `query Cart($id: ID!) { cart(id: $id) { ...CartFields } }`,
    { id: cartId },
  );
  return data.cart;
}

export async function addLine(merchandiseId: string, quantity = 1): Promise<Cart> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  const lines = [{ merchandiseId, quantity }];

  if (cartId) {
    try {
      const data = await call<{ cartLinesAdd: { cart: Cart } }>(
        `mutation Add($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } }
        }`,
        { cartId, lines },
      );
      if (data.cartLinesAdd.cart) return data.cartLinesAdd.cart;
    } catch {
      // Expired or unknown cart: fall through and create a new one.
    }
  }

  const data = await call<{ cartCreate: { cart: Cart } }>(
    `mutation Create($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) { cart { ...CartFields } userErrors { field message } }
    }`,
    { lines },
  );
  await saveCartId(data.cartCreate.cart.id);
  return data.cartCreate.cart;
}

export async function updateLine(lineId: string, quantity: number): Promise<void> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return;
  await call(
    `mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  );
}

export async function removeLine(lineId: string): Promise<void> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return;
  await call(
    `mutation Remove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message } }
    }`,
    { cartId, lineIds: [lineId] },
  );
}
