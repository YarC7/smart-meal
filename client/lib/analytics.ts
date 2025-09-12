import { z } from "zod";

type EventName =
  | "view_recipe"
  | "start_cook"
  | "step_next"
  | "timer_complete"
  | "quick_add_from_recipe"
  | "budget_replan"
  | "favorite_toggle"
  | "rate_recipe"
  | "purchase_toggle";

const EventSchema = z.object({
  event: z.string(),
  at: z.number(),
  planId: z.string().optional(),
  recipeId: z.string().optional(),
  step: z.number().optional(),
  budgetBefore: z.number().optional(),
  budgetAfter: z.number().optional(),
  props: z.record(z.any()).optional(),
});

export function track(name: EventName, props?: Record<string, any>) {
  const payload = { event: name, props, at: Date.now(), ...props } as any;
  const parsed = EventSchema.safeParse(payload);
  // eslint-disable-next-line no-console
  if (!parsed.success) console.warn("analytics schema warning", parsed.error);
  // eslint-disable-next-line no-console
  console.log("analytics:", name, props || {});
  try {
    fetch("/api/logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsed.success ? parsed.data : payload),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
