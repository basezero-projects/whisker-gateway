import { z } from "zod";

const Schema = z.object({
  WHISKER_ENGINE_URL: z.string().url(),
  WHISKER_INTERNAL_SECRET: z.string().min(16),
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(16),
  BETTER_AUTH_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  STRIPE_PRICE_ID_USAGE: z.string().startsWith("price_"),
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_TRACES_SAMPLE_RATE: z.string().optional(),
  NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: z.string().optional(),
});

export const env = Schema.parse(process.env);
