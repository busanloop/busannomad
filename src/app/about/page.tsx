export default function AboutPage() {
  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">About Nomad Loop</h1>
      <p className="text-sm text-zinc-500 mb-8">
        How we built a city-wide Learn · Work · Play platform for digital nomads
      </p>

      {/* Why Busan */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
          Why Busan
        </h2>
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          <p>
            Most people who live by the ocean in Busan have never really <em>seen</em> it.
            It&apos;s always there — so close it becomes invisible.
          </p>
          <p>
            Nomads have a similar problem. We can work from anywhere, but we never stop.
            Always connected, always on — yet somehow disconnected from ourselves.
          </p>
          <p>
            Busan taught me how to stop.
          </p>
          <p className="text-zinc-400">
            The silence at Beomeosa temple before the city wakes up. Walking the Geumjeongsan ridge
            with no destination. Sitting in a hot spring after a long run along Oncheoncheon, feeling
            nothing but warm water and cold air. And the people you meet on those paths — not at a
            conference, not on a screen, but on a trail, at a pojangmacha, watching the bridge lights
            come on over Gwangalli.
          </p>
          <p>
            <strong className="text-white">Play is not entertainment. It&apos;s reconnecting with yourself.</strong>
          </p>
          <p className="text-zinc-400">
            Not the loop of commute and routine, but a day that wakes up all five senses —
            a morning run by the stream, recovery in a hot spring, deep work at a quiet cafe,
            and a walk home along the coast as the sun sets.
          </p>
          <p>
            That&apos;s what we&apos;re building. <strong className="text-emerald-400">Learn · Work · Play.</strong>
          </p>
        </div>
      </section>

      {/* LWP Identity */}
      <section className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-purple-950/20 to-blue-950/20 border border-purple-900/20">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
          Learn · Work · Play — The city is the campus
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed mb-3">
          Aligned with Busan&apos;s smart city LWP vision. Not one building — <strong className="text-white">the entire city of Busan becomes a nomad campus</strong>.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="p-3 rounded-lg bg-purple-500/10 text-center">
            <p className="text-lg font-bold text-purple-400">Learn</p>
            <p className="text-[10px] text-zinc-500">Local community<br/>Nomad networking</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-center">
            <p className="text-lg font-bold text-blue-400">Work</p>
            <p className="text-[10px] text-zinc-500">F22 Coworking<br/>Dongnae cafes</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
            <p className="text-lg font-bold text-emerald-400">Play</p>
            <p className="text-[10px] text-zinc-500">Oncheoncheon runs<br/>Hot springs · Hikes</p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          Inspired by global nomad residencies (FLOW, Network School) — implemented at city scale, not building scale.
        </p>
      </section>

      {/* Racing Tech */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
          Drift Racing Engine
        </h2>
        <p className="text-sm text-zinc-400 mb-4">
          We built a browser-based arcade drift racing game from scratch using Three.js.
          The physics model uses a 3-factor drift system: increased yaw rate, reduced lateral grip, and forward assist during drift.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-800">
                <th className="pb-2">Parameter</th>
                <th className="pb-2">Value</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {[
                ["Forward Accel", "1950 cm/s²"],
                ["Drag Factor", "0.735"],
                ["Grip Brake", "1800"],
                ["Drift Escape Force", "2350"],
                ["Drift Max Gauge", "3970"],
                ["Boost Factor", "1.5×"],
                ["Boost Duration", "2900ms"],
              ].map(([param, val]) => (
                <tr key={param} className="border-b border-zinc-800/50">
                  <td className="py-2 text-zinc-400">{param}</td>
                  <td className="py-2 font-mono text-cyan-400">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* API Integrations */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
          API Integrations
        </h2>
        <div className="space-y-3">
          {[
            { name: "MyRealTrip", desc: "Tour tickets (279) + accommodation (1,942) search with tracked partner links for revenue", color: "text-rose-400" },
            { name: "API Fuse × KakaoMap", desc: "Real-time local restaurant/cafe search in Gwangalli via server-side gateway", color: "text-amber-400" },
            { name: "Three.js", desc: "Custom drift racing engine with ghost replay, coin collection, and mobile touch controls", color: "text-cyan-400" },
          ].map((api) => (
            <div key={api.name} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className={`font-semibold text-sm ${api.color}`}>{api.name}</span>
              <p className="text-xs text-zinc-400 mt-1">{api.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Go-to-Market */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">
          Go-to-Market
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Market entry</h4>
            <ul className="text-xs text-zinc-400 space-y-1.5">
              <li>• F22 Coworking (300sqm, Busan) — <strong className="text-white">operating now</strong></li>
              <li>• Partner with public workation programs (Busan city budget ₩74.4M/year)</li>
              <li>• Onboard local stays, restaurants & fitness that want nomad traffic</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">Revenue</h4>
            <ul className="text-xs text-zinc-400 space-y-1.5">
              <li>• <strong className="text-white">MyRealTrip partner links</strong> — tour/stay bookings earn commission (live now)</li>
              <li>• <strong className="text-white">Pass revenue share</strong> — split with coworking, fitness & restaurant partners</li>
              <li>• <strong className="text-white">Public workation contracts</strong> — ₩74.4M annual city budget</li>
            </ul>
          </div>
        </div>
      </section>

      {/* F22 */}
      <section className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 to-zinc-900 border border-blue-900/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🏢</span>
          <h2 className="font-semibold">F22 Coworking — Operating now</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2 rounded-lg bg-zinc-900/50 text-center">
            <p className="text-sm font-bold text-blue-400">300sqm</p>
            <p className="text-[10px] text-zinc-500">Lounge & meeting rooms</p>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/50 text-center">
            <p className="text-sm font-bold text-blue-400">24/7</p>
            <p className="text-[10px] text-zinc-500">Open hours</p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-3">Gwangalli, Busan · f22.co.kr</p>
      </section>
    </div>
  );
}
