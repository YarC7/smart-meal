import { useMemo, useState } from "react";
import { loadRecipes } from "@/lib/recipesStore";
import RecipeCard from "@/components/recipes/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Recipes() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const recipes = loadRecipes();

  useState(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return recipes;
    return recipes.filter(
      (r) =>
        (r.title_vi || r.title_en || "").toLowerCase().includes(s) ||
        (r.tags || []).some((t) => t.toLowerCase().includes(s)),
    );
  }, [recipes, q]);

  return (
    <div className="container mx-auto py-8 sm:py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-extrabold tracking-tight">Recipes</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or tag"
          className="w-full sm:w-72 rounded-md border px-3 py-2 text-sm"
        />
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
