import { useMemo } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const macroData = [
  { name: "Protein", value: 30, color: "#10b981" },
  { name: "Carbs", value: 45, color: "#38bdf8" },
  { name: "Fat", value: 25, color: "#f59e0b" },
];

const groceries = [
  { name: "Chicken breast", qty: "1.2 kg" },
  { name: "Quinoa", qty: "800 g" },
  { name: "Spinach", qty: "2 bunches" },
  { name: "Greek yogurt", qty: "4 cups" },
  { name: "Avocado", qty: "4" },
];

export default function Index() {
  const totalMacros = useMemo(
    () => macroData.reduce((sum, m) => sum + m.value, 0),
    [],
  );

  return (
    <div className="bg-gradient-to-b from-white via-white to-emerald-50/50 dark:from-background dark:via-background dark:to-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 -right-20 size-[40rem] rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-400/10" />
        <div className="container mx-auto pt-20 pb-10 md:pt-28 md:pb-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800">
                Science‑backed • Personalized • Fast
              </span>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">
                Eat smarter. Feel better. Save time.
              </h1>
              <p className="mt-4 text-lg text-foreground/70 max-w-prose">
                SmartMeal builds your weekly meal plan and grocery list around
                your goals, preferences, and budget. Track macros and key
                micronutrients with beautiful insights.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/planner"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                >
                  Create my plan
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-secondary/80"
                >
                  Explore features
                </a>
              </div>
              <p className="mt-4 text-sm text-foreground/60">
                Users achieve an average of 1.5 kg weight change in 12 weeks.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl border bg-card p-6 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold">Today's Macros</h3>
                    <div className="mt-4 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={macroData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={36}
                            outerRadius={64}
                            paddingAngle={4}
                          >
                            {macroData.map((entry, index) => (
                              <Cell key={`c-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      {macroData.map((m) => (
                        <div key={m.name} className="flex items-center gap-2">
                          <span
                            className="inline-block size-2 rounded"
                            style={{ background: m.color }}
                          />
                          <span>
                            {m.name}:{" "}
                            {Math.round((m.value / totalMacros) * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      This Week's Groceries
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {groceries.map((g) => (
                        <li
                          key={g.name}
                          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                        >
                          <span className="truncate">{g.name}</span>
                          <span className="text-foreground/60">{g.qty}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-foreground/60">
                      Optimized for budget and nutrition goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-foreground/70">
            Personalized plans, fast logging, auto-generated grocery lists, and
            progress insights—built for real results without the hassle.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Personalized Meal Plans",
              desc: "Rule‑based engine today, learning from your feedback tomorrow.",
            },
            {
              title: "Barcode‑fast Logging",
              desc: "USDA/FDC powered database with offline caching for < 2s latency.",
            },
            {
              title: "Budget‑aware Grocery Lists",
              desc: "Weekly lists ranked by cost to match your budget.",
            },
            {
              title: "Macro + Micro Tracking",
              desc: "Protein, carbs, fats plus iron, calcium, vitamin D and potassium.",
            },
            {
              title: "Nudges & Streaks",
              desc: "Stay consistent with gentle reminders and streak counters.",
            },
            {
              title: "Privacy by Design",
              desc: "Encrypted at rest, OAuth2 + PKCE sign‑in, and data minimization.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t bg-background">
        <div className="container mx-auto py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Set your goals",
                desc: "Pick lose, maintain or gain, add preferences and budget.",
              },
              {
                step: "02",
                title: "Get your plan",
                desc: "We balance macros and micronutrients for the week in seconds.",
              },
              {
                step: "03",
                title: "Shop & track",
                desc: "Follow your list, log meals fast, and watch progress.",
              },
            ].map((s) => (
              <div key={s.step} className="">
                <div className="text-sm font-bold text-primary">{s.step}</div>
                <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-foreground/70">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/planner"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              Start planning now
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold">
              Can I change dietary preferences?
            </h3>
            <p className="mt-2 text-sm text-foreground/70">
              Yes. Update preferences anytime and your next plan adapts
              instantly.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Does SmartMeal work offline?
            </h3>
            <p className="mt-2 text-sm text-foreground/70">
              Yes. The app is PWA‑ready with offline caching for core flows.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
