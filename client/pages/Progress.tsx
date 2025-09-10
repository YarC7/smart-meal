import { useEffect, useMemo, useState } from "react";
import MacroDonut from "@/components/smartmeal/MacroDonut";
import {
  DayLog,
  Logs,
  computeTargets,
  loadLogs,
  loadPlan,
  loadProfile,
  saveLogs,
  pushLogAction,
  popLastLogAction,
} from "@/lib/planner";
import { toast } from "@/hooks/use-toast";
import { MEALS } from "@/data/meals";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function Progress() {
  const profile = loadProfile();
  const plan = loadPlan();
  const targets = profile
    ? computeTargets(profile)
    : { calories: 2000, protein: 150, carbs: 225, fat: 56 };
  const [logs, setLogs] = useState<Logs>(() => loadLogs());

  const today = logs[todayKey()] || {
    date: todayKey(),
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  useEffect(() => saveLogs(logs), [logs]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const [addingId, setAddingId] = useState<string | null>(null);
  const [undoing, setUndoing] = useState(false);

  const addMeal = (mealId: string) => {
    const m = MEALS.find((x) => x.id === mealId);
    if (!m) return;
    const updated: DayLog = {
      date: todayKey(),
      calories: today.calories + m.calories,
      protein: today.protein + m.protein,
      carbs: today.carbs + m.carbs,
      fat: today.fat + m.fat,
    };
    pushLogAction(todayKey(), {
      mealId,
      calories: m.calories,
      protein: m.protein,
      carbs: m.carbs,
      fat: m.fat,
    });
    setLogs({ ...logs, [todayKey()]: updated });
    console.log("analytics:quick_add", mealId);
    const n = m?.name || "Meal";
    toast({ title: "Logged", description: `${n} added to today.` });
    setTimeout(() => setAddingId(null), 300);
  };

  const undo = () => {
    setUndoing(true);
    const last = popLastLogAction(todayKey());
    if (!last) {
      setUndoing(false);
      return;
    }
    const updated: DayLog = {
      date: todayKey(),
      calories: Math.max(0, today.calories - last.calories),
      protein: Math.max(0, today.protein - last.protein),
      carbs: Math.max(0, today.carbs - last.carbs),
      fat: Math.max(0, today.fat - last.fat),
    };
    setLogs({ ...logs, [todayKey()]: updated });
    console.log("analytics:undo");
    toast({ title: "Undone", description: "Reverted last log." });
    setTimeout(() => setUndoing(false), 250);
  };

  const last7 = useMemo(() => {
    const arr: { day: string; calories: number }[] = [];
    let totalLogged = 0;
    let totalPlanned = 0;
    const dowIndex = (new Date().getDay() + 6) % 7; // Mon=0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { weekday: "short" });
      const cal = logs[key]?.calories ?? 0;
      arr.push({ day: label, calories: cal });
      totalLogged += cal;
      if (plan) {
        const idx = (dowIndex - (6 - i) + 7) % 7;
        totalPlanned += plan.days[idx].meals.reduce(
          (s, m) => s + m.calories,
          0,
        );
      }
    }
    // Seed demo data if all zeros
    if (arr.every((x) => x.calories === 0)) {
      for (let i = 0; i < arr.length; i++) arr[i].calories = 1200 + i * 60;
    }
    return arr;
  }, [logs, plan]);

  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if ((logs[key]?.calories || 0) > 0) count++;
      else break;
    }
    return count;
  }, [logs]);

  const compliance = useMemo(() => {
    if (!plan) return null;
    let logged = 0,
      planned = 0;
    const dowIndex = (new Date().getDay() + 6) % 7;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      logged += logs[key]?.calories || 0;
      const idx = (dowIndex - (6 - i) + 7) % 7;
      planned += plan.days[idx].meals.reduce((s, m) => s + m.calories, 0);
    }
    return planned > 0 ? Math.round((logged / planned) * 100) : null;
  }, [logs, plan]);

  return (
    <div className="container mx-auto py-8 sm:py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-extrabold tracking-tight">Progress</h1>
        <div className="text-sm flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 ring-1 ring-emerald-300">
            🔥 Streak: {streak} days
          </span>
          <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1 ring-1 ring-amber-300">
            🥇 Keep it up
          </span>
          <span className="rounded-full bg-fuchsia-100 text-fuchsia-700 px-3 py-1 ring-1 ring-fuchsia-300">
            💯 You got this
          </span>
          {compliance !== null &&
            (() => {
              const label =
                compliance >= 90
                  ? "Excellent"
                  : compliance >= 70
                    ? "Good"
                    : "Needs work";
              const cls =
                compliance >= 90
                  ? "bg-emerald-100 text-emerald-700 ring-emerald-300"
                  : compliance >= 70
                    ? "bg-amber-100 text-amber-700 ring-amber-300"
                    : "bg-red-100 text-red-700 ring-red-300";
              return (
                <span className={`rounded-full px-3 py-1 ring-1 ${cls}`}>
                  {label}: {compliance}%
                </span>
              );
            })()}
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6 lg:gap-8">
        <section className="rounded-xl border bg-card p-4 sm:p-6 space-y-4 lg:col-span-2">
          {plan && (
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-2">
                Today's planned meals
              </h3>
              <div className="grid gap-2">
                {plan.days[(new Date().getDay() + 6) % 7].meals.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => addMeal(pm.id)}
                    disabled={addingId === pm.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-secondary disabled:opacity-50"
                    aria-busy={addingId === pm.id}
                  >
                    <span className="truncate mr-3">{pm.name}</span>
                    <span className="text-foreground/60 whitespace-nowrap">
                      {addingId === pm.id ? "Adding…" : `${pm.calories} kcal`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <h2 className="text-sm font-semibold">Weekly calories</h2>
          {loading ? (
            <div className="h-56">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#10b981" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <aside className="rounded-xl border bg-card p-4 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold">Today's macros</h2>
          <MacroDonut
            protein={today.protein}
            carbs={today.carbs}
            fat={today.fat}
          />
          <ul className="text-sm space-y-1">
            <li>
              Calories:{" "}
              <span className="font-semibold">
                {today.calories}/{targets.calories}
              </span>
            </li>
            <li>
              Protein:{" "}
              <span className="font-semibold">
                {today.protein}/{targets.protein} g
              </span>
            </li>
            <li>
              Carbs:{" "}
              <span className="font-semibold">
                {today.carbs}/{targets.carbs} g
              </span>
            </li>
            <li>
              Fat:{" "}
              <span className="font-semibold">
                {today.fat}/{targets.fat} g
              </span>
            </li>
          </ul>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm">Quick add from meals</label>
              <button
                onClick={undo}
                disabled={undoing}
                className="rounded-md border px-2 py-1 text-xs hover:bg-secondary disabled:opacity-50"
                title="Undo last"
                aria-busy={undoing}
              >
                {undoing ? "Undoing…" : "Undo"}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {MEALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => addMeal(m.id)}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-secondary"
                >
                  <span className="truncate mr-3">{m.name}</span>
                  <span className="text-foreground/60 whitespace-nowrap">
                    {m.calories} kcal
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {plan ? (
        <p className="mt-6 text-xs text-foreground/60">
          Tip: keep a streak by logging daily. Nudges will remind you when
          you're 40% below targets.
        </p>
      ) : (
        <p className="mt-6 text-xs text-foreground/60">
          Generate a plan to see personalized targets.
        </p>
      )}
    </div>
  );
}
