import { describe, it, expect } from "vitest";
import { normalizeUnitAndQty } from "./planner";

describe("normalizeUnitAndQty", () => {
  it("converts kg to g with costFactor", () => {
    const r = normalizeUnitAndQty(1, "kg");
    expect(r.unit).toBe("g");
    expect(r.qty).toBe(1000);
    expect(r.costFactor).toBeCloseTo(1/1000);
  });
  it("maps cups to ml", () => {
    const r = normalizeUnitAndQty(2, "cup");
    expect(r.unit).toBe("ml");
    expect(r.qty).toBe(480);
    expect(r.costFactor).toBeCloseTo(1/240);
  });
  it("maps pcs and quả to piece", () => {
    expect(normalizeUnitAndQty(3, "pcs").unit).toBe("piece");
    expect(normalizeUnitAndQty(1, "quả").unit).toBe("piece");
  });
});
