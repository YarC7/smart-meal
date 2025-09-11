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
  const wakeRef = useRef<any>(null);
  const recogRef = useRef<any>(null);

  const steps = useMemo(
    () => (recipe ? [...recipe.steps].sort((a, b) => a.order - b.order) : []),
    [recipe],
  );
  const step = steps[index];

  useEffect(() => {
    if (!recipe || !step) return;
    track("start_cook", { recipeId: recipe.id, step: index });
    // Preload next media if image
    const next = steps[index + 1];
    if (next?.media && /\.(png|jpe?g|webp|gif|svg)$/i.test(next.media)) {
      const img = new Image();
      img.src = next.media;
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
      if (t.includes("tiếp theo")) go(index + 1);
      if (t.includes("quay lại")) go(index - 1);
    };
    rec.onerror = () => {};
    recogRef.current = rec;
    return () => {
      try { rec.abort(); } catch {}
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
            <h1 className="text-lg font-semibold mr-3">{step.text}</h1>
            {step.type && (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                step.type === "prep"
                  ? "bg-amber-100 text-amber-800"
                  : step.type === "cook"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-sky-100 text-sky-800"
              }`}>{step.type}</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            {step.time ? (
              <Timer seconds={step.time} label={`Step ${index + 1}`} />
            ) : (
              <div className="text-sm text-foreground/60">No timer</div>
            )}
            <div className="flex items-center gap-2">
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
            </div>
            <div className="flex flex-wrap gap-3">
              {timers.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Timer seconds={t} label={`Extra ${i + 1}`} />
                  <button
                    className="rounded border px-2 py-1 text-xs hover:bg-secondary"
                    onClick={() => setTimers((arr) => arr.filter((_, j) => j !== i))}
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
