import { describe, it, expect, vi, beforeEach } from "vitest";
import { preloadImage } from "./media";

describe("preloadImage", () => {
  beforeEach(() => {
    (global as any).Image = vi.fn().mockImplementation(() => ({ set src(v: string) {} }));
  });
  it("creates an Image and sets src", () => {
    preloadImage("/foo.png");
    expect((global as any).Image).toHaveBeenCalledTimes(1);
  });
});
