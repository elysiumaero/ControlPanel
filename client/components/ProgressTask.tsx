import { useEffect, useRef, useState } from "react";

export type ProgressState = "idle" | "running" | "done" | "error";

export function ProgressTask({
  label,
  duration = 3000,
  onDone,
  disabled,
}: {
  label: string;
  duration?: number;
  onDone?: () => void;
  disabled?: boolean;
}) {
  const [state, setState] = useState<ProgressState>("idle");
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );

  const start = () => {
    if (disabled || state === "running") return;
    setState("running");
    setProgress(0);
    const startAt = Date.now();
    timer.current = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - startAt) / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        if (timer.current) window.clearInterval(timer.current);
        setState("done");
        onDone?.();
      }
    }, 50);
  };

  return (
    <div className="border border-emerald-700/30 rounded-lg p-3 bg-black/30">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={start}
          disabled={disabled || state === "running"}
          className="relative overflow-hidden px-3 py-1.5 text-sm font-semibold rounded text-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 rounded bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,.6)]" />
          <span className="relative z-10">{label}</span>
        </button>
        <div className="text-xs text-emerald-400/80 min-w-16 text-right">
          {state === "idle" && "IDLE"}
          {state === "running" && `${Math.round(progress)}%`}
          {state === "done" && "DONE"}
          {state === "error" && "ERROR"}
        </div>
      </div>
      <div className="mt-2 h-2 rounded bg-emerald-900/40">
        <div
          className="h-full rounded bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,.8)] transition-[width]"
          style={{ width: `${state === "idle" ? 0 : progress}%` }}
        />
      </div>
    </div>
  );
}
