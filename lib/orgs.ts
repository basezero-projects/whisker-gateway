import { db } from "@/db/client";
import { orgMembers, orgs, quotas } from "@/db/schema";
import { eq } from "drizzle-orm";

/** Idempotent — ensure the user has at least one org. Returns the org id. */
export async function ensureOrgForUser(userId: string, suggestedName: string): Promise<string> {
  const existing = await db.query.orgMembers.findFirst({ where: eq(orgMembers.userId, userId) });
  if (existing) return existing.orgId;

  const [org] = await db
    .insert(orgs)
    .values({ slug: `org-${userId.slice(0, 8)}`, name: suggestedName })
    .returning();

  await db.insert(orgMembers).values({ orgId: org.id, userId, role: "owner" });
  await db.insert(quotas).values({
    orgId: org.id,
    plan: "free",
    monthlyMinuteLimit: 60,
  });
  return org.id;
}
