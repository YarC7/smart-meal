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

export const MEALS: Meal[] = [
  { id: "banh-mi-op-la", name: "Bánh mì ốp la", calories: 420, protein: 20, carbs: 45, fat: 16, tags: ["breakfast"], ingredients: [
    { name: "Bánh mì", unit: "piece", qty: 1, costPerUnit: 0.5 },
    { name: "Trứng gà", unit: "piece", qty: 2, costPerUnit: 0.25 },
    { name: "Dưa leo", unit: "g", qty: 50, costPerUnit: 0.02 },
    { name: "Dầu ăn", unit: "tbsp", qty: 0.5, costPerUnit: 0.1 },
  ]},
  { id: "pho-bo", name: "Phở bò", calories: 550, protein: 30, carbs: 60, fat: 18, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bánh phở", unit: "g", qty: 120, costPerUnit: 0.015 },
    { name: "Thịt bò", unit: "g", qty: 120, costPerUnit: 0.02 },
    { name: "Hành lá", unit: "g", qty: 20, costPerUnit: 0.02 },
    { name: "Nước dùng", unit: "ml", qty: 400, costPerUnit: 0.003 },
  ]},
  { id: "com-ga-hai-nam", name: "Cơm gà Hải Nam", calories: 620, protein: 32, carbs: 80, fat: 18, tags: ["lunch", "dinner"], ingredients: [
    { name: "Gạo", unit: "g", qty: 90, costPerUnit: 0.01 },
    { name: "Gà luộc", unit: "g", qty: 150, costPerUnit: 0.015 },
    { name: "Dưa leo", unit: "g", qty: 50, costPerUnit: 0.02 },
    { name: "Nước mắm", unit: "tbsp", qty: 1, costPerUnit: 0.05 },
  ]},
  { id: "ca-kho-to", name: "Cá kho tộ", calories: 480, protein: 35, carbs: 12, fat: 28, tags: ["lunch", "dinner", "low_carb", "high_protein"], ingredients: [
    { name: "Cá basa", unit: "g", qty: 160, costPerUnit: 0.012 },
    { name: "Nước mắm", unit: "tbsp", qty: 1, costPerUnit: 0.05 },
    { name: "Đường", unit: "tbsp", qty: 0.5, costPerUnit: 0.03 },
    { name: "Tiêu", unit: "tsp", qty: 0.25, costPerUnit: 0.02 },
  ]},
  { id: "canh-rau-muong", name: "Canh rau muống", calories: 120, protein: 6, carbs: 10, fat: 6, tags: ["lunch", "dinner", "vegetarian"], ingredients: [
    { name: "Rau muống", unit: "g", qty: 150, costPerUnit: 0.01 },
    { name: "Hành tím", unit: "g", qty: 10, costPerUnit: 0.02 },
    { name: "Dầu ăn", unit: "tbsp", qty: 0.5, costPerUnit: 0.1 },
    { name: "Muối", unit: "tsp", qty: 0.25, costPerUnit: 0.01 },
  ]},
  { id: "bun-cha", name: "Bún chả", calories: 620, protein: 28, carbs: 75, fat: 22, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bún", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Thịt heo", unit: "g", qty: 140, costPerUnit: 0.015 },
    { name: "Rau sống", unit: "g", qty: 80, costPerUnit: 0.02 },
    { name: "Nước mắm", unit: "tbsp", qty: 1, costPerUnit: 0.05 },
  ]},
  { id: "chao-thit-bam", name: "Cháo thịt bằm", calories: 380, protein: 18, carbs: 55, fat: 9, tags: ["breakfast", "lunch"], ingredients: [
    { name: "Gạo", unit: "g", qty: 70, costPerUnit: 0.01 },
    { name: "Thịt heo bằm", unit: "g", qty: 80, costPerUnit: 0.015 },
    { name: "Hành lá", unit: "g", qty: 10, costPerUnit: 0.02 },
    { name: "Nước mắm", unit: "tsp", qty: 0.5, costPerUnit: 0.05 },
  ]},
  { id: "xoi-ga", name: "Xôi gà", calories: 520, protein: 22, carbs: 75, fat: 14, tags: ["breakfast", "lunch"], ingredients: [
    { name: "Gạo nếp", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Thịt gà", unit: "g", qty: 100, costPerUnit: 0.015 },
    { name: "Hành phi", unit: "g", qty: 10, costPerUnit: 0.02 },
    { name: "Nước tương", unit: "tbsp", qty: 1, costPerUnit: 0.04 },
  ]},
  { id: "mien-ga", name: "Miến gà", calories: 430, protein: 25, carbs: 55, fat: 10, tags: ["lunch", "dinner"], ingredients: [
    { name: "Miến", unit: "g", qty: 80, costPerUnit: 0.015 },
    { name: "Thịt gà", unit: "g", qty: 120, costPerUnit: 0.015 },
    { name: "Rau răm", unit: "g", qty: 10, costPerUnit: 0.02 },
    { name: "Nước dùng", unit: "ml", qty: 350, costPerUnit: 0.003 },
  ]},
  { id: "com-tam-suon-trung", name: "Cơm tấm sườn trứng", calories: 750, protein: 35, carbs: 90, fat: 24, tags: ["lunch", "dinner"], ingredients: [
    { name: "Cơm tấm", unit: "g", qty: 120, costPerUnit: 0.01 },
    { name: "Sườn nướng", unit: "g", qty: 150, costPerUnit: 0.02 },
    { name: "Trứng gà", unit: "piece", qty: 1, costPerUnit: 0.25 },
    { name: "Dưa chua", unit: "g", qty: 50, costPerUnit: 0.02 },
  ]},
  { id: "banh-cuon", name: "Bánh cuốn", calories: 360, protein: 15, carbs: 60, fat: 8, tags: ["breakfast", "lunch"], ingredients: [
    { name: "Bánh cuốn", unit: "g", qty: 150, costPerUnit: 0.012 },
    { name: "Thịt bằm", unit: "g", qty: 60, costPerUnit: 0.015 },
    { name: "Mộc nhĩ", unit: "g", qty: 10, costPerUnit: 0.02 },
    { name: "Nước mắm", unit: "tbsp", qty: 1, costPerUnit: 0.05 },
  ]},
  { id: "bun-bo-hue", name: "Bún bò Huế", calories: 650, protein: 32, carbs: 70, fat: 22, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bún", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Thịt bò", unit: "g", qty: 140, costPerUnit: 0.02 },
    { name: "Sả", unit: "g", qty: 20, costPerUnit: 0.02 },
    { name: "Nước dùng", unit: "ml", qty: 400, costPerUnit: 0.003 },
  ]},
  { id: "goi-cuon", name: "Gỏi cuốn", calories: 360, protein: 18, carbs: 45, fat: 12, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bánh tráng", unit: "piece", qty: 4, costPerUnit: 0.05 },
    { name: "Tôm", unit: "g", qty: 80, costPerUnit: 0.02 },
    { name: "Thịt heo", unit: "g", qty: 60, costPerUnit: 0.02 },
    { name: "Rau sống", unit: "g", qty: 80, costPerUnit: 0.02 },
  ]},
  { id: "ca-ri-ga", name: "Cà ri gà", calories: 620, protein: 30, carbs: 55, fat: 28, tags: ["dinner"], ingredients: [
    { name: "Thịt gà", unit: "g", qty: 160, costPerUnit: 0.015 },
    { name: "Khoai tây", unit: "g", qty: 120, costPerUnit: 0.01 },
    { name: "Cà rốt", unit: "g", qty: 80, costPerUnit: 0.01 },
    { name: "Nước cốt dừa", unit: "ml", qty: 150, costPerUnit: 0.006 },
  ]},
  { id: "banh-xeo", name: "Bánh xèo", calories: 520, protein: 22, carbs: 60, fat: 20, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bột gạo", unit: "g", qty: 80, costPerUnit: 0.01 },
    { name: "Tôm", unit: "g", qty: 80, costPerUnit: 0.02 },
    { name: "Thịt heo", unit: "g", qty: 60, costPerUnit: 0.015 },
    { name: "Giá", unit: "g", qty: 80, costPerUnit: 0.01 },
  ]},
  { id: "chao-ga", name: "Cháo gà", calories: 400, protein: 24, carbs: 50, fat: 10, tags: ["breakfast", "lunch"], ingredients: [
    { name: "Gạo", unit: "g", qty: 70, costPerUnit: 0.01 },
    { name: "Thịt gà", unit: "g", qty: 100, costPerUnit: 0.015 },
    { name: "Hành lá", unit: "g", qty: 10, costPerUnit: 0.02 },
    { name: "Gừng", unit: "g", qty: 5, costPerUnit: 0.02 },
  ]},
  { id: "bo-kho-banh-mi", name: "Bò kho + bánh mì", calories: 700, protein: 40, carbs: 70, fat: 24, tags: ["lunch", "dinner"], ingredients: [
    { name: "Thịt bò", unit: "g", qty: 150, costPerUnit: 0.02 },
    { name: "Bánh mì", unit: "piece", qty: 1, costPerUnit: 0.5 },
    { name: "Cà rốt", unit: "g", qty: 80, costPerUnit: 0.01 },
    { name: "Khoai tây", unit: "g", qty: 100, costPerUnit: 0.01 },
  ]},
  { id: "bun-thit-nuong", name: "Bún thịt nướng", calories: 600, protein: 28, carbs: 75, fat: 20, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bún", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Thịt heo", unit: "g", qty: 140, costPerUnit: 0.015 },
    { name: "Rau sống", unit: "g", qty: 80, costPerUnit: 0.02 },
    { name: "Nước mắm", unit: "tbsp", qty: 1, costPerUnit: 0.05 },
  ]},
  { id: "banh-bao", name: "Bánh bao", calories: 320, protein: 12, carbs: 50, fat: 8, tags: ["breakfast", "snack"], ingredients: [
    { name: "Bánh bao", unit: "piece", qty: 1, costPerUnit: 0.6 },
  ]},
  { id: "cha-gio", name: "Chả giò", calories: 420, protein: 16, carbs: 40, fat: 22, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bánh tráng", unit: "piece", qty: 4, costPerUnit: 0.05 },
    { name: "Thịt heo", unit: "g", qty: 100, costPerUnit: 0.015 },
    { name: "Miến", unit: "g", qty: 30, costPerUnit: 0.015 },
    { name: "Cà rốt", unit: "g", qty: 40, costPerUnit: 0.01 },
  ]},
  { id: "ca-nuong", name: "Cá nướng", calories: 460, protein: 38, carbs: 6, fat: 28, tags: ["dinner", "low_carb", "high_protein"], ingredients: [
    { name: "Cá", unit: "g", qty: 180, costPerUnit: 0.012 },
    { name: "Dầu ăn", unit: "tbsp", qty: 0.5, costPerUnit: 0.1 },
    { name: "Muối", unit: "tsp", qty: 0.25, costPerUnit: 0.01 },
    { name: "Tiêu", unit: "tsp", qty: 0.25, costPerUnit: 0.02 },
  ]},
  { id: "rau-cai-xao-toi", name: "Rau cải xào tỏi", calories: 160, protein: 6, carbs: 12, fat: 10, tags: ["lunch", "dinner", "vegetarian"], ingredients: [
    { name: "Rau cải", unit: "g", qty: 150, costPerUnit: 0.01 },
    { name: "Tỏi", unit: "g", qty: 6, costPerUnit: 0.03 },
    { name: "Dầu ăn", unit: "tbsp", qty: 0.5, costPerUnit: 0.1 },
  ]},
  { id: "trung-chien-ca-chua", name: "Trứng chiên cà chua", calories: 360, protein: 18, carbs: 14, fat: 24, tags: ["lunch", "dinner", "vegetarian"], ingredients: [
    { name: "Trứng gà", unit: "piece", qty: 3, costPerUnit: 0.25 },
    { name: "Cà chua", unit: "g", qty: 120, costPerUnit: 0.01 },
    { name: "Hành lá", unit: "g", qty: 10, costPerUnit: 0.02 },
  ]},
  { id: "banh-mi-thit", name: "Bánh mì thịt", calories: 520, protein: 24, carbs: 60, fat: 20, tags: ["breakfast", "lunch"], ingredients: [
    { name: "Bánh mì", unit: "piece", qty: 1, costPerUnit: 0.5 },
    { name: "Thịt nguội", unit: "g", qty: 80, costPerUnit: 0.02 },
    { name: "Dưa leo", unit: "g", qty: 50, costPerUnit: 0.02 },
    { name: "Nước tương", unit: "tbsp", qty: 1, costPerUnit: 0.04 },
  ]},
  { id: "hu-tieu", name: "Hủ tiếu", calories: 580, protein: 28, carbs: 70, fat: 16, tags: ["lunch", "dinner"], ingredients: [
    { name: "Hủ tiếu", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Thịt heo", unit: "g", qty: 120, costPerUnit: 0.015 },
    { name: "Hẹ", unit: "g", qty: 10, costPerUnit: 0.02 },
    { name: "Nước dùng", unit: "ml", qty: 400, costPerUnit: 0.003 },
  ]},
  { id: "chao-dau-xanh", name: "Cháo đậu xanh", calories: 340, protein: 14, carbs: 58, fat: 6, tags: ["breakfast", "vegetarian"], ingredients: [
    { name: "Gạo", unit: "g", qty: 60, costPerUnit: 0.01 },
    { name: "Đậu xanh", unit: "g", qty: 50, costPerUnit: 0.012 },
    { name: "Đường", unit: "tbsp", qty: 0.5, costPerUnit: 0.03 },
  ]},
  { id: "bun-rieu", name: "Bún riêu", calories: 560, protein: 26, carbs: 68, fat: 18, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bún", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Riêu cua", unit: "g", qty: 100, costPerUnit: 0.02 },
    { name: "Cà chua", unit: "g", qty: 80, costPerUnit: 0.01 },
  ]},
  { id: "com-chien-duong-chau", name: "Cơm chiên Dương Châu", calories: 700, protein: 30, carbs: 90, fat: 24, tags: ["lunch", "dinner"], ingredients: [
    { name: "Gạo", unit: "g", qty: 120, costPerUnit: 0.01 },
    { name: "Trứng gà", unit: "piece", qty: 2, costPerUnit: 0.25 },
    { name: "Lạp xưởng", unit: "g", qty: 60, costPerUnit: 0.02 },
    { name: "Đậu Hà Lan", unit: "g", qty: 60, costPerUnit: 0.02 },
  ]},
  { id: "sup-bi-do", name: "Súp bí đỏ", calories: 300, protein: 10, carbs: 40, fat: 10, tags: ["lunch", "dinner", "vegetarian"], ingredients: [
    { name: "Bí đỏ", unit: "g", qty: 200, costPerUnit: 0.008 },
    { name: "Sữa tươi", unit: "ml", qty: 120, costPerUnit: 0.005 },
    { name: "Hành tây", unit: "g", qty: 40, costPerUnit: 0.01 },
  ]},
  { id: "ca-chem-hap", name: "Cá chẽm hấp", calories: 420, protein: 36, carbs: 4, fat: 26, tags: ["dinner", "low_carb", "high_protein"], ingredients: [
    { name: "Cá chẽm", unit: "g", qty: 180, costPerUnit: 0.015 },
    { name: "Gừng", unit: "g", qty: 6, costPerUnit: 0.03 },
    { name: "Hành lá", unit: "g", qty: 10, costPerUnit: 0.02 },
  ]},
  { id: "com-ca-kho-canh-chua", name: "Cơm + cá kho + canh chua", calories: 750, protein: 38, carbs: 90, fat: 22, tags: ["dinner"], ingredients: [
    { name: "Gạo", unit: "g", qty: 100, costPerUnit: 0.01 },
    { name: "Cá", unit: "g", qty: 140, costPerUnit: 0.012 },
    { name: "Cà chua", unit: "g", qty: 80, costPerUnit: 0.01 },
    { name: "Thơm", unit: "g", qty: 60, costPerUnit: 0.01 },
  ]},
  { id: "banh-da-cua", name: "Bánh đa cua", calories: 560, protein: 26, carbs: 70, fat: 18, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bánh đa", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Thịt cua", unit: "g", qty: 100, costPerUnit: 0.02 },
    { name: "Rau muống", unit: "g", qty: 60, costPerUnit: 0.01 },
  ]},
  { id: "banh-tet-trung-thit", name: "Bánh tét trứng thịt", calories: 520, protein: 18, carbs: 65, fat: 18, tags: ["breakfast", "snack"], ingredients: [
    { name: "Bánh tét", unit: "slice", qty: 2, costPerUnit: 0.5 },
  ]},
  { id: "xoi-man", name: "Xôi mặn", calories: 580, protein: 24, carbs: 80, fat: 16, tags: ["breakfast", "lunch"], ingredients: [
    { name: "Gạo nếp", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Lạp xưởng", unit: "g", qty: 60, costPerUnit: 0.02 },
    { name: "Trứng cút", unit: "piece", qty: 3, costPerUnit: 0.12 },
  ]},
  { id: "banh-uot", name: "Bánh ướt", calories: 320, protein: 10, carbs: 55, fat: 7, tags: ["breakfast", "lunch"], ingredients: [
    { name: "Bánh ướt", unit: "g", qty: 150, costPerUnit: 0.012 },
    { name: "Chả lụa", unit: "g", qty: 60, costPerUnit: 0.02 },
    { name: "Mắm nêm", unit: "tbsp", qty: 1, costPerUnit: 0.05 },
  ]},
  { id: "banh-canh", name: "Bánh canh", calories: 560, protein: 24, carbs: 70, fat: 18, tags: ["lunch", "dinner"], ingredients: [
    { name: "Bánh canh", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Tôm", unit: "g", qty: 100, costPerUnit: 0.02 },
    { name: "Thịt heo", unit: "g", qty: 80, costPerUnit: 0.015 },
  ]},
  { id: "mi-xao-bo", name: "Mì xào bò", calories: 650, protein: 32, carbs: 70, fat: 22, tags: ["lunch", "dinner"], ingredients: [
    { name: "Mì", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Thịt bò", unit: "g", qty: 140, costPerUnit: 0.02 },
    { name: "Rau cải", unit: "g", qty: 80, costPerUnit: 0.01 },
  ]},
  { id: "trung-duc-thit", name: "Trứng đúc thịt", calories: 480, protein: 30, carbs: 10, fat: 34, tags: ["lunch", "dinner", "high_protein", "low_carb"], ingredients: [
    { name: "Trứng gà", unit: "piece", qty: 3, costPerUnit: 0.25 },
    { name: "Thịt heo bằm", unit: "g", qty: 120, costPerUnit: 0.015 },
    { name: "Hành tây", unit: "g", qty: 40, costPerUnit: 0.01 },
  ]},
  { id: "dua-xao-bo", name: "Dưa xào bò", calories: 520, protein: 32, carbs: 18, fat: 30, tags: ["lunch", "dinner"], ingredients: [
    { name: "Thịt bò", unit: "g", qty: 140, costPerUnit: 0.02 },
    { name: "Dưa cải", unit: "g", qty: 120, costPerUnit: 0.01 },
    { name: "Dầu ăn", unit: "tbsp", qty: 0.5, costPerUnit: 0.1 },
  ]},
  { id: "mi-quang", name: "Mì Quảng", calories: 620, protein: 28, carbs: 70, fat: 20, tags: ["lunch", "dinner"], ingredients: [
    { name: "Mì Quảng", unit: "g", qty: 120, costPerUnit: 0.012 },
    { name: "Thịt heo", unit: "g", qty: 120, costPerUnit: 0.015 },
    { name: "Tôm", unit: "g", qty: 60, costPerUnit: 0.02 },
  ]},
];
