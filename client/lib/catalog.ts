const CATEGORIES_URL =
  "https://cdn.builder.io/o/assets%2Fdc872da47f1c45cbb319472163d66df4%2F8cb5b86e3c7347eb8036f7ad6e42af53?alt=media&token=d9581519-9b16-4e59-a9d7-baa3b5d4c8db&apiKey=dc872da47f1c45cbb319472163d66df4";
const SUBS_URL =
  "https://cdn.builder.io/o/assets%2Fdc872da47f1c45cbb319472163d66df4%2F9b1bbabb5ea047c796fa87f2b15cbb0a?alt=media&token=10839162-22d1-4faf-9355-e810ea25c4ac&apiKey=dc872da47f1c45cbb319472163d66df4";
const PANTRY_URL =
  "https://cdn.builder.io/o/assets%2Fdc872da47f1c45cbb319472163d66df4%2Fdd9dc6b7ddb94008ad44afdd9334b50d?alt=media&token=0465ca55-9ae6-43ba-9e9e-2a44060504ee&apiKey=dc872da47f1c45cbb319472163d66df4";

const KEY_CATS = "smartmeal.categories.v1";
const KEY_SUBS = "smartmeal.substitutions.remote.v1";
const KEY_PANTRY = "smartmeal.pantry.staples.v1";

export type CategoriesMap = Record<string, string>; // ingredient name(lowercased) -> category
export type SubsMap = Record<string, string[]>;
export type PantryStaples = string[];

async function fetchJSON<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`Failed to fetch ${url}`);
  return (await r.json()) as T;
}

export async function loadCategories(): Promise<CategoriesMap> {
  const v = localStorage.getItem(KEY_CATS);
  if (v) return JSON.parse(v) as CategoriesMap;
  try {
    const data = await fetchJSON<CategoriesMap>(CATEGORIES_URL);
    localStorage.setItem(KEY_CATS, JSON.stringify(data));
    return data;
  } catch {
    return {};
  }
}

export async function loadSubs(): Promise<SubsMap> {
  const v = localStorage.getItem(KEY_SUBS);
  if (v) return JSON.parse(v) as SubsMap;
  try {
    const data = await fetchJSON<SubsMap>(SUBS_URL);
    localStorage.setItem(KEY_SUBS, JSON.stringify(data));
    return data;
  } catch {
    return {};
  }
}

export async function loadPantryStaples(): Promise<PantryStaples> {
  const v = localStorage.getItem(KEY_PANTRY);
  if (v) return JSON.parse(v) as PantryStaples;
  try {
    const data = await fetchJSON<PantryStaples>(PANTRY_URL as any);
    localStorage.setItem(KEY_PANTRY, JSON.stringify(data));
    return data;
  } catch {
    return [];
  }
}

export function getCategoryFor(
  name: string,
  cats: CategoriesMap,
): string | null {
  const n = name.toLowerCase().trim();
  return cats[n] || null;
}

export function getSubsFor(name: string, subs: SubsMap): string[] | null {
  const n = name.toLowerCase();
  for (const key of Object.keys(subs)) {
    if (n.includes(key.toLowerCase())) return subs[key];
  }
  return null;
}

export const PANTRY_USER_KEY = "smartmeal.pantry.user.v1";
export type PantryState = Record<string, boolean>; // ingredient -> owned?
export function loadUserPantry(): PantryState {
  const v = localStorage.getItem(PANTRY_USER_KEY);
  return v ? (JSON.parse(v) as PantryState) : {};
}
export function saveUserPantry(p: PantryState) {
  localStorage.setItem(PANTRY_USER_KEY, JSON.stringify(p));
}
