import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-key-auth";
import { callEngine } from "@/lib/engine-client";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await authenticateRequest(req);
  if (!authed) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const out = await callEngine({
    path: `/api/internal/transcripts/${id}`,
    method: "GET",
    orgId: authed.orgId,
  });
  return NextResponse.json(out);
}
