"use client";

import { useState, useEffect } from "react";
// import { QRCodeSVG } from "qrcode.react";

/* ── Feature flags ──────────────────────────────────────────
   MVP: Day Pass only, manual verification at spot (no QR).
   SHOW_MULTI_PLANS  → re-enable Week/Month when demand validated.
   ENABLE_QR_CHECKIN → re-enable QR + digital check-in flow.
   ──────────────────────────────────────────────────────────── */
const SHOW_MULTI_PLANS = false;
const ENABLE_QR_CHECKIN = false;

const dayPass = {
  name: "Day Pass",
  price: null as number | null, // TBD — finalised before launch
  priceLabel: "Price TBD",
  period: "1 day",
  features: ["1× coworking", "1× fitness", "10% dining discount"],
  split: { f22: null, fitness: null, local: null, platform: null } as Record<string, number | null>,
};

const futurePlans = [
  {
    name: "Week Pass",
    price: 79000,
    priceLabel: "₩79,000",
    period: "7 days",
    features: ["Unlimited coworking", "Unlimited fitness", "20% dining", "Nomad board"],
    popular: true,
    split: { f22: 31600, fitness: 23700, local: 15800, platform: 7900 },
  },
  {
    name: "Month Pass",
    price: 249000,
    priceLabel: "₩249,000",
    period: "30 days",
    features: ["Unlimited coworking", "Unlimited fitness", "30% dining", "Nomad board", "Cross-city access"],
    split: { f22: 99600, fitness: 74700, local: 49800, platform: 24900 },
  },
];

type Step = "info" | "complete" | "active";

/* ── QR check-in data (disabled for MVP — manual verification at spot)
const defaultCheckins = [
  { spot: "F22 Coworking", time: "Today 09:30", type: "Work", recent: false },
  { spot: "Fitness Partner", time: "Today 12:00", type: "Play", recent: false },
  { spot: "Gwangalli Cafe", time: "Yesterday 18:00", type: "Play", recent: false },
];
── */

