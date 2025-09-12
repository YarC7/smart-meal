import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loadRecipes, syncRemoteRecipesOnce } from "@/lib/recipesStore";
import RecipeCard from "@/components/recipes/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecipeCategory } from "@shared/recipe";
import { loadFavorites } from "@/lib/favorites";

const ALL_TAGS: string[] = [
  "low_cost",
  "high_protein",
  "vegan",
  "vietnamese",
  "western",
];
const CATEGORIES: ("All" | RecipeCategory)[] = [
  "All",
  "Breakfast",
  "Lunch/Dinner",
  "Snack/Dessert",
];
const ORIGINS: ("All" | "vietnamese" | "western" | "other")[] = [
  "All",
  "vietnamese",
  "western",
  "other",
];

export default function Recipes() {
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [category, setCategory] = useState<"All" | RecipeCategory>("All");
  const [origin, setOrigin] = useState<(typeof ORIGINS)[number]>("All");
  const [version, setVersion] = useState(0);
  const recipes = loadRecipes();
  const [favOnly, setFavOnly] = useState(false);
  const [favIds, setFavIds] = useState<Set<string>>(() => loadFavorites());
  useEffect(() => {
    const on = () => setFavIds(loadFavorites());
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, []);

  useEffect(() => {
    setQ(sp.get("q") || "");
  }, [sp]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await syncRemoteRecipesOnce();
      if (mounted) setVersion((v) => v + 1); // trigger re-render to show merged data
      setTimeout(() => setLoading(false), 300);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return recipes.filter((r) => {
      if (favOnly && !favIds.has(r.id)) return false;
      if (category !== "All" && r.category !== category) return false;
      if (origin !== "All") {
        const tags = (r.tags || []).map((t) => t.toLowerCase());
        if (origin === "other") {
          if (tags.includes("vietnamese") || tags.includes("western")) return false;
        } else {
          if (!tags.includes(origin)) return false;
        }
      }
      if (selectedTags.length) {
        const tags = r.tags || [];
        const ok = selectedTags.every((t) => tags.includes(t));
        if (!ok) return false;
      }
      if (!s) return true;
      const title = (r.title_vi || r.title_en || r.name || "").toLowerCase();
      const tagsStr = (r.tags || []).join(" ").toLowerCase();
      const ings = (r.ingredients || [])
        .map((i) => i.name)
        .join(" ")
        .toLowerCase();
      return title.includes(s) || tagsStr.includes(s) || ings.includes(s);
    });
  }, [recipes, q, selectedTags, category, origin, favOnly, favIds, version]);

  return (
    <div className="container mx-auto py-8 sm:py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-extrabold tracking-tight">Recipes</h1>
        <input
          value={q}
          onChange={(e) => {
            const v = e.target.value;
            setQ(v);
            const next = new URLSearchParams(sp);
            if (v) next.set("q", v);
            else next.delete("q");
            setSp(next, { replace: true });
          }}
          placeholder="Search by name, ingredient, or tag"
          className="w-full sm:w-72 rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <label className="flex items-center gap-2 text-xs border rounded-md px-2 py-1 cursor-pointer">
          <input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} />
          Favorites only
        </label>
        <div className="inline-flex gap-1 rounded-md border p-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-2 py-1 rounded text-xs ${
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="inline-flex gap-1 rounded-md border p-1">
          {ORIGINS.map((o) => (
            <button
              key={o}
              onClick={() => setOrigin(o)}
              className={`px-2 py-1 rounded text-xs ${
                origin === o
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
        <div className="inline-flex gap-1 flex-wrap">
          {ALL_TAGS.map((t) => {
            const active = selectedTags.includes(t);
            return (
              <button
                key={t}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(t)
                      ? prev.filter((x) => x !== t)
                      : [...prev, t],
                  )
                }
                className={`px-2 py-1 rounded border text-xs ${
                  active
                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                    : "hover:bg-secondary"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
