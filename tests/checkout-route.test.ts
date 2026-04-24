import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  requireSession: vi.fn(async () => ({ user: { id: "u1", email: "e@x.com" } })),
}));
vi.mock("@/db/client", () => ({
  db: {
    query: {
      orgMembers: { findFirst: vi.fn(async () => ({ orgId: "org1", userId: "u1" })) },
      subscriptions: { findFirst: vi.fn(async () => undefined) },
    },
  },
}));
vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: { create: vi.fn(async () => ({ id: "cus_123" })) },
    checkout: {
      sessions: { create: vi.fn(async () => ({ url: "https://checkout.stripe.com/x" })) },
    },
  },
}));

const { POST } = await import("@/app/api/billing/checkout/route");

describe("POST /api/billing/checkout", () => {
  it("returns the checkout URL", async () => {
    const req = new Request("http://x/api/billing/checkout", { method: "POST" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.url).toBe("https://checkout.stripe.com/x");
  });
});
