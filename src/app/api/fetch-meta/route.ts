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
      if (node.description) out.note = String(node.description).slice(0, 400);
      return out;
    }
  }
  return out;
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

    const meta: EventMeta = {
      title: ld.title || pickMeta(html, "og:title") || pickTitleTag(html) || "",
      date:
        ld.date ||
        toYmd(pickMeta(html, "article:published_time")) ||
        toYmd(pickMeta(html, "event:start_time")) ||
        "",
      loc: ld.loc || "",
      note: ld.note || pickMeta(html, "og:description") || pickMeta(html, "description") || "",
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
