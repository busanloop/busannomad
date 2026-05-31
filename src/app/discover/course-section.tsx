"use client";

import { useState, useEffect } from "react";

type KakaoSpot = { name: string; address: string; category: string };

const courses = [
  {
    title: "Oncheoncheon run → hot spring recovery → Dongnae cafe work",
    desc: "A perfect day living like a Busan local",
    tags: ["Play", "Wellness", "Work"],
    signature: true,
    flow: [
      { step: "Play", label: "Morning run at Oncheoncheon", icon: "🏃‍♂️", query: "온천천" },
      { step: "Play", label: "Recover at Nokcheon-tang", icon: "♨️", query: "녹천탕" },
      { step: "Work", label: "Deep work at a Dongnae cafe", icon: "💻", query: "동래 카페" },
    ],
    icon: "🏃‍♂️",
  },
  {
    title: "Jangsan hike + Haeundae & Dongbaekseom walk",
    desc: "Haeundae nomad wellness — mountain to ocean in one morning",
    tags: ["Play", "Wellness"],
    icon: "⛰️",
  },
  {
    title: "Geumjeongsan hike + Beomeosa temple + hot spring",
    desc: "Mountain, temple & onsen — Busan's northern healing route",
    tags: ["Play", "Wellness"],
    icon: "🏔️",
  },
  {
    title: "Gwangalli sunrise run + healthy brunch",
    desc: "Start your day running under Gwangan Bridge at dawn",
    tags: ["Play"],
    icon: "🌅",
  },
  {
    title: "Dalmaji gallery walk + quiet cafe deep work",
    desc: "For rainy days and when you need inspiration",
    tags: ["Work", "Wellness"],
    icon: "🎨",
  },
];

const tagColor: Record<string, string> = {
  Play: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Wellness: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Work: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

const stepColor: Record<string, string> = {
  Play: "text-emerald-400",
  Work: "text-blue-400",
  Learn: "text-purple-400",
};

export function CourseSection() {
  const [sigSpots, setSigSpots] = useState<Record<string, KakaoSpot[]>>({});

  useEffect(() => {
    const sig = courses[0];
    if (!sig.flow) return;
    sig.flow.forEach((f) => {
      fetch(`/api/meet-spots?q=${encodeURIComponent(f.query)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.items?.length) {
            setSigSpots((prev) => ({ ...prev, [f.query]: d.items.slice(0, 2) }));
          }
        })
        .catch(() => {});
    });
  }, []);

  const sig = courses[0];

  return (
    <div>
      <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">
        Busan Nomad Routines
      </h2>
      <p className="text-xs text-zinc-600 mb-4">Curated daily routines for living in Busan</p>

      {/* Signature course — hero banner */}
      <div className="mb-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-blue-950/30 to-purple-950/30 border border-emerald-500/30">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold">
            Signature Course
          </span>
        </div>
        <h3 className="text-lg font-bold leading-snug mt-2">{sig.title}</h3>
        <p className="text-sm text-zinc-400 mt-1 mb-4">{sig.desc}</p>

        {/* LWP flow */}
        <div className="flex items-center gap-0 mb-4">
          {sig.flow!.map((f, i) => (
            <div key={f.label} className="flex items-center">
              <div className="text-center px-2">
                <span className="text-2xl">{f.icon}</span>
                <p className="text-xs font-semibold mt-1">{f.label}</p>
                <span className={`text-[10px] font-bold ${stepColor[f.step]}`}>{f.step}</span>
              </div>
              {i < sig.flow!.length - 1 && (
                <span className="text-zinc-600 text-lg mx-1">→</span>
              )}
            </div>
          ))}
        </div>

        {/* KakaoMap real locations */}
        {Object.keys(sigSpots).length > 0 && (
          <div className="space-y-1.5">
            {sig.flow!.map((f) => {
              const spots = sigSpots[f.query];
              if (!spots?.length) return null;
              return (
                <div key={f.query} className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>{f.icon}</span>
                  <span className="text-zinc-400">{spots[0].name}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-600">{spots[0].address}</span>
                </div>
              );
            })}
            <p className="text-[10px] text-zinc-600 mt-1">powered by KakaoMap · API Fuse</p>
          </div>
        )}
      </div>

      {/* Other courses */}
      <div className="space-y-3">
        {courses.slice(1).map((c) => (
          <div key={c.title} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{c.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-snug">{c.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tagColor[t] || "bg-zinc-800 text-zinc-400"}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
