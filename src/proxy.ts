import { NextRequest, NextResponse } from "next/server";

// 공유 액세스 코드 게이트 (Next 16: middleware → proxy).
// /review UI, /api/fetch-meta, /api/review/* 를 REVIEW_ACCESS_CODE 로 보호.
// 코드가 설정돼 있지 않으면 fail-closed.

const COOKIE = "rb_code";

export function proxy(req: NextRequest) {
  const code = process.env.REVIEW_ACCESS_CODE;
  const { pathname } = req.nextUrl;

  // 코드 입력 페이지와 인증 엔드포인트는 게이트에서 제외
  if (pathname === "/review/gate" || pathname === "/api/review-auth") {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  const authed = Boolean(code) && cookie === code;
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { ok: false, error: code ? "unauthorized" : "REVIEW_ACCESS_CODE not configured" },
      { status: 401 },
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/review/gate";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/review/:path*", "/api/fetch-meta", "/api/review/:path*"],
};
