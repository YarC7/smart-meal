import { describe, it, expect } from "vitest";
import fs from "fs";

describe("service worker image caching", () => {
  it("has registerRoute for images and offline fallback", () => {
    const content = fs.readFileSync("client/sw.ts", "utf-8");
    expect(content).toMatch(/request\.destination === "image"/);
    expect(content).toMatch(/placeholder\.svg/);
  });
});
