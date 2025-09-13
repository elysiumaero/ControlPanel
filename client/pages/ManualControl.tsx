import { OpsShell } from "@/components/OpsShell";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ManualControl() {
  const [code, setCode] = useState("");
  const authorized = useMemo(() => code === "702356", [code]);

  const [engineOn, setEngineOn] = useState(false);
  const [parachute, setParachute] = useState(false);
  const [vx, setVx] = useState(0);
  const [vy, setVy] = useState(0);
  const [vz, setVz] = useState(0);
  const [yaw, setYaw] = useState(0);
  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (!authorized) return;
      keysRef.current[e.key] = true;
      if (["w", "W", "ArrowUp"].includes(e.key))
        setVy((v) => Math.min(100, v + 5));
      if (["s", "S", "ArrowDown"].includes(e.key))
        setVy((v) => Math.max(-100, v - 5));
      if (["a", "A", "ArrowLeft"].includes(e.key))
        setVx((v) => Math.max(-100, v - 5));
      if (["d", "D", "ArrowRight"].includes(e.key))
        setVx((v) => Math.min(100, v + 5));
      if (["r", "R"].includes(e.key)) setVz((v) => Math.min(100, v + 5));
      if (["f", "F"].includes(e.key)) setVz((v) => Math.max(-100, v - 5));
      if (["q", "Q"].includes(e.key)) setYaw((v) => v - 5);
      if (["e", "E"].includes(e.key)) setYaw((v) => v + 5);
      if (e.key === " ") setEngineOn((on) => !on);
    };
    const onUp = (e: KeyboardEvent) => {
      if (!authorized) return;
      keysRef.current[e.key] = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [authorized]);

  const kill = () => {
    if (!authorized) return;
    setEngineOn(false);
    setParachute(true);
    setVx(0);
    setVy(0);
    setVz(0);
  };

  return (
    <OpsShell>
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Camera feed */}
        <div className="xl:col-span-2 rounded-lg border border-emerald-600/30 bg-black/40 p-6">
          <h2 className="text-emerald-300 font-bold tracking-widest text-sm mb-4">
            CAMERA
          </h2>
          <div className="aspect-video w-full rounded border border-emerald-700/30 bg-gradient-to-b from-emerald-500/10 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-emerald-500/20" />
              ))}
            </div>
            <div className="absolute top-3 left-3 text-xs text-yellow-300">
              UAV LINK: DISCONNECTED
            </div>
            <div className="absolute bottom-3 right-3 text-xs text-emerald-400/80">
              ELYSIUM OPTICS
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div className="rounded-lg border border-emerald-600/30 bg-black/40 p-6 space-y-4">
          <h2 className="text-emerald-300 font-bold tracking-widest text-sm">
            MANUAL CONTROL
          </h2>

          <div>
            <label className="block text-xs text-emerald-400/80 mb-1">
              CONTROL PASSCODE
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="702356"
              className="w-full px-3 py-2 rounded bg-neutral-900/80 text-emerald-200 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
            <div className="mt-1 text-xs">
              {authorized ? (
                <span className="text-emerald-400">AUTHORIZED</span>
              ) : (
                <span className="text-emerald-500/70">Controls locked</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-emerald-700/30 p-3 bg-emerald-500/5">
              <div className="text-emerald-400/80">ENGINE</div>
              <div
                className={`text-lg ${engineOn ? "text-emerald-400" : "text-yellow-300"}`}
              >
                {engineOn ? "ON" : "OFF"}
              </div>
            </div>
            <div className="rounded border border-emerald-700/30 p-3 bg-emerald-500/5">
              <div className="text-emerald-400/80">PARACHUTE</div>
              <div
                className={`text-lg ${parachute ? "text-yellow-300" : "text-emerald-400"}`}
              >
                {parachute ? "DEPLOYED" : "STOWED"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-emerald-700/30 p-3">
              <div className="text-emerald-400/80">VX</div>
              <div className="text-emerald-300 text-lg">{vx}</div>
            </div>
            <div className="rounded border border-emerald-700/30 p-3">
              <div className="text-emerald-400/80">VY</div>
              <div className="text-emerald-300 text-lg">{vy}</div>
            </div>
            <div className="rounded border border-emerald-700/30 p-3">
              <div className="text-emerald-400/80">VZ</div>
              <div className="text-emerald-300 text-lg">{vz}</div>
            </div>
            <div className="rounded border border-emerald-700/30 p-3">
              <div className="text-emerald-400/80">YAW</div>
              <div className="text-emerald-300 text-lg">{yaw}</div>
            </div>
          </div>

          <div className="text-xs text-emerald-400/80">
            Keybinds: WASD/Arrows movement, R/F altitude, Q/E yaw, Space toggles
            engine.
          </div>

          <button
            onClick={kill}
            disabled={!authorized}
            className="relative overflow-hidden w-full px-3 py-2 text-sm font-extrabold tracking-widest rounded text-emerald-900 disabled:opacity-40"
          >
            <span className="absolute inset-0 rounded bg-red-400 shadow-[0_0_22px_rgba(248,113,113,.8)]" />
            <span className="relative z-10">
              EMERGENCY: KILL ENGINE + DEPLOY PARACHUTE
            </span>
          </button>
        </div>
      </div>
    </OpsShell>
  );
}
