import { describe, expect, it } from "vitest";
import { sign, verify, MAX_SKEW_SECONDS } from "@/lib/hmac";

const secret = "test-secret";

describe("hmac", () => {
  it("sign + verify round trip succeeds", () => {
    const body = JSON.stringify({ hello: "world" });
    const ts = Math.floor(Date.now() / 1000);
    const sig = sign({ secret, body, timestamp: ts });
    expect(verify({ secret, body, timestamp: ts, signature: sig })).toBe(true);
  });

  it("verify rejects mismatched body", () => {
    const ts = Math.floor(Date.now() / 1000);
    const sig = sign({ secret, body: "a", timestamp: ts });
    expect(verify({ secret, body: "b", timestamp: ts, signature: sig })).toBe(false);
  });

  it("verify rejects mismatched secret", () => {
    const ts = Math.floor(Date.now() / 1000);
    const sig = sign({ secret, body: "a", timestamp: ts });
    expect(verify({ secret: "other", body: "a", timestamp: ts, signature: sig })).toBe(false);
  });

  it("verify rejects skew beyond MAX_SKEW_SECONDS", () => {
    const ts = Math.floor(Date.now() / 1000) - MAX_SKEW_SECONDS - 10;
    const sig = sign({ secret, body: "a", timestamp: ts });
    expect(verify({ secret, body: "a", timestamp: ts, signature: sig })).toBe(false);
  });
});
