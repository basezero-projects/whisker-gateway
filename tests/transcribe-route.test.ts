import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api-key-auth", () => ({
  authenticateRequest: vi.fn(async () => ({ orgId: "org-1", apiKeyId: "key-1" })),
}));
vi.mock("@/lib/engine-client", () => ({
  callEngine: vi.fn(async () => ({ id: 42, status: "pending", duplicate: false })),
}));

const { POST } = await import("@/app/api/v1/transcribe/route");

describe("POST /api/v1/transcribe", () => {
  it("happy path returns engine response", async () => {
    const req = new Request("http://x/api/v1/transcribe", {
      method: "POST",
      headers: { authorization: "Bearer wsk_test_xx" },
      body: JSON.stringify({ url: "https://example.com/a" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe(42);
  });

  it("rejects missing auth", async () => {
    const mod = await import("@/lib/api-key-auth");
    (mod.authenticateRequest as any).mockResolvedValueOnce(null);
    const req = new Request("http://x/api/v1/transcribe", {
      method: "POST",
      body: JSON.stringify({ url: "https://example.com/a" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("rejects malformed body", async () => {
    const req = new Request("http://x/api/v1/transcribe", {
      method: "POST",
      headers: { authorization: "Bearer wsk_test_xx" },
      body: JSON.stringify({ wrong: "shape" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
