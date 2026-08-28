import { timingSafeEqual } from "crypto";

/**
 * Node-only, constant-time password check.
 * Import this only from Server Actions / Route Handlers (Node runtime) — never from middleware.ts,
 * which runs on the Edge runtime and can't bundle Node's `crypto` module.
 */
export async function checkPassword(password: string): Promise<boolean> {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) throw new Error("DASHBOARD_PASSWORD is not set");

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
