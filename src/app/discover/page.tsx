"use client";

import { useState, useEffect } from "react";
import { TravelSection } from "./travel-section";
import { MeetSection } from "./meet-section";
import { CourseSection } from "./course-section";

type Category = "All" | "Learn" | "Work" | "Play";

/* ── Verified spots (MVP: 3 only) ──────────────────────────── */
const spots = [
  {
    id: 1,
    name: "F22 Coworking",
    category: "Work" as const,
    address: "128, Namdongcheon-ro, Nam-gu, Busan, Republic of Korea",
    description: "300sqm lounge & meeting rooms, open 24/7",
    lat: 35.141046,
    lng: 129.065214,
    hours: "24/7",
  },
  {
    id: 2,
    name: "Fitness Korea Munhyeon",
    category: "Play" as const,
    address: "Under 10 min walk from BIFC2, Munhyeon",
    description: "Gym, weights & yoga",
    lat: 35.1545,
    lng: 129.1155,
    hours: "06:00 - 22:00",
  },
  {
    id: 3,
    name: "Daniels Tribe",
    category: "Work" as const,
    address: "8 Suyeong-ro 554beonga-gil, Suyeong-gu, Busan",
    description: "Quiet deep-work cafe near Gwangalli",
    lat: 35.1544525,
    lng: 129.1149754,
    hours: "08:00 - 23:00",
  },
];

/* ── Future spots (hidden for MVP — re-enable when expanding)
const extraSpots = [
  {
    id: 4,
    name: "Gwangalli Food Street",
    category: "Play" as const,
    address: "Gwangalli Beach Rd",
    description: "Curated local restaurant row",
    lat: 35.1535,
    lng: 129.1195,
    hours: "11:00 - 23:00",
  },
  {
    id: 5,
    name: "Gwangan Bridge Viewpoint",
    category: "Play" as const,
    address: "Millak-dong, Suyeong-gu",
    description: "Iconic night bridge view",
    lat: 35.1497,
    lng: 129.1263,
    hours: "Always Open",
  },
  {
    id: 6,
    name: "Haeundae Beach Run",
    category: "Play" as const,
    address: "Haeundae Beach Rd",
    description: "5km beachside running course",
    lat: 35.1587,
    lng: 129.1604,
    hours: "Always Open",
  },
  {
    id: 7,
    name: "Avani Hotel Busan",
    category: "Work" as const,
    address: "Haeundae-gu",
    description: "Nomad-friendly hotel with lobby workspace",
    lat: 35.1621,
    lng: 129.1637,
    hours: "24/7",
  },
];
── */

const categoryColors: Record<string, string> = {
  Learn: "bg-purple-500",
  Work: "bg-blue-500",
  Play: "bg-emerald-500",
};

const categoryBadge: Record<string, string> = {
  Learn: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Work: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Play: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function DiscoverPage() {
  const [filter, setFilter] = useState<Category>("All");
  const [coupon, setCoupon] = useState<{ code: string; spots: Array<{ name: string; emoji: string; reward: string }> } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nomadloop_coupons");
      if (raw) setCoupon(JSON.parse(raw));
    } catch {}
  }, []);

  const clearCoupon = () => {
    localStorage.removeItem("nomadloop_coupons");
    setCoupon(null);
  };

  const filtered =
    filter === "All" ? spots : spots.filter((s) => s.category === filter);

  return (
    <div className="flex flex-col">
      {/* Coupon Banner */}
      {coupon && (
        <div className="mx-6 mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 to-cyan-950/50 border border-emerald-500/30 relative">
          <button onClick={clearCoupon} className="absolute top-2 right-3 text-zinc-500 hover:text-white text-lg">✕</button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎟</span>
            <span className="text-emerald-400 font-bold text-sm">{coupon.code} applied</span>
          </div>
          <p className="text-xs text-zinc-400 mb-2">20% off all Busan tours & stays on MyRealTrip</p>
          <div className="flex flex-wrap gap-1.5">
            {coupon.spots.map((s) => (
              <span key={s.name} className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                {s.emoji} {s.reward}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">Discover Busan</h1>
        <p className="text-sm text-zinc-500">
          Explore Learn · Work · Play spots across the city
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="mx-6 h-48 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 to-emerald-950/30" />
        <div className="relative z-10 text-center">
          <p className="text-zinc-400 text-sm mb-2">Busan, South Korea</p>
          <p className="text-zinc-600 text-xs">35.1796° N, 129.0756° E</p>
          <div className="flex gap-2 mt-3 justify-center">
            {["Learn", "Work", "Play"].map((cat) => (
              <div key={cat} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${categoryColors[cat]}`} />
                <span className="text-xs text-zinc-500">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-6 py-4">
        {(["All", "Learn", "Work", "Play"] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-white text-black"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Spot List */}
      <div className="px-6 space-y-3 pb-6">
        {filtered.map((spot) => (
          <div key={spot.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{spot.name}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{spot.address}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${categoryBadge[spot.category]}`}>
                {spot.category}
              </span>
            </div>
            <p className="text-sm text-zinc-400 mb-2">{spot.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">{spot.hours}</span>
              {/* QR check-in disabled for MVP — manual verification at spot
              <button className="text-xs text-emerald-400 font-medium hover:text-emerald-300">
                Check In →
              </button>
              */}
            </div>
          </div>
        ))}
      </div>

      {/* Nomad Courses */}
      <div className="px-6 py-6">
        <CourseSection />
      </div>

      {/* Meet Section - API Fuse × KakaoMap */}
      <div className="px-6 py-6">
        <MeetSection />
      </div>

      {/* Travel Section - MyRealTrip */}
      <div className="px-6 py-6">
        <TravelSection />
      </div>

      {/* Next Step CTA */}
      <div className="px-6 pb-8">
        <a
          href="/pass"
          className="block w-full p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/20 text-center hover:border-emerald-500/40 transition-colors"
        >
          <p className="text-emerald-400 font-semibold text-sm">Next step →</p>
          <p className="text-xs text-zinc-400 mt-1">Get your pass — just show it at the spot</p>
        </a>
      </div>
    </div>
  );
}
