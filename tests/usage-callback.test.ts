import { describe, expect, it, vi } from "vitest";
import { sign } from "@/lib/hmac";

vi.mock("@/db/client", () => ({
  db: {
    insert: vi.fn(() => ({ values: vi.fn(async () => undefined) })),
  },
}));

const { POST } = await import("@/app/api/internal/usage/route");

describe("POST /api/internal/usage", () => {
  it("rejects bad signature", async () => {
    const req = new Request("http://x/api/internal/usage", {
      method: "POST",
      headers: {
        "X-Whisker-Timestamp": String(Math.floor(Date.now() / 1000)),
        "X-Whisker-Signature": "sha256=garbage",
      },
      body: JSON.stringify({ orgId: "x", eventType: "y", quantity: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("accepts a signed event and 200s", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const body = JSON.stringify({
      orgId: "11111111-1111-1111-1111-111111111111",
      eventType: "transcription.completed",
      quantity: 60,
    });
    const sig = sign({ secret: process.env.WHISKER_INTERNAL_SECRET!, body, timestamp: ts });
    const req = new Request("http://x/api/internal/usage", {
      method: "POST",
      headers: { "X-Whisker-Timestamp": String(ts), "X-Whisker-Signature": sig },
      body,
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.ok).toBe(true);
  });

  it("rejects malformed payload", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const body = JSON.stringify({ wrong: "shape" });
    const sig = sign({ secret: process.env.WHISKER_INTERNAL_SECRET!, body, timestamp: ts });
    const req = new Request("http://x/api/internal/usage", {
      method: "POST",
      headers: { "X-Whisker-Timestamp": String(ts), "X-Whisker-Signature": sig },
      body,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
