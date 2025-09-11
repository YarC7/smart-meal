import { useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  aggregateGroceries,
  formatQty,
  loadPlan,
  loadProfile,
  groupGroceries,
} from "@/lib/planner";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BudgetProgressBar from "@/components/smartmeal/BudgetProgressBar";
import subs from "@/data/substitutions.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  loadCategories,
  loadPantryStaples,
  loadSubs,
  getCategoryFor,
  getSubsFor,
  loadUserPantry,
  saveUserPantry,
} from "@/lib/catalog";
import { track } from "@/lib/analytics";
import { replanUnderBudget, estimateMealCost } from "@/lib/replan";
import { getProteinPer100g } from "@/lib/nutrition";

export default function Grocery() {
  const plan = loadPlan();
  const profile = loadProfile();

  const { items, totalCost } = useMemo(() => {
    const base = plan ? aggregateGroceries(plan) : { items: [], totalCost: 0 };
    try {
      const extraRaw = localStorage.getItem("smartmeal.grocery.extra.v1");
      const extra = extraRaw ? (JSON.parse(extraRaw) as typeof base.items) : [];
      const map = new Map<string, (typeof base.items)[number]>();
      for (const it of [...base.items, ...extra]) {
        const key = `${it.name}|${it.unit}`;
        const prev = map.get(key);
        map.set(key, prev ? { ...it, qty: prev.qty + it.qty } : it);
      }
      const merged = Array.from(map.values());
      const total = merged.reduce((s, i) => s + (i.cost || 0), 0);
      return { items: merged, totalCost: total || base.totalCost };
    } catch {
      return base;
    }
  }, [plan]);

  const [cats, setCats] = useState<Record<string, string>>({});
  const [remoteSubs, setRemoteSubs] = useState<Record<string, string[]>>({});
  const [pantryList, setPantryList] = useState<string[]>([]);
  const [userPantry, setUserPantry] =
    useState<Record<string, boolean>>(loadUserPantry());

  useEffect(() => {
    loadCategories().then(setCats);
    loadSubs().then(setRemoteSubs);
    loadPantryStaples().then(setPantryList);
  }, []);

  useEffect(() => {
    saveUserPantry(userPantry);
  }, [userPantry]);

  const [copying, setCopying] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    name: string;
    suggestions: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const overUnder = profile ? Math.round(profile.budgetPerWeek - totalCost) : 0;

  useEffect(() => {
    if (items.length === 0) return;
    try {
      fetch("/api/grocery", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, [items]);

  const copy = async () => {
    const text = items
      .map((i) => `• ${i.name} — ${formatQty(i.qty)} ${i.unit}`)
      .join("\n");
    try {
      setCopying(true);
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Grocery list copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
      });
    } finally {
      setCopying(false);
    }
  };

  function findSubs(name: string): string[] | null {
    const n = name.toLowerCase();
    for (const key of Object.keys(subs)) {
      if (n.includes(key.toLowerCase()))
        return (subs as Record<string, string[]>)[key];
    }
    return null;
  }

  if (!plan || !profile) {
    return (
      <section className="container mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold">No plan found</h1>
        <p className="mt-2 text-foreground/70">
          Create your 7‑day plan to generate a smart grocery list optimized for
          your budget.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/planner"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
          >
            Generate plan
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Learn more
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="container mx-auto py-8 sm:py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-extrabold tracking-tight">Grocery List</h1>
        <div className="text-sm text-foreground/70">
          Weekly budget:{" "}
          <span className="font-semibold">
            {profile.budgetPerWeek.toFixed(0)}
          </span>
        </div>
      </div>

      {overUnder < 0 && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 text-red-800 px-4 py-3">
          You are over your weekly budget by {Math.abs(overUnder).toFixed(2)}.
          Consider swapping high‑cost items (e.g., salmon, avocado) for cheaper
          alternatives.
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-3 gap-6 lg:gap-8">
        <section className="lg:col-span-2 rounded-xl border bg-card p-4 sm:p-6">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                  <div className="mt-3 space-y-2">
                    {[0, 1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-8 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={groupGroceries(items).map((g) => g.category)}
            >
              {groupGroceries(
                items.filter((it) => !userPantry[it.name?.toLowerCase?.()]),
              ).map(({ category, list }) => (
                <AccordionItem
                  key={category}
                  value={category}
                  className="border rounded-md mb-3"
                >
                  <AccordionTrigger className="px-3 text-sm font-semibold">
                    <div className="flex items-center justify-between w-full">
                      <span>{category}</span>
                      <span className="text-xs text-foreground/60">
                        {list.length} items
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="mt-1 space-y-2">
                      {list.map((i) => (
                        <li
                          key={`${category}-${i.name}-${i.unit}`}
                          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-secondary"
                          onClick={() => {
                            if (overUnder < 0) {
                              const s =
                                getSubsFor(i.name, remoteSubs) ||
                                findSubs(i.name);
                              if (s && s.length) {
                                setSelected({ name: i.name, suggestions: s });
                                setOpen(true);
                                return;
                              }
                            }
                            const peers = list
                              .filter((p) => p.name !== i.name)
                              .filter(
                                (p) =>
                                  (p.cost ?? Infinity) < (i.cost ?? Infinity),
                              )
                              .sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0))
                              .slice(0, 3);
                            if (peers.length === 0) {
                              toast({
                                title: "No cheaper alternative",
                                description: `No cheaper ${category.toLowerCase()} found.`,
                              });
                            } else {
                              const msg = peers
                                .map(
                                  (p) =>
                                    `${p.name} (${(p.cost ?? 0).toFixed(2)})`,
                                )
                                .join(", ");
                              toast({
                                title: "Cheaper alternatives",
                                description: msg,
                              });
                            }
                          }}
                          title="Click to see cheaper alternatives"
                        >
                          <span className="truncate mr-3">{i.name}</span>
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/recipes?q=${encodeURIComponent(i.name)}`}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded border px-2 py-0.5 text-xs hover:bg-background"
                              title="Find recipes that use this ingredient"
                            >
                              Recipes
                            </Link>
                            <span className="text-foreground/70">
                              {formatQty(i.qty)} {i.unit}
                            </span>
                            {i.cost !== undefined && (
                              <span className="text-foreground/60">
                                {(i.cost ?? 0).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={copy}
              disabled={copying}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
            >
              {copying ? "Copying…" : "Copy list"}
            </button>
            <button
              onClick={() => {
                window.print();
                toast({ title: "Print", description: "Print dialog opened." });
              }}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Print
            </button>
          </div>
        </section>
        <aside className="rounded-xl border bg-card p-4 sm:p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold">Budget overview</h2>
            {loading ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ) : (
              <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span>Estimated total</span>
                  <span className="font-semibold">{totalCost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Remaining vs budget</span>
                  <span
                    className={
                      overUnder >= 0 ? "text-emerald-600" : "text-red-600"
                    }
                  >
                    {overUnder >= 0 ? "+" : ""}
                    {overUnder.toFixed(2)}
                  </span>
                </div>
                {profile && (
                  <div className="mt-2">
                    <BudgetProgressBar
                      total={totalCost}
                      budget={profile.budgetPerWeek}
                    />
                  </div>
                )}
                {overUnder < 0 && (
                  <>
                    <div className="mt-3 rounded-md border p-3 bg-red-50/50">
                      <div className="text-xs font-semibold mb-1">
                        Top cheaper swaps
                      </div>
                      <ul className="text-xs space-y-1">
                        {groupGroceries(items)
                          .flatMap((g) => g.list)
                          .filter((i) => i.cost != null)
                          .sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0))
                          .slice(0, 5)
                          .map((i) => {
                            const peers = items
                              .filter((p) => p.name !== i.name)
                              .filter((p) => (p.cost ?? Infinity) < (i.cost ?? Infinity))
                              .sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0))
                              .slice(0, 3);
                            return (
                              <li key={`${i.name}-${i.unit}`}>
                                <span className="font-medium">{i.name}:</span>{" "}
                                {peers.length
                                  ? peers
                                      .map((p) => `${p.name} (${(p.cost ?? 0).toFixed(2)})`)
                                      .join(", ")
                                  : "No cheaper peers"}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        if (!plan || !profile) return;
                        const { plan: np, changed } = replanUnderBudget(
                          {
                            ...plan,
                            days: [
                              ...plan.days.map((d) => ({
                                ...d,
                                meals: [...d.meals],
                              })),
                            ],
                          },
                          profile.budgetPerWeek,
                        );
                        track("budget_replan", { changed });
                        localStorage.setItem(
                          "smartmeal.plan.v1",
                          JSON.stringify(np),
                        );
                        window.location.reload();
                      }}
                      className="mt-3 w-full rounded-md border px-3 py-2 text-sm hover:bg-secondary"
                    >
                      Replan under budget
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold">Pantry</h2>
            <p className="text-xs text-foreground/60">
              Exclude items you already own.
            </p>
            <div className="mt-2 grid gap-2 max-h-48 overflow-auto">
              {pantryList.map((p) => (
                <label key={p} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!userPantry[p.toLowerCase()]}
                    onChange={(e) =>
                      setUserPantry((prev) => ({
                        ...prev,
                        [p.toLowerCase()]: e.target.checked,
                      }))
                    }
                  />
                  <span className="truncate">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Protein value</h2>
            <p className="text-xs text-foreground/60">
              Cost per gram of protein (lower is better).
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {groupGroceries(items)
                .flatMap((g) => g.list)
                .filter(
                  (i) =>
                    (cats[i.name.toLowerCase()] || "").toLowerCase() ===
                    "proteins",
                )
                .map((i) => {
                  // compute using nutrition table when unit is in grams
                  const { getProteinPer100g } = require("@/lib/nutrition");
                  const per100 = getProteinPer100g(i.name);
                  const unit = i.unit.toLowerCase();
                  if (!per100 || i.cost == null) return null;
                  const grams = unit === "g" ? i.qty : 0;
                  if (!grams) return null;
                  const proteinGrams = (per100 / 100) * grams;
                  if (!proteinGrams) return null;
                  const value = i.cost / proteinGrams; // cost per gram protein
                  return { name: i.name, unit: i.unit, value };
                })
                .filter(Boolean)
                .sort((a: any, b: any) => a.value - b.value)
                .slice(0, 6)
                .map((row: any) => (
                  <li
                    key={`${row.name}-${row.unit}`}
                    className="flex items-center justify-between"
                  >
                    <span className="truncate mr-3">{row.name}</span>
                    <span className="text-foreground/60">
                      {row.value.toFixed(3)}/g protein
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          <p className="text-xs text-foreground/60">
            Ingredients grouped by category to simplify shopping.
          </p>
        </aside>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cheaper substitutions</DialogTitle>
            <DialogDescription>
              Consider swapping{" "}
              <span className="font-semibold">{selected?.name}</span> for one of
              these affordable alternatives:
            </DialogDescription>
          </DialogHeader>
          <ul className="mt-2 space-y-2">
            {selected?.suggestions.map((s) => (
              <li
                key={s}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span className="truncate">{s}</span>
                <span className="text-foreground/60">Similar role</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-foreground/60">
            Tip: Tap any item to see cheaper peers in the same category.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
