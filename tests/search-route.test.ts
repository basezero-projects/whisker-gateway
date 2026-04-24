import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api-key-auth", () => ({
  authenticateRequest: vi.fn(async () => ({ orgId: "org-1", apiKeyId: "key-1" })),
}));
vi.mock("@/lib/engine-client", () => ({
  callEngine: vi.fn(async () => [{ id: 1, snippet: "match" }]),
}));

const { GET } = await import("@/app/api/v1/search/route");

describe("GET /api/v1/search", () => {
  it("happy path", async () => {
    const req = new Request("http://x/api/v1/search?q=foo", {
      headers: { authorization: "Bearer wsk_test_xx" },
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it("rejects missing auth", async () => {
    const mod = await import("@/lib/api-key-auth");
    (mod.authenticateRequest as any).mockResolvedValueOnce(null);
    const req = new Request("http://x/api/v1/search?q=foo");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
