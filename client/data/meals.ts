export type Ingredient = {
  name: string;
  unit: string; // g, ml, piece, cup, tbsp, slice
  qty: number; // per recipe serving
  costPerUnit?: number;
};

export type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[]; // breakfast | lunch | dinner | snack | vegetarian | vegan | low_carb | high_protein
  ingredients: Ingredient[];
};

// Import mixed dataset and normalize to Meal[]
import rawMeals from "./mixed_meals_55_categorized.json";

type RawMeal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags?: string[];
  ingredients: Ingredient[];
  category?: string; // "Breakfast" | "Lunch/Dinner" | etc
};

function normalizeTags(tags: string[] | undefined, category?: string) {
  const set = new Set<string>(tags || []);
  if (category) {
    const c = category.toLowerCase();
    if (c.includes("breakfast")) set.add("breakfast");
    if (c.includes("lunch") || c.includes("dinner")) {
      set.add("lunch");
      set.add("dinner");
    }
  }
  // Derive convenience tags
  return Array.from(set);
}

export const MEALS: Meal[] = (rawMeals as RawMeal[]).map((m) => ({
  id: m.id,
  name: m.name,
  calories: m.calories,
  protein: m.protein,
  carbs: m.carbs,
  fat: m.fat,
  tags: normalizeTags(m.tags, m.category),
  ingredients: m.ingredients,
}));
