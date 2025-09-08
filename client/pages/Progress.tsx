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
} from "@/lib/planner";
import { MEALS } from "@/data/meals";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

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
    setLogs({ ...logs, [todayKey()]: updated });
  };

  const last7 = useMemo(() => {
    const arr: { day: string; calories: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { weekday: "short" });
      arr.push({ day: label, calories: logs[key]?.calories || 0 });
    }
    return arr;
  }, [logs]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-extrabold tracking-tight">Progress</h1>

      <div className="mt-6 grid lg:grid-cols-3 gap-8">
        <section className="rounded-xl border bg-card p-6 space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Weekly calories</h2>
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
        </section>

        <aside className="rounded-xl border bg-card p-6 space-y-4">
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
            <label className="text-sm block mb-2">Quick add from meals</label>
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
