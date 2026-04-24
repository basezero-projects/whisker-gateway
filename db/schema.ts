import {
  pgSchema,
  text,
  uuid,
  timestamp,
  integer,
  bigint,
  boolean,
  jsonb,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const gateway = pgSchema("gateway");

// --- better-auth standard tables ---

export const users = gateway.table("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = gateway.table("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = gateway.table("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerId: text("provider_id").notNull(),
  accountId: text("account_id").notNull(),
  password: text("password"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = gateway.table("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- whisker-specific gateway tables ---

export const orgs = gateway.table("orgs", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orgMembers = gateway.table(
  "org_members",
  {
    orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("owner"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.orgId, t.userId] }),
    userIdx: index("org_members_user_idx").on(t.userId),
  })
);

export const apiKeys = gateway.table(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
    createdBy: text("created_by").notNull().references(() => users.id),
    name: text("name").notNull(),
    prefix: text("prefix").notNull(),
    secretHash: text("secret_hash").notNull(),
    scopes: text("scopes").array().notNull().default(["transcribe"]),
    lastUsedAt: timestamp("last_used_at"),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    prefixIdx: uniqueIndex("api_keys_prefix_idx").on(t.prefix),
    orgIdx: index("api_keys_org_idx").on(t.orgId),
  })
);

export const subscriptions = gateway.table("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id").notNull().unique().references(() => orgs.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan").notNull().default("free"),
  status: text("status").notNull().default("active"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usageEvents = gateway.table(
  "usage_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
    apiKeyId: uuid("api_key_id").references(() => apiKeys.id, { onDelete: "set null" }),
    eventType: text("event_type").notNull(),
    quantity: integer("quantity").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    pushedToStripeAt: timestamp("pushed_to_stripe_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    orgIdx: index("usage_events_org_idx").on(t.orgId),
    pendingIdx: index("usage_events_pending_idx").on(t.pushedToStripeAt),
  })
);

export const quotas = gateway.table("quotas", {
  orgId: uuid("org_id").primaryKey().references(() => orgs.id, { onDelete: "cascade" }),
  plan: text("plan").notNull(),
  monthlyMinuteLimit: integer("monthly_minute_limit").notNull(),
  currentUsage: bigint("current_usage_seconds", { mode: "number" }).notNull().default(0),
  resetAt: timestamp("reset_at").notNull().defaultNow(),
});

export const licenses = gateway.table("licenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id").references(() => orgs.id, { onDelete: "set null" }),
  keyHash: text("key_hash").notNull().unique(),
  plan: text("plan").notNull(),
  validUntil: timestamp("valid_until"),
  lastValidatedAt: timestamp("last_validated_at"),
  seats: integer("seats").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
