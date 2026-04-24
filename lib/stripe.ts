import Stripe from "stripe";
import { env } from "@/lib/env";

// API version pinned to the SDK default; bump deliberately per migration.
export const stripe = new Stripe(env.STRIPE_SECRET_KEY);
