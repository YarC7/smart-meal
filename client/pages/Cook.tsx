import { useMemo, useState } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { getRecipe } from "@/lib/recipesStore";
import Timer from "@/components/recipes/Timer";
import VoiceControl from "@/components/recipes/VoiceControl";

export default function Cook() {
  const { id } = useParams<{ id: string }>();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const recipe = id ? getRecipe(id) : undefined;
  const index = Math.max(0, parseInt(sp.get("step") || "0", 10));

  const steps = useMemo(
    () => (recipe ? [...recipe.steps].sort((a, b) => a.order - b.order) : []),
    [recipe],
  );
  const step = steps[index];

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
    navigate(
      { pathname: `/cook/${id}`, search: `?step=${next}` },
      { replace: true },
    );
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
          <h1 className="text-lg font-semibold">{step.text}</h1>
          <div className="flex items-center justify-between gap-3">
            {step.time ? (
              <Timer seconds={step.time} />
            ) : (
              <div className="text-sm text-foreground/60">No timer</div>
            )}
            <VoiceControl text={step.text} />
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
