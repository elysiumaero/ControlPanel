import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Crosshair, Target, MapPin } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const INDIA_BOUNDS = { latMin: 6, latMax: 36, lonMin: 68, lonMax: 98 };

function project(lat: number, lon: number) {
  const x = ((lon - INDIA_BOUNDS.lonMin) / (INDIA_BOUNDS.lonMax - INDIA_BOUNDS.lonMin)) * 100;
  const y = (1 - (lat - INDIA_BOUNDS.latMin) / (INDIA_BOUNDS.latMax - INDIA_BOUNDS.latMin)) * 100;
  return { x, y };
}

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const A =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * c;
}

export function DestinationPanel({
  lat,
  lon,
  curLat,
  curLon,
  onSet,
  onSetCurrent,
}: {
  lat: number;
  lon: number;
  curLat: number | null;
  curLon: number | null;
  onSet: (lat: number, lon: number) => void;
  onSetCurrent: (lat: number, lon: number) => void;
}) {
  const [draftLat, setDraftLat] = useState(lat);
  const [draftLon, setDraftLon] = useState(lon);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [tracking, setTracking] = useState(false);
  const [lastUpdateAt, setLastUpdateAt] = useState<number | null>(null);
  const [accuracyM, setAccuracyM] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (curLat != null && curLon != null) {
      setDistanceKm(haversineKm(curLat, curLon, draftLat, draftLon));
    }
  }, [curLat, curLon, draftLat, draftLon]);

  // Cleanup any active geolocation watch when component unmounts
  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation?.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  const dst = useMemo(() => project(draftLat, draftLon), [draftLat, draftLon]);
  const src = useMemo(() => (curLat != null && curLon != null ? project(curLat, curLon) : null), [curLat, curLon]);

  const useGeolocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      onSetCurrent(lat, lon);
      // Send to backend for persistence/telemetry
      try {
        await fetch("/api/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lon }),
        });
      } catch (e) {
        // best-effort send; silently ignore errors in demo
        console.warn("Failed to send location", e);
      }
    });
  };

  const toggleTracking = () => {
    if (!navigator.geolocation) return;

    if (tracking) {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setTracking(false);
      return;
    }

    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setAccuracyM(typeof pos.coords.accuracy === "number" ? pos.coords.accuracy : null);
        setLastUpdateAt(Date.now());
        onSetCurrent(lat, lon);
        try {
          await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lon }),
          });
        } catch (e) {
          console.warn("Failed to send location", e);
        }
      },
      (err) => {
        console.warn("Geolocation watch error", err);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    watchIdRef.current = id;
    setTracking(true);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Crosshair className="h-5 w-5 text-primary" /> Set Destination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Latitude</div>
              <Input value={draftLat} onChange={(e) => setDraftLat(Number(e.target.value))} type="number" min={-90} max={90} step="0.0001" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Longitude</div>
              <Input value={draftLon} onChange={(e) => setDraftLon(Number(e.target.value))} type="number" min={-180} max={180} step="0.0001" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onSet(draftLat, draftLon)} className="flex-1">
              <Target className="h-4 w-4 mr-2" /> Confirm Coordinates
            </Button>
            <Button variant="outline" onClick={() => { setDraftLat(lat); setDraftLon(lon); }}>Reset</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={useGeolocation}><MapPin className="h-4 w-4 mr-2" /> Use Current Location</Button>
            <Button variant={tracking ? "destructive" : "secondary"} onClick={toggleTracking}>
              {tracking ? "Stop Tracking" : "Start Tracking"}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {tracking
              ? `Tracking... ${accuracyM != null ? `(±${Math.round(accuracyM)} m)` : ""} ${lastUpdateAt ? `• Updated ${new Date(lastUpdateAt).toLocaleTimeString()}` : ""}`
              : "Tracking off"}
          </div>
          <Separator />
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>Distance:</span>
            <span className={distanceKm != null && distanceKm > 80 ? "text-red-400" : "text-emerald-400"}>{distanceKm == null ? "N/A" : `${distanceKm.toFixed(1)} km`}</span>
            {distanceKm != null && distanceKm > 80 && <span className="ml-2">(Warning: &gt; 80 km)</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Map of India</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-72 w-full rounded border border-primary/40 bg-black/60 overflow-hidden">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/India_outline.svg" alt="India Map" className="absolute inset-0 h-full w-full object-contain opacity-50" />
            {src && (
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1={src.x} y1={src.y} x2={dst.x} y2={dst.y} stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="2 2" />
              </svg>
            )}
            {src && (
              <div style={{ left: `${src.x}%`, top: `${src.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(0,0,0,0.6)]" />
              </div>
            )}
            <div style={{ left: `${dst.x}%`, top: `${dst.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
              <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_0_2px_rgba(0,0,0,0.6)] animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
