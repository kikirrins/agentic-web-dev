import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Tiny password gate for /ops.
 * The cookie holds HMAC(OPS_PASSWORD, "ops-session"), never the password itself.
 * Changing OPS_PASSWORD invalidates every existing session.
 */

export const OPS_COOKIE = "ops_session";

export function opsPassword(): string | undefined {
  return process.env.OPS_PASSWORD || undefined;
}

export function sessionToken(password: string): string {
  return createHmac("sha256", password).update("ops-session").digest("hex");
}

/** Constant-time string comparison (hash first so lengths always match). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function isValidSession(cookieValue: string | undefined): boolean {
  const password = opsPassword();
  if (!password) return process.env.NODE_ENV !== "production"; // dev without password: open, with warning
  if (!cookieValue) return false;
  return safeEqual(cookieValue, sessionToken(password));
}
