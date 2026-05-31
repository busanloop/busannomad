"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const plans = [
  {
    name: "Day Pass",
    price: 15000,
    priceLabel: "₩15,000",
    period: "1 day",
    features: ["1× coworking", "1× fitness", "10% dining discount"],
    split: { f22: 6000, fitness: 4500, local: 3000, platform: 1500 },
  },
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

type Step = "select" | "payment" | "complete" | "active";

const defaultCheckins = [
  { spot: "F22 Coworking", time: "Today 09:30", type: "Work", recent: false },
  { spot: "Fitness Partner", time: "Today 12:00", type: "Play", recent: false },
  { spot: "Gwangalli Cafe", time: "Yesterday 18:00", type: "Play", recent: false },
];

export default function PassPage() {
  const [step, setStep] = useState<Step>("select");
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [checkins, setCheckins] = useState(defaultCheckins);
  const [hasCoupon, setHasCoupon] = useState(false);

  useEffect(() => {
    setHasCoupon(!!localStorage.getItem("nomadloop_coupons"));
  }, []);

  const plan = plans[selectedPlan];
  const finalPrice = hasCoupon ? Math.round(plan.price * 0.8) : plan.price;

  const qrValue = JSON.stringify({
    service: "nomad-loop",
    user: "demo-user",
    pass: plan.name,
    issued: new Date().toISOString(),
    valid: true,
  });

  const handleCheckin = (spot: string, type: string) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    setCheckins([{ spot, time: `Just now ${timeStr}`, type, recent: true }, ...checkins]);
  };

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">Nomad Pass</h1>
        <p className="text-sm text-zinc-500">One pass for Learn · Work · Play</p>
      </div>

      {step === "select" && (
        <>
          {hasCoupon && (
            <div className="mx-6 mb-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
              <p className="text-sm text-emerald-400 font-medium">🎟 NOMAD20 applied — 20% off all plans!</p>
            </div>
          )}
          <div className="px-6 space-y-3 mb-6">
            {plans.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setSelectedPlan(i)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedPlan === i ? "bg-emerald-950/30 border-emerald-500/40" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{p.name}</h3>
                    {p.popular && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Popular</span>
                    )}
                  </div>
                  <div className="text-right">
                    {hasCoupon ? (
                      <>
                        <p className="font-bold text-lg text-emerald-400">₩{Math.round(p.price * 0.8).toLocaleString()}</p>
                        <p className="text-xs text-zinc-600 line-through">{p.priceLabel}</p>
                      </>
                    ) : (
                      <p className="font-bold text-lg">{p.priceLabel}</p>
                    )}
                    <p className="text-xs text-zinc-500">/{p.period}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.features.map((f) => (
                    <span key={f} className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div className="px-6">
            <button onClick={() => setStep("payment")} className="w-full py-3 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors">
              Get {plan.name} — ₩{finalPrice.toLocaleString()}
            </button>
          </div>
        </>
      )}

      {step === "payment" && (
        <div className="px-6">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6">
            <h2 className="font-semibold mb-4">Payment details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Card number</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">CVC</label>
                  <input type="text" placeholder="000" className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-sm" />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">{plan.name}</span>
                <span>{plan.priceLabel}</span>
              </div>
              {hasCoupon && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-emerald-400">🎟 NOMAD20 discount</span>
                  <span className="text-emerald-400">-₩{(plan.price - finalPrice).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-zinc-800">
                <span>Total</span>
                <span className="text-emerald-400">₩{finalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setStep("complete")} className="w-full py-3 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors mb-3">
            Pay ₩{finalPrice.toLocaleString()}
          </button>
          <button onClick={() => setStep("select")} className="w-full py-3 rounded-full border border-zinc-700 text-zinc-400 text-sm">
            Back
          </button>
          <p className="text-[10px] text-zinc-600 text-center mt-3">* Demo mockup. No real payment is processed.</p>
        </div>
      )}

      {step === "complete" && (
        <div className="px-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-zinc-900 border border-emerald-800/30 text-center mb-6">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold mb-1">Pass activated!</h2>
            <p className="text-emerald-400 font-semibold">{plan.name} · ₩{finalPrice.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 mt-1">Valid for {plan.period}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-6">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Partner revenue share</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-400">💼 F22 Coworking</span>
                <span>₩{plan.split.f22.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-400">🏋️ Fitness Partner</span>
                <span>₩{plan.split.fitness.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-400">🍜 Local restaurants</span>
                <span>₩{plan.split.local.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
                <span className="text-cyan-400">🔄 Nomad Loop</span>
                <span>₩{plan.split.platform.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 mt-3">* Revenue is shared with local partners</p>
          </div>

          <button onClick={() => setStep("active")} className="w-full py-3 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors">
            View Pass QR
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
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex justify-center py-4">
                <div className="bg-white p-3 rounded-xl">
                  <QRCodeSVG value={qrValue} size={180} level="M" bgColor="#ffffff" fgColor="#000000" />
                </div>
              </div>
              <p className="text-center text-sm text-zinc-400 mt-3">Scan QR at any partner spot to check in</p>
            </div>
          </div>

          <div className="px-6 mb-4">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quick Check-in</h2>
            <div className="flex gap-2">
              {[
                { spot: "F22 Coworking", type: "Work", emoji: "💼" },
                { spot: "Fitness Partner", type: "Play", emoji: "🏋️" },
                { spot: "Gwangalli Eats", type: "Play", emoji: "🍜" },
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

          <div className="px-6 mt-6">
            <button onClick={() => setStep("select")} className="w-full py-3 rounded-full border border-zinc-700 text-zinc-400 text-sm">
              Change plan
            </button>
          </div>
        </>
      )}
    </div>
  );
}