export default function PassPage() {
  const [step, setStep] = useState<Step>("info");
  const [hasCoupon, setHasCoupon] = useState(false);

  /* ── QR check-in state (disabled for MVP)
  const [checkins, setCheckins] = useState(defaultCheckins);

  const qrValue = JSON.stringify({
    service: "busan-nomad",
    user: "demo-user",
    pass: dayPass.name,
    issued: new Date().toISOString(),
    valid: true,
  });

  const handleCheckin = (spot: string, type: string) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    setCheckins([{ spot, time: `Just now ${timeStr}`, type, recent: true }, ...checkins]);
  };
  ── */

  useEffect(() => {
    setHasCoupon(!!localStorage.getItem("nomadloop_coupons"));
  }, []);

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">Nomad Pass</h1>
        <p className="text-sm text-zinc-500">One pass for Learn · Work · Play</p>
      </div>

      {step === "info" && (
        <>
          {hasCoupon && (
            <div className="mx-6 mb-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
              <p className="text-sm text-emerald-400 font-medium">🎟 NOMAD20 applied — 20% off!</p>
            </div>
          )}

          {/* Day Pass card */}
          <div className="px-6 mb-6">
            <div className="w-full p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{dayPass.name}</h3>
                <div className="text-right">
                  <p className="font-bold text-lg text-amber-400">{dayPass.priceLabel}</p>
                  <p className="text-xs text-zinc-500">/{dayPass.period}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {dayPass.features.map((f) => (
                  <span key={f} className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">{f}</span>
                ))}
              </div>
              <p className="text-xs text-zinc-500">
                Includes access to 3 verified spaces: F22 Coworking, Fitness Partner, and local restaurants in Gwanganli.
              </p>
            </div>
          </div>

          {/* How to get it */}
          <div className="px-6 mb-6">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">How to get the Day Pass</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                July passes are distributed through partner travel agencies — no individual checkout needed.
                Contact us or your travel coordinator to reserve.
              </p>
              <p className="text-xs text-zinc-500 mt-2">* Pricing will be confirmed before launch.</p>
            </div>
          </div>

          <div className="px-6">
            <button onClick={() => setStep("complete")} className="w-full py-3 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors">
              Get the Day Pass
            </button>
            <p className="text-[10px] text-zinc-500 text-center mt-3">* Demo flow — no real payment is processed.</p>
          </div>

          {/* Hidden multi-plan selector — enable via SHOW_MULTI_PLANS flag */}
          {SHOW_MULTI_PLANS && (
            <div className="px-6 mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">More plans</h3>
              {futurePlans.map((p) => (
                <div key={p.name} className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{p.name}</h3>
                      {p.popular && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Popular</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{p.priceLabel}</p>
                      <p className="text-xs text-zinc-500">/{p.period}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.features.map((f) => (
                      <span key={f} className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {step === "complete" && (
        <div className="px-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-zinc-900 border border-emerald-800/30 text-center mb-6">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold mb-1">Pass activated!</h2>
            <p className="text-emerald-400 font-semibold">{dayPass.name}</p>
            <p className="text-xs text-zinc-500 mt-1">Valid for {dayPass.period}</p>
          </div>

          <button onClick={() => setStep("active")} className="w-full py-3 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors">
            View My Pass
          </button>
        </div>
      )}

      {step === "active" && (
        <>
          <div className="px-6 mb-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-zinc-900 border border-emerald-800/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-emerald-400 font-medium">Active</p>
                  <h2 className="text-xl font-bold">{dayPass.name}</h2>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-center text-sm text-zinc-400 py-6">
                Show this pass at any partner spot. The staff will verify your access.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { spot: "F22 Coworking", type: "Work", emoji: "💼" },
                  { spot: "Fitness Partner", type: "Play", emoji: "🏋️" },
                  { spot: "Daniels Tribe", type: "Work", emoji: "☕" },
                ].map((s) => (
                  <div
                    key={s.spot}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-center"
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <p className="text-[10px] text-zinc-400 mt-1">{s.spot.split(" ")[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR check-in UI (disabled for MVP — manual verification at spot)
          {ENABLE_QR_CHECKIN && (
            <>
              <div className="px-6 mb-6">
                <div className="flex justify-center py-4">
                  <div className="bg-white p-3 rounded-xl">
                    <QRCodeSVG value={qrValue} size={180} level="M" bgColor="#ffffff" fgColor="#000000" />
                  </div>
                </div>
                <p className="text-center text-sm text-zinc-400 mt-3">Scan QR at any partner spot to check in</p>
              </div>

              <div className="px-6 mb-4">
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quick Check-in</h2>
                <div className="flex gap-2">
                  {[
                    { spot: "F22 Coworking", type: "Work", emoji: "💼" },
                    { spot: "Fitness Partner", type: "Play", emoji: "🏋️" },
                    { spot: "Daniels Tribe", type: "Work", emoji: "☕" },
                  ].map((s) => (
                    <button
                      key={s.spot}
                      onClick={() => handleCheckin(s.spot, s.type)}
                      className="flex-1 p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 transition-colors text-center"
                    >
                      <span className="text-lg">{s.emoji}</span>
                      <p className="text-[10px] text-zinc-400 mt-1">{s.spot.split(" ")[0]}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6">
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Recent Check-ins</h2>
                <div className="space-y-2">
                  {checkins.map((c, i) => (
                    <div
                      key={c.spot + c.time + i}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        c.recent ? "bg-emerald-950/20 border-emerald-500/30" : "bg-zinc-900 border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${
                          c.type === "Work" ? "bg-blue-400" : c.type === "Play" ? "bg-emerald-400" : "bg-purple-400"
                        }`} />
                        <span className="text-sm font-medium">{c.spot}</span>
                        {c.recent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">NEW</span>}
                      </div>
                      <span className="text-xs text-zinc-500">{c.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          */}

          <div className="px-6 mt-6">
            <button onClick={() => setStep("info")} className="w-full py-3 rounded-full border border-zinc-700 text-zinc-400 text-sm">
              Back to pass info
            </button>
          </div>
        </>
      )}
    </div>
  );
}
