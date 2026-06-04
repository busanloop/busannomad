"use client";

export default function RacePage() {
  return (
    <div className="fixed inset-0 z-40">
      <iframe
        src="/racing-demo.html"
        className="w-full h-full border-0"
        allow="autoplay"
      />
      <a
        href="/"
        className="fixed top-4 left-4 z-50 bg-zinc-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-zinc-700 hover:bg-zinc-800 transition-colors"
      >
        ← Back to BusanNomads
      </a>
      <div className="fixed top-4 right-4 z-50 bg-zinc-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-700">
        <span className="text-xs text-emerald-400">BusanNomads · Arcade Drift Physics</span>
      </div>
    </div>
  );
}
