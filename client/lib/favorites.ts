const KEY = "smartmeal.favorites.v1";

export function loadFavorites(): Set<string> {
  try {
    const v = localStorage.getItem(KEY);
    return new Set(v ? (JSON.parse(v) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function saveFavorites(ids: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.from(ids)));
  } catch {}
}

export function isFavorite(id: string): boolean {
  return loadFavorites().has(id);
}

export function toggleFavorite(id: string): boolean {
  const s = loadFavorites();
  if (s.has(id)) s.delete(id);
  else s.add(id);
  saveFavorites(s);
  try {
    window.dispatchEvent(new StorageEvent("storage", { key: KEY } as any));
  } catch {}
  return s.has(id);
}
