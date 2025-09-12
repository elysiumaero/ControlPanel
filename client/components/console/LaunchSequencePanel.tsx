import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Rocket, Mic } from "lucide-react";

function Row({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded border bg-secondary/20">
      <div className="text-sm">{label}</div>
      {ok ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      ) : (
        <XCircle className="h-5 w-5 text-red-400" />
      )}
    </div>
  );
}

export function LaunchSequencePanel({
  emailOk,
  commanderOk,
  consentOk,
  safetyVerified,
  safetyArmed,
  distanceKm,
  telemetryOk,
  onLaunch,
}: {
  emailOk: boolean;
  commanderOk: boolean;
  consentOk: boolean;
  safetyVerified: boolean;
  safetyArmed: boolean;
  distanceKm: number | null;
  telemetryOk: boolean;
  onLaunch: () => void;
}) {
  const withinRange = distanceKm == null ? false : distanceKm <= 80;
  const allOk = emailOk && commanderOk && consentOk && safetyVerified && safetyArmed && telemetryOk;

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Preflight Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Row label="Commander Login" ok={emailOk} />
          <Row label="Commander's Code" ok={commanderOk} />
          <Row label="Two-Person Consent (or bypassed)" ok={consentOk} />
          <Row label="Safety Captcha Verified" ok={safetyVerified} />
          <Row label="System Armed" ok={safetyArmed} />
          <Row label="Telemetry Nominal" ok={telemetryOk} />
          <Row label="Range ≤ 80 km" ok={withinRange} />
          {distanceKm != null && !withinRange && (
            <Alert>
              <AlertDescription>Distance warning: {distanceKm.toFixed(1)} km exceeds 80 km threshold.</AlertDescription>
            </Alert>
          )}
          <Separator />
          <div className="flex justify-end">
            <Button size="lg" disabled={!allOk} onClick={onLaunch}>
              <Rocket className="h-5 w-5 mr-2" /> Initiate Launch
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mic className="h-5 w-5 text-primary" /> Voice Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Hook your Python voice-auth module here. This UI is a placeholder for the integration point.</p>
          <ul className="list-disc list-inside">
            <li>Run model to verify commander’s voice</li>
            <li>Expose boolean result to enable final launch</li>
          </ul>
          <p>We can wire a backend endpoint to receive the signal when you’re ready.</p>
        </CardContent>
      </Card>
    </div>
  );
}
