"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const KartViewer = dynamic(
  () => import("@/components/kart-viewer").then((mod) => mod.KartViewer),
  { ssr: false, loading: () => <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center text-zinc-600">Loading 3D...</div> }
);

const features = [
  {
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    title: "Learn",
    desc: "Nomad community & networking",
    color: "text-purple-400",
  },
  {
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    title: "Work",
    desc: "Coworking & cafe workspaces",
    color: "text-blue-400",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Play",
    desc: "Wellness, activities & local life",
    color: "text-emerald-400",
  },
];

const spots = [
  { name: "F22 Coworking", type: "Work", address: "Gwanganli, Busan" },
  { name: "Fitness & Wellness", type: "Play", address: "10 min walk from F22" },
  { name: "Nomad Community", type: "Learn", address: "Gwanganli, Busan" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-zinc-950/80 to-zinc-950" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Busan, South Korea
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Nomad Loop
          </h1>
          <p className="text-lg text-zinc-400 max-w-md mx-auto mb-2">
            One pass. Learn · Work · Play.
          </p>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-8">
            Race through Busan in a kart, discover real spots along the way,
            and use them with a single city pass.
          </p>
          <KartViewer />

          {/* How it works */}
          <div className="mb-6 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 max-w-sm mx-auto">
            <p className="text-xs text-zinc-400 text-center mb-2">How it works</p>
            <div className="flex items-center justify-center gap-1 text-xs text-zinc-500">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-medium">1. Race</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">2. Discover</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">3. Pass</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/race"
              className="px-8 py-3.5 rounded-full bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors text-lg"
            >
              Race Busan →
            </Link>
          </div>
          <div className="flex gap-3 justify-center mt-3">
            <Link
              href="/discover"
              className="px-5 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/pass"
              className="px-5 py-2 rounded-full bg-zinc-800 text-zinc-300 text-sm font-medium border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              Get Pass
            </Link>
            <Link
              href="/about"
              className="px-5 py-2 rounded-full bg-zinc-800 text-zinc-300 text-sm font-medium border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              Tech
            </Link>
          </div>
        </div>
      </section>

      {/* Learn · Work · Play */}
      <section className="px-6 py-12">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6 text-center">
          Learn · Work · Play
        </h2>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-900 border border-zinc-800"
            >
              <svg
                className={`w-8 h-8 mb-3 ${f.color}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
              </svg>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spots */}
      <section className="px-6 py-8">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Available Spots
        </h2>
        <div className="space-y-3">
          {spots.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-zinc-500">{s.address}</p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  s.type === "Work"
                    ? "bg-blue-500/10 text-blue-400"
                    : s.type === "Play"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-purple-500/10 text-purple-400"
                }`}
              >
                {s.type}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* The city is the campus */}
      <section className="px-6 py-8">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-blue-950/50 border border-emerald-900/30">
          <h3 className="font-semibold mb-2">The entire city is your campus.</h3>
          <p className="text-sm text-zinc-400">
            Run along Oncheoncheon stream, recover at Nokcheon hot spring,
            then deep-work at a quiet Dongnae cafe. Busan is not one building —
            it is a city-wide Learn · Work · Play campus for nomads.
          </p>
        </div>
      </section>

      {/* Tech Stats */}
      <section className="px-6 py-8">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 text-center">
          Built with Custom Drift Physics
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: "3", label: "Live APIs" },
            { num: "15", label: "Coins" },
            { num: "6", label: "Spots" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-lg font-bold text-cyan-400">{s.num}</p>
              <p className="text-[10px] text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Integrations */}
      <section className="px-6 pb-8">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 text-center">
          API Integrations
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "Three.js", desc: "Drift Racing Engine", color: "text-cyan-400" },
            { name: "MyRealTrip", desc: "2,221 Products", color: "text-rose-400" },
            { name: "GGUI", desc: "Agent MCP", color: "text-amber-400" },
          ].map((api) => (
            <div key={api.name} className="text-center p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className={`text-sm font-bold ${api.color}`}>{api.name}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{api.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
