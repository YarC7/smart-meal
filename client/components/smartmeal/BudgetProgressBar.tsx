import React from "react";

interface BudgetProgressBarProps {
  total: number;
  budget: number;
}

export default function BudgetProgressBar({ total, budget }: BudgetProgressBarProps) {
  const pct = Math.round((total / Math.max(1, budget)) * 100);
  const clamped = Math.min(100, Math.max(0, pct));
  const color = pct < 80 ? "bg-emerald-500" : pct <= 100 ? "bg-amber-500" : "bg-red-500";
  const label = pct < 80 ? "Within budget" : pct <= 100 ? "Near budget" : "Over budget";

  return (
    <div>
      <div className="h-2 rounded bg-muted overflow-hidden" aria-label="Budget usage" aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped} role="progressbar">
        <div className={`h-2 ${color}`} style={{ width: `${clamped}%` }} />
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-foreground/60">
        <span>{pct}% of budget</span>
        <span className={pct < 80 ? "text-emerald-600" : pct <= 100 ? "text-amber-600" : "text-red-600"}>{label}</span>
      </div>
    </div>
  );
}
