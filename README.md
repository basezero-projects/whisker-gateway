# whisker-gateway

Auth + billing + public API gateway for [Whisker](https://github.com/basezero-projects/whisker).

## Local dev

```bash
pnpm install
cp .env.example .env.local
# Fill in placeholders. At minimum set DATABASE_URL pointing at the engine
# compose Postgres (run `docker compose up -d postgres minio` from ../whisker).
pnpm db:migrate
pnpm dev
```

## Deploy

Vercel project → wire `basezero-projects/whisker-gateway` → set env vars from `.env.example` to real values (Stripe live keys, prod DATABASE_URL, real `WHISKER_INTERNAL_SECRET` shared with engine deploy). Cron in `vercel.json` flushes usage to Stripe nightly.
