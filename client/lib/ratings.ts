const KEY = "smartmeal.ratings.v1";
export type Ratings = Record<string, number>; // recipeId -> 1..5

export function loadRatings(): Ratings {
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Ratings) : {};
  } catch {
    return {};
  }
}

export function saveRatings(r: Ratings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
  } catch {}
}

export function setRating(id: string, stars: number) {
  const r = loadRatings();
  r[id] = Math.max(1, Math.min(5, Math.round(stars)));
  saveRatings(r);
  try {
    window.dispatchEvent(new StorageEvent("storage", { key: KEY } as any));
  } catch {}
}

export function getRating(id: string): number | undefined {
  return loadRatings()[id];
}
