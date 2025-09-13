import { OpsShell } from "@/components/OpsShell";
import { useMemo, useState } from "react";

function TestRow({ name, disabled }: { name: string; disabled: boolean }) {
  const [pct, setPct] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const start = () => {
    if (disabled || running) return;
    setRunning(true);
    setDone(false);
    setPct(0);
    const startAt = Date.now();
    const dur = 2800 + Math.random() * 1200;
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - startAt) / dur) * 100);
      setPct(p);
      if (p >= 100) {
        clearInterval(id);
        setRunning(false);
        setDone(true);
      }
    }, 50);
  };
  return (
    <div className="grid grid-cols-12 gap-3 items-center">
      <div className="col-span-3 text-sm text-emerald-300">{name}</div>
      <div className="col-span-6 h-2 bg-emerald-900/40 rounded">
        <div
          className="h-full rounded bg-emerald-400 transition-[width]"
          style={{ width: `${running || done ? pct : 0}%` }}
        />
      </div>
      <div className="col-span-3 flex items-center justify-end gap-2">
        <span className="text-xs text-emerald-400/80 w-10 text-right">
          {running ? `${Math.round(pct)}%` : done ? "DONE" : "IDLE"}
        </span>
        <button
          onClick={start}
          disabled={disabled || running}
          className="relative overflow-hidden px-3 py-1.5 text-xs font-semibold rounded text-emerald-900 disabled:opacity-40"
        >
          <span className="absolute inset-0 rounded bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,.6)]" />
          <span className="relative z-10">TEST</span>
        </button>
      </div>
    </div>
  );
}

export default function Safety() {
  const [code, setCode] = useState("");
  const ok = useMemo(() => code === "2413", [code]);
  return (
    <OpsShell>
      <div className="rounded-lg border border-emerald-600/30 bg-black/40 p-6">
        <h1 className="text-emerald-300 font-bold tracking-widest text-sm">
          SAFETY PANEL
        </h1>
        <p className="mt-2 text-emerald-400/80 text-sm">
          Run subsystem tests. Passcode required.
        </p>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs text-emerald-400/80 mb-1">
              PASSCODE
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="2413"
              className="w-full px-3 py-2 rounded bg-neutral-900/80 text-emerald-200 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
            <div className="mt-1 text-xs">
              {ok ? (
                <span className="text-emerald-400">AUTHORIZED</span>
              ) : (
                <span className="text-emerald-500/70">Enter code</span>
              )}
            </div>
          </div>
          <div className="md:col-span-2 grid gap-4">
            <TestRow name="Sensors" disabled={!ok} />
            <TestRow name="Fin Servos" disabled={!ok} />
            <TestRow name="Motor" disabled={!ok} />
            <TestRow name="Battery" disabled={!ok} />
            <TestRow name="Camera" disabled={!ok} />
            <TestRow name="IMU" disabled={!ok} />
            <TestRow name="GPS" disabled={!ok} />
          </div>
        </div>
      </div>
    </OpsShell>
  );
}
