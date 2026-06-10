import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Groups — BusanNomads",
  description:
    "Worktrips, retreats, and workcation groups in Busan. Verified spaces, connection programming, and bilingual coordination — one contact, one invoice.",
};

const offerings = [
  {
    title: "Verified spaces",
    desc: "A 24/7 coworking lounge with meeting & seminar rooms (f22, BIFC2), a gym, and a deep-work cafe. Visited and confirmed, not a listing.",
  },
  {
    title: "Connection programming",
    desc: "Skill-share sessions and meetups so your group doesn't just work in Busan — they meet the people in it.",
  },
  {
    title: "One point of contact",
    desc: "Bilingual coordination (EN/JA/KO), single invoice, no chasing three venues separately.",
  },
];

export default function GroupsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-zinc-950/80 to-zinc-950" />
        <div className="relative z-10 max-w-lg mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Bring your team to Busan.
          </h1>
          <p className="text-lg text-zinc-300 max-w-md mx-auto">
            Worktrips, retreats, and workcation groups — we handle the spaces,
            the logistics, and the connections. One contact, one invoice, zero
            friction.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 py-8">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6 text-center">
          What you get
        </h2>
        <div className="space-y-3 max-w-lg mx-auto">
          {offerings.map((o) => (
            <div
              key={o.title}
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <p className="font-medium text-zinc-100">{o.title}</p>
              <p className="text-sm text-zinc-400 mt-1">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof */}
      <section className="px-6 py-8">
        <div className="max-w-lg mx-auto p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-blue-950/50 border border-emerald-900/30 text-center">
          <p className="text-zinc-100 font-medium">
            In July 2026, we host 60 digital nomads from Japan —
          </p>
          <p className="text-sm text-zinc-400 mt-1">
            coordinated with Korea&apos;s regional innovation centers.
          </p>
        </div>
      </section>

      {/* Capacity */}
      <section className="px-6 py-8">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 text-center">
          Capacity
        </h2>
        <p className="text-center text-zinc-300 max-w-lg mx-auto">
          Groups of 10–80. Seminar rooms, meeting rooms, and open lounge at f22
          (BIFC2, 22F).
        </p>
      </section>

      {/* CTA */}
      <section className="px-6 py-10 text-center">
        <h2 className="text-xl font-semibold text-zinc-100 mb-3">
          Planning a worktrip to Busan?
        </h2>
        <a
          href="mailto:busannomads@gmail.com"
          className="inline-flex px-8 py-3.5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors text-lg"
        >
          busannomads@gmail.com
        </a>
        <p className="text-sm text-zinc-500 mt-3">
          Tell us your group size and dates.
        </p>
      </section>

      {/* Back link */}
      <section className="px-6 pb-10 text-center">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          &larr; Back to Home
        </Link>
      </section>
    </div>
  );
}
