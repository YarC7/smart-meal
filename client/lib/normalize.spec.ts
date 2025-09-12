import { describe, it, expect } from "vitest";
import { normalizeUnitAndQty } from "./planner";

describe("normalizeUnitAndQty", () => {
  it("converts kg to g with costFactor", () => {
    const r = normalizeUnitAndQty(1, "kg");
    expect(r.unit).toBe("g");
    expect(r.qty).toBe(1000);
    expect(r.costFactor).toBeCloseTo(1 / 1000);
  });
  it("maps cups to ml", () => {
    const r = normalizeUnitAndQty(2, "cup");
    expect(r.unit).toBe("ml");
    expect(r.qty).toBe(480);
    expect(r.costFactor).toBeCloseTo(1 / 240);
  });
  it("maps tbsp and tsp to ml using aliases file", () => {
    const r1 = normalizeUnitAndQty(2, "tbsp");
    expect(r1.unit).toBe("ml");
    expect(r1.qty).toBe(30);
    expect(r1.costFactor).toBeCloseTo(1 / 15);
    const r2 = normalizeUnitAndQty(3, "tsp");
    expect(r2.unit).toBe("ml");
    expect(r2.qty).toBe(15);
    expect(r2.costFactor).toBeCloseTo(1 / 5);
  });
  it("maps pcs and quả to piece", () => {
    expect(normalizeUnitAndQty(3, "pcs").unit).toBe("piece");
    expect(normalizeUnitAndQty(1, "quả").unit).toBe("piece");
  });
});
