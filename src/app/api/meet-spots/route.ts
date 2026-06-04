import { NextRequest, NextResponse } from "next/server";

const APIFUSE_KEY = process.env.APIFUSE_API_KEY || "";
const F22_LAT = 35.141046;
const F22_LNG = 129.065214;

const FALLBACK = [
  { name: "광안리 해변 맛집거리", address: "부산 수영구 광안해변로", category: "음식점", lat: 35.1535, lng: 129.1195, distance: 0 },
  { name: "민락회센터", address: "부산 수영구 민락동", category: "횟집", lat: 35.1497, lng: 129.1263, distance: 0 },
  { name: "광안리 카페거리", address: "부산 수영구 광안해변로", category: "카페", lat: 35.1540, lng: 129.1200, distance: 0 },
  { name: "수영 전통시장", address: "부산 수영구 수영동", category: "시장", lat: 35.1565, lng: 129.1135, distance: 0 },
];

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q") || "광안리 맛집";

  if (!APIFUSE_KEY) {
    return NextResponse.json({ source: "fallback", items: FALLBACK });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch("https://api.apifuse.com/v1/kakaomap-api/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${APIFUSE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: q, lat: F22_LAT, lng: F22_LNG, radius: 2000, page: 1 }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ source: "fallback", items: FALLBACK });
    }

    const json = await res.json();
    const items = (json.data?.items || []).map((item: Record<string, unknown>) => ({
      name: item.name,
      address: item.address,
      category: item.category,
      lat: item.lat,
      lng: item.lng,
      distance: item.distance,
    }));

    return NextResponse.json({ source: "apifuse", items: items.length > 0 ? items : FALLBACK });
  } catch {
    return NextResponse.json({ source: "fallback", items: FALLBACK });
  }
}
