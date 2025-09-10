import { MEALS, Meal, Ingredient } from "@/data/meals";

export type Sex = "male" | "female";
export type Activity = "sedentary" | "light" | "moderate" | "very" | "extra";
export type Goal = "lose" | "maintain" | "gain";
export type Preference =
  | "omnivore"
  | "vegetarian"
  | "vegan"
  | "low_carb"
  | "high_protein";

export interface ProfileInput {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: Goal;
  preference: Preference;
  budgetPerWeek: number;
}

export interface MacroTargets {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface DayPlan {
  day: string; // e.g., Mon
  meals: Meal[]; // 3 meals
}

export interface WeekPlan {
  days: DayPlan[];
  targets: MacroTargets;
}

export function getAlternates(current: Meal, pref: Preference): Meal[] {
  const list = filterMeals(pref);
  // Prefer same meal time (breakfast vs mains) and similar calories +- 120
  const isBreakfast = current.tags.includes("breakfast");
  const pool = list.filter((m) =>
    isBreakfast
      ? m.tags.includes("breakfast")
      : m.tags.includes("lunch") || m.tags.includes("dinner"),
  );
  const similar = pool
    .filter((m) => m.id !== current.id)
    .sort(
      (a, b) =>
        Math.abs(a.calories - current.calories) -
        Math.abs(b.calories - current.calories),
    );
  return similar;
}

export function swapMeal(
  plan: WeekPlan,
  dayIndex: number,
  mealIndex: number,
  pref: Preference,
): WeekPlan {
  const day = plan.days[dayIndex];
  const current = day.meals[mealIndex];
  const alts = getAlternates(current, pref);
  const usedIds = new Set(day.meals.map((m) => m.id));
  const next = alts.find((m) => !usedIds.has(m.id)) || alts[0] || current;
  const newDays = plan.days.map((d, i) =>
    i !== dayIndex
      ? d
      : { ...d, meals: d.meals.map((m, j) => (j === mealIndex ? next : m)) },
  );
  const updated: WeekPlan = { ...plan, days: newDays };
  savePlan(updated);
  return updated;
}

export function swapMealWith(
  plan: WeekPlan,
  dayIndex: number,
  mealIndex: number,
  newMeal: Meal,
): WeekPlan {
  const newDays = plan.days.map((d, i) =>
    i !== dayIndex
      ? d
      : { ...d, meals: d.meals.map((m, j) => (j === mealIndex ? newMeal : m)) },
  );
  const updated: WeekPlan = { ...plan, days: newDays };
  savePlan(updated);
  return updated;
}

export function regenerateDay(
  plan: WeekPlan,
  dayIndex: number,
  pref: Preference,
): WeekPlan {
  const list = filterMeals(pref);
  const breakfasts = list.filter((m) => m.tags.includes("breakfast"));
  const mains = list.filter(
    (m) => m.tags.includes("lunch") || m.tags.includes("dinner"),
  );
  const i = (dayIndex + 3) % Math.max(1, breakfasts.length);
  const j = (dayIndex * 2 + 1) % Math.max(1, mains.length);
  const k = (dayIndex * 2 + 2) % Math.max(1, mains.length);
  const meals: Meal[] = [
    breakfasts[i] || list[0],
    mains[j] || list[1] || list[0],
    mains[k] || list[2] || list[0],
  ];
  const newDays = plan.days.map((d, idx) =>
    idx === dayIndex ? { ...d, meals } : d,
  );
  const updated: WeekPlan = { ...plan, days: newDays };
  savePlan(updated);
  return updated;
}

export function mifflinStJeorBMR({
  sex,
  weightKg,
  heightCm,
  age,
}: ProfileInput) {
  // kcal/day
  const s = sex === "male" ? 5 : -161;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + s;
}

export function activityFactor(a: Activity) {
  switch (a) {
    case "sedentary":
      return 1.2;
    case "light":
      return 1.375;
    case "moderate":
      return 1.55;
    case "very":
      return 1.725;
    case "extra":
      return 1.9;
  }
}

export function adjustForGoal(tdee: number, goal: Goal) {
  if (goal === "lose") return Math.round(tdee * 0.8);
  if (goal === "gain") return Math.round(tdee * 1.15);
  return Math.round(tdee);
}

export function macroSplit(pref: Preference) {
  // Return macro calories percentage
  switch (pref) {
    case "low_carb":
      return { p: 0.3, c: 0.25, f: 0.45 };
    case "high_protein":
      return { p: 0.35, c: 0.4, f: 0.25 };
    default:
      return { p: 0.3, c: 0.45, f: 0.25 };
  }
}

export function computeTargets(input: ProfileInput): MacroTargets {
  const bmr = mifflinStJeorBMR(input);
  const tdee = bmr * activityFactor(input.activity);
  const calories = adjustForGoal(tdee, input.goal);
  const split = macroSplit(input.preference);
  const protein = Math.round((calories * split.p) / 4);
  const carbs = Math.round((calories * split.c) / 4);
  const fat = Math.round((calories * split.f) / 9);
  return { calories, protein, carbs, fat };
}

export function filterMeals(pref: Preference): Meal[] {
  let list = MEALS;
  if (pref === "vegetarian")
    list = MEALS.filter(
      (m) =>
        !m.tags.includes("beef") &&
        !m.tags.includes("pork") &&
        !/shrimp|chicken|beef|salmon/i.test(m.name),
    );
  if (pref === "vegan") list = MEALS.filter((m) => m.tags.includes("vegan"));
  if (pref === "low_carb")
    list = MEALS.filter((m) => m.tags.includes("low_carb") || m.carbs <= 35);
  if (pref === "high_protein")
    list = MEALS.filter(
      (m) => m.tags.includes("high_protein") || m.protein >= 30,
    );
  return list;
}

export function buildWeekPlan(input: ProfileInput): WeekPlan {
  const targets = computeTargets(input);
  const list = filterMeals(input.preference);
  // Ensure we have some breakfast/lunch/dinner categorization
  const breakfasts = list.filter((m) => m.tags.includes("breakfast"));
  const mains = list.filter(
    (m) => m.tags.includes("lunch") || m.tags.includes("dinner"),
  );
  const fallback = list;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const plan = days.map((d, i) => {
    const b =
      breakfasts[i % (breakfasts.length || 1)] || fallback[i % fallback.length];
    const l =
      mains[(i * 2) % (mains.length || 1)] ||
      fallback[(i * 2) % fallback.length];
    const dn =
      mains[(i * 2 + 1) % (mains.length || 1)] ||
      fallback[(i * 2 + 1) % fallback.length];
    return { day: d, meals: [b, l, dn] } as DayPlan;
  });

  return { days: plan, targets };
}

export type GroceryItem = {
  name: string;
  unit: string;
  qty: number;
  cost?: number;
};

export function aggregateGroceries(plan: WeekPlan) {
  const map = new Map<string, GroceryItem>();

  for (const day of plan.days) {
    for (const meal of day.meals) {
      for (const ing of meal.ingredients) {
        const key = `${ing.name}|${ing.unit}`;
        const prev = map.get(key);
        const qty = (prev?.qty || 0) + ing.qty;
        const cost = ing.costPerUnit ? qty * ing.costPerUnit : prev?.cost;
        map.set(key, { name: ing.name, unit: ing.unit, qty, cost });
      }
    }
  }

  const items = Array.from(map.values());
  const totalCost = items.reduce((s, i) => s + (i.cost || 0), 0);
  items.sort((a, b) => (b.cost || 0) - (a.cost || 0));
  return { items, totalCost };
}

export function formatQty(qty: number) {
  if (Number.isInteger(qty)) return String(qty);
  return qty.toFixed(2).replace(/\.00$/, "");
}

export type GroceryCategory =
  | "Proteins"
  | "Carbs"
  | "Vegetables"
  | "Condiments"
  | "Snacks";

export function categorize(name: string): GroceryCategory {
  const n = name.toLowerCase();
  if (/gà|bò|heo|trứng|tôm|cá|thịt|cua|lạp xưởng|đậu hũ|đậu phụ/.test(n))
    return "Proteins";
  if (
    /gạo|cơm|bánh mì|bún|miến|mì|bánh phở|bánh đa|gạo nếp|khoai|bánh tráng|bánh canh|spaghetti|pasta|couscous/.test(
      n,
    )
  )
    return "Carbs";
  if (
    /rau|dưa|cà chua|dưa leo|hành|tỏi|giá|bí|cải|đậu hà lan|thơm|dứa|cà rốt|hẹ|xà lách|bắp cải/.test(
      n,
    )
  )
    return "Vegetables";
  if (
    /nước mắm|nước tương|muối|tiêu|đường|mắm|xì dầu|dầu|dầu ăn|giấm|tương ớt|mayonnaise/.test(
      n,
    )
  )
    return "Condiments";
  // Treat fruits and dairy as Snacks for simplified grouping UI
  if (
    /chuối|xoài|cam|thơm|dứa|sữa|sữa chua|yogurt|phô mai|hạt|đ���u phộng|bim bim|bánh quy/.test(
      n,
    )
  )
    return "Snacks";
  return "Snacks";
}

export function groupGroceries(items: GroceryItem[]) {
  const groups = new Map<GroceryCategory, GroceryItem[]>();
  for (const it of items) {
    const cat = categorize(it.name);
    const arr = groups.get(cat) || [];
    arr.push(it);
    groups.set(cat, arr);
  }
  return Array.from(groups.entries()).map(([category, list]) => ({
    category,
    list,
  }));
}

// Persistence
const KEY = "smartmeal.profile.v1";
const PLAN_KEY = "smartmeal.plan.v1";
const LOG_KEY = "smartmeal.logs.v1";
const LOG_STACK_KEY = "smartmeal.logs.stack.v1";

export function saveProfile(input: ProfileInput) {
  localStorage.setItem(KEY, JSON.stringify(input));
}
export function loadProfile(): ProfileInput | null {
  const v = localStorage.getItem(KEY);
  return v ? (JSON.parse(v) as ProfileInput) : null;
}
export function savePlan(plan: WeekPlan) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
}
export function loadPlan(): WeekPlan | null {
  const v = localStorage.getItem(PLAN_KEY);
  return v ? (JSON.parse(v) as WeekPlan) : null;
}

