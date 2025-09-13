import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAuthenticated } from "@/lib/auth";

export default function Index() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    if (isAuthenticated()) navigate("/dashboard");
  }, [navigate]);

  const disabled = useMemo(
    () => name.trim().length === 0 || password.length === 0,
    [name, password],
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950 text-emerald-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,.12),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(52,211,153,.12),transparent_40%)]" />
      <div className="absolute inset-0 opacity-[0.08] mix-blend-screen bg-[linear-gradient(transparent_95%,rgba(16,185,129,.35)_95%)] bg-[length:100%_3px] animate-scanlines" />
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
        <div className="absolute -inset-[40%] bg-[conic-gradient(from_0deg,rgba(16,185,129,.08),transparent_20%,rgba(16,185,129,.08))] animate-rotate-slow" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md border border-emerald-700/30 bg-black/40 rounded-xl p-6 md:p-8 shadow-[inset_0_0_60px_rgba(16,185,129,.12)] backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded bg-emerald-500/20 ring-1 ring-emerald-400/40 shadow-[0_0_30px_rgba(16,185,129,.35)] animate-pulseGlow" />
            <div>
              <div className="text-2xl font-extrabold tracking-widest text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,.6)]">
                ELYSIUM
              </div>
              <div className="text-xs text-emerald-500/80 tracking-[0.2em]">
                LAUNCH AUTHORIZATION
              </div>
            </div>
          </div>

          <label className="block text-sm text-emerald-400/80 mb-1 tracking-wide">
            Operator Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prerit Roshan or Raghav Jindal"
            className="w-full mb-4 px-4 py-2 rounded bg-neutral-900/80 text-emerald-200 placeholder:text-emerald-600/50 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/60 transition"
          />

          <label className="block text-sm text-emerald-400/80 mb-1 tracking-wide">
            Access Code
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter mission code"
            className="w-full mb-2 px-4 py-2 rounded bg-neutral-900/80 text-emerald-200 placeholder:text-emerald-600/50 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/60 transition"
          />

          {error && <div className="text-red-400/90 text-sm mb-3">{error}</div>}

          <button
            disabled={disabled}
            onClick={() => {
              const u = login(name, password);
              if (!u) {
                setError("Invalid credentials. Authorized operators only.");
                return;
              }
              setError("");
              navigate("/dashboard");
            }}
            className="group relative w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 font-bold tracking-widest rounded-md text-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[.99]"
          >
            <span className="absolute inset-0 rounded-md bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,.6)] group-hover:shadow-[0_0_40px_rgba(16,185,129,.8)] transition" />
            <span className="relative z-10">ENGAGE</span>
          </button>

          <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] text-emerald-500/80">
            <div className="rounded border border-emerald-700/30 p-2 bg-emerald-500/5">
              LINK: SECURE
            </div>
            <div className="rounded border border-emerald-700/30 p-2 bg-emerald-500/5">
              UAV: ELYSIUM
            </div>
            <div className="rounded border border-emerald-700/30 p-2 bg-emerald-500/5">
              MODE: STANDBY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
