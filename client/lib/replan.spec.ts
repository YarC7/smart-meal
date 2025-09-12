import { describe, it, expect } from "vitest";
import { buildWeekPlan, type ProfileInput } from "./planner";
import { replanUnderBudget } from "./replan";

const profile: ProfileInput = {
  age: 30,
  sex: "male",
  heightCm: 178,
  weightKg: 75,
  activity: "moderate",
  goal: "maintain",
  preference: "omnivore",
  budgetPerWeek: 30,
};

function planCost(plan: ReturnType<typeof buildWeekPlan>) {
  return plan.days
    .flatMap((d) => d.meals)
    .reduce((s, m) => s + m.ingredients.reduce((x, i) => x + (i.costPerUnit ? i.costPerUnit * i.qty : 0), 0), 0);
}

describe("replanUnderBudget", () => {
  it("reduces cost while keeping macros roughly similar", () => {
    const base = buildWeekPlan(profile);
    const baseCost = planCost(base);
    const budget = Math.max(1, Math.floor(baseCost * 0.9));
    const { plan: updated, changed } = replanUnderBudget(JSON.parse(JSON.stringify(base)), budget);
    expect(changed).toBeGreaterThanOrEqual(0);
    const newCost = planCost(updated);
    expect(newCost).toBeLessThanOrEqual(budget);
    // Compare macro sums
    const sum = (k: "calories" | "protein" | "carbs" | "fat", p: typeof base) =>
      p.days.flatMap((d) => d.meals).reduce((s, m) => s + (m as any)[k], 0);
    const baseProtein = sum("protein", base);
    const newProtein = sum("protein", updated);
    const baseCalories = sum("calories", base);
    const newCalories = sum("calories", updated);
    // within ±10%
    expect(Math.abs(newProtein - baseProtein) / Math.max(1, baseProtein)).toBeLessThanOrEqual(0.1);
    expect(Math.abs(newCalories - baseCalories) / Math.max(1, baseCalories)).toBeLessThanOrEqual(0.1);
  });
});
