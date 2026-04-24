import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/api-key-auth";
import { callEngine } from "@/lib/engine-client";

const Body = z.object({ url: z.string().url(), force: z.boolean().optional() });

export async function POST(req: Request) {
  const authed = await authenticateRequest(req);
  if (!authed) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const result = await callEngine({
    path: "/api/internal/transcribe",
    method: "POST",
    orgId: authed.orgId,
    payload: parsed.data,
  });
  return NextResponse.json(result);
}
