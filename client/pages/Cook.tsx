import { useEffect, useMemo, useRef, useState } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { getRecipe } from "@/lib/recipesStore";
import Timer from "@/components/recipes/Timer";
import VoiceControl from "@/components/recipes/VoiceControl";
import { track } from "@/lib/analytics";

export default function Cook() {
  const { id } = useParams<{ id: string }>();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const recipe = id ? getRecipe(id) : undefined;
  const index = Math.max(0, parseInt(sp.get("step") || "0", 10));
  const [timers, setTimers] = useState<number[]>([]);
  const [checks, setChecks] = useState<boolean[]>([]);
  const wakeRef = useRef<any>(null);
  const recogRef = useRef<any>(null);

  const steps = useMemo(
    () => (recipe ? [...recipe.steps].sort((a, b) => a.order - b.order) : []),
    [recipe],
  );
  const step = steps[index];

  // Load persisted progress
  useEffect(() => {
    if (!recipe) return;
    try {
      const key = `smartmeal.cook.${recipe.id}.v1`;
      const v = localStorage.getItem(key);
      if (v) {
        const obj = JSON.parse(v) as { index: number; checks: boolean[] };
        setChecks(obj.checks || Array(steps.length).fill(false));
      } else {
        setChecks(Array(steps.length).fill(false));
      }
    } catch {
      setChecks(Array(steps.length).fill(false));
    }
  }, [recipe, steps.length]);

  // Persist on change
  useEffect(() => {
    if (!recipe || checks.length === 0) return;
    try {
      const key = `smartmeal.cook.${recipe.id}.v1`;
      localStorage.setItem(key, JSON.stringify({ index, checks }));
    } catch {}
  }, [recipe, index, checks]);

  useEffect(() => {
    if (!recipe || !step) return;
    track("start_cook", { recipeId: recipe.id, step: index });
    try {
      window.speechSynthesis?.cancel();
      const u = new SpeechSynthesisUtterance(step.text);
      u.lang = "vi-VN";
      window.speechSynthesis?.speak(u);
    } catch {}
    // Preload next media if image
    const next = steps[index + 1];
    if (next?.media && /\.(png|jpe?g|webp|gif|svg)$/i.test(next.media)) {
      (async () => {
        try {
          const { preloadImage } = await import("@/lib/media");
          preloadImage(next.media!);
        } catch {}
      })();
    }
    // Wake lock
    const req = async () => {
      try {
        // @ts-ignore
        wakeRef.current = await navigator.wakeLock?.request?.("screen");
      } catch {}
    };
    req();
    return () => {
      try {
        wakeRef.current?.release?.();
        wakeRef.current = null;
      } catch {}
    };
  }, [recipe, step, index, steps]);

  useEffect(() => {
    // Voice navigation (Vietnamese commands)
    const rec: any = (window as any).webkitSpeechRecognition
      ? new (window as any).webkitSpeechRecognition()
      : null;
    if (!rec) return;
    rec.lang = "vi-VN";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const t = Array.from(e.results)
        .map((r: any) => r[0]?.transcript?.toLowerCase?.() || "")
        .join(" ");
      if (/tiếp theo|next/.test(t)) go(index + 1);
      if (/quay lại|lùi|back/.test(t)) go(index - 1);
      const m = t.match(/bước\s*(\d+)/) || t.match(/step\s*(\d+)/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!Number.isNaN(n)) go(n - 1);
      }
      const tm =
        t.match(/(hẹn giờ|timer)\s*(\d+)/) || t.match(/(phút)\s*(\d+)/);
      if (tm) {
        const mins = parseInt(tm[2] || tm[1], 10);
        if (!Number.isNaN(mins)) setTimers((arr) => [...arr, mins * 60]);
      }
      if (/đã xong|hoàn thành|done|complete/.test(t)) {
        setChecks((arr) => {
          const next = [...arr];
          next[index] = true;
          return next;
        });
        go(index + 1);
      }
    };
    rec.onerror = () => {};
    recogRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {}
    };
  }, [index]);

  if (!recipe || !step) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-sm text-foreground/60">No cooking step available.</p>
        <Link
          to={`/recipes/${id ?? ""}`}
          className="mt-3 inline-block rounded border px-3 py-1 text-xs hover:bg-secondary"
        >
          Back to recipe
        </Link>
      </div>
    );
  }

  const go = (i: number) => {
    const next = Math.min(Math.max(i, 0), steps.length - 1);
    if (next !== index) track("step_next", { recipeId: recipe.id, to: next });
    navigate(
      { pathname: `/cook/${id}`, search: `?step=${next}` },
      { replace: true },
    );
  };

  const addTimer = () => {
    const base = step.time || 60;
    setTimers((t) => [...t, base]);
  };

  return (
    <div className="fixed inset-0 bg-background z-40 p-4 sm:p-6 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <Link
            to={`/recipes/${id}`}
            className="rounded-md border px-3 py-1 text-xs hover:bg-secondary"
          >
            Exit
          </Link>
          <div className="text-xs text-foreground/60">
            Step {index + 1} / {steps.length}
          </div>
        </div>

        <div className="rounded-xl border p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mr-3">
              <input
                type="checkbox"
                checked={!!checks[index]}
                onChange={(e) => {
                  setChecks((arr) => {
                    const next = [...arr];
                    next[index] = e.target.checked;
                    return next;
                  });
                }}
                aria-label="Mark step complete"
              />
              <h1 className="text-lg font-semibold">{step.text}</h1>
            </div>
            {step.type && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  step.type === "prep"
                    ? "bg-amber-100 text-amber-800"
                    : step.type === "cook"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-sky-100 text-sky-800"
                }`}
              >
                {step.type}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            {step.time ? (
              <div className="rounded-md border p-2">
                <Timer
                  seconds={step.time}
                  label={`Step ${index + 1}`}
                  onRunningChange={() => {}}
                />
              </div>
            ) : (
              <div className="text-sm text-foreground/60">No timer</div>
            )}
            <div className="flex items-center gap-2">
              <div className="text-xs text-foreground/60">
                {checks.filter(Boolean).length}/{steps.length} done
              </div>
              <VoiceControl text={step.text} />
              {recogRef.current ? (
                <button
                  className="rounded border px-2 py-1 text-xs hover:bg-secondary"
                  onClick={() => {
                    try {
                      if ((recogRef.current as any)._listening) {
                        (recogRef.current as any).abort();
                        (recogRef.current as any)._listening = false;
                      } else {
                        (recogRef.current as any).start();
                        (recogRef.current as any)._listening = true;
                      }
                    } catch {}
                  }}
                >
                  Voice nav
                </button>
              ) : null}
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 mb-2">
              <button
                className="rounded border px-2 py-1 text-xs hover:bg-secondary"
                onClick={addTimer}
              >
                Add timer
              </button>
              {Array.isArray(step.timers) && step.timers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {step.timers.map((sec: number, i: number) => (
                    <button
                      key={i}
                      className="rounded border px-2 py-1 text-xs hover:bg-secondary"
                      onClick={() => setTimers((t) => [...t, sec])}
                    >
                      Start {Math.round(sec / 60)}m
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {timers.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Timer seconds={t} label={`Extra ${i + 1}`} />
                  <button
                    className="rounded border px-2 py-1 text-xs hover:bg-secondary"
                    onClick={() =>
                      setTimers((arr) => arr.filter((_, j) => j !== i))
                    }
                    aria-label={`Remove timer ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t">
            <button
              onClick={() => go(index - 1)}
              className="rounded-md border px-3 py-1 text-sm hover:bg-secondary"
              disabled={index === 0}
            >
              Back
            </button>
            <button
              onClick={() => go(index + 1)}
              className="rounded-md border px-3 py-1 text-sm hover:bg-secondary"
              disabled={index >= steps.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
