import "server-only";
import { headers } from "next/headers";

/**
 * Minimal Storefront API client.
 *
 * - No env vars      -> mock.shop (public demo store, no token).
 * - With env vars    -> https://<domain>/api/2026-10/graphql.json using the
 *                       private token. The private token never leaves the server.
 */

export const STOREFRONT_API_VERSION = "2026-10";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

export const isMockShop = !(domain && privateToken);

const endpoint = isMockShop
  ? "https://mock.shop/api"
  : `https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`;

type UserError = { field?: string[] | null; message: string; code?: string };

export class StorefrontError extends Error {
  constructor(
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "StorefrontError";
  }
}

type Options = {
  /** Buyer IP from the incoming request; Shopify uses it for bot protection. */
  buyerIp?: string | null;
};

/**
 * Run a Storefront GraphQL query or mutation.
 * Throws on network/GraphQL errors and on any `userErrors` returned by a mutation.
 */
export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  { buyerIp }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (!isMockShop) headers["Shopify-Storefront-Private-Token"] = privateToken!;
  if (buyerIp) headers["Shopify-Storefront-Buyer-IP"] = buyerIp;

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new StorefrontError(`Storefront API respondió ${res.status}`);
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new StorefrontError(json.errors.map((e) => e.message).join("; "), json.errors);
  }
  if (!json.data) throw new StorefrontError("Respuesta vacía de Storefront API");

  // Mutations return { <mutationName>: { userErrors: [...] } }.
  for (const value of Object.values(json.data as Record<string, unknown>)) {
    const userErrors = (value as { userErrors?: UserError[] } | null)?.userErrors;
    if (userErrors?.length) {
      throw new StorefrontError(userErrors.map((e) => e.message).join("; "), userErrors);
    }
  }

  return json.data;
}

/** Reads the buyer IP from the incoming request headers (call inside a request scope). */
export async function getBuyerIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || null;
}
