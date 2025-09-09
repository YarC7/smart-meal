import { describe, it, expect } from "vitest";
import {
  computeTargets,
  buildWeekPlan,
  aggregateGroceries,
  type ProfileInput,
} from "./planner";

const baseProfile: ProfileInput = {
  age: 28,
  sex: "male",
  heightCm: 175,
  weightKg: 72,
  activity: "moderate",
  goal: "maintain",
  preference: "omnivore",
  budgetPerWeek: 40,
};

describe("computeTargets", () => {
  it("calculates macros in grams from calories split", () => {
    const t = computeTargets(baseProfile);
    expect(t.calories).toBeGreaterThan(1800);
    expect(t.protein).toBeGreaterThan(100);
    expect(t.carbs).toBeGreaterThan(150);
    expect(t.fat).toBeGreaterThan(40);
  });
});

describe("buildWeekPlan", () => {
  it("returns 7 days with 3 meals each", () => {
    const plan = buildWeekPlan(baseProfile);
    expect(plan.days).toHaveLength(7);
    for (const day of plan.days) {
      expect(day.meals.length).toBe(3);
    }
  });
});

describe("aggregateGroceries", () => {
  it("aggregates quantities and computes total cost", () => {
    const plan = buildWeekPlan(baseProfile);
    const { items, totalCost } = aggregateGroceries(plan);
    expect(items.length).toBeGreaterThan(0);
    // Should have a positive total cost estimate
    expect(totalCost).toBeGreaterThan(0);
    // Merged quantities for same name+unit
    const names = new Set(items.map((i) => `${i.name}|${i.unit}`));
    expect(names.size).toBe(items.length);
  });
});
