export interface RecipeStep {
  order: number;
  text: string;
  time?: number; // seconds
  media?: string; // optional media per step
  type?: "prep" | "cook" | "rest";
  heat?: "low" | "med" | "high";
  timers?: number[]; // extra timers in seconds
}

export type RecipeCategory = "Breakfast" | "Lunch/Dinner" | "Snack/Dessert";
// Tags are free-form labels (e.g., "low_cost", "high_protein", "vegan", "vietnamese", "western", "salad", ...)
export type RecipeTag = string;

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
  equipment?: string[];
  // i18n-friendly naming
  title_vi?: string;
  title_en?: string;
  name?: string; // generic name if needed
  description?: string;
  // discovery
  category?: RecipeCategory;
  tags?: RecipeTag[];
  allergens?: ("peanut"|"soy"|"egg"|"gluten"|"milk"|"shellfish")[];
  // ingredients and nutrition
  ingredients?: RecipeIngredient[];
  macrosPerServing?: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  micros?: { sodium?: number; fiber?: number; calcium?: number; iron?: number };
  costPerServing?: number;
}
