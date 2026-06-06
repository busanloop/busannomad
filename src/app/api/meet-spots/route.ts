import { NextRequest, NextResponse } from "next/server";

const APIFUSE_KEY = process.env.APIFUSE_API_KEY || "";
const F22_LAT = 35.141046;
const F22_LNG = 129.065214;

const FALLBACK = [
  { name: "김씨네뷰", address: "부산 남구", category: "맛집", lat: 35.1455783, lng: 129.0675416, distance: 0 },
  { name: "전포 카페거리", address: "부산 부산진구 전포동", category: "카페", lat: 35.1553990, lng: 129.0673266, distance: 0 },
  { name: "Pickles 피클스", address: "부산 부산진구 전포동", category: "술집", lat: 35.1550857, lng: 129.0641420, distance: 0 },
  { name: "Your Type Brunch", address: "부산 남구", category: "브런치", lat: 35.1517426, lng: 129.0665745, distance: 0 },
];

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q") || "전포 맛집";

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
