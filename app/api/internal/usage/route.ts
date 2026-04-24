import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/client";
import { usageEvents } from "@/db/schema";
import { verify } from "@/lib/hmac";
import { env } from "@/lib/env";

const Body = z.object({
  orgId: z.string(),
  apiKeyId: z.string().nullable().optional(),
  eventType: z.string(),
  quantity: z.number().int().nonnegative(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function POST(req: Request) {
  const ts = Number(req.headers.get("X-Whisker-Timestamp"));
  const sig = req.headers.get("X-Whisker-Signature") ?? "";
  const body = await req.text();
  if (!verify({ secret: env.WHISKER_INTERNAL_SECRET, body, timestamp: ts, signature: sig })) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  const json = JSON.parse(body);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  await db.insert(usageEvents).values({
    orgId: parsed.data.orgId,
    apiKeyId: parsed.data.apiKeyId ?? null,
    eventType: parsed.data.eventType,
    quantity: parsed.data.quantity,
    metadata: parsed.data.metadata ?? {},
  });

  return NextResponse.json({ ok: true });
}
