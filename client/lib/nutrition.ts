export const PROTEIN_PER_100G: Record<string, number> = {
  "thịt bò": 26,
  "bò bắp": 26,
  "thịt heo": 25,
  "sườn heo": 25,
  "thịt heo xay": 24,
  "thịt ba chỉ": 20,
  "đùi gà": 27,
  "ức gà": 31,
  "trứng": 13,
  "tôm": 24,
  "cá": 22,
  "cá hồi": 25,
  "đậu hũ": 8,
  "đậu phụ": 8,
  "đậu nành": 36,
};

export function getProteinPer100g(name: string): number | null {
  const n = name.toLowerCase();
  // Exact match first
  if (PROTEIN_PER_100G[n] != null) return PROTEIN_PER_100G[n];
  // Fuzzy contains for common labels
  for (const k of Object.keys(PROTEIN_PER_100G)) {
    if (n.includes(k)) return PROTEIN_PER_100G[k];
  }
  return null;
}
