import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api-key-auth", () => ({
  authenticateRequest: vi.fn(async () => ({ orgId: "org-1", apiKeyId: "key-1" })),
}));
vi.mock("@/lib/engine-client", () => ({
  callEngine: vi.fn(async () => ({ id: 1, type: "transcribe.url", status: "done" })),
}));

const { GET } = await import("@/app/api/v1/jobs/[id]/route");

describe("GET /api/v1/jobs/[id]", () => {
  it("happy path", async () => {
    const req = new Request("http://x/api/v1/jobs/1", {
      headers: { authorization: "Bearer wsk_test_xx" },
    });
    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
  });

  it("rejects missing auth", async () => {
    const mod = await import("@/lib/api-key-auth");
    (mod.authenticateRequest as any).mockResolvedValueOnce(null);
    const req = new Request("http://x/api/v1/jobs/1");
    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(401);
  });
});
