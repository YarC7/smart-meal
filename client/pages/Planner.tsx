import { useEffect, useMemo, useState } from "react";
import MacroDonut from "@/components/smartmeal/MacroDonut";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ProfileInput,
  WeekPlan,
  buildWeekPlan,
  computeTargets,
  loadPlan,
  loadProfile,
  savePlan,
  saveProfile,
  swapMeal,
  regenerateDay,
  filterMeals,
  swapMealWith,
} from "@/lib/planner";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const defaultProfile: ProfileInput = {
  age: 28,
  sex: "male",
  heightCm: 175,
  weightKg: 72,
  activity: "moderate",
  goal: "maintain",
  preference: "omnivore",
  budgetPerWeek: 40,
};

export default function Planner() {
  const [profile, setProfile] = useState<ProfileInput>(
    () => loadProfile() || defaultProfile,
  );
  const [plan, setPlan] = useState<WeekPlan | null>(() => loadPlan());

  const targets = useMemo(() => computeTargets(profile), [profile]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const generate = () => {
    const p = buildWeekPlan(profile);
    setPlan(p);
    savePlan(p);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <section className="lg:col-span-1 space-y-4">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Meal Planner
          </h1>
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <div>Age</div>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: +e.target.value })
                  }
                  min={10}
                  max={99}
                />
              </label>
              <label className="text-sm">
                <div>Sex</div>
                <select
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  value={profile.sex}
                  onChange={(e) =>
                    setProfile({ ...profile, sex: e.target.value as any })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label className="text-sm">
                <div>Height (cm)</div>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  value={profile.heightCm}
                  onChange={(e) =>
                    setProfile({ ...profile, heightCm: +e.target.value })
                  }
                  min={120}
                  max={220}
                />
              </label>
              <label className="text-sm">
                <div>Weight (kg)</div>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  value={profile.weightKg}
                  onChange={(e) =>
                    setProfile({ ...profile, weightKg: +e.target.value })
                  }
                  min={35}
                  max={200}
                />
              </label>
              <label className="text-sm col-span-2">
                <div>Activity</div>
                <select
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  value={profile.activity}
                  onChange={(e) =>
                    setProfile({ ...profile, activity: e.target.value as any })
                  }
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="very">Very active</option>
                  <option value="extra">Extra active</option>
                </select>
              </label>
              <label className="text-sm">
                <div>Goal</div>
                <select
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  value={profile.goal}
                  onChange={(e) =>
                    setProfile({ ...profile, goal: e.target.value as any })
                  }
                >
                  <option value="lose">Lose</option>
                  <option value="maintain">Maintain</option>
                  <option value="gain">Gain</option>
                </select>
              </label>
              <label className="text-sm">
                <div>Preference</div>
                <select
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  value={profile.preference}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preference: e.target.value as any,
                    })
                  }
                >
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="low_carb">Low‑carb</option>
                  <option value="high_protein">High‑protein</option>
                </select>
              </label>
              <label className="text-sm col-span-2">
                <div>Budget per week</div>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min={15}
                    max={120}
                    step={1}
                    value={profile.budgetPerWeek}
                    onChange={(e) =>
                      setProfile({ ...profile, budgetPerWeek: +e.target.value })
                    }
                    className="w-full"
                  />
                  <input
                    type="number"
                    className="w-24 rounded-md border bg-background px-3 py-2"
                    value={profile.budgetPerWeek}
                    onChange={(e) =>
                      setProfile({ ...profile, budgetPerWeek: +e.target.value })
                    }
                  />
                </div>
              </label>
            </div>

            <button
              onClick={generate}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
            >
              Generate 7‑day plan
            </button>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-sm font-semibold">Daily targets</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <MacroDonut
                  protein={targets.protein}
                  carbs={targets.carbs}
                  fat={targets.fat}
                />
              </div>
              <ul className="text-sm space-y-2">
                <li>
                  Calories:{" "}
                  <span className="font-semibold">{targets.calories} kcal</span>
                </li>
                <li>
                  Protein:{" "}
                  <span className="font-semibold">{targets.protein} g</span>
                </li>
                <li>
                  Carbs:{" "}
                  <span className="font-semibold">{targets.carbs} g</span>
                </li>
                <li>
                  Fat: <span className="font-semibold">{targets.fat} g</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Plan preview */}
        <section className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold">Your 7‑day plan</h2>
            <div className="hidden md:block rounded-xl border bg-card p-3">
              <h3 className="text-xs font-semibold">Daily targets</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 items-center">
                <div className="h-24 w-24">
                  <MacroDonut protein={targets.protein} carbs={targets.carbs} fat={targets.fat} />
                </div>
                <ul className="text-xs space-y-1">
                  <li>Cals: <span className="font-semibold">{targets.calories}</span></li>
                  <li>P: <span className="font-semibold">{targets.protein} g</span></li>
                  <li>C: <span className="font-semibold">{targets.carbs} g</span></li>
                  <li>F: <span className="font-semibold">{targets.fat} g</span></li>
                </ul>
              </div>
            </div>
          </div>
          {plan ? (
            <div className="mt-4 grid md:grid-cols-2 gap-6">
              {plan.days.map((d) => (
                <div key={d.day} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{d.day}</h3>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {d.meals.map((m, mi) => (
                      <li
                        key={m.id}
                        className="flex items-center justify-between rounded-md border px-3 py-2 gap-3"
                      >
                        <span className="truncate mr-3 flex-1 min-w-0">
                          {m.name}
                        </span>
                        <span className="text-foreground/60 whitespace-nowrap">
                          {m.calories} kcal
                        </span>
                        <button
                          onClick={() => {
                            if (!plan) return;
                            const updated = swapMeal(
                              plan,
                              plan.days.indexOf(d),
                              mi,
                              profile.preference,
                            );
                            setPlan(updated);
                            toast({ title: "Meal swapped", description: `${m.name} replaced.` });
                          }}
                          className="rounded-md border px-2 py-1 hover:bg-secondary"
                          title="Swap meal"
                        >
                          Swap
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        if (!plan) return;
                        const updated = regenerateDay(
                          plan,
                          plan.days.indexOf(d),
                          profile.preference,
                        );
                        setPlan(updated);
                        toast({ title: "Day regenerated", description: `${d.day} updated.` });
                      }}
                      className="rounded-md border px-3 py-1 text-xs hover:bg-secondary"
                    >
                      Regenerate Day
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-foreground/70">
              Fill the form and generate a plan. It will be saved automatically.
            </p>
          )}
          {plan && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/grocery"
                className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
              >
                View grocery list
              </a>
              <a
                href="/progress"
                className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
              >
                Track my progress
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
