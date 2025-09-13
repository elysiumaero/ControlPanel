import { OpsShell } from "@/components/OpsShell";
import { useEffect, useMemo, useState } from "react";

function useBattery() {
  const [pct, setPct] = useState(92);
  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => Math.max(0, p - Math.random() * 0.2));
    }, 1500);
    return () => clearInterval(id);
  }, []);
  const health = pct > 60 ? "GOOD" : pct > 30 ? "FAIR" : "LOW";
  return { pct, health } as const;
}

function getArmed() {
  return localStorage.getItem("elysium_armed") === "true";
}

export default function Dashboard() {
  const { pct, health } = useBattery();
  const [armed, setArmed] = useState(getArmed());
  useEffect(() => {
    const onStorage = () => setArmed(getArmed());
    window.addEventListener("storage", onStorage);
    const id = setInterval(onStorage, 800);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(id);
    };
  }, []);

  const missionStatus = useMemo(
    () => (armed ? "ARMED / GREEN" : "STANDBY / SAFE"),
    [armed],
  );

  return (
    <OpsShell>
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-lg border border-emerald-600/30 bg-black/40 p-6 shadow-[inset_0_0_60px_rgba(16,185,129,.1)]">
          <h2 className="text-emerald-300 font-bold tracking-widest text-sm mb-4">
            MISSION OVERVIEW
          </h2>
          <div className="h-72 md:h-96 rounded bg-gradient-to-b from-emerald-500/10 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,.25),transparent_60%)] animate-pulseGlow" />
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0,rgba(16,185,129,.35)_50%,transparent_100%)] animate-sweep" />
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-emerald-500/20" />
              ))}
            </div>
            <div className="absolute bottom-4 left-4 text-xs text-emerald-400/80">
              ELYSIUM RADAR FEED: ONLINE
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-emerald-600/30 bg-black/40 p-6">
          <h2 className="text-emerald-300 font-bold tracking-widest text-sm mb-4">
            SYSTEM STATUS
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span>Mission</span>
              <span className="text-emerald-400">{missionStatus}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Arming</span>
              <span className={armed ? "text-emerald-400" : "text-yellow-300"}>
                {armed ? "ARMED" : "SAFE"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Navigation</span>
              <span className="text-emerald-400">READY</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Comms</span>
              <span className="text-emerald-400">SECURE LINK</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Telemetry Alerts</span>
              <span className="text-emerald-400">0 CRITICAL</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Diagnostics</span>
              <span className="text-emerald-400">NOMINAL</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Sensors</span>
              <span className="text-emerald-400">OK</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Battery</span>
              <span className="text-emerald-400">
                {pct.toFixed(0)}% ({health})
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-lg border border-emerald-600/30 bg-black/40 p-6">
          <h3 className="text-emerald-300 font-bold tracking-widest text-sm">
            TELEMETRY
          </h3>
          <ul className="mt-3 text-sm space-y-2 text-emerald-400/90">
            <li>ALT 000034m | SPD 000.0m/s | HDG 090</li>
            <li>GPS: 12 sats | HDOP 0.6</li>
            <li>LINK: AES-256 | RSSI -62dBm</li>
          </ul>
        </div>
        <div className="rounded-lg border border-emerald-600/30 bg-black/40 p-6">
          <h3 className="text-emerald-300 font-bold tracking-widest text-sm">
            ALERTS
          </h3>
          <ul className="mt-3 space-y-2 text-xs">
            <li className="text-emerald-400/80">No active alerts.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-emerald-600/30 bg-black/40 p-6">
          <h3 className="text-emerald-300 font-bold tracking-widest text-sm">
            BATTERY
          </h3>
          <div className="mt-3">
            <div className="h-3 bg-emerald-900/40 rounded">
              <div
                className="h-full rounded bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,.8)] transition-[width]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-emerald-400">
              {pct.toFixed(0)}% • {health}
            </div>
          </div>
        </div>
      </section>
    </OpsShell>
  );
}
