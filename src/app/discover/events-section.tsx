"use client";

import { useEffect, useState } from "react";

type PublicEvent = {
  id: string;
  title: string;
  date: string;
  loc: string;
  note: string;
  image: string;
  src: string;
};

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmtDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  const dt = new Date(y, m - 1, day);
  return { md: `${m}.${String(day).padStart(2, "0")}`, dow: DOW[dt.getDay()] };
}

export function EventsSection() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/events")
      .then((r) => r.json())
      .then((j) => setEvents(j.events || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // 로딩 중이거나 공개 행사 없으면 블록 자체를 숨김
  if (loading || events.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-1">Events in Busan</h2>
      <p className="text-sm text-zinc-500 mb-3">Upcoming events worth checking out</p>
      <div className="space-y-3">
        {events.map((e) => {
          const { md, dow } = fmtDate(e.date);
          return (
            <div key={e.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-12 text-center">
                  <div className="text-base font-bold leading-tight">{md}</div>
                  <div className="text-[10px] uppercase tracking-wide text-zinc-500">{dow}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold leading-tight">{e.title}</h3>
                  {e.loc && <p className="text-xs text-zinc-500 mt-0.5">{e.loc}</p>}
                  {e.note && (
                    <p className="text-sm text-zinc-400 mt-2 line-clamp-3 whitespace-pre-line">{e.note}</p>
                  )}
                  {e.src && (
                    <a
                      href={e.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-emerald-400 mt-2 hover:text-emerald-300"
                    >
                      Details →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
