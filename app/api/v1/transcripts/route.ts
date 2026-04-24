import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-key-auth";
import { callEngine } from "@/lib/engine-client";

export async function GET(req: Request) {
  const authed = await authenticateRequest(req);
  if (!authed) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const out = await callEngine({ path: "/api/internal/transcripts", method: "GET", orgId: authed.orgId });
  return NextResponse.json(out);
}
