// src/app/api/fetch-meta/route.ts
// 행사 URL → 서버사이드 메타 스크래핑 (OG 태그 + JSON-LD Event 스키마)
// SSRF 가드: 사설/루프백/링크로컬 IP 차단 + 리다이렉트 매 홉 재검증.

import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { EventMeta } from "@/lib/fetch-meta";

export const runtime = "nodejs";

const UA =
  "Mozilla/5.0 (compatible; ReviewBoardBot/1.0; +https://busannomads.com)";
const MAX_HTML = 500_000;
const HOP_TIMEOUT = 8000;
const MAX_HOPS = 4;
const NOTE_MAX = 8000;

// ── SSRF 가드 ────────────────────────────────────────────────────────
function ipBlocked(ip: string): boolean {
  let addr = ip;
  if (isIP(addr) === 6 && addr.toLowerCase().startsWith("::ffff:")) {
    addr = addr.slice(7); // IPv4-mapped IPv6 → 내부 v4 검사
  }
  const ver = isIP(addr);
  if (ver === 4) {
    const p = addr.split(".").map(Number);
    if (p.length !== 4 || p.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true;
    const [a, b] = p;
    if (a === 0) return true; // 0.0.0.0/8
    if (a === 10) return true; // 10/8
    if (a === 127) return true; // loopback
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16/12
    if (a === 192 && b === 168) return true; // 192.168/16
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64/10
    return false;
  }
  if (ver === 6) {
    const l = addr.toLowerCase();
    if (l === "::1" || l === "::") return true; // loopback / unspecified
    if (l.startsWith("fe80")) return true; // link-local
    if (l.startsWith("fc") || l.startsWith("fd")) return true; // ULA fc00::/7
    return false;
  }
  return true; // 해석 불가 → 차단
}

async function assertPublicUrl(raw: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("invalid url");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("protocol not allowed");
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    throw new Error("host not allowed");
  }
  if (isIP(host)) {
    if (ipBlocked(host)) throw new Error("host not allowed");
  } else {
    const records = await lookup(host, { all: true });
    if (!records.length || records.some((r) => ipBlocked(r.address))) {
      throw new Error("host not allowed");
    }
  }
  return u;
}

// 리다이렉트를 수동으로 따라가며 매 홉 호스트 재검증
async function safeFetch(start: URL): Promise<Response> {
  let url = start;
  for (let i = 0; i < MAX_HOPS; i++) {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      redirect: "manual",
      signal: AbortSignal.timeout(HOP_TIMEOUT),
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return res;
      url = await assertPublicUrl(new URL(loc, url).toString());
      continue;
    }
    return res;
  }
  throw new Error("too many redirects");
}

