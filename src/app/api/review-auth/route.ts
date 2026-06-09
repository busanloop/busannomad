import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const COOKIE = "rb_code";

export async function POST(req: NextRequest) {
  const code = process.env.REVIEW_ACCESS_CODE;
  if (!code) {
    return NextResponse.json(
      { ok: false, error: "REVIEW_ACCESS_CODE not configured" },
      { status: 500 },
    );
  }

  let input = "";
  try {
    ({ code: input } = await req.json());
  } catch {
    // ignore malformed body → treated as wrong code
  }

  if (input !== code) {
    return NextResponse.json({ ok: false, error: "invalid code" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30일
  });
  return res;
}
