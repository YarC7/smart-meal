import React, { useEffect, useRef, useState } from "react";

interface TimerProps {
  seconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

export default function Timer({ seconds, autoStart, onComplete }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(!!autoStart);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setRunning(false);
          try {
            new AudioContext();
          } catch {}
          if (onComplete) onComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, onComplete]);

  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(remaining % 60)
    .toString()
    .padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <div className="font-mono text-lg tabular-nums" aria-live="polite">
        {minutes}:{secs}
      </div>
      <div className="flex gap-2">
        {!running ? (
          <button
            className="rounded border px-2 py-1 text-xs hover:bg-secondary"
            onClick={() => setRunning(true)}
          >
            Start
          </button>
        ) : (
          <button
            className="rounded border px-2 py-1 text-xs hover:bg-secondary"
            onClick={() => setRunning(false)}
          >
            Pause
          </button>
        )}
        <button
          className="rounded border px-2 py-1 text-xs hover:bg-secondary"
          onClick={() => {
            setRunning(false);
            setRemaining(seconds);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
