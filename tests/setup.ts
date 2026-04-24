// Test setup — load .env.test if it exists, otherwise use placeholder env.
import { config } from "dotenv";
config({ path: ".env.test" });

process.env.DATABASE_URL ??= "postgresql://whisker:whisker@127.0.0.1:5432/whisker";
process.env.WHISKER_INTERNAL_SECRET ??= "test-secret-do-not-use-in-prod";
process.env.WHISKER_ENGINE_URL ??= "http://127.0.0.1:8765";
process.env.BETTER_AUTH_SECRET ??= "test-better-auth-secret-32-bytes-min";
process.env.BETTER_AUTH_URL ??= "http://localhost:3000";
process.env.STRIPE_SECRET_KEY ??= "sk_test_placeholder";
process.env.STRIPE_WEBHOOK_SECRET ??= "whsec_placeholder";
process.env.STRIPE_PRICE_ID_USAGE ??= "price_placeholder";
