import { db } from "@/db/client";
import { apiKeys } from "@/db/schema";
import { parse, verifySecret } from "@/lib/api-keys";
import { eq } from "drizzle-orm";

export interface AuthedRequest {
  orgId: string;
  apiKeyId: string;
}

export async function authenticateRequest(req: Request): Promise<AuthedRequest | null> {
  const auth = req.headers.get("authorization") ?? "";
  const match = auth.match(/^Bearer\s+(\S+)$/i);
  if (!match) return null;

  const parsed = parse(match[1]);
  if (!parsed) return null;

  const row = await db.query.apiKeys.findFirst({ where: eq(apiKeys.prefix, parsed.prefix) });
  if (!row || row.revokedAt) return null;

  const ok = await verifySecret(parsed.secret, row.secretHash);
  if (!ok) return null;

  void db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, row.id));
  return { orgId: row.orgId, apiKeyId: row.id };
}
