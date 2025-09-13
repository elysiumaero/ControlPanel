import { NavLink, useNavigate } from "react-router-dom";
import { PropsWithChildren, useEffect } from "react";
import { getUser, logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/safety", label: "Safety" },
  { to: "/arming", label: "Arming" },
  { to: "/navigation", label: "Navigation" },
  { to: "/communication", label: "Communication" },
  { to: "/manual-control", label: "Manual Control" },
  { to: "/diagnostics", label: "Diagnostics" },
];

export function OpsShell({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-emerald-300 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,.12),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(52,211,153,.12),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen bg-[linear-gradient(transparent_95%,rgba(16,185,129,.35)_95%)] bg-[length:100%_3px] animate-scanlines" />
      <header className="border-b border-emerald-700/30 bg-black/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-30">
        <div className="container max-w-screen-2xl mx-auto flex items-center gap-6 py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-sm bg-emerald-500/20 ring-1 ring-emerald-400/40 shadow-[0_0_30px_rgba(16,185,129,.35)] animate-pulseGlow" />
            <div className="leading-tight">
              <div className="font-extrabold tracking-widest text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,.6)]">
                ELYSIUM
              </div>
              <div className="text-xs text-emerald-500/80 tracking-[0.2em]">
                UAV COMMAND INTERFACE
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-1.5 text-sm rounded border border-emerald-600/30 [text-shadow:0_0_8px_rgba(16,185,129,.35)] transition-all",
                    "hover:bg-emerald-500/10 hover:shadow-[0_0_30px_rgba(16,185,129,.35)] hover:border-emerald-400/50",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/60"
                      : "text-emerald-400/90",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block text-xs text-emerald-500/80">
              AUTH:{" "}
              <span className="text-emerald-300">{user?.name ?? "GUEST"}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="relative overflow-hidden px-3 py-1.5 text-sm font-semibold text-emerald-900 bg-emerald-400 rounded shadow-[0_0_18px_rgba(16,185,129,.5)] ring-1 ring-emerald-300 transition-all hover:shadow-[0_0_35px_rgba(16,185,129,.7)] active:scale-95 active:shadow-[0_0_50px_rgba(16,185,129,.9)]"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <nav className="grid grid-cols-2 gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-1.5 text-sm rounded border text-center",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/60"
                      : "text-emerald-400/90 border-emerald-600/30 hover:bg-emerald-500/10",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="relative z-10 container max-w-screen-2xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
