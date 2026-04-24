import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { orgs } from "@/db/schema";
import { flushUsageForOrg } from "@/lib/billing";

/** Vercel cron hits this nightly. */
export async function GET() {
  const all = await db.query.orgs.findMany();
  let total = 0;
  for (const org of all) {
    total += await flushUsageForOrg(org.id);
  }
  return NextResponse.json({ pushed: total });
}