// ── 파싱 ─────────────────────────────────────────────────────────────
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function pickMeta(html: string, key: string): string {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`,
    "i",
  );
  const m = html.match(re) || html.match(re2);
  return m ? decodeEntities(m[1].trim()) : "";
}

function pickTitleTag(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1].trim()) : "";
}

function toYmd(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function parseJsonLd(html: string): Partial<EventMeta> {
  const out: Partial<EventMeta> = {};
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  for (const b of blocks) {
    let data: unknown;
    try {
      data = JSON.parse(b[1].trim());
    } catch {
      continue;
    }
    const root = data as Record<string, unknown>;
    const nodes: Record<string, unknown>[] = Array.isArray(data)
      ? (data as Record<string, unknown>[])
      : Array.isArray(root["@graph"])
        ? (root["@graph"] as Record<string, unknown>[])
        : [root];
    for (const node of nodes) {
      const type = node["@type"];
      const isEvent =
        type === "Event" ||
        (Array.isArray(type) && type.includes("Event")) ||
        (typeof type === "string" && type.toLowerCase().includes("event"));
      if (!isEvent) continue;
      if (node.name) out.title = String(node.name);
      if (node.startDate) out.date = toYmd(String(node.startDate));
      const loc = node.location as
        | string
        | { name?: string; address?: string | { addressLocality?: string } }
        | undefined;
      if (loc) {
        if (typeof loc === "string") out.loc = loc;
        else if (loc.name) out.loc = String(loc.name);
        else if (loc.address)
          out.loc =
            typeof loc.address === "string" ? loc.address : loc.address.addressLocality || "";
      }
      if (node.description) out.note = String(node.description).slice(0, NOTE_MAX);
      return out;
    }
  }
  return out;
}

// ── 본문 설명 추출 (Next.js __NEXT_DATA__ / ProseMirror) ──────────────
// Luma 등 Next.js SSR 사이트는 행사 본문을 __NEXT_DATA__ JSON 에 담는다.
// og:description 은 보통 한두 문장으로 잘려 있으므로, 본문이 더 길면 그쪽을 쓴다.

function extractNextData(html: string): unknown | null {
  const m = html.match(
    /<script\b[^>]*\bid=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i,
  );
  if (!m) return null;
  try {
    return JSON.parse(m[1].trim());
  } catch {
    return null;
  }
}

// ProseMirror 노드 → 텍스트 (단락/리스트/제목 경계에 줄바꿈)
function pmToText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { type?: string; text?: string; content?: unknown[] };
  let out = "";
  if (typeof n.text === "string") out += n.text;
  if (Array.isArray(n.content)) for (const c of n.content) out += pmToText(c);
  if (
    n.type === "paragraph" ||
    n.type === "heading" ||
    n.type === "listItem" ||
    n.type === "list_item" ||
    n.type === "horizontal_rule" ||
    n.type === "hard_break"
  ) {
    out += "\n";
  }
  return out;
}

// __NEXT_DATA__ 안에서 description 류 키를 재귀로 모아 가장 긴 텍스트 반환
function richDescription(html: string): string {
  const data = extractNextData(html);
  if (!data) return "";
  const found: string[] = [];
  const visit = (v: unknown) => {
    if (Array.isArray(v)) {
      v.forEach(visit);
      return;
    }
    if (v && typeof v === "object") {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (/description|about|body/i.test(k)) {
          if (typeof val === "string") found.push(val);
          else if (val && typeof val === "object") {
            const t = pmToText(val).trim();
            if (t) found.push(t);
          }
        }
        visit(val);
      }
    }
  };
  visit(data);
  const cleaned = found
    .map((s) =>
      s
        .replace(/\u200b/g, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
    )
    .filter((s) => s.length > 0);
  cleaned.sort((a, b) => b.length - a.length);
  return (cleaned[0] || "").slice(0, NOTE_MAX);
}

// ── 핸들러 ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 공유 코드 게이트 (미들웨어와 별개로 한 번 더 검사 — defense in depth)
  const accessCode = process.env.REVIEW_ACCESS_CODE;
  if (!accessCode || req.cookies.get("rb_code")?.value !== accessCode) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let raw = "";
  try {
    ({ url: raw } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  let target: URL;
  try {
    target = await assertPublicUrl(raw);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "invalid url";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  try {
    const res = await safeFetch(target);
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `fetch failed: ${res.status}` });
    }
    const html = (await res.text()).slice(0, MAX_HTML);
    const ld = parseJsonLd(html);

    // 본문(긴 설명)이 메타보다 길면 본문을 쓴다
    const body = richDescription(html);
    const metaNote =
      ld.note || pickMeta(html, "og:description") || pickMeta(html, "description") || "";
    const note = (body.length > metaNote.length ? body : metaNote).slice(0, NOTE_MAX);

    const meta: EventMeta = {
      title: ld.title || pickMeta(html, "og:title") || pickTitleTag(html) || "",
      date:
        ld.date ||
        toYmd(pickMeta(html, "article:published_time")) ||
        toYmd(pickMeta(html, "event:start_time")) ||
        "",
      loc: ld.loc || "",
      note,
      image: pickMeta(html, "og:image") || "",
      siteName: pickMeta(html, "og:site_name") || target.hostname,
      sourceUrl: target.toString(),
    };

    return NextResponse.json({ ok: true, meta });
  } catch (err) {
    const msg = err instanceof Error && err.name === "TimeoutError" ? "timeout" : "scrape error";
    return NextResponse.json({ ok: false, error: msg });
  }
}
