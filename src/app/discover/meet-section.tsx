"use client";

import { useState, useEffect } from "react";

type MeetSpot = {
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  distance: number;
};

export function MeetSection() {
  const [spots, setSpots] = useState<MeetSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [query, setQuery] = useState("광안리 맛집");

  const queries = [
    { label: "Restaurants", value: "광안리 맛집" },
    { label: "Cafes", value: "광안리 카페" },
    { label: "Bars", value: "광안리 술집" },
    { label: "Seafood", value: "광안리 해산물" },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/meet-spots?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setSpots(data.items || []);
        setSource(data.source || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
          Local Eats · Gwangalli
        </h2>
      </div>

      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {queries.map((q) => (
          <button
            key={q.value}
            onClick={() => setQuery(q.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              query === q.value
                ? "bg-amber-500/20 text-amber-400"
                : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {spots.slice(0, 6).map((spot, i) => (
            <div key={spot.name + i} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{spot.name}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{spot.address}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 mt-1 inline-block">
                    {spot.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {source === "apifuse" && (
        <p className="text-[10px] text-zinc-600 mt-3 text-center">
          powered by KakaoMap · API Fuse
        </p>
      )}
    </div>
  );
}
