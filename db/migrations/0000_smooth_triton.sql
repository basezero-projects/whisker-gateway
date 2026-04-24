CREATE SCHEMA "gateway";
--> statement-breakpoint
CREATE TABLE "gateway"."accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gateway"."api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"name" text NOT NULL,
	"prefix" text NOT NULL,
	"secret_hash" text NOT NULL,
	"scopes" text[] DEFAULT '{"transcribe"}' NOT NULL,
	"last_used_at" timestamp,
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gateway"."licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"key_hash" text NOT NULL,
	"plan" text NOT NULL,
	"valid_until" timestamp,
	"last_validated_at" timestamp,
	"seats" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "licenses_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "gateway"."org_members" (
	"org_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'owner' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "org_members_org_id_user_id_pk" PRIMARY KEY("org_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "gateway"."orgs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orgs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gateway"."quotas" (
	"org_id" uuid PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"monthly_minute_limit" integer NOT NULL,
	"current_usage_seconds" bigint DEFAULT 0 NOT NULL,
	"reset_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gateway"."sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "gateway"."subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"plan" text DEFAULT 'free' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_org_id_unique" UNIQUE("org_id")
);
--> statement-breakpoint
CREATE TABLE "gateway"."usage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"api_key_id" uuid,
	"event_type" text NOT NULL,
	"quantity" integer NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"pushed_to_stripe_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gateway"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" text,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "gateway"."verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gateway"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "gateway"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."api_keys" ADD CONSTRAINT "api_keys_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "gateway"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."api_keys" ADD CONSTRAINT "api_keys_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "gateway"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."licenses" ADD CONSTRAINT "licenses_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "gateway"."orgs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."org_members" ADD CONSTRAINT "org_members_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "gateway"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."org_members" ADD CONSTRAINT "org_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "gateway"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."quotas" ADD CONSTRAINT "quotas_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "gateway"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "gateway"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."subscriptions" ADD CONSTRAINT "subscriptions_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "gateway"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."usage_events" ADD CONSTRAINT "usage_events_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "gateway"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway"."usage_events" ADD CONSTRAINT "usage_events_api_key_id_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "gateway"."api_keys"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "api_keys_prefix_idx" ON "gateway"."api_keys" USING btree ("prefix");--> statement-breakpoint
CREATE INDEX "api_keys_org_idx" ON "gateway"."api_keys" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "org_members_user_idx" ON "gateway"."org_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "usage_events_org_idx" ON "gateway"."usage_events" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "usage_events_pending_idx" ON "gateway"."usage_events" USING btree ("pushed_to_stripe_at");