import { WeekPlan, filterMeals, categorize } from "@/lib/planner";
import { MEALS, Meal } from "@/data/meals";

export function mealCost(meal: Meal): number {
  return meal.ingredients.reduce(
    (s, i) => s + (i.costPerUnit ? i.costPerUnit * i.qty : 0),
    0,
  );
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

function getDiversityRulesSync() {
  try {
    const v = localStorage.getItem("smartmeal.diversity.rules.v1");
    if (v) return JSON.parse(v) as { maxRepeatPerWeek: number; minVegetablePerDay: number; preferTags: string[] };
  } catch {}
  return { maxRepeatPerWeek: 2, minVegetablePerDay: 1, preferTags: ["low_cost", "vietnamese"] };
}

function hasVegetable(meal: Meal): boolean {
  return meal.ingredients.some((i) => categorize(i.name) === "Vegetables");
}

export function replanUnderBudget(
  plan: WeekPlan,
  budget: number,
): { plan: WeekPlan; changed: number } {
  const rules = getDiversityRulesSync();
  const flat: { dayIndex: number; mealIndex: number; meal: Meal; cost: number }[] = [];
  plan.days.forEach((d, di) =>
    d.meals.forEach((m, mi) => flat.push({ dayIndex: di, mealIndex: mi, meal: m, cost: mealCost(m) })),
  );
  let total = flat.reduce((s, x) => s + x.cost, 0);
  let changed = 0;
  const all = filterMeals("omnivore" as any);

  const freq = new Map<string, number>();
  for (const m of flat.map((f) => f.meal)) freq.set(m.id, (freq.get(m.id) || 0) + 1);

  for (const item of flat.sort((a, b) => b.cost - a.cost)) {
    if (total <= budget) break;
    const dayHasVeg = plan.days[item.dayIndex].meals.some((m) => hasVegetable(m));

    const candidates = all
      .filter((m) => m.id !== item.meal.id)
      .filter((m) => (freq.get(m.id) || 0) < rules.maxRepeatPerWeek)
      .filter((m) => (dayHasVeg ? true : hasVegetable(m)))
      .filter((m) => similarMacros(item.meal, m))
      .sort((a, b) => {
        const ca = mealCost(a);
        const cb = mealCost(b);
        if (ca !== cb) return ca - cb;
        const ta = (a.tags || []).some((t) => rules.preferTags.includes(t));
        const tb = (b.tags || []).some((t) => rules.preferTags.includes(t));
        return ta === tb ? 0 : ta ? -1 : 1;
      });
    const cheaper = candidates.find((m) => mealCost(m) < item.cost);
    if (cheaper) {
      const delta = item.cost - mealCost(cheaper);
      plan.days[item.dayIndex].meals[item.mealIndex] = cheaper;
      freq.set(cheaper.id, (freq.get(cheaper.id) || 0) + 1);
      total -= delta;
      changed++;
    }
  }
  // Ensure min vegetable per day post-pass
  for (let di = 0; di < plan.days.length; di++) {
    const day = plan.days[di];
    const vegCount = day.meals.filter(hasVegetable).length;
    if (vegCount >= rules.minVegetablePerDay) continue;
    const pool = all.filter(hasVegetable).sort((a, b) => mealCost(a) - mealCost(b));
    for (let add = 0; add < rules.minVegetablePerDay - vegCount; add++) {
      const targetIdx = day.meals.findIndex((m) => !hasVegetable(m));
      if (targetIdx >= 0) {
        const pick = pool.find((m) => (freq.get(m.id) || 0) < rules.maxRepeatPerWeek);
        if (pick) {
          plan.days[di].meals[targetIdx] = pick;
          freq.set(pick.id, (freq.get(pick.id) || 0) + 1);
          changed++;
        }
      }
    }
  }
  return { plan, changed };
}
