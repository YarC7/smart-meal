import { useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import {
  aggregateGroceries,
  formatQty,
  loadPlan,
  loadProfile,
  groupGroceries,
} from "@/lib/planner";
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";

export default function Grocery() {
  const plan = loadPlan();
  const profile = loadProfile();

  const { items, totalCost } = useMemo(() => {
    return plan ? aggregateGroceries(plan) : { items: [], totalCost: 0 };
  }, [plan]);

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
    }
  };

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
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
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

      <div className="mt-6 grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 rounded-xl border bg-card p-6">
          {groupGroceries(items).map(({ category, list }) => (
            <details key={category} className="group mb-4" open>
              <summary className="flex items-center justify-between cursor-pointer select-none">
                <h3 className="text-sm font-semibold">{category}</h3>
                <span className="text-xs text-foreground/60">
                  {list.length} items
                </span>
              </summary>
              <ul className="mt-2 space-y-2">
                {list.map((i) => (
                  <li
                    key={`${category}-${i.name}-${i.unit}`}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      const peers = list
                        .filter((p) => p.name !== i.name)
                        .filter((p) => (p.cost ?? Infinity) < (i.cost ?? Infinity))
                        .sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0))
                        .slice(0, 3);
                      if (peers.length === 0) {
                        toast({ title: "No cheaper alternative", description: `No cheaper ${category.toLowerCase()} found.` });
                      } else {
                        const msg = peers.map((p) => `${p.name} (${(p.cost ?? 0).toFixed(2)})`).join(", ");
                        toast({ title: "Cheaper alternatives", description: msg });
                      }
                    }}
                    title="Click to see cheaper alternatives"
                  >
                    <span className="truncate mr-3">{i.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-foreground/70">
                        {formatQty(i.qty)} {i.unit}
                      </span>
                      {i.cost !== undefined && (
                        <span className="text-foreground/60">
                          {i.cost.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          ))}

          <div className="mt-6 flex gap-3">
            <button
              onClick={copy}
              className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
            >
              Copy list
            </button>
            <button
              onClick={() => {
                window.print();
                toast({ title: "Print", description: "Print dialog opened." });
              }}
              className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
            >
              Print
            </button>
          </div>
        </section>
        <aside className="rounded-xl border bg-card p-6">
          <h2 className="text-sm font-semibold">Budget overview</h2>
          <div className="mt-4 text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span>Estimated total</span>
              <span className="font-semibold">{totalCost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Remaining vs budget</span>
              <span
                className={overUnder >= 0 ? "text-emerald-600" : "text-red-600"}
              >
                {overUnder >= 0 ? "+" : ""}
                {overUnder.toFixed(2)}
              </span>
            </div>
            {profile && (
              <div className="mt-2">
                {(() => {
                  const pct = Math.min(
                    150,
                    Math.round(
                      (totalCost / Math.max(1, profile.budgetPerWeek)) * 100,
                    ),
                  );
                  const color =
                    pct < 80
                      ? "bg-emerald-500"
                      : pct <= 100
                        ? "bg-amber-500"
                        : "bg-red-500";
                  return (
                    <div>
                      <div className="h-2 rounded bg-muted overflow-hidden">
                        <div
                          className={`h-2 ${color}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-foreground/60">
                        {pct}% of budget
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-foreground/60">
            Ingredients grouped by category to simplify shopping.
          </p>
        </aside>
      </div>
    </div>
  );
}
