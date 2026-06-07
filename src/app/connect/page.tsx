"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BUSAN_STATIONS, STATION_BY_CODE } from "@/data/busan-stations";
import {
  getDeviceHandle,
  getDeviceId,
  getDisplayName,
  setDisplayName,
} from "@/lib/storage";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  addDays,
  busanToday,
  DEFAULT_STAY_DAYS,
  daysUntil,
  formatStayDate,
  MAX_STAY_DAYS,
  STAY_TIER_BADGE,
  STAY_TIER_LABELS,
  STAY_TIER_SHORT,
  STAY_TIERS,
  stayTier,
} from "@/lib/stay";
import type { PresenceRow, StationCode, StayTier } from "@/types/presence";

const POLL_MS = 60_000;
const PRESENCE_COLUMNS = "id, display_name, station, staying_until, city, updated_at";

const DEMO_PRESENCE: PresenceRow[] = [
  {
    id: "demo-1",
    display_name: "Nomad-a1b2",
    station: "gwangan",
    staying_until: addDays(busanToday(), 2),
    city: "busan",
    updated_at: busanToday(),
  },
  {
    id: "demo-2",
    display_name: "Mika",
    station: "seomyeon",
    staying_until: addDays(busanToday(), 9),
    city: "busan",
    updated_at: busanToday(),
  },
  {
    id: "demo-3",
    display_name: "Nomad-7c3d",
    station: "bifc",
    staying_until: addDays(busanToday(), 25),
    city: "busan",
    updated_at: busanToday(),
  },
];

const SESSIONS = [
  {
    id: "jun10",
    when: "Wed Jun 10 · 19:00",
    stationCode: "bifc",
    stationLabel: "BIFC · Munhyeon (f22)",
    host: "Gray",
    topic: "Building a nomad service in Busan",
    note: "First meetup — everyone shares one thing they're good at",
  },
];

