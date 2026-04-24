import { stripe } from "@/lib/stripe";
import { db } from "@/db/client";
import { usageEvents, subscriptions } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { env } from "@/lib/env";

/** Push all unpushed usage events for an org to Stripe as a single
 *  metered billing event. Returns the count of usage_events processed. */
export async function flushUsageForOrg(orgId: string): Promise<number> {
  const events = await db.query.usageEvents.findMany({
    where: and(eq(usageEvents.orgId, orgId), isNull(usageEvents.pushedToStripeAt)),
  });
  if (events.length === 0) return 0;

  const sub = await db.query.subscriptions.findFirst({ where: eq(subscriptions.orgId, orgId) });
  if (!sub?.stripeSubscriptionId || !sub?.stripeCustomerId) {
    // Free tier (or no Stripe customer yet) — record nothing in Stripe but
    // mark events as processed so they don't pile up.
    await db
      .update(usageEvents)
      .set({ pushedToStripeAt: new Date() })
      .where(and(eq(usageEvents.orgId, orgId), isNull(usageEvents.pushedToStripeAt)));
    return events.length;
  }

  const totalSeconds = events.reduce((acc, e) => acc + e.quantity, 0);
  const minutes = Math.ceil(totalSeconds / 60);

  // Sanity-check: subscription should still carry the usage Price.
  const subscription = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
  const item = subscription.items.data.find((i) => i.price.id === env.STRIPE_PRICE_ID_USAGE);
  if (!item) {
    throw new Error(`subscription has no usage item for ${env.STRIPE_PRICE_ID_USAGE}`);
  }

  // Stripe SDK v22 dropped the legacy `subscriptionItems.createUsageRecord`
  // method in favour of the new metered-billing API. Emit a meter event
  // keyed by the Stripe customer.
  //
  // TODO(deploy): the `event_name` here ("whisker_transcription_minutes") must
  // match the meter configured against STRIPE_PRICE_ID_USAGE in the Stripe
  // dashboard. Surface this as env var if the meter name ever needs to vary
  // per-environment.
  await stripe.billing.meterEvents.create({
    event_name: "whisker_transcription_minutes",
    payload: {
      stripe_customer_id: sub.stripeCustomerId,
      value: String(minutes),
    },
    timestamp: Math.floor(Date.now() / 1000),
  });

  await db
    .update(usageEvents)
    .set({ pushedToStripeAt: new Date() })
    .where(and(eq(usageEvents.orgId, orgId), isNull(usageEvents.pushedToStripeAt)));

  return events.length;
}
