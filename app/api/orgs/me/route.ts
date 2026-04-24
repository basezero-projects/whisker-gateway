import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { ensureOrgForUser } from "@/lib/orgs";

export async function POST() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const orgId = await ensureOrgForUser(session.user.id, session.user.name ?? session.user.email);
  return NextResponse.json({ orgId });
}
