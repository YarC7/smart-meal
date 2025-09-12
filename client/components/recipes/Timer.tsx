import React, { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

interface TimerProps {
  seconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
  onRunningChange?: (running: boolean) => void;
  label?: string;
}

function beepAndVibrate() {
  try {
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    o.start();
    o.stop(ctx.currentTime + 0.2);
  } catch {}
  if (navigator.vibrate) navigator.vibrate(200);
}

export default function Timer({
  seconds,
  autoStart,
  onComplete,
  onRunningChange,
  label,
}: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(!!autoStart);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (onRunningChange) onRunningChange(running);
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setRunning(false);
          if (onRunningChange) onRunningChange(false);
          beepAndVibrate();
          track("timer_complete", { label, seconds });
          if (onComplete) onComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, onComplete, onRunningChange, label, seconds]);

  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(remaining % 60)
    .toString()
    .padStart(2, "0");

  return (
    <div
      className="flex items-center gap-2"
      role="timer"
      aria-live="polite"
      aria-label={label || "timer"}
      data-running={running ? "true" : "false"}
    >
      <div className="font-mono text-lg tabular-nums">
        {minutes}:{secs}
      </div>
      <div className="flex gap-2">
        {!running ? (
          <button
            className="rounded border px-2 py-1 text-xs hover:bg-secondary"
            onClick={() => {
              setRunning(true);
              if (onRunningChange) onRunningChange(true);
            }}
          >
            Start
          </button>
        ) : (
          <button
            className="rounded border px-2 py-1 text-xs hover:bg-secondary"
            onClick={() => {
              setRunning(false);
              if (onRunningChange) onRunningChange(false);
            }}
          >
            Pause
          </button>
        )}
        <button
          className="rounded border px-2 py-1 text-xs hover:bg-secondary"
          onClick={() => {
            setRunning(false);
            if (onRunningChange) onRunningChange(false);
            setRemaining(seconds);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
