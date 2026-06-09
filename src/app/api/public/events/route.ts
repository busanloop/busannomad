// src/app/api/public/events/route.ts
// 공개 읽기 전용 — 코드 게이트 없음 (노마드는 익명).
// published_to_nomads=true + cat=events + 다가오는 행사만, 그리고 외부 노출용 필드만 반환.
// (attendees / article 상태 / 내부 메모성 필드는 절대 내보내지 않음)

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { TABLE, type Row } from "@/lib/review-types";

export const runtime = "nodejs";

export type PublicEvent = {
  id: string;
  title: string;
  date: string;
  loc: string;
  note: string;
  image: string;
  src: string;
};

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ ok: true, events: [] });

  // KST 기준 오늘 (다가오는 행사만)
  const todayKST = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

  const { data, error } = await sb
    .from(TABLE)
    .select("id,title,date,loc,note,image,src,cat,published_to_nomads")
    .eq("cat", "events")
    .eq("published_to_nomads", true)
    .gte("date", todayKST)
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const events: PublicEvent[] = (data as Row[]).map((r) => ({
    id: r.id,
    title: r.title,
    date: r.date,
    loc: r.loc ?? "",
    note: r.note ?? "",
    image: r.image ?? "",
    src: r.src ?? "",
  }));

  return NextResponse.json({ ok: true, events });
}
