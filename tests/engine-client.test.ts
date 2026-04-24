import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { callEngine } from "@/lib/engine-client";

describe("callEngine", () => {
  const original = global.fetch;
  beforeEach(() => {
    global.fetch = vi.fn(async (url: any, init: any) => {
      return new Response(
        JSON.stringify({ url: String(url), method: init?.method, headers: init?.headers, body: init?.body ?? null }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }) as any;
  });
  afterEach(() => { global.fetch = original; });

  it("includes signature + timestamp headers", async () => {
    const out: any = await callEngine({ path: "/api/internal/health", method: "GET" });
    expect(out.headers["X-Whisker-Timestamp"]).toMatch(/^\d+$/);
    expect(out.headers["X-Whisker-Signature"]).toMatch(/^sha256=[0-9a-f]{64}$/);
  });

  it("forwards orgId in X-Whisker-Org", async () => {
    const out: any = await callEngine({ path: "/api/internal/echo", method: "GET", orgId: "abc-123" });
    expect(out.headers["X-Whisker-Org"]).toBe("abc-123");
  });
});
