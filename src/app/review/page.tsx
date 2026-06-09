"use client";

import { useEffect, useMemo, useState } from "react";
import {
  listEntries,
  createEntry,
  updateEntry,
  type Entry,
  type Cat,
  type ArticleStatus,
  type NewEntry,
} from "@/lib/review-store";
import { fetchMeta } from "@/lib/fetch-meta";

const CAT: Record<Cat, { label: string; color: string; rate: boolean }> = {
  events: { label: "Events", color: "#E8714C", rate: false },
  fnb: { label: "F&B", color: "#D6A53A", rate: true },
  thoughts: { label: "Thoughts", color: "#5FA8BE", rate: false },
};
const STATUS: Record<ArticleStatus, { label: string; color: string }> = {
  none: { label: "기사 미작성", color: "#E2603F" },
  draft: { label: "초안", color: "#D6A53A" },
  published: { label: "발행", color: "#5FB07A" },
};
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_KR = ["일", "월", "화", "수", "목", "금", "토"];
const serif = '"Fraunces","Newsreader",Georgia,serif';

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

type Filter = "all" | Cat | "pending";

export default function ReviewPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"cal" | "list">("cal");
  const [filter, setFilter] = useState<Filter>("all");
  const today = useMemo(() => new Date(), []);
  const [cur, setCur] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [selected, setSelected] = useState<Entry | null>(null);
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [prefill, setPrefill] = useState<Partial<Entry> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    listEntries()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return entries;
    if (filter === "pending") return entries.filter((e) => e.cat === "events" && e.article === "none");
    return entries.filter((e) => e.cat === filter);
  }, [entries, filter]);

  const pendingCount = useMemo(
    () => entries.filter((e) => e.cat === "events" && e.article === "none").length,
    [entries],
  );

  function closeModal() {
    setModal(null);
    setPrefill(null);
    setEditId(null);
  }

  async function handleSave(form: NewEntry) {
    if (editId) {
      const upd = await updateEntry(editId, form);
      setEntries((prev) => prev.map((e) => (e.id === editId ? upd : e)));
      setSelected(upd);
    } else {
      const created = await createEntry(form);
      setEntries((prev) => [created, ...prev]);
    }
    closeModal();
  }

  async function handleMarkDraft(id: string) {
    const upd = await updateEntry(id, { article: "draft" });
    setEntries((prev) => prev.map((e) => (e.id === id ? upd : e)));
    setSelected(upd);
  }

  function openNew(dateStr?: string) {
    setPrefill({ cat: "events", date: dateStr || ymd(today) });
    setEditId(null);
    setModal("new");
  }

  function openEdit(entry: Entry) {
    setSelected(null);
    setPrefill(entry);
    setEditId(entry.id);
    setModal("edit");
  }

  function setFilterAndMaybeList(f: Filter) {
    setFilter(f);
    if (f === "pending") setView("list");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-10 pb-10">
      {/* Masthead */}
      <header>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 style={{ fontFamily: serif }} className="text-4xl sm:text-5xl font-medium tracking-tight leading-none">
              Review Board
            </h1>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
              SouthBridge · Events · F&amp;B · Thoughts
            </p>
          </div>
          <button
            onClick={() => openNew()}
            className="rounded-sm bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-900 transition hover:opacity-80"
          >
            + Entry
          </button>
        </div>
        <div className="mt-7 h-0.5 bg-white" />
        <div className="mt-[3px] h-px bg-white" />
      </header>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(["all", "events", "fnb", "thoughts"] as const).map((c) => {
            const active = filter === c;
            const color = c === "all" ? "#e5e7eb" : CAT[c].color;
            return (
              <button
                key={c}
                onClick={() => setFilterAndMaybeList(c)}
                style={active ? { background: "#fff", color: "#18181b", borderColor: "#fff" } : { color }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: active ? "#18181b" : color }} />
                {c === "all" ? "All" : CAT[c].label}
              </button>
            );
          })}
          <button
            onClick={() => setFilterAndMaybeList("pending")}
            style={
              filter === "pending"
                ? { background: STATUS.none.color, color: "#fff", borderColor: STATUS.none.color }
                : { color: STATUS.none.color, borderColor: STATUS.none.color }
            }
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition"
          >
            <span className="h-1.5 w-1.5 rotate-45" style={{ background: filter === "pending" ? "#fff" : STATUS.none.color }} />
            기사 미작성 ({pendingCount})
          </button>
        </div>
        <div className="flex overflow-hidden rounded-sm border border-white/20">
          {(["cal", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={view === v ? { background: "#fff", color: "#18181b" } : {}}
              className="px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider transition"
            >
              {v === "cal" ? "Calendar" : "List"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-16 text-center font-mono text-xs uppercase tracking-widest text-white/30">Loading…</p>
      ) : view === "cal" ? (
        <CalendarView
          entries={visible}
          cur={cur}
          today={today}
          onPrev={() => setCur((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))}
          onNext={() => setCur((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))}
          onToday={() => setCur({ y: today.getFullYear(), m: today.getMonth() })}
          onPick={setSelected}
          onEmptyDay={openNew}
        />
      ) : (
        <ListView entries={visible} onPick={setSelected} />
      )}

      {selected && (
        <DetailPanel
          entry={selected}
          onClose={() => setSelected(null)}
          onMarkDraft={handleMarkDraft}
          onEdit={openEdit}
        />
      )}
      {modal && (
        <EntryModal
          prefill={prefill}
          isEdit={modal === "edit"}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ── Calendar ─────────────────────────────────────────────── */
function CalendarView({
  entries,
  cur,
  today,
  onPrev,
  onNext,
  onToday,
  onPick,
  onEmptyDay,
}: {
  entries: Entry[];
  cur: { y: number; m: number };
  today: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onPick: (e: Entry) => void;
  onEmptyDay: (date: string) => void;
}) {
  const first = new Date(cur.y, cur.m, 1).getDay();
  const days = new Date(cur.y, cur.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 style={{ fontFamily: serif }} className="text-2xl font-medium">
          {cur.y}년 {cur.m + 1}월
        </h2>
        <div className="flex items-center gap-1.5">
          <button onClick={onToday} className="h-8 rounded-sm border border-white/15 px-3 font-mono text-[10px] uppercase tracking-wider text-white/50 transition hover:border-white/40 hover:text-white">
            Today
          </button>
          <button onClick={onPrev} className="grid h-8 w-8 place-items-center rounded-sm border border-white/15 transition hover:border-white/40">‹</button>
          <button onClick={onNext} className="grid h-8 w-8 place-items-center rounded-sm border border-white/15 transition hover:border-white/40">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-white/30 border-b border-white/10">
        {WEEK.map((w, i) => (
          <div key={w} className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: i === 0 ? CAT.events.color : "rgba(255,255,255,.35)" }}>
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, idx) => {
          if (d === null) return <div key={`e${idx}`} className="min-h-[112px] border-b border-r border-white/5" />;
          const dateStr = ymd(new Date(cur.y, cur.m, d));
          const dow = new Date(cur.y, cur.m, d).getDay();
          const isToday = dateStr === ymd(today);
          const dayEntries = entries.filter((e) => e.date === dateStr);
          return (
            <div
              key={dateStr}
              onClick={() => onEmptyDay(dateStr)}
              className={`min-h-[112px] cursor-pointer border-b border-r border-white/5 p-2 transition hover:bg-white/[0.04] ${isToday ? "bg-white/[0.06]" : ""}`}
            >
              <span
                className={`font-mono text-xs ${isToday ? "grid h-5 w-5 place-items-center rounded-full bg-white font-medium text-zinc-900" : ""}`}
                style={!isToday && dow === 0 ? { color: CAT.events.color } : { color: isToday ? undefined : "rgba(255,255,255,.55)" }}
              >
                {d}
              </span>
              <div className="mt-1.5 flex flex-col gap-0.5">
                {dayEntries.slice(0, 2).map((e) => {
                  const pending = e.cat === "events" && e.article === "none";
                  return (
                    <button
                      key={e.id}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onPick(e);
                      }}
                      className="flex items-center gap-1.5 text-left text-[12.5px] leading-tight"
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 ${pending ? "rotate-45" : "rounded-full"}`} style={{ background: CAT[e.cat].color }} />
                      <span
                        className="truncate text-white/90"
                        style={pending ? { textDecoration: "underline wavy", textDecorationColor: STATUS.none.color, textUnderlineOffset: 3 } : {}}
                      >
                        {e.title}
                      </span>
                    </button>
                  );
                })}
                {dayEntries.length > 2 && <span className="font-mono text-[10px] text-white/30">+{dayEntries.length - 2} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── List ─────────────────────────────────────────────────── */
function ListView({ entries, onPick }: { entries: Entry[]; onPick: (e: Entry) => void }) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  if (!sorted.length)
    return <p className="mt-20 text-center font-mono text-xs uppercase tracking-widest text-white/30">No entries</p>;
  const monthKey = (s: string) => {
    const d = parseYmd(s);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
  };
  return (
    <section className="mt-8">
      {sorted.map((e, i) => {
        const d = parseYmd(e.date);
        const mk = monthKey(e.date);
        const showMonth = i === 0 || mk !== monthKey(sorted[i - 1].date);
        const c = CAT[e.cat];
        return (
          <div key={e.id}>
            {showMonth && (
              <div className="mt-8 mb-1 border-b border-white/10 pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/30">{mk}</div>
            )}
            <button onClick={() => onPick(e)} className="grid w-full grid-cols-[64px_1fr] gap-5 border-b border-white/5 py-5 text-left transition hover:bg-white/[0.04] sm:grid-cols-[96px_1fr]">
              <div className="font-mono text-[11px] text-white/30">
                <span className="block text-xl text-white/90 sm:text-2xl">{d.getDate()}</span>
                {DOW_KR[d.getDay()]}
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: c.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </span>
                <h3 style={{ fontFamily: serif }} className="mt-1.5 mb-1.5 text-xl font-medium leading-tight">{e.title}</h3>
                {e.loc && <div className="font-mono text-[11px] uppercase tracking-wide text-white/50">{e.loc}</div>}
                <p className="mt-2 max-w-[60ch] whitespace-pre-line text-white/60">{e.note}</p>
                {c.rate && e.rating ? (
                  <div className="mt-2.5 flex gap-1" style={{ color: c.color }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className={`h-2 w-2 rounded-full border ${i <= e.rating! ? "" : "opacity-30"}`} style={{ borderColor: c.color, background: i <= e.rating! ? c.color : "transparent" }} />
                    ))}
                  </div>
                ) : null}
                {e.cat === "events" && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {e.article && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: STATUS[e.article].color, borderColor: STATUS[e.article].color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS[e.article].color }} />
                        {STATUS[e.article].label}
                      </span>
                    )}
                    {e.attendees.length > 0 && (
                      <span className="font-mono text-[10px] uppercase tracking-wide text-white/30">참석 · {e.attendees.join(", ")}</span>
                    )}
                  </div>
                )}
              </div>
            </button>
          </div>
        );
      })}
    </section>
  );
}

/* ── Detail panel ─────────────────────────────────────────── */
function DetailPanel({ entry, onClose, onMarkDraft, onEdit }: { entry: Entry; onClose: () => void; onMarkDraft: (id: string) => void; onEdit: (e: Entry) => void }) {
  const c = CAT[entry.cat];
  const d = parseYmd(entry.date);
  const dateLabel = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${DOW_KR[d.getDay()]})`;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
      <aside className="fixed right-0 top-0 z-50 h-full w-[min(460px,92vw)] overflow-y-auto border-l border-white/15 bg-zinc-950 p-8 shadow-2xl">
        <div className="absolute right-5 top-5 flex items-center gap-3">
          <button onClick={() => onEdit(entry)} className="rounded-sm border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition hover:bg-white/10">편집</button>
          <button onClick={onClose} className="text-2xl leading-none text-white/40 hover:text-white">×</button>
        </div>
        <div className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider" style={{ color: c.color }}>
          <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
          {c.label}
        </div>
        <h2 style={{ fontFamily: serif }} className="mb-3.5 text-3xl font-medium leading-tight">{entry.title}</h2>
        <div className="mb-5 flex flex-col gap-2 border-y border-white/10 py-3.5 font-mono text-xs text-white/60">
          <span><b className="mr-2 inline-block min-w-14 text-white/90 font-medium">Date</b>{dateLabel}</span>
          {entry.loc && <span><b className="mr-2 inline-block min-w-14 text-white/90 font-medium">Place</b>{entry.loc}</span>}
          {entry.cat === "events" && entry.attendees.length > 0 && (
            <span><b className="mr-2 inline-block min-w-14 text-white/90 font-medium">참석</b>{entry.attendees.join(", ")}</span>
          )}
          {entry.cat === "events" && entry.article && (
            <span>
              <b className="mr-2 inline-block min-w-14 text-white/90 font-medium">기사</b>
              <span style={{ color: STATUS[entry.article].color }}>{STATUS[entry.article].label}</span>
            </span>
          )}
          {entry.cat === "events" && entry.publishedToNomads && (
            <span>
              <b className="mr-2 inline-block min-w-14 text-white/90 font-medium">공개</b>
              <span style={{ color: "#5FB07A" }}>부산 노마드에 공개됨</span>
            </span>
          )}
          {c.rate && entry.rating ? (
            <span><b className="mr-2 inline-block min-w-14 text-white/90 font-medium">Rating</b>{"●".repeat(entry.rating)}{"○".repeat(5 - entry.rating)}</span>
          ) : null}
        </div>
        <p className="whitespace-pre-wrap text-lg leading-relaxed text-white/90">{entry.note}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {entry.src && (
            <a href={entry.src} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] tracking-wide text-white/50 underline underline-offset-4">행사 페이지 →</a>
          )}
          {entry.cat === "events" && entry.article === "published" && entry.articleUrl && (
            <a href={entry.articleUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] tracking-wide underline underline-offset-4" style={{ color: STATUS.published.color }}>발행 기사 →</a>
          )}
          {entry.cat === "events" && entry.article === "none" && (
            <button onClick={() => onMarkDraft(entry.id)} className="rounded-sm border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition hover:bg-white/10">기사 작성 시작</button>
          )}
        </div>
      </aside>
    </>
  );
}

/* ── New entry modal ──────────────────────────────────────── */
function EntryModal({ prefill, isEdit = false, onClose, onSave }: { prefill: Partial<Entry> | null; isEdit?: boolean; onClose: () => void; onSave: (e: NewEntry) => void | Promise<void> }) {
  const [cat, setCat] = useState<Cat>(prefill?.cat ?? "events");
  const [url, setUrl] = useState(prefill?.src ?? "");
  const [title, setTitle] = useState(prefill?.title ?? "");
  const [date, setDate] = useState(prefill?.date ?? ymd(new Date()));
  const [loc, setLoc] = useState(prefill?.loc ?? "");
  const [att, setAtt] = useState((prefill?.attendees ?? []).join(", "));
  const [note, setNote] = useState(prefill?.note ?? "");
  const [status, setStatus] = useState<ArticleStatus>(prefill?.article ?? "none");
  const [artUrl, setArtUrl] = useState(prefill?.articleUrl ?? "");
  const [rating, setRating] = useState<string>(prefill?.rating ? String(prefill.rating) : "");
  const [image, setImage] = useState(prefill?.image ?? "");
  const [pubNomads, setPubNomads] = useState(prefill?.publishedToNomads ?? false);
  const [fetching, setFetching] = useState(false);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const input = "w-full rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-[15px] text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none";

  async function doFetch() {
    if (!url.trim()) {
      setMsg("URL을 입력해줘.");
      return;
    }
    setFetching(true);
    setMsg("행사 정보 가져오는 중...");
    try {
      const meta = await fetchMeta(url.trim());
      if (meta.title) setTitle(meta.title);
      if (meta.date) setDate(meta.date);
      if (meta.loc) setLoc(meta.loc);
      if (meta.note) setNote(meta.note);
      if (meta.image) setImage(meta.image);
      setMsg(meta.title ? "채웠어. 확인하고 저장해줘." : "메타가 빈약해. 직접 입력해줘.");
    } catch {
      setMsg("가져오기 실패. 직접 입력해줘.");
    } finally {
      setFetching(false);
    }
  }

  async function submit() {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({
      cat,
      date,
      title: title.trim(),
      loc: loc.trim(),
      note: note.trim(),
      rating: cat === "fnb" && rating ? Math.max(0, Math.min(5, Number(rating))) : null,
      src: cat === "events" ? url.trim() : "",
      image: cat === "events" ? image : "",
      attendees: cat === "events" ? att.split(",").map((s) => s.trim()).filter(Boolean) : [],
      article: cat === "events" ? status : null,
      articleUrl: cat === "events" ? artUrl.trim() : "",
      publishedToNomads: cat === "events" ? pubNomads : false,
    });
    setSaving(false);
  }

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/55 p-6 sm:p-12">
      <div className="relative w-[min(580px,100%)] rounded-md border border-white/15 bg-zinc-950 p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-5 text-2xl leading-none text-white/40 hover:text-white">×</button>
        <h3 style={{ fontFamily: serif }} className="text-2xl font-medium">{isEdit ? "기록 편집" : "새 기록"}</h3>
        <p className="mb-6 mt-1 font-mono text-[11px] text-white/50">{isEdit ? "내용을 고치고 저장하면 바로 반영된다." : "참석한 행사를 남겨두면 나중에 기사 쓸 때 헷갈리지 않는다."}</p>

        <Field label="Category">
          <div className="flex gap-2">
            {(Object.keys(CAT) as Cat[]).map((k) => (
              <button
                key={k}
                onClick={() => setCat(k)}
                style={cat === k ? { background: CAT[k].color, borderColor: CAT[k].color, color: "#18181b" } : {}}
                className="flex-1 rounded-md border border-white/15 bg-white/5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-white/60 transition"
              >
                {CAT[k].label}
              </button>
            ))}
          </div>
        </Field>

        {cat === "events" && (
          <Field label="행사 URL">
            <div className="flex gap-2">
              <input className={input} placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doFetch()} />
              <button onClick={doFetch} disabled={fetching} className="shrink-0 rounded-md border border-white/20 px-4 font-mono text-[11px] uppercase tracking-wider transition hover:bg-white/10 disabled:opacity-50">
                {fetching ? "..." : "가져오기"}
              </button>
            </div>
            {msg && <p className="mt-1.5 font-mono text-[11px] text-white/40">{msg}</p>}
          </Field>
        )}

        <Field label="Title">
          <input className={input} placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <div className="flex gap-3">
          <Field label="Date" className="flex-1">
            <input type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Place" className="flex-1">
            <input className={input} placeholder="장소 / 주최" value={loc} onChange={(e) => setLoc(e.target.value)} />
          </Field>
        </div>

        {cat === "events" && (
          <>
            <Field label="참석자 (쉼표로 구분)">
              <input className={input} placeholder="그레이, ..." value={att} onChange={(e) => setAtt(e.target.value)} />
            </Field>
          </>
        )}

        <Field label="Note · 기사 메모">
          <textarea className={`${input} min-h-24 resize-y`} placeholder="핵심 포인트, 인용, 만난 사람..." value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>

        {cat === "events" && (
          <>
            <Field label="기사 상태">
              <div className="flex gap-2">
                {(Object.keys(STATUS) as ArticleStatus[]).map((k) => (
                  <button key={k} onClick={() => setStatus(k)} style={status === k ? { background: STATUS[k].color, borderColor: STATUS[k].color, color: "#18181b" } : {}} className="flex-1 rounded-md border border-white/15 bg-white/5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-white/60 transition">
                    {STATUS[k].label}
                  </button>
                ))}
              </div>
            </Field>
            {status === "published" && (
              <Field label="발행 기사 링크">
                <input className={input} placeholder="https://..." value={artUrl} onChange={(e) => setArtUrl(e.target.value)} />
              </Field>
            )}
            <button
              type="button"
              onClick={() => setPubNomads((v) => !v)}
              className="mb-4 flex w-full items-center gap-3 rounded-md border border-white/15 bg-white/5 px-3 py-3 text-left transition hover:border-white/30"
            >
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded border text-[11px]"
                style={pubNomads ? { background: "#5FB07A", borderColor: "#5FB07A", color: "#18181b" } : { borderColor: "rgba(255,255,255,.3)" }}
              >
                {pubNomads ? "✓" : ""}
              </span>
              <span>
                <span className="block text-[13px] text-white/90">부산 노마드에 공개</span>
                <span className="block font-mono text-[10px] text-white/40">BusanNomads Discover에 노출 (다가오는 행사만)</span>
              </span>
            </button>
          </>
        )}

        {cat === "fnb" && (
          <Field label="Rating (0–5)">
            <input type="number" min={0} max={5} className={input} placeholder="0–5" value={rating} onChange={(e) => setRating(e.target.value)} />
          </Field>
        )}

        <div className="mt-6 flex justify-end gap-2.5">
          <button onClick={onClose} className="rounded-sm border border-white/20 px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition hover:bg-white/10">취소</button>
          <button onClick={submit} disabled={saving} className="rounded-sm bg-white px-5 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-900 transition hover:opacity-80 disabled:opacity-50">
            {saving ? "..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-white/40">{label}</label>
      {children}
    </div>
  );
}
