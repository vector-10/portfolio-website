const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/** Creates a signed, self-verifying session token — no database, no session store. */
export async function createSessionToken(): Promise<string> {
  const secret = requireEnv("SESSION_SECRET");
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `ok:${exp}`;
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return `${payload}.${bytesToHex(signature)}`;
}

export async function isValidSessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;

  const [payload, signatureHex] = token.split(".");
  if (!payload || !signatureHex) return false;

  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;

  const key = await getHmacKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    hexToBytes(signatureHex),
    new TextEncoder().encode(payload)
  );
  if (!valid) return false;

  const exp = Number(payload.split(":")[1]);
  return Number.isFinite(exp) && Date.now() < exp;
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE };
