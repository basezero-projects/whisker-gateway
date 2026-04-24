import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { db } from "@/db/client";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return NextResponse.json({ error: `bad signature: ${e}` }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as any;
      const orgId = sub.metadata?.orgId;
      if (orgId) {
        await db
          .insert(subscriptions)
          .values({
            orgId,
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id as string,
            plan: sub.metadata?.plan ?? "pro",
            status: sub.status,
            currentPeriodEnd: sub.current_period_end
              ? new Date(sub.current_period_end * 1000)
              : null,
          })
          .onConflictDoUpdate({
            target: subscriptions.orgId,
            set: {
              stripeCustomerId: sub.customer as string,
              stripeSubscriptionId: sub.id as string,
              status: sub.status,
              currentPeriodEnd: sub.current_period_end
                ? new Date(sub.current_period_end * 1000)
                : null,
              updatedAt: new Date(),
            },
          });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      await db
        .update(subscriptions)
        .set({ status: "canceled", updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
