import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getRecipe } from "@/lib/recipesStore";
import IngredientPill from "@/components/recipes/IngredientPill";
import Timer from "@/components/recipes/Timer";
import VoiceControl from "@/components/recipes/VoiceControl";
import { MEALS } from "@/data/meals";
import { toast } from "@/hooks/use-toast";
import { pushLogAction, loadLogs, saveLogs, DayLog } from "@/lib/planner";
import subs from "@/data/substitutions_updated.json" assert { type: "json" };
import { track } from "@/lib/analytics";
import { useEffect as ReactUseEffect, useState as ReactUseState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { getRating, setRating } from "@/lib/ratings";

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function findSubs(name: string): string[] | null {
  const n = name.toLowerCase();
  const data: any = subs as any;
  for (const key of Object.keys(data)) {
    if (n.includes(key.toLowerCase())) {
      const v = (data as any)[key];
      if (Array.isArray(v)) return v as string[];
      if (v && Array.isArray(v.alternatives)) return v.alternatives as string[];
    }
  }
  return null;
}

function FavButton({ id }: { id: string }) {
  const [fav, setFav] = ReactUseState<boolean>(() => isFavorite(id));
  ReactUseEffect(() => {
    const on = () => setFav(isFavorite(id));
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, [id]);
  return (
    <button
      aria-pressed={fav}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      className={`rounded-full border px-2 py-1 text-xs ${fav ? "bg-amber-100 text-amber-800" : "hover:bg-secondary"}`}
      onClick={() => {
        const next = toggleFavorite(id);
        setFav(next);
        track("favorite_toggle", { recipeId: id, value: next });
      }}
    >
      {fav ? "★" : "☆"}
    </button>
  );
}

function Rating({ id }: { id: string }) {
  const [rate, setRate] = ReactUseState<number>(getRating(id) || 0);
  const Star = ({ n }: { n: number }) => (
    <button
      aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
      className={`text-sm ${rate >= n ? "text-amber-500" : "text-foreground/40"}`}
      onClick={() => {
        setRating(id, n);
        setRate(n);
        track("rate_recipe", { recipeId: id, rating: n });
      }}
    >
      ���
    </button>
  );
  return (
    <div
      role="radiogroup"
      aria-label="Rate recipe"
      className="inline-flex gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} n={n} />
      ))}
    </div>
  );
}

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const [sp] = useSearchParams();
  const recipe = id ? getRecipe(id) : undefined;
  const meal = useMemo(
    () => MEALS.find((m) => m.id === recipe?.mealId),
    [recipe],
  );
  const [servings, setServings] = useState<number>(recipe?.servings || 2);
  const stepParam = Math.max(0, parseInt(sp.get("step") || "0", 10));

  useEffect(() => {
    if (recipe) {
      track("view_recipe", { recipeId: recipe.id });
      try {
        document.title = title;
        const setMeta = (p: string, c: string) => {
          let m = document.querySelector(`meta[property='${p}']`);
          if (!m) {
            m = document.createElement("meta");
            m.setAttribute("property", p);
            document.head.appendChild(m);
          }
          m.setAttribute("content", c);
        };
        setMeta("og:title", title);
        setMeta("og:type", "article");
        if (recipe.image) setMeta("og:image", recipe.image);
        setMeta(
          "og:description",
          `${recipe.prepTime + recipe.cookTime} min • ${recipe.difficulty}`,
        );
      } catch {}
    }
  }, [recipe, title]);

  if (!recipe)
    return (
      <div className="container mx-auto py-10">
        <p className="text-sm text-foreground/60">Recipe not found.</p>
      </div>
    );

  const title = recipe.title_vi || recipe.title_en || "Recipe";
  const scale = servings / Math.max(1, recipe.servings || 1);

  const quickAdd = () => {
    track("quick_add_from_recipe", { recipeId: recipe.id, servings });
    if (!meal) return;
    const logs = loadLogs();
    const today =
      logs[todayKey()] ||
      ({
        date: todayKey(),
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      } as DayLog);
    const updated: DayLog = {
      date: today.date,
      calories: today.calories + meal.calories,
      protein: today.protein + meal.protein,
      carbs: today.carbs + meal.carbs,
      fat: today.fat + meal.fat,
    };
    pushLogAction(today.date, {
      mealId: meal.id,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    });
    logs[today.date] = updated;
    saveLogs(logs);
    toast({ title: "Logged", description: "Meal added to today's progress." });
  };

  const substitutions = (recipe.ingredients || [])
    .map((i) => ({ name: i.name, suggestions: findSubs(i.name) }))
    .filter((x) => x.suggestions && x.suggestions.length) as {
    name: string;
    suggestions: string[];
  }[];

  return (
    <div className="container mx-auto py-8 sm:py-10">
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <section className="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
          {recipe.image && (
            <img
              src={recipe.image}
              alt={title}
              className="w-full h-56 object-cover"
            />
          )}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-xl font-semibold truncate" title={title}>
                {title}
              </h1>
              <div className="flex items-center gap-2 ml-auto">
                <FavButton id={recipe.id} />
                <Rating id={recipe.id} />
              </div>
              <div className="text-xs text-foreground/60 flex gap-3 w-full">
                {recipe.category && <span>{recipe.category}</span>}
                <span>{recipe.difficulty}</span>
                <span>⏱ {recipe.prepTime + recipe.cookTime} min</span>
                <span>👥 {servings}</span>
              </div>
            </div>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 text-[10px] text-foreground/70">
                {recipe.tags.map((t) => (
                  <span key={t} className="rounded-full border px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="text-sm">Servings</label>
              <input
                type="number"
                min={1}
                value={servings}
                onChange={(e) =>
                  setServings(parseInt(e.target.value || "1", 10))
                }
                className="w-20 rounded-md border px-2 py-1 text-sm"
              />
              <button
                onClick={quickAdd}
                className="ml-auto rounded-md border px-3 py-1 text-xs hover:bg-secondary"
              >
                Quick-Add to Today
              </button>
              <Link
                to={`/cook/${recipe.id}?step=${stepParam}`}
                className="rounded-md border px-3 py-1 text-xs hover:bg-secondary"
              >
                Start Cooking
              </Link>
            </div>

            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold mb-2">Ingredients</h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.map((ing) => (
                    <IngredientPill
                      key={`${ing.name}-${ing.unit}`}
                      name={ing.name}
                      qty={Math.round(ing.qty * scale)}
                      unit={ing.unit}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-foreground/60">
                  Tap an ingredient to add it to Grocery.
                </p>
                {substitutions.length > 0 && (
                  <div className="mt-3 rounded-md border p-3 bg-secondary/30">
                    <div className="text-xs font-semibold mb-1">
                      Substitutions
                    </div>
                    <ul className="text-xs space-y-1">
                      {substitutions.map((s) => (
                        <li key={s.name}>
                          <span className="font-medium">{s.name}:</span>{" "}
                          {s.suggestions.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.equipment && recipe.equipment.length > 0 && (
                  <div className="mt-3 rounded-md border p-3">
                    <div className="text-xs font-semibold mb-1">Equipment</div>
                    <ul className="text-xs space-y-1 list-disc ml-4">
                      {recipe.equipment.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div>
              <h2 className="text-sm font-semibold mb-2">Steps</h2>
              <ol className="space-y-3 list-decimal ml-5">
                {recipe.steps
                  .sort((a, b) => a.order - b.order)
                  .map((s) => (
                    <li
                      key={s.order}
                      className="space-y-2"
                      ref={(el) => {
                        if (!el) return;
                        if (s.order - 1 === stepParam)
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm leading-relaxed flex-1">
                          {s.text}
                        </p>
                        {s.time ? (
                          <div className="shrink-0">
                            <Timer seconds={s.time} />
                            <div className="mt-1">
                              <VoiceControl text={s.text} />
                            </div>
                          </div>
                        ) : (
                          <div className="shrink-0">
                            <VoiceControl text={s.text} />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
              </ol>
            </div>

            {recipe.tips && recipe.tips.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold mb-1">Tips</h2>
                <ul className="list-disc ml-5 text-sm text-foreground/80 space-y-1">
                  {recipe.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-xl border bg-card p-4 sm:p-6 space-y-2">
          <h2 className="text-sm font-semibold">Overview</h2>
          <div className="text-sm text-foreground/70 space-y-1">
            <div>
              Difficulty:{" "}
              <span className="font-medium">{recipe.difficulty}</span>
            </div>
            <div>
              Prep: <span className="font-medium">{recipe.prepTime} min</span>
            </div>
            <div>
              Cook: <span className="font-medium">{recipe.cookTime} min</span>
            </div>
            {meal && (
              <div className="pt-2 border-t">
                <div className="text-sm font-semibold mb-1">Macros</div>
                <div className="text-sm text-foreground/70">
                  {meal.calories} kcal • P {meal.protein}g • C {meal.carbs}g • F{" "}
                  {meal.fat}g
                </div>
              </div>
            )}
          </div>
          {recipe.videoUrl && (
            <div className="pt-2 border-t">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={recipe.videoUrl}
                  title="Recipe video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
