import { Recipe } from "@shared/recipe";
import { RECIPES } from "@/data/recipes";

const RECIPES_KEY = "recipes.v1";
const EXTRA_GROCERY_KEY = "smartmeal.grocery.extra.v1";

export function loadRecipes(): Recipe[] {
  const v = localStorage.getItem(RECIPES_KEY);
  if (v) return JSON.parse(v) as Recipe[];
  localStorage.setItem(RECIPES_KEY, JSON.stringify(RECIPES));
  return RECIPES;
}

export function getRecipe(id: string): Recipe | undefined {
  return loadRecipes().find((r) => r.id === id);
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
