import { useMemo } from "react";
import { aggregateGroceries, formatQty, loadPlan, loadProfile } from "@/lib/planner";
import { Link } from "react-router-dom";

export default function Grocery() {
  const plan = loadPlan();
  const profile = loadProfile();

  const { items, totalCost } = useMemo(() => {
    return plan ? aggregateGroceries(plan) : { items: [], totalCost: 0 };
  }, [plan]);

  const overUnder = profile ? Math.round(profile.budgetPerWeek - totalCost) : 0;

  const copy = async () => {
    const text = items.map((i) => `• ${i.name} — ${formatQty(i.qty)} ${i.unit}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {}
  };

  if (!plan || !profile) {
    return (
      <section className="container mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold">No plan found</h1>
        <p className="mt-2 text-foreground/70">Generate a plan first.</p>
        <div className="mt-6">
          <Link
            to="/planner"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
          >
            Go to Planner
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Grocery List</h1>
        <div className="text-sm text-foreground/70">Weekly budget: <span className="font-semibold">{profile.budgetPerWeek.toFixed(0)}</span></div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 rounded-xl border bg-card p-6">
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={`${i.name}-${i.unit}`} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span className="truncate mr-3">{i.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-foreground/70">{formatQty(i.qty)} {i.unit}</span>
                  {i.cost !== undefined && (
                    <span className="text-foreground/60">{i.cost.toFixed(2)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3">
            <button onClick={copy} className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80">Copy list</button>
            <button onClick={() => window.print()} className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80">Print</button>
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
              <span className={overUnder >= 0 ? "text-emerald-600" : "text-red-600"}>
                {overUnder >= 0 ? "+" : ""}{overUnder.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="mt-4 text-xs text-foreground/60">
            Ingredients sorted by cost to help you trim the bill. Consider swapping high‑cost items like salmon or avocado for cheaper protein sources if over budget.
          </p>
        </aside>
      </div>
    </div>
  );
}
