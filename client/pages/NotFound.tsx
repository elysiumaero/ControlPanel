import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-emerald-300">
      <div className="text-center border border-emerald-700/30 bg-black/40 p-8 rounded-xl shadow-[inset_0_0_60px_rgba(16,185,129,.12)]">
        <h1 className="text-4xl font-extrabold tracking-widest text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,.6)] mb-2">
          404
        </h1>
        <p className="text-emerald-400/80 mb-6">Sector not accessible.</p>
        <Link
          to="/"
          className="inline-flex px-4 py-2 rounded bg-emerald-400 text-emerald-900 font-semibold shadow-[0_0_20px_rgba(16,185,129,.6)]"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
