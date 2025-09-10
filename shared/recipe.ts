export interface RecipeStep {
  order: number;
  text: string;
  time?: number; // seconds
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
  tags?: string[];
  ingredients?: {
    name: string;
    qty: number;
    unit: string;
    optional?: boolean;
  }[];
  title_vi?: string;
  title_en?: string;
}
