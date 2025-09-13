import { OpsShell } from "@/components/OpsShell";

export default function Placeholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <OpsShell>
      <div className="rounded-lg border border-emerald-600/30 bg-black/40 p-6 shadow-[inset_0_0_60px_rgba(16,185,129,.08)]">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-300 tracking-wide drop-shadow-[0_0_12px_rgba(16,185,129,.5)]">
          {title}
        </h1>
        <p className="mt-2 text-emerald-400/80">
          {description ??
            "Mission module placeholder. Continue prompting to fully implement this screen."}
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded border border-emerald-600/20 bg-emerald-500/5"
            />
          ))}
        </div>
      </div>
    </OpsShell>
  );
}
