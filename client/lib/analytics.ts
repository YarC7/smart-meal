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

export function track(name: EventName, props?: Record<string, any>) {
  // eslint-disable-next-line no-console
  console.log("analytics:", name, props || {});
  try {
    fetch("/api/logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: name, props, at: Date.now() }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
