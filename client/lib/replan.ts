import { WeekPlan, filterMeals } from "@/lib/planner";
import { MEALS, Meal } from "@/data/meals";

export function mealCost(meal: Meal): number {
  return meal.ingredients.reduce((s, i) => s + (i.costPerUnit ? i.costPerUnit * i.qty : 0), 0);
}

export function estimateMealCost(mealId: string): number {
  const m = MEALS.find((x) => x.id === mealId);
  return m ? mealCost(m) : 0;
}

function closeEnough(a: number, b: number, pct = 0.1) {
  if (b === 0) return true;
  return Math.abs(a - b) / b <= pct;
}

function similarMacros(base: Meal, cand: Meal): boolean {
  return (
    closeEnough(cand.calories, base.calories, 0.1) &&
    closeEnough(cand.protein, base.protein, 0.1) &&
    closeEnough(cand.carbs, base.carbs, 0.2) &&
    closeEnough(cand.fat, base.fat, 0.2)
  );
}

export function replanUnderBudget(plan: WeekPlan, budget: number): { plan: WeekPlan; changed: number } {
  // Attempt to replace highest-cost meals first with cheaper similar macro meals
  const flat: { dayIndex: number; mealIndex: number; meal: Meal; cost: number }[] = [];
  plan.days.forEach((d, di) =>
    d.meals.forEach((m, mi) => flat.push({ dayIndex: di, mealIndex: mi, meal: m, cost: mealCost(m) })),
  );
  let total = flat.reduce((s, x) => s + x.cost, 0);
  let changed = 0;
  const all = filterMeals("omnivore" as any); // use entire set; Planner filters elsewhere

  for (const item of flat.sort((a, b) => b.cost - a.cost)) {
    if (total <= budget) break;
    const candidates = all
      .filter((m) => m.id !== item.meal.id)
      .filter((m) => similarMacros(item.meal, m))
      .sort((a, b) => mealCost(a) - mealCost(b));
    const cheaper = candidates.find((m) => mealCost(m) < item.cost);
    if (cheaper) {
      const delta = item.cost - mealCost(cheaper);
      plan.days[item.dayIndex].meals[item.mealIndex] = cheaper;
      total -= delta;
      changed++;
    }
  }
  return { plan, changed };
}
