import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity, BatteryCharging, Gauge } from "lucide-react";

export type Health = "OK" | "Warning" | "Critical";

export function TelemetryPanel({
  rpm,
  batteryPct,
  speed,
  motorTemp,
  health,
}: {
  rpm: number;
  batteryPct: number;
  speed: number;
  motorTemp: number;
  health: Health;
}) {
  const healthColor =
    health === "OK"
      ? "bg-emerald-500 text-emerald-900"
      : health === "Warning"
        ? "bg-yellow-500 text-yellow-900"
        : "bg-red-500 text-red-900";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" /> RPM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tabular-nums">{rpm.toLocaleString()}</div>
          <Progress value={Math.min(100, (rpm / 20000) * 100)} className="mt-4" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <BatteryCharging className="h-4 w-4 text-primary" /> Battery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-semibold tabular-nums">{batteryPct}%</div>
            <Badge className={cn("ml-2", batteryPct > 60 ? "bg-emerald-500 text-emerald-900" : batteryPct > 30 ? "bg-yellow-500 text-yellow-900" : "bg-red-500 text-red-900")}>{batteryPct > 60 ? "Stable" : batteryPct > 30 ? "Low" : "Critical"}</Badge>
          </div>
          <Progress value={batteryPct} className="mt-4" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" /> Speed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tabular-nums">{speed} m/s</div>
          <Progress value={Math.min(100, (speed / 1000) * 100)} className="mt-4" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Motor Temp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-semibold tabular-nums">{motorTemp}°C</div>
            <Badge className={healthColor}>{health}</Badge>
          </div>
          <Progress value={Math.min(100, (motorTemp / 200) * 100)} className="mt-4" />
        </CardContent>
      </Card>
    </div>
  );
}
