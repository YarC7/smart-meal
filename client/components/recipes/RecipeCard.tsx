import React from "react";
import { Recipe } from "@shared/recipe";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { track } from "@/lib/analytics";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const title = recipe.title_vi || recipe.title_en || "Recipe";
  const [fav, setFav] = useState<boolean>(() => isFavorite(recipe.id));
  useEffect(() => {
    const on = () => setFav(isFavorite(recipe.id));
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, [recipe.id]);
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={title}
          className="w-full h-36 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-sm truncate" title={title}>
            {title}
          </h3>
          <button
            aria-pressed={fav}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className={`rounded-full border px-2 py-1 text-xs ${fav ? "bg-amber-100 text-amber-800" : "hover:bg-secondary"}`}
            onClick={() => {
              const next = toggleFavorite(recipe.id);
              setFav(next);
              track("favorite_toggle", { recipeId: recipe.id, value: next });
            }}
          >
            {fav ? "★" : "☆"}
          </button>
        </div>
        <div className="text-xs text-foreground/60 flex items-center gap-3">
          <span>{recipe.difficulty}</span>
          <span>⏱ {recipe.prepTime + recipe.cookTime} min</span>
          <span>👥 {recipe.servings}</span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/recipes/${recipe.id}`}
            className="rounded-md border px-3 py-1 text-xs hover:bg-secondary"
          >
            View
          </Link>
          <Link
            to={`/cook/${recipe.id}`}
            className="rounded-md border px-3 py-1 text-xs hover:bg-secondary"
          >
            Cook
          </Link>
        </div>
      </div>
    </div>
  );
}
