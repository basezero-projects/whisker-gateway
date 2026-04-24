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
  const parts = input.split("_");
  if (parts.length !== 4 || parts[0] !== "wsk") return null;
  const env = parts[1] === "live" ? "live" : parts[1] === "test" ? "test" : null;
  if (!env) return null;
  if (parts[2].length !== 8 || !/^[a-f0-9]+$/.test(parts[2])) return null;
  if (parts[3].length < 16) return null;
  return { env, prefix: parts[2], secret: parts[3] };
}

export async function verifySecret(secret: string, hash: string): Promise<boolean> {
  return bcrypt.compare(secret, hash);
}
