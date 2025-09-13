import { useEffect, useRef, useState } from "react";

const ARMED_KEY = "elysium_armed";

export function isArmed() {
  return localStorage.getItem(ARMED_KEY) === "true";
}

export function setArmed(v: boolean) {
  localStorage.setItem(ARMED_KEY, v ? "true" : "false");
}

export default function HoldToArm({
  passcode = "7825",
}: {
  passcode?: string;
}) {
  const [coverOpen, setCoverOpen] = useState(false);
  const [code, setCode] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  const [holding, setHolding] = useState(false);
  const [armed, setArmedState] = useState(isArmed());
  const holdTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (holdTimer.current) window.clearTimeout(holdTimer.current);
    },
    [],
  );

  const onHoldStart = () => {
    if (!codeValid || armed) return;
    setHolding(true);
    holdTimer.current = window.setTimeout(() => {
      setHolding(false);
      setArmed(true);
      setArmedState(true);
    }, 2000);
  };

  const onHoldEnd = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    setHolding(false);
  };

  return (
    <div className="rounded-lg border border-emerald-700/30 bg-black/40 p-4">
      <h3 className="text-emerald-300 font-bold tracking-widest text-sm mb-3">
        HOLD-TO-ARM
      </h3>
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <div className="relative">
          <div className="h-28 rounded-lg border border-emerald-600/40 bg-emerald-900/20 flex items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 origin-top-left transition-transform duration-500 ${coverOpen ? "rotate-[-120deg] translate-x-[-10%] translate-y-[-40%]" : "rotate-0"}`}
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,.35), rgba(6,95,70,.65))",
                boxShadow: "0 0 40px rgba(16,185,129,.4)",
                borderBottom: "1px solid rgba(16,185,129,.5)",
              }}
            />
            <div className="relative z-10 text-center">
              <div className="text-xs text-emerald-400/80">SAFETY COVER</div>
              <button
                onClick={() => setCoverOpen((v) => !v)}
                className="mt-1 px-2 py-1 text-xs rounded bg-emerald-400 text-emerald-900 font-semibold shadow-[0_0_18px_rgba(16,185,129,.6)]"
              >
                {coverOpen ? "CLOSE" : "FLIP OPEN"}
              </button>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs text-emerald-400/80 mb-1">
              PASSCODE
            </label>
            <input
              value={code}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                setCode(v);
                setCodeValid(v === passcode);
              }}
              placeholder="Enter code"
              className="w-full px-3 py-2 rounded bg-neutral-900/80 text-emerald-200 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
            <div className="mt-1 text-xs">
              {codeValid ? (
                <span className="text-emerald-400">AUTHORIZED</span>
              ) : (
                <span className="text-emerald-500/70">Code required</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="text-sm text-emerald-400/80">
            STATUS:{" "}
            {armed ? (
              <span className="text-emerald-400">ARMED</span>
            ) : (
              <span className="text-yellow-300">SAFE</span>
            )}
          </div>
          <button
            onMouseDown={onHoldStart}
            onMouseUp={onHoldEnd}
            onMouseLeave={onHoldEnd}
            disabled={!codeValid || armed || !coverOpen}
            className="relative overflow-hidden w-48 h-12 rounded font-extrabold tracking-widest text-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 rounded bg-emerald-400 shadow-[0_0_22px_rgba(16,185,129,.8)]" />
            <span className="relative z-10">
              {holding ? "HOLDING..." : armed ? "ARMED" : "PRESS & HOLD"}
            </span>
          </button>
          <div className="w-48 h-2 bg-emerald-900/40 rounded">
            <div
              className="h-full rounded bg-emerald-400 transition-[width]"
              style={{ width: holding ? "100%" : armed ? "100%" : "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
