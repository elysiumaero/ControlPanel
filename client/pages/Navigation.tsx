import { OpsShell } from "@/components/OpsShell";
import { useMemo, useState } from "react";

type Target = {
  name: string;
  lat: number;
  lon: number;
  distanceKm: number; // approx from Delhi
};

const DELHI = { lat: 28.6139, lon: 77.209 };

const TARGETS: Target[] = [
  { name: "Panipat", lat: 29.391, lon: 76.969, distanceKm: 90 },
  { name: "Alwar", lat: 27.553, lon: 76.634, distanceKm: 150 },
  { name: "Rewari", lat: 28.199, lon: 76.616, distanceKm: 82 },
  { name: "Bhiwani", lat: 28.799, lon: 76.133, distanceKm: 120 },
  { name: "Aligarh", lat: 27.897, lon: 78.088, distanceKm: 126 },
  { name: "Muzaffarnagar", lat: 29.475, lon: 77.703, distanceKm: 128 },
  { name: "Karnal", lat: 29.685, lon: 76.99, distanceKm: 120 },
  { name: "Neemrana", lat: 27.988, lon: 76.386, distanceKm: 120 },
  { name: "Mathura", lat: 27.492, lon: 77.673, distanceKm: 160 },
].filter((t) => t.distanceKm >= 80 && t.distanceKm <= 160);

function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

export default function Navigation() {
  const [mode, setMode] = useState<"direct" | "guided">("direct");
  const [target, setTarget] = useState<Target | null>(TARGETS[0]);
  const [code, setCode] = useState("");
  const [locked, setLocked] = useState(false);

  const distance = useMemo(
    () => (target ? haversineKm(DELHI, target) : 0),
    [target],
  );
  const speedKmh = mode === "direct" ? 250 : 180; // direct = speed, guided = precision
  const etaMins = distance > 0 ? Math.round((distance / speedKmh) * 60) : 0;
  const authorized = code === "351478";

  const bbox = useMemo(() => {
    if (!target) return null;
    const dLat = 0.18;
    const dLon = 0.18;
    const lat1 = target.lat - dLat;
    const lat2 = target.lat + dLat;
    const lon1 = target.lon - dLon;
    const lon2 = target.lon + dLon;
    return `${lon1},${lat1},${lon2},${lat2}`;
  }, [target]);

  return (
    <OpsShell>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-lg border border-emerald-600/30 bg-black/40 p-6">
          <h2 className="text-emerald-300 font-bold tracking-widest text-sm mb-4">
            TARGETING
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3">
              <div>
                <label className="block text-xs text-emerald-400/80 mb-1">
                  TARGET CITY
                </label>
                <select
                  value={target?.name ?? ""}
                  onChange={(e) =>
                    setTarget(
                      TARGETS.find((t) => t.name === e.target.value) ?? null,
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-neutral-900/80 text-emerald-200 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                >
                  {TARGETS.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} • ~{t.distanceKm} km
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-emerald-400/80 mb-1">
                  PATH MODE
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMode("direct")}
                    className={`px-3 py-1.5 text-xs rounded border ${mode === "direct" ? "bg-emerald-500/15 border-emerald-400/60" : "border-emerald-600/30 hover:bg-emerald-500/10"}`}
                  >
                    DIRECT
                  </button>
                  <button
                    onClick={() => setMode("guided")}
                    className={`px-3 py-1.5 text-xs rounded border ${mode === "guided" ? "bg-emerald-500/15 border-emerald-400/60" : "border-emerald-600/30 hover:bg-emerald-500/10"}`}
                  >
                    GUIDED
                  </button>
                </div>
                <div className="mt-2 text-xs text-emerald-400/80">
                  {mode === "direct"
                    ? "Direct: prioritizes speed."
                    : "Guided: prioritizes precision."}
                </div>
              </div>
              <div>
                <label className="block text-xs text-emerald-400/80 mb-1">
                  LOCK PASSCODE
                </label>
                <input
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="351478"
                  className="w-full px-3 py-2 rounded bg-neutral-900/80 text-emerald-200 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />
                <button
                  onClick={() => authorized && target && setLocked(true)}
                  disabled={!authorized || !target}
                  className="mt-2 relative overflow-hidden w-full px-3 py-2 text-sm font-semibold rounded text-emerald-900 disabled:opacity-40"
                >
                  <span className="absolute inset-0 rounded bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,.6)]" />
                  <span className="relative z-10">LOCK TARGET</span>
                </button>
                <div className="mt-2 text-xs text-emerald-400/80">
                  Status: {locked ? "LOCKED" : "UNLOCKED"}
                </div>
              </div>
              <div className="text-sm mt-3 text-emerald-300">
                Distance: {distance.toFixed(0)} km
                <br />
                ETA: {etaMins} min @ {speedKmh} km/h
              </div>
            </div>
            <div className="md:col-span-2">
              {target && bbox ? (
                <div className="aspect-video w-full overflow-hidden rounded border border-emerald-700/30">
                  <iframe
                    title="map"
                    className="w-full h-full"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${target.lat},${target.lon}`)}`}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded bg-emerald-900/10 border border-emerald-700/30" />
              )}
              {target && (
                <div className="mt-3 text-xs text-emerald-400/80">
                  TARGET: {target.name} • {target.lat.toFixed(3)},{" "}
                  {target.lon.toFixed(3)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-emerald-600/30 bg-black/40 p-6">
          <h2 className="text-emerald-300 font-bold tracking-widest text-sm mb-4">
            ROUTE SUMMARY
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Origin</span>
              <span>
                {DELHI.lat.toFixed(3)}, {DELHI.lon.toFixed(3)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Destination</span>
              <span>
                {target
                  ? `${target.lat.toFixed(3)}, ${target.lon.toFixed(3)}`
                  : "—"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Mode</span>
              <span>{mode.toUpperCase()}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Distance</span>
              <span>{distance.toFixed(0)} km</span>
            </li>
            <li className="flex items-center justify-between">
              <span>ETA</span>
              <span>{etaMins} min</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Lock</span>
              <span className={locked ? "text-emerald-400" : "text-yellow-300"}>
                {locked ? "LOCKED" : "UNLOCKED"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </OpsShell>
  );
}
