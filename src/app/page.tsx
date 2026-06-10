"use client";

import Link from "next/link";

const verifiedSpots = [
  {
    name: "f22",
    type: "Work",
    desc: "300sqm coworking lounge & meeting rooms, open 24/7",
    address: "BIFC2 22F, 128 Namdongcheon-ro, Nam-gu, Busan",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "Fitness Korea Munhyeon",
    type: "Play",
    desc: "Gym, weights & yoga — under 10 min from f22",
    address: "Munhyeon, Nam-gu, Busan",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    name: "Daniels Tribe",
    type: "Work",
    desc: "Quiet deep-work café, open daily 08:00–23:00",
    address: "Suyeong-gu, Busan",
    color: "bg-blue-500/10 text-blue-400",
  },
];

const steps = [
  { n: "01", title: "Come in", desc: "Drop by any verified space with your day pass." },
  { n: "02", title: "Check in", desc: "Let the front desk know you're in — they'll mark you down." },
  { n: "03", title: "Connect", desc: "Share what you do, learn from others, never work alone." },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero — connection first */}
      <section className="relative min-h-[68vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-zinc-950/80 to-zinc-950" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Busan, South Korea
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            In Busan,<br />you don&apos;t work alone.
          </h1>
          <p className="text-lg text-zinc-300 max-w-md mx-auto mb-8">
            Busan has places to work. We have the people in them.
            See who&apos;s here, share what you do, and connect.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/discover"
              className="px-8 py-3.5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors text-lg"
            >
              Explore the spaces
            </Link>
            <Link
              href="/connect"
              className="px-8 py-3.5 rounded-full bg-zinc-800 text-zinc-200 font-bold border border-zinc-700 hover:bg-zinc-700 transition-colors text-lg"
            >
              Connect — live this July
            </Link>
          </div>
          <div className="mt-4">
            <Link
              href="/groups"
              className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              Bringing a group? &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 2. The problem */}
      <section className="px-6 py-12">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-2xl font-semibold text-zinc-100 leading-snug">
            Busan has plenty of places to work.
            <br />
            <span className="text-zinc-500">What it&apos;s missing is someone to work beside.</span>
          </p>
        </div>
      </section>

      {/* 3. How it works — 3 steps (restored as its own section) */}
      <section className="px-6 py-8">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6 text-center">
          How it works
        </h2>
        <div className="space-y-3 max-w-lg mx-auto">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <span className="shrink-0 text-sm font-bold text-emerald-400 w-8">{s.n}</span>
              <div>
                <p className="font-medium text-zinc-100">{s.title}</p>
                <p className="text-sm text-zinc-400 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Verified spaces — where connection happens */}
      <section className="px-6 py-8">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2 text-center">
          Where people gather
        </h2>
        <p className="text-xs text-zinc-500 text-center mb-6">
          Three verified spaces, visited and confirmed — not a listing.
        </p>
        <div className="space-y-3 max-w-lg mx-auto">
          {verifiedSpots.map((s) => (
            <div
              key={s.name}
              className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}>
                {s.type}
              </span>
              <div>
                <p className="font-medium text-zinc-100">{s.name}</p>
                <p className="text-sm text-zinc-400 mt-0.5">{s.desc}</p>
                <p className="text-xs text-zinc-500 mt-1">{s.address}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Connect — the core */}
      <section className="px-6 py-8">
        <div className="max-w-lg mx-auto p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-blue-950/50 border border-emerald-900/30">
          <h3 className="font-semibold mb-2 text-zinc-100">Who&apos;s working in Busan right now?</h3>
          <p className="text-sm text-zinc-400 mb-5">
            Connect shows you which spots have nomads checked in this moment —
            so you can join them, not just find a desk.
          </p>
          <Link
            href="/connect"
            className="inline-flex px-6 py-3 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
          >
            Open Connect
          </Link>
        </div>
      </section>

      {/* 6. Contact / footer */}
      <section className="px-6 py-10 text-center">
        <p className="text-sm text-zinc-400 mb-1">
          Bringing a team or group to Busan?
        </p>
        <Link
          href="/groups"
          className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
        >
          See what we offer for groups &rarr;
        </Link>
        <div className="mt-8">
          <Link
            href="/race"
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Try the Busan drift game →
          </Link>
        </div>
      </section>
    </div>
  );
}
