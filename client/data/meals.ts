export type Ingredient = {
  name: string;
  unit: string; // g, ml, piece, cup, tbsp
  qty: number; // quantity per recipe
  costPerUnit?: number; // estimated cost per unit in local currency
};

export type Meal = {
  id: string;
  name: string;
  calories: number; // kcal per serving
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  tags: string[]; // breakfast | lunch | dinner | vegetarian | vegan | low_carb | high_protein
  ingredients: Ingredient[];
};

// Lightweight curated library for MVP planning
export const MEALS: Meal[] = [
  {
    id: "oat-berry",
    name: "Overnight Oats with Berries",
    calories: 420,
    protein: 22,
    carbs: 55,
    fat: 14,
    tags: ["breakfast", "vegetarian"],
    ingredients: [
      { name: "Rolled oats", unit: "g", qty: 60, costPerUnit: 0.02 },
      { name: "Greek yogurt", unit: "g", qty: 150, costPerUnit: 0.01 },
      { name: "Mixed berries", unit: "g", qty: 100, costPerUnit: 0.03 },
      { name: "Chia seeds", unit: "g", qty: 10, costPerUnit: 0.04 },
      { name: "Honey", unit: "tbsp", qty: 1, costPerUnit: 0.2 },
    ],
  },
  {
    id: "egg-avocado-toast",
    name: "Egg & Avocado Toast",
    calories: 380,
    protein: 19,
    carbs: 33,
    fat: 18,
    tags: ["breakfast"],
    ingredients: [
      { name: "Whole‑grain bread", unit: "slice", qty: 2, costPerUnit: 0.25 },
      { name: "Egg", unit: "piece", qty: 2, costPerUnit: 0.3 },
      { name: "Avocado", unit: "piece", qty: 0.5, costPerUnit: 1.2 },
      { name: "Olive oil", unit: "tbsp", qty: 0.5, costPerUnit: 0.15 },
    ],
  },
  {
    id: "chicken-quinoa",
    name: "Grilled Chicken & Quinoa Bowl",
    calories: 560,
    protein: 45,
    carbs: 55,
    fat: 16,
    tags: ["lunch", "dinner", "high_protein"],
    ingredients: [
      { name: "Chicken breast", unit: "g", qty: 180, costPerUnit: 0.01 },
      { name: "Quinoa", unit: "g", qty: 80, costPerUnit: 0.02 },
      { name: "Spinach", unit: "g", qty: 80, costPerUnit: 0.02 },
      { name: "Cherry tomatoes", unit: "g", qty: 80, costPerUnit: 0.03 },
      { name: "Olive oil", unit: "tbsp", qty: 1, costPerUnit: 0.15 },
    ],
  },
  {
    id: "tofu-stirfry",
    name: "Tofu Veggie Stir‑fry",
    calories: 520,
    protein: 28,
    carbs: 48,
    fat: 24,
    tags: ["lunch", "dinner", "vegan"],
    ingredients: [
      { name: "Firm tofu", unit: "g", qty: 180, costPerUnit: 0.01 },
      { name: "Brown rice", unit: "g", qty: 80, costPerUnit: 0.02 },
      { name: "Broccoli", unit: "g", qty: 120, costPerUnit: 0.02 },
      { name: "Bell pepper", unit: "g", qty: 80, costPerUnit: 0.02 },
      { name: "Soy sauce", unit: "tbsp", qty: 1, costPerUnit: 0.1 },
    ],
  },
  {
    id: "salmon-salad",
    name: "Baked Salmon Salad",
    calories: 520,
    protein: 34,
    carbs: 24,
    fat: 30,
    tags: ["lunch", "dinner", "low_carb", "high_protein"],
    ingredients: [
      { name: "Salmon fillet", unit: "g", qty: 160, costPerUnit: 0.02 },
      { name: "Mixed greens", unit: "g", qty: 120, costPerUnit: 0.02 },
      { name: "Cucumber", unit: "g", qty: 80, costPerUnit: 0.02 },
      { name: "Avocado", unit: "piece", qty: 0.5, costPerUnit: 1.2 },
      { name: "Olive oil", unit: "tbsp", qty: 1, costPerUnit: 0.15 },
    ],
  },
  {
    id: "lentil-soup",
    name: "Hearty Lentil Soup",
    calories: 450,
    protein: 24,
    carbs: 60,
    fat: 10,
    tags: ["lunch", "dinner", "vegan"],
    ingredients: [
      { name: "Lentils", unit: "g", qty: 90, costPerUnit: 0.02 },
      { name: "Carrot", unit: "g", qty: 60, costPerUnit: 0.02 },
      { name: "Celery", unit: "g", qty: 50, costPerUnit: 0.02 },
      { name: "Onion", unit: "g", qty: 50, costPerUnit: 0.02 },
      { name: "Vegetable broth", unit: "ml", qty: 400, costPerUnit: 0.003 },
    ],
  },
  {
    id: "yogurt-parfait",
    name: "Greek Yogurt Parfait",
    calories: 320,
    protein: 23,
    carbs: 35,
    fat: 9,
    tags: ["breakfast", "vegetarian", "high_protein"],
    ingredients: [
      { name: "Greek yogurt", unit: "g", qty: 200, costPerUnit: 0.01 },
      { name: "Granola", unit: "g", qty: 40, costPerUnit: 0.03 },
      { name: "Blueberries", unit: "g", qty: 80, costPerUnit: 0.03 },
    ],
  },
  {
    id: "beef-bowl",
    name: "Beef & Veggie Rice Bowl",
    calories: 650,
    protein: 40,
    carbs: 65,
    fat: 22,
    tags: ["lunch", "dinner"],
    ingredients: [
      { name: "Lean beef", unit: "g", qty: 150, costPerUnit: 0.02 },
      { name: "White rice", unit: "g", qty: 90, costPerUnit: 0.015 },
      { name: "Green beans", unit: "g", qty: 100, costPerUnit: 0.02 },
      { name: "Soy sauce", unit: "tbsp", qty: 1, costPerUnit: 0.1 },
    ],
  },
  {
    id: "chickpea-bowl",
    name: "Mediterranean Chickpea Bowl",
    calories: 520,
    protein: 20,
    carbs: 65,
    fat: 18,
    tags: ["lunch", "dinner", "vegan"],
    ingredients: [
      { name: "Chickpeas", unit: "g", qty: 120, costPerUnit: 0.02 },
      { name: "Couscous", unit: "g", qty: 80, costPerUnit: 0.02 },
      { name: "Tomato", unit: "g", qty: 80, costPerUnit: 0.02 },
      { name: "Cucumber", unit: "g", qty: 80, costPerUnit: 0.02 },
      { name: "Olive oil", unit: "tbsp", qty: 1, costPerUnit: 0.15 },
    ],
  },
  {
    id: "shrimp-pasta",
    name: "Garlic Shrimp Pasta",
    calories: 580,
    protein: 32,
    carbs: 70,
    fat: 16,
    tags: ["dinner"],
    ingredients: [
      { name: "Shrimp", unit: "g", qty: 140, costPerUnit: 0.02 },
      { name: "Whole‑grain pasta", unit: "g", qty: 90, costPerUnit: 0.02 },
      { name: "Spinach", unit: "g", qty: 60, costPerUnit: 0.02 },
      { name: "Olive oil", unit: "tbsp", qty: 1, costPerUnit: 0.15 },
      { name: "Garlic", unit: "clove", qty: 2, costPerUnit: 0.05 },
    ],
  },
];
