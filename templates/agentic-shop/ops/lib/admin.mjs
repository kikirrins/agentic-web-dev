// Shopify Admin GraphQL client for the ops scripts.
// - Token via client credentials grant (Dev Dashboard app installed on a store of the same org).
// - Token lives only in memory and is never printed.
// - Retries with backoff based on extensions.cost.throttleStatus.
//
// Verified against shopify.dev (Admin GraphQL 2026-10):
//   POST https://{shop}.myshopify.com/admin/oauth/access_token
//     application/x-www-form-urlencoded: grant_type=client_credentials, client_id, client_secret
//     -> { access_token, scope, expires_in }  (expires_in = 86399)
//   Header X-Shopify-Access-Token; errors[].extensions.code === "THROTTLED";
//   extensions.cost { requestedQueryCost, actualQueryCost,
//                     throttleStatus { maximumAvailable, currentlyAvailable, restoreRate } }

export const ADMIN_API_VERSION = "2026-10";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;

export function hasAdminCredentials() {
  return Boolean(domain && clientId && clientSecret);
}

export function storeDomain() {
  return domain;
}

let cached = null; // { token, expiresAt }

async function getToken() {
  if (cached && Date.now() < cached.expiresAt) return cached.token;
  if (!hasAdminCredentials()) {
    throw new Error("Faltan SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_CLIENT_ID o SHOPIFY_ADMIN_CLIENT_SECRET");
  }

  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) {
    // Never echo the body blindly: it could contain sensitive data.
    throw new Error(`No se pudo obtener el token de Admin API (HTTP ${res.status})`);
  }
  const json = await res.json();
  // Refresh one minute before Shopify's expiry.
  cached = { token: json.access_token, expiresAt: Date.now() + (json.expires_in - 60) * 1000 };
  return cached.token;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Run an Admin GraphQL operation. Throws on GraphQL errors.
 * Mutations: the caller checks `userErrors` (see assertNoUserErrors).
 */
export async function gql(query, variables = {}, { maxRetries = 5 } = {}) {
  for (let attempt = 0; ; attempt++) {
    const token = await getToken();
    const res = await fetch(`https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query, variables }),
    });

    if (res.status === 401) cached = null; // token expired or revoked: get a new one next try

    const json = res.headers.get("content-type")?.includes("json") ? await res.json() : {};
    const throttled =
      res.status === 429 || json.errors?.some((e) => e.extensions?.code === "THROTTLED");

    if ((throttled || res.status >= 500 || res.status === 401) && attempt < maxRetries) {
      await sleep(backoffMs(json.extensions?.cost, attempt));
      continue;
    }
    if (!res.ok) throw new Error(`Admin API respondió HTTP ${res.status}`);
    if (json.errors?.length) {
      throw new Error(`Admin API: ${json.errors.map((e) => e.message).join("; ")}`);
    }

    // Be polite: if the bucket is almost empty, wait until it refills a bit.
    const status = json.extensions?.cost?.throttleStatus;
    if (status && status.currentlyAvailable < status.maximumAvailable * 0.1) {
      await sleep(backoffMs(json.extensions.cost, 0));
    }
    return json.data;
  }
}

/** How long to wait so the bucket has enough points for the requested cost. */
function backoffMs(cost, attempt) {
  const status = cost?.throttleStatus;
  if (status?.restoreRate) {
    const needed = (cost.requestedQueryCost ?? 100) - status.currentlyAvailable;
    const seconds = Math.max(1, Math.ceil(needed / status.restoreRate));
    return seconds * 1000;
  }
  return Math.min(30_000, 1000 * 2 ** attempt); // plain exponential backoff
}

/** Throws if a mutation payload has userErrors. */
export function assertNoUserErrors(payload, label) {
  const errors = payload?.userErrors ?? [];
  if (errors.length) throw new Error(`${label}: ${errors.map((e) => e.message).join("; ")}`);
  return payload;
}

/** Iterate all nodes of a paginated connection. `pick` extracts the connection from data. */
export async function* paginate(query, variables, pick) {
  let after = null;
  do {
    const data = await gql(query, { ...variables, after });
    const conn = pick(data);
    yield* conn.nodes;
    after = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
  } while (after);
}
