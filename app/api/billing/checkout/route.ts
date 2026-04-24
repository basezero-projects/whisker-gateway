import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireSession } from "@/lib/session";
import { db } from "@/db/client";
import { orgMembers, subscriptions } from "@/db/schema";
import { env } from "@/lib/env";
import { eq } from "drizzle-orm";

export async function POST(_req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const member = await db.query.orgMembers.findFirst({ where: eq(orgMembers.userId, session.user.id) });
  if (!member) return NextResponse.json({ error: "no org" }, { status: 400 });

  const sub = await db.query.subscriptions.findFirst({ where: eq(subscriptions.orgId, member.orgId) });
  let customerId = sub?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { orgId: member.orgId, userId: session.user.id },
    });
    customerId = customer.id;
  }

  const baseUrl = env.BETTER_AUTH_URL;
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: env.STRIPE_PRICE_ID_USAGE }],
    success_url: `${baseUrl}/billing?success=1`,
    cancel_url: `${baseUrl}/pricing?canceled=1`,
    subscription_data: { metadata: { orgId: member.orgId, plan: "pro" } },
  });

  return NextResponse.json({ url: checkout.url });
}
