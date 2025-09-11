export interface RecipeStep {
  order: number;
  text: string;
  time?: number; // seconds
  media?: string; // optional media per step
}

export type RecipeCategory = "Breakfast" | "Lunch/Dinner" | "Snack/Dessert";
export type RecipeTag =
  | "low_cost"
  | "high_protein"
  | "vegan"
  | "vietnamese"
  | "western";

export interface RecipeIngredient {
  name: string;
  qty: number;
  unit: string;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  mealId: string; // links to existing Meal
  steps: RecipeStep[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  difficulty: "Easy" | "Medium" | "Hard";
  servings: number;
  tips?: string[];
  image?: string;
  videoUrl?: string;
  // i18n-friendly naming
  title_vi?: string;
  title_en?: string;
  name?: string; // generic name if needed
  description?: string;
  // discovery
  category?: RecipeCategory;
  tags?: RecipeTag[];
  // ingredients and nutrition
  ingredients?: RecipeIngredient[];
  macrosPerServing?: { kcal: number; protein: number; carbs: number; fat: number };
  costPerServing?: number;
}
