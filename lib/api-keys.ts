import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

export type Env = "live" | "test";

export interface GeneratedKey {
  full: string;
  prefix: string;
  secret: string;
  secretHash: string;
}

export function generate({ env }: { env: Env }): GeneratedKey {
  const prefix = randomBytes(4).toString("hex");
  const secret = randomBytes(24).toString("base64url");
  const full = `wsk_${env}_${prefix}_${secret}`;
  const secretHash = bcrypt.hashSync(secret, 10);
  return { full, prefix, secret, secretHash };
}

export function parse(input: string): { env: Env; prefix: string; secret: string } | null {
  // base64url-encoded secrets can contain `_`, so split with a limit so the
  // secret stays in one piece. Match must anchor to the wsk_<env>_<8 hex>_ shape.
  const match = input.match(/^wsk_(live|test)_([a-f0-9]{8})_([A-Za-z0-9_-]{16,})$/);
  if (!match) return null;
  return { env: match[1] as Env, prefix: match[2], secret: match[3] };
}

export async function verifySecret(secret: string, hash: string): Promise<boolean> {
  return bcrypt.compare(secret, hash);
}
