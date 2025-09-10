import { Recipe } from "@shared/recipe";

export const RECIPES: Recipe[] = [
  {
    id: "r_vn_goi_ga",
    mealId: "vn_goi_ga",
    title_vi: "Gỏi gà xé phay",
    title_en: "Vietnamese Chicken Salad",
    steps: [
      { order: 1, text: "Luộc gà đến chín, để nguội rồi xé sợi.", time: 900 },
      { order: 2, text: "Bắp cải thái mỏng, ngâm đá cho giòn.", time: 300 },
      {
        order: 3,
        text: "Trộn gà, bắp cải, hành tây, rau răm với nước mắm chua ngọt.",
        time: 120,
      },
      { order: 4, text: "Rắc đậu phộng rang và thưởng thức." },
    ],
    prepTime: 15,
    cookTime: 20,
    difficulty: "Easy",
    servings: 2,
    tips: ["Luộc gà lửa nhỏ để thịt không khô.", "Thêm chanh cho vị tươi."],
    image: "/placeholder.svg",
    tags: ["vietnamese", "salad", "low_cost"],
    ingredients: [
      { name: "Thịt g��", qty: 200, unit: "g" },
      { name: "Bắp cải", qty: 200, unit: "g" },
      { name: "Rau răm", qty: 10, unit: "g", optional: true },
      { name: "Đậu phộng rang", qty: 20, unit: "g", optional: true },
    ],
  },
  {
    id: "r_ws_spaghetti_bolognese",
    mealId: "ws_spaghetti_bolognese",
    title_vi: "Mì Ý sốt bò bằm",
    title_en: "Spaghetti Bolognese",
    steps: [
      { order: 1, text: "Luộc mì al dente theo gợi ý trên bao bì.", time: 600 },
      {
        order: 2,
        text: "Xào thơm hành tỏi, cho thịt bò bằm đảo săn.",
        time: 300,
      },
      { order: 3, text: "Thêm cà chua, nêm nếm; đun liu riu.", time: 600 },
      { order: 4, text: "Trộn sốt với mì, rắc phô mai (tuỳ chọn)." },
    ],
    prepTime: 10,
    cookTime: 25,
    difficulty: "Medium",
    servings: 2,
    tips: ["Giữ lại nước luộc mì để làm loãng sốt."],
    image: "/placeholder.svg",
    tags: ["western", "pasta"],
    ingredients: [
      { name: "Spaghetti", qty: 240, unit: "g" },
      { name: "Thịt bò bằm", qty: 200, unit: "g" },
      { name: "Cà chua", qty: 160, unit: "g" },
    ],
  },
  {
    id: "r_vn_mi_quang",
    mealId: "vn_mi_quang",
    title_vi: "Mì Quảng đơn giản",
    title_en: "Simple Mi Quang",
    steps: [
      { order: 1, text: "Luộc mì Quảng, để ráo.", time: 360 },
      { order: 2, text: "Xào thịt gà với chút nghệ, nêm nếm.", time: 300 },
      { order: 3, text: "Chan nước dùng nhẹ, thêm rau sống, đậu phộng." },
    ],
    prepTime: 10,
    cookTime: 20,
    difficulty: "Easy",
    servings: 2,
    image: "/placeholder.svg",
    tags: ["vietnamese", "noodle"],
    ingredients: [
      { name: "Mì Quảng", qty: 240, unit: "g" },
      { name: "Thịt gà", qty: 140, unit: "g" },
    ],
  },
  {
    id: "r_ws_chicken_salad",
    mealId: "ws_chicken_salad",
    title_vi: "Salad ức gà",
    title_en: "Chicken Salad",
    steps: [
      { order: 1, text: "Áp chảo ức gà đến 72°C, nghỉ 5 phút.", time: 480 },
      { order: 2, text: "Trộn xà lách, cà chua với sốt dầu giấm.", time: 180 },
      { order: 3, text: "Thái lát gà, bày lên salad." },
    ],
    prepTime: 10,
    cookTime: 12,
    difficulty: "Easy",
    servings: 2,
    image: "/placeholder.svg",
    tags: ["western", "salad", "high_protein"],
    ingredients: [
      { name: "Ức gà", qty: 200, unit: "g" },
      { name: "Rau xà lách", qty: 160, unit: "g" },
      { name: "Cà chua", qty: 100, unit: "g" },
    ],
  },
];

const STORAGE_KEY = "recipes.v1";

export function loadRecipes(): Recipe[] {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v) return JSON.parse(v) as Recipe[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(RECIPES));
  return RECIPES;
}

export function getRecipeById(id: string): Recipe | undefined {
  return loadRecipes().find((r) => r.id === id);
}

export function getRecipeByMealId(mealId: string): Recipe | undefined {
  return loadRecipes().find((r) => r.mealId === mealId);
}
