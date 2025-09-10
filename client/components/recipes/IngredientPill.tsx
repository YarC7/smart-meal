import React from "react";
import { toast } from "@/hooks/use-toast";
import { saveExtraGroceries, loadExtraGroceries } from "@/lib/recipesStore";

interface Props {
  name: string;
  qty: number;
  unit: string;
}

export default function IngredientPill({ name, qty, unit }: Props) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs hover:bg-secondary"
      onClick={() => {
        const items = loadExtraGroceries();
        const key = `${name}|${unit}`;
        const existing = items.find((i) => `${i.name}|${i.unit}` === key);
        if (existing) existing.qty += qty;
        else items.push({ name, unit, qty });
        saveExtraGroceries(items);
        toast({ title: "Added", description: `${name} added to Grocery.` });
        try {
          fetch("/api/grocery", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ items }),
            keepalive: true,
          }).catch(() => {});
        } catch {}
      }}
      title="Add to Grocery"
    >
      <span className="truncate max-w-[10rem]">{name}</span>
      <span className="text-foreground/60">
        {qty} {unit}
      </span>
    </button>
  );
}