export default function ConnectPage() {
  const [rows, setRows] = useState<PresenceRow[]>([]);
  const [myStation, setMyStation] = useState<StationCode | null>(null);
  const [name, setName] = useState("");
  const [stayingUntil, setStayingUntil] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [rsvps, setRsvps] = useState<Record<string, number>>({});
  const rsvp = (id: string) =>
    setRsvps((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  const joined = myStation !== null;

  const loadPresence = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return; // demo mode manages rows directly
    const { data, error } = await supabase
      .from("presence_live")
      .select(PRESENCE_COLUMNS)
      .order("staying_until", { ascending: true });
    if (error) {
      setStatus(error.message);
      return;
    }
    setRows((data as PresenceRow[]) ?? []);
  }, []);

  // Initial load + restore saved display name.
  useEffect(() => {
    setName(getDisplayName());
    if (isSupabaseConfigured()) {
      void loadPresence();
    } else {
      setRows(DEMO_PRESENCE);
    }
  }, [loadPresence]);

  // 60s polling (Realtime is off so device_id stays private).
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const timer = setInterval(() => void loadPresence(), POLL_MS);
    return () => clearInterval(timer);
  }, [loadPresence]);

  // Tap a station = check in (or move your pin there).
  async function checkIn(station: StationCode) {
    if (busy) return;
    setBusy(true);
    setStatus("");

    const trimmed = name.trim();
    if (trimmed) setDisplayName(trimmed);

    const deviceId = getDeviceId();
    const displayName = trimmed || getDeviceHandle();

    let staying = stayingUntil;
    if (!staying) {
      staying = addDays(busanToday(), DEFAULT_STAY_DAYS);
    } else {
      const days = daysUntil(staying);
      if (days < 0) {
        setStatus("That date is in the past.");
        setBusy(false);
        return;
      }
      if (days > MAX_STAY_DAYS) {
        setStatus(`Last day can be at most ${MAX_STAY_DAYS} days from today.`);
        setBusy(false);
        return;
      }
    }

    const supabase = getSupabase();
    if (!supabase) {
      const selfRow: PresenceRow = {
        id: `self-${deviceId}`,
        display_name: displayName,
        station,
        staying_until: staying,
        city: "busan",
        updated_at: busanToday(),
      };
      setRows((prev) => [selfRow, ...prev.filter((r) => r.id !== selfRow.id)]);
      setMyStation(station);
      setStatus("Saved locally — connect Supabase to share with others.");
      setBusy(false);
      return;
    }

    const { error } = await supabase.rpc("upsert_presence", {
      p_device_id: deviceId,
      p_display_name: displayName,
      p_station: station,
      p_staying_until: staying,
      p_city: "busan",
    });
    if (error) {
      setStatus(error.message);
      setBusy(false);
      return;
    }
    setMyStation(station);
    setStatus(`Checked in at ${STATION_BY_CODE[station].nameEn}.`);
    await loadPresence();
    setBusy(false);
  }

  // Save optional name / last-day edits to the existing pin.
  async function saveDetails() {
    if (myStation) await checkIn(myStation);
    setShowOptional(false);
  }

  async function leave() {
    if (busy) return;
    setBusy(true);
    const deviceId = getDeviceId();
    const supabase = getSupabase();

    if (!supabase) {
      setRows((prev) => prev.filter((r) => r.id !== `self-${deviceId}`));
      setMyStation(null);
      setStatus("You left the list.");
      setBusy(false);
      return;
    }

    const { error } = await supabase.rpc("leave_presence", {
      p_device_id: deviceId,
    });
    if (error) {
      setStatus(error.message);
      setBusy(false);
      return;
    }
    setMyStation(null);
    setStatus("You left the list.");
    await loadPresence();
    setBusy(false);
  }

  // Per-station counts with tier breakdown (station order preserved).
  const stationStats = useMemo(() => {
    const counts = new Map<
      StationCode,
      { total: number } & Record<StayTier, number>
    >();
    for (const row of rows) {
      const tier = stayTier(row.staying_until);
      const cur =
        counts.get(row.station) ??
        ({ total: 0, short: 0, week: 0, long: 0 } as {
          total: number;
        } & Record<StayTier, number>);
      cur.total += 1;
      cur[tier] += 1;
      counts.set(row.station, cur);
    }
    return BUSAN_STATIONS.map((s) => ({ station: s, stats: counts.get(s.code) })).filter(
      (x) => x.stats && x.stats.total > 0,
    );
  }, [rows]);

  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) => a.staying_until.localeCompare(b.staying_until)),
    [rows],
  );

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">I&apos;m in Busan now</h1>
        <p className="text-sm text-zinc-500">
          Tap your station so visiting nomads know you&apos;re around. Anonymous,
          no login.
        </p>
      </div>

      {/* Station tap grid — one tap = checked in */}
      <div className="px-6 grid grid-cols-2 gap-2">
        {BUSAN_STATIONS.map((s) => {
          const active = myStation === s.code;
          return (
            <button
              key={s.code}
              type="button"
              onClick={() => void checkIn(s.code)}
              disabled={busy}
              className={`rounded-xl border px-4 py-3 text-left transition-colors disabled:opacity-60 ${
                active
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-600"
              }`}
            >
              <span className="block text-sm font-semibold">
                {active ? "✓ " : ""}
                {s.nameEn}
              </span>
              <span className="block text-[11px] text-zinc-500">
                Line {s.lines.join("·")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Checked-in state + optional details */}
      <div className="px-6 mt-3">
        {myStation && (
          <div className="flex items-center justify-between rounded-xl bg-emerald-950/30 border border-emerald-900/30 px-4 py-3">
            <span className="text-sm text-emerald-400 font-medium">
              ✓ Checked in at {STATION_BY_CODE[myStation].nameEn}
            </span>
            <button
              type="button"
              onClick={() => void leave()}
              disabled={busy}
              className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-zinc-300 hover:border-white/30 disabled:opacity-60"
            >
              Leave
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowOptional((v) => !v)}
          className="mt-2 text-xs text-zinc-500 hover:text-zinc-300"
        >
          {showOptional ? "▾" : "▸"} Add your name &amp; how long you&apos;re
          staying (optional)
        </button>

        {showOptional && (
          <div className="mt-2 space-y-3 rounded-xl bg-zinc-900 border border-zinc-800 p-4">
            <div>
              <label className="block text-xs text-zinc-500">Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Leave blank for an anonymous handle"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/30 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500">Here until</label>
              <input
                type="date"
                value={stayingUntil}
                min={busanToday()}
                max={addDays(busanToday(), MAX_STAY_DAYS)}
                onChange={(e) => setStayingUntil(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/30 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
              <p className="mt-1 text-[11px] text-zinc-600">
                Blank = {DEFAULT_STAY_DAYS} days from today.
              </p>
            </div>
            {joined && (
              <button
                type="button"
                onClick={() => void saveDetails()}
                disabled={busy}
                className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
              >
                Save
              </button>
            )}
          </div>
        )}

        {status && <p className="mt-2 text-xs text-zinc-500">{status}</p>}
      </div>

      {SESSIONS.length > 0 && (
        <div className="px-6 mt-6">
          <h2 className="text-sm font-semibold text-zinc-300 mb-2">Today&apos;s sessions</h2>
          <p className="text-xs text-zinc-500 mb-3">
            Someone shares one thing they&apos;re good at. Tap join to say you&apos;ll come.
          </p>
          <ul className="space-y-2">
            {SESSIONS.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-emerald-400 font-medium">{s.when}</p>
                    <p className="font-medium text-zinc-100 mt-0.5">{s.topic}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {s.stationLabel} · hosted by {s.host}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{s.note}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <button
                      onClick={() => rsvp(s.id)}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-zinc-300 hover:border-white/30"
                    >
                      Join 👋
                    </button>
                    {(rsvps[s.id] ?? 0) > 0 && (
                      <p className="text-[11px] text-zinc-500 mt-1">
                        {rsvps[s.id]} going
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Who's here now */}
      <div className="px-6 mt-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-2">
          Who&apos;s here now
        </h2>

        {stationStats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {stationStats.map(({ station: s, stats }) => {
              const parts = STAY_TIERS.filter((t) => stats![t] > 0).map(
                (t) => `${STAY_TIER_SHORT[t]} ${stats![t]}`,
              );
              return (
                <span
                  key={s.code}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200"
                >
                  <strong>{s.nameEn}</strong> {stats!.total}
                  {parts.length > 0 && (
                    <span className="text-zinc-500"> ({parts.join(" · ")})</span>
                  )}
                </span>
              );
            })}
          </div>
        )}

        <ul className="space-y-2 pb-6">
          {sortedRows.map((row) => {
            const tier = stayTier(row.staying_until);
            return (
              <li
                key={row.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
              >
                <div className="min-w-0">
                  <span className="font-medium text-sm">{row.display_name}</span>
                  <span className="ml-2 text-xs text-zinc-500">
                    {STATION_BY_CODE[row.station]?.nameEn ?? row.station}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-zinc-500">
                    until {formatStayDate(row.staying_until)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STAY_TIER_BADGE[tier]}`}
                  >
                    {STAY_TIER_LABELS[tier]}
                  </span>
                </div>
              </li>
            );
          })}
          {sortedRows.length === 0 && (
            <li className="py-8 text-center text-sm text-zinc-600">
              <p>No one&apos;s here right now.</p>
              <p className="mt-1 text-xs">Connect goes live this July with our first nomads — be one of the first to drop a pin.</p>
            </li>
          )}
        </ul>

        {!isSupabaseConfigured() && (
          <p className="text-xs text-zinc-600">
            Demo mode — connect Supabase to see real nomads. List refreshes every
            60s when live.
          </p>
        )}

        <p className="mt-4 pb-6 text-xs text-zinc-400">
          Questions or want to host a meetup?{" "}
          <a
            href="mailto:busannomads@gmail.com"
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
          >
            busannomads@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
