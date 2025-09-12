import { Recipe } from "@shared/recipe";
import { RECIPES } from "@/data/recipes";

const RECIPES_KEY = "recipes.v2";
const EXTRA_GROCERY_KEY = "smartmeal.grocery.extra.v1";
const REMOTE_SYNC_FLAG = "smartmeal.recipes.remote.v4.synced";
const REMOTE_RECIPES_URL =
  "https://cdn.builder.io/o/assets%2F9c3b9c41cf804cacbe891b2a77ab48ac%2Fea082bb74e624fcea0bc647454d4c7f8?alt=media&token=834f4563-aff4-4ed4-b1be-5f6847353d9d&apiKey=9c3b9c41cf804cacbe891b2a77ab48ac";

export function loadRecipes(): Recipe[] {
  const v = localStorage.getItem(RECIPES_KEY);
  if (v) return JSON.parse(v) as Recipe[];
  localStorage.setItem(RECIPES_KEY, JSON.stringify(RECIPES));
  return RECIPES;
}

export function getRecipe(id: string): Recipe | undefined {
  return loadRecipes().find((r) => r.id === id);
}

export async function syncRemoteRecipesOnce(url: string = REMOTE_RECIPES_URL) {
  try {
    if (localStorage.getItem(REMOTE_SYNC_FLAG) === "1") return;
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return;
    const arr = (await r.json()) as any[];
    if (!Array.isArray(arr)) return;
    const existing = loadRecipes();
    const have = new Set(existing.map((x) => x.id));
    const mapped: Recipe[] = arr
      .map((x: any) => {
        const macros = x.macrosPerServing || {};
        const image: string | undefined =
          typeof x.image === "string" && /^https?:\/\//.test(x.image)
            ? x.image
            : undefined;
        const steps = Array.isArray(x.steps)
          ? x.steps.map((s: any) => ({
              order: Number(s.order) || 0,
              text: String(s.text || "").trim(),
              time: typeof s.time === "number" ? s.time : undefined,
              media: typeof s.media === "string" ? s.media : undefined,
              type: s.type,
              heat: s.heat,
              timers: Array.isArray(s.timers) ? s.timers : undefined,
            }))
          : [];
        return {
          id: String(x.id),
          mealId: String(x.mealId || x.id),
          steps,
          prepTime: Number(x.prepTime) || 0,
          cookTime: Number(x.cookTime) || 0,
          difficulty: (x.difficulty as any) || "Medium",
          servings: Number(x.servings) || 2,
          tips: Array.isArray(x.tips) ? x.tips : undefined,
          image,
          videoUrl: typeof x.videoUrl === "string" ? x.videoUrl : undefined,
          equipment: Array.isArray(x.equipment) ? x.equipment : undefined,
          title_vi: typeof x.title_vi === "string" ? x.title_vi : undefined,
          title_en: typeof x.title_en === "string" ? x.title_en : undefined,
          name: typeof x.name === "string" ? x.name : undefined,
          description:
            typeof x.description === "string" ? x.description : undefined,
          category: x.category,
          tags: Array.isArray(x.tags) ? x.tags : undefined,
          allergens: Array.isArray(x.allergens) ? x.allergens : undefined,
          ingredients: Array.isArray(x.ingredients) ? x.ingredients : undefined,
          macrosPerServing: macros
            ? {
                kcal:
                  typeof macros.kcal === "number"
                    ? macros.kcal
                    : typeof macros.calories === "number"
                      ? macros.calories
                      : 0,
                protein: Number(macros.protein) || 0,
                carbs: Number(macros.carbs) || 0,
                fat: Number(macros.fat) || 0,
              }
            : undefined,
          costPerServing:
            typeof x.costPerServing === "number" ? x.costPerServing : undefined,
        } as Recipe;
      })
      .filter((r: Recipe) => r.id && r.steps && r.steps.length > 0);
    const merged = [...existing, ...mapped.filter((m) => !have.has(m.id))];
    localStorage.setItem(RECIPES_KEY, JSON.stringify(merged));
    localStorage.setItem(REMOTE_SYNC_FLAG, "1");
  } catch {}
}

export type ExtraGroceryItem = {
  name: string;
  unit: string;
  qty: number;
  cost?: number;
};

export function loadExtraGroceries(): ExtraGroceryItem[] {
  const v = localStorage.getItem(EXTRA_GROCERY_KEY);
  return v ? (JSON.parse(v) as ExtraGroceryItem[]) : [];
}

export function saveExtraGroceries(items: ExtraGroceryItem[]) {
  localStorage.setItem(EXTRA_GROCERY_KEY, JSON.stringify(items));
}
