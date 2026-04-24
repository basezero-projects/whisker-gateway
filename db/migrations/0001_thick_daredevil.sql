ALTER TABLE "gateway"."accounts" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "gateway"."accounts" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "gateway"."accounts" ADD COLUMN "id_token" text;--> statement-breakpoint
ALTER TABLE "gateway"."accounts" ADD COLUMN "access_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "gateway"."accounts" ADD COLUMN "refresh_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "gateway"."accounts" ADD COLUMN "scope" text;--> statement-breakpoint
ALTER TABLE "gateway"."accounts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "gateway"."sessions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "gateway"."verifications" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;