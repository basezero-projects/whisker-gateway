import { describe, expect, it } from "vitest";
import { generate, parse, verifySecret } from "@/lib/api-keys";

describe("api-keys", () => {
  it("generates a key with the documented format", () => {
    const k = generate({ env: "test" });
    expect(k.full).toMatch(/^wsk_test_[a-z0-9]{8}_[A-Za-z0-9_-]{32,}$/);
    expect(k.prefix).toHaveLength(8);
    expect(k.secret.length).toBeGreaterThanOrEqual(32);
  });

  it("parse extracts the prefix from a full key", () => {
    const k = generate({ env: "live" });
    const parsed = parse(k.full);
    expect(parsed?.env).toBe("live");
    expect(parsed?.prefix).toBe(k.prefix);
    expect(parsed?.secret).toBe(k.secret);
  });

  it("parse returns null for malformed input", () => {
    expect(parse("garbage")).toBeNull();
    expect(parse("wsk_only_two")).toBeNull();
    expect(parse("")).toBeNull();
  });

  it("verifySecret returns true only for the original secret", async () => {
    const k = generate({ env: "test" });
    expect(await verifySecret(k.secret, k.secretHash)).toBe(true);
    expect(await verifySecret("wrong", k.secretHash)).toBe(false);
  });
});
