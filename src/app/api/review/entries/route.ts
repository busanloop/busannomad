// src/app/api/review/entries/route.ts
// 코드 게이트가 걸린 entries CRUD. Supabase service role 로만 DB 접근(RLS 우회).
// 미설정(dev) 시 서버 in-memory fallback 으로 동작.

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  TABLE,
  SEED,
  COLMAP,
  rowToEntry,
  entryToRow,
  type Entry,
  type NewEntry,
  type Row,
} from "@/lib/review-types";

export const runtime = "nodejs";

function authed(req: NextRequest): boolean {
  const code = process.env.REVIEW_ACCESS_CODE;
  return Boolean(code) && req.cookies.get("rb_code")?.value === code;
}

// dev fallback (단일 프로세스에서만 세션 동안 유지)
let memory: Entry[] | null = null;
function mem(): Entry[] {
  if (!memory) memory = [...SEED];
  return memory;
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const sb = getSupabaseAdmin();
  if (!sb) {
    const entries = [...mem()].sort((a, b) => b.date.localeCompare(a.date));
    return NextResponse.json({ ok: true, entries, persisted: false });
  }
  const { data, error } = await sb.from(TABLE).select("*").order("date", { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, entries: (data as Row[]).map(rowToEntry), persisted: true });
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  let body: NewEntry;
  try {
    body = (await req.json()) as NewEntry;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (!body?.title?.trim() || !body?.date) {
    return NextResponse.json({ ok: false, error: "title and date required" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    const entry: Entry = { ...body, id: crypto.randomUUID() };
    mem().unshift(entry);
    return NextResponse.json({ ok: true, entry, persisted: false });
  }
  const { data, error } = await sb.from(TABLE).insert(entryToRow(body)).select().single();
  if (error || !data) {
    return NextResponse.json({ ok: false, error: error?.message || "insert failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, entry: rowToEntry(data as Row), persisted: true });
}

export async function PATCH(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  let id = "";
  let patch: Partial<NewEntry> = {};
  try {
    ({ id, patch } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });

  const sb = getSupabaseAdmin();
  if (!sb) {
    const list = mem();
    const i = list.findIndex((x) => x.id === id);
    if (i < 0) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    list[i] = { ...list[i], ...patch };
    return NextResponse.json({ ok: true, entry: list[i], persisted: false });
  }
  const row: Record<string, unknown> = {};
  for (const k of Object.keys(patch) as (keyof NewEntry)[]) {
    if (patch[k] !== undefined) row[COLMAP[k]] = patch[k];
  }
  const { data, error } = await sb.from(TABLE).update(row).eq("id", id).select().single();
  if (error || !data) {
    return NextResponse.json({ ok: false, error: error?.message || "update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, entry: rowToEntry(data as Row), persisted: true });
}
