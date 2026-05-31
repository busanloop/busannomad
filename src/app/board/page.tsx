"use client";

const nomads = [
  {
    name: "Alex K.",
    from: "Berlin",
    role: "Frontend Developer",
    staying: "Busan · 2 weeks",
    interests: ["coworking", "surfing", "coffee"],
    avatar: "AK",
  },
  {
    name: "Yuki T.",
    from: "Fukuoka",
    role: "UX Designer",
    staying: "Busan · 3 days",
    interests: ["running", "photography", "local eats"],
    avatar: "YT",
  },
  {
    name: "Hyunseung K.",
    from: "Busan",
    role: "Builder / F22 Host",
    staying: "Busan · Local",
    interests: ["coworking", "digital nomads", "community"],
    avatar: "HK",
  },
  {
    name: "Sarah L.",
    from: "Singapore",
    role: "Product Manager",
    staying: "Busan · 1 week",
    interests: ["yoga", "beach", "networking"],
    avatar: "SL",
  },
  {
    name: "Taro M.",
    from: "Tokyo",
    role: "Data Engineer",
    staying: "Busan · 5 days",
    interests: ["fitness", "ramen", "meetups"],
    avatar: "TM",
  },
];

const avatarColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
];

export default function BoardPage() {
  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">Nomad Board</h1>
        <p className="text-sm text-zinc-500">
          Nomads in the same city right now
        </p>
      </div>

      {/* City toggle */}
      <div className="flex gap-2 px-6 mb-4">
        <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-white text-black">
          Busan
        </button>
        <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-zinc-800 text-zinc-400 hover:bg-zinc-700">
          Fukuoka
        </button>
      </div>

      {/* Online count */}
      <div className="mx-6 mb-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">
            {nomads.length} nomads are in Busan right now
          </span>
        </div>
      </div>

      {/* Nomad list */}
      <div className="px-6 space-y-3 pb-6">
        {nomads.map((nomad, i) => (
          <div
            key={nomad.name}
            className="p-4 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-sm font-bold text-white shrink-0`}
              >
                {nomad.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{nomad.name}</h3>
                  <span className="text-xs text-zinc-500">{nomad.staying}</span>
                </div>
                <p className="text-sm text-zinc-400">{nomad.role}</p>
                <p className="text-xs text-zinc-500 mb-2">from {nomad.from}</p>
                <div className="flex flex-wrap gap-1.5">
                  {nomad.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400"
                    >
                      {interest}
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
