import { sign } from "@/lib/hmac";
import { env } from "@/lib/env";

interface CallArgs {
  path: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  orgId?: string;
  payload?: unknown;
}

export async function callEngine<T = unknown>(args: CallArgs): Promise<T> {
  const url = `${env.WHISKER_ENGINE_URL}${args.path}`;
  const body = args.payload === undefined ? "" : JSON.stringify(args.payload);
  const ts = Math.floor(Date.now() / 1000);
  const signature = sign({ secret: env.WHISKER_INTERNAL_SECRET, body, timestamp: ts });

  const headers: Record<string, string> = {
    "X-Whisker-Timestamp": String(ts),
    "X-Whisker-Signature": signature,
  };
  if (args.payload !== undefined) headers["content-type"] = "application/json";
  if (args.orgId) headers["X-Whisker-Org"] = args.orgId;

  const res = await fetch(url, {
    method: args.method,
    headers,
    body: body || undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`engine ${args.method} ${args.path} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}