export type DayLog = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
export type Logs = Record<string, DayLog>; // key by yyyy-mm-dd

export function loadLogs(): Logs {
  const v = localStorage.getItem(LOG_KEY);
  return v ? (JSON.parse(v) as Logs) : {};
}
export function saveLogs(logs: Logs) {
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  try {
    const body = JSON.stringify({ logs: Object.values(logs) });
    fetch("/api/logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

// Action stack for undo per day
export type LogAction = {
  mealId: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
export type LogStacks = Record<string, LogAction[]>; // by date

export function loadLogStacks(): LogStacks {
  const v = sessionStorage.getItem(LOG_STACK_KEY);
  return v ? (JSON.parse(v) as LogStacks) : {};
}
export function saveLogStacks(stacks: LogStacks) {
  sessionStorage.setItem(LOG_STACK_KEY, JSON.stringify(stacks));
}

export function pushLogAction(date: string, action: LogAction) {
  const stacks = loadLogStacks();
  const arr = stacks[date] || [];
  stacks[date] = [...arr, action];
  saveLogStacks(stacks);
}

export function popLastLogAction(date: string): LogAction | null {
  const stacks = loadLogStacks();
  const arr = stacks[date] || [];
  const last = arr.pop() || null;
  stacks[date] = arr;
  saveLogStacks(stacks);
  return last;
}
