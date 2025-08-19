import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-neutral-950 px-4 flex items-center justify-center">
      {/* Soft amber glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_center_-120px,rgba(245,158,11,0.18),transparent_60%)]" />

      <main className="relative w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-2xl shadow-black/50 ring-1 ring-amber-500/10 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Generator Nota Thermal
            </span>
          </h1>
        </header>

        <div className="mt-8 flex justify-center">
          <Link
            href="/nota"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-3 font-semibold text-black shadow-md shadow-amber-900/30 ring-1 ring-amber-300/30 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            Buat Nota
          </Link>
        </div>
      </main>
    </div>
  );
}
