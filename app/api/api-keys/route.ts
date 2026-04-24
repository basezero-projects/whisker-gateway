import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { db } from "@/db/client";
import { apiKeys, orgMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generate } from "@/lib/api-keys";
import { z } from "zod";

async function userOrg(userId: string) {
  const m = await db.query.orgMembers.findFirst({ where: eq(orgMembers.userId, userId) });
  return m?.orgId ?? null;
}

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const orgId = await userOrg(session.user.id);
  if (!orgId) return NextResponse.json([]);
  const rows = await db.query.apiKeys.findMany({ where: eq(apiKeys.orgId, orgId) });
  return NextResponse.json(rows.map((r) => ({ ...r, secretHash: undefined })));
}

const CreateBody = z.object({ name: z.string().min(1).max(100) });

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const orgId = await userOrg(session.user.id);
  if (!orgId) return NextResponse.json({ error: "no org" }, { status: 400 });

  const body = CreateBody.parse(await req.json());
  const key = generate({ env: process.env.NODE_ENV === "production" ? "live" : "test" });

  const [row] = await db
    .insert(apiKeys)
    .values({
      orgId,
      createdBy: session.user.id,
      name: body.name,
      prefix: key.prefix,
      secretHash: key.secretHash,
    })
    .returning();

  return NextResponse.json({ ...row, secretHash: undefined, fullKey: key.full });
}
