import { OpsShell } from "@/components/OpsShell";
import { ProgressTask } from "@/components/ProgressTask";
import HoldToArm from "@/components/HoldToArm";

export default function Arming() {
  return (
    <OpsShell>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-emerald-600/30 bg-black/40 p-6">
          <h2 className="text-emerald-300 font-bold tracking-widest text-sm mb-4">
            ARMING SEQUENCE
          </h2>
          <div className="grid gap-3">
            <ProgressTask label="Run Systems Check" duration={2500} />
            <ProgressTask label="Calibrate Sensors" duration={3000} />
            <ProgressTask label="Load Mission Profile" duration={2800} />
            <ProgressTask label="Charge Warhead" duration={3500} />
            <ProgressTask label="Enable Firing Circuit" duration={3200} />
          </div>
          <p className="mt-4 text-xs text-emerald-400/80">
            Execute pre-arm procedures in sequence.
          </p>
        </div>
        <HoldToArm passcode="7825" />
      </div>
    </OpsShell>
  );
}
