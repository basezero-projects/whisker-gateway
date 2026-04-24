import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn((body: string, sig: string) => {
        if (sig === "good") {
          return JSON.parse(body);
        }
        throw new Error("bad signature");
      }),
    },
  },
}));

vi.mock("@/db/client", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onConflictDoUpdate: vi.fn(async () => undefined),
      })),
    })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(async () => undefined) })) })),
  },
}));

const { POST } = await import("@/app/api/webhooks/stripe/route");

describe("POST /api/webhooks/stripe", () => {
  it("rejects bad signature with 400", async () => {
    const req = new Request("http://x/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "bad" },
      body: JSON.stringify({ type: "customer.subscription.created", data: { object: {} } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("accepts customer.subscription.created and 200s", async () => {
    const req = new Request("http://x/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "good" },
      body: JSON.stringify({
        type: "customer.subscription.created",
        data: {
          object: {
            id: "sub_123",
            customer: "cus_123",
            status: "active",
            current_period_end: 1900000000,
            metadata: { orgId: "11111111-1111-1111-1111-111111111111", plan: "pro" },
          },
        },
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.received).toBe(true);
  });

  it("ignores unknown event types but 200s", async () => {
    const req = new Request("http://x/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "good" },
      body: JSON.stringify({ type: "checkout.session.completed", data: { object: {} } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
