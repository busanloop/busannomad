"use client";

import { useState } from "react";

type Meetup = {
  id: number;
  title: string;
  host: string;
  spots: number;
  maxSpots: number;
  tag: "Learn" | "Work" | "Play";
  when: string;
  emoji: string;
};

const initialMeetups: Meetup[] = [
  {
    id: 1,
    title: "Morning run at Oncheoncheon",
    host: "Hyunseung K.",
    spots: 3,
    maxSpots: 8,
    tag: "Play",
    when: "Tomorrow 7:00 AM",
    emoji: "🏃‍♂️",
  },
  {
    id: 2,
    title: "AI startup chat at F22",
    host: "Alex K.",
    spots: 5,
    maxSpots: 12,
    tag: "Learn",
    when: "Today 2:00 PM",
    emoji: "💡",
  },
  {
    id: 3,
    title: "Gwangalli sunset beers",
    host: "Sarah L.",
    spots: 4,
    maxSpots: 10,
    tag: "Play",
    when: "Today 6:30 PM",
    emoji: "🍻",
  },
  {
    id: 4,
    title: "Geumjeongsan morning hike",
    host: "Taro M.",
    spots: 2,
    maxSpots: 6,
    tag: "Play",
    when: "Saturday 8:00 AM",
    emoji: "🏔️",
  },
  {
    id: 5,
    title: "Beomeosa temple stay weekend",
    host: "Yuki T.",
    spots: 1,
    maxSpots: 4,
    tag: "Play",
    when: "Sat–Sun",
    emoji: "🛕",
  },
  {
    id: 6,
    title: "Coastal walk at Igidae",
    host: "Hyunseung K.",
    spots: 5,
    maxSpots: 10,
    tag: "Play",
    when: "Sunday 9:00 AM",
    emoji: "🌊",
  },
  {
    id: 7,
    title: "Remote work focus session",
    host: "Alex K.",
    spots: 6,
    maxSpots: 8,
    tag: "Work",
    when: "Weekdays 10 AM–1 PM",
    emoji: "💻",
  },
  {
    id: 8,
    title: "Busan builders weekly",
    host: "Hyunseung K.",
    spots: 7,
    maxSpots: 15,
    tag: "Learn",
    when: "Every Thursday 7 PM",
    emoji: "🔧",
  },
];

const tagStyle: Record<string, string> = {
  Learn: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Work: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Play: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

export default function BoardPage() {
  const [meetups, setMeetups] = useState(initialMeetups);
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState("");

  const handleJoin = (id: number) => {
    if (joined.has(id)) return;
    setJoined(new Set([...joined, id]));
    setMeetups((prev) =>
      prev.map((m) => (m.id === id ? { ...m, spots: m.spots + 1 } : m))
    );
    const meetup = meetups.find((m) => m.id === id);
    setToast(`Joined "${meetup?.title}"!`);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">Busan Meetups</h1>
        <p className="text-sm text-zinc-500">
          Join a run, a hike, a chat, or just sunset beers
        </p>
      </div>

      {/* Online count */}
      <div className="mx-6 mb-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">
            {meetups.reduce((a, m) => a + m.spots, 0)} nomads active in Busan
          </span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 px-6 mb-4">
        {["All", "Learn", "Work", "Play"].map((f) => (
          <span
            key={f}
            className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400"
          >
            {f}
          </span>
        ))}
      </div>

      {/* Meetup list */}
      <div className="px-6 space-y-3 pb-6">
        {meetups.map((m) => {
          const isFull = m.spots >= m.maxSpots;
          const didJoin = joined.has(m.id);
          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border ${
                didJoin
                  ? "bg-emerald-950/20 border-emerald-500/30"
                  : "bg-zinc-900 border-zinc-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{m.title}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tagStyle[m.tag]}`}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Hosted by {m.host} · {m.when}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {Array.from({ length: Math.min(m.spots, 4) }).map(
                          (_, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 rounded-full bg-zinc-700 border border-zinc-800 flex items-center justify-center text-[8px] text-zinc-400"
                            >
                              {i + 1}
                            </div>
                          )
                        )}
                        {m.spots > 4 && (
                          <div className="w-5 h-5 rounded-full bg-zinc-700 border border-zinc-800 flex items-center justify-center text-[8px] text-zinc-400">
                            +{m.spots - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {m.spots}/{m.maxSpots}
                      </span>
                    </div>
                    <button
                      onClick={() => handleJoin(m.id)}
                      disabled={didJoin || isFull}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        didJoin
                          ? "bg-emerald-500/20 text-emerald-400 cursor-default"
                          : isFull
                          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                          : "bg-emerald-500 text-black hover:bg-emerald-400"
                      }`}
                    >
                      {didJoin ? "Joined ✓" : isFull ? "Full" : "Join"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
