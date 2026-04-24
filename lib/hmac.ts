import { createHmac, timingSafeEqual } from "node:crypto";

export const MAX_SKEW_SECONDS = 300;

export function sign(args: { secret: string; body: string; timestamp: number }): string {
  const mac = createHmac("sha256", args.secret);
  mac.update(`${args.timestamp}.${args.body}`);
  return `sha256=${mac.digest("hex")}`;
}

export function verify(args: {
  secret: string;
  body: string;
  timestamp: number;
  signature: string;
}): boolean {
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - args.timestamp) > MAX_SKEW_SECONDS) return false;

  const expected = sign({ secret: args.secret, body: args.body, timestamp: args.timestamp });
  if (expected.length !== args.signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(args.signature));
  } catch {
    return false;
  }
}
