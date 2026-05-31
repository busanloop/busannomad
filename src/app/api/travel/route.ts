import { NextRequest, NextResponse } from "next/server";

const MRT_BASE = "https://partner-ext-api.myrealtrip.com";
const MRT_API_KEY = process.env.MRT_API_KEY || "";

const BUSAN_REGION_ID = 21467;

async function mrtPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${MRT_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MRT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

// 마이링크 생성 — 파트너 추적 URL
async function createMyLink(targetUrl: string): Promise<string> {
  try {
    const data = await mrtPost("/v1/mylink", { targetUrl });
    return data.data?.mylink || targetUrl;
  } catch {
    return targetUrl;
  }
}

// 검색 결과의 productUrl을 마이링크로 변환
async function enrichWithMyLinks(items: Array<{ productUrl?: string; [key: string]: unknown }>) {
  const enriched = await Promise.all(
    items.map(async (item) => {
      if (item.productUrl) {
        const mylink = await createMyLink(item.productUrl as string);
        return { ...item, mylinkUrl: mylink };
      }
      return item;
    })
  );
  return enriched;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "search";
  const keyword = searchParams.get("keyword") || "부산";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  const gid = searchParams.get("gid") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  if (!MRT_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    if (action === "categories") {
      const data = await mrtPost("/v1/products/tna/categories", { city: keyword });
      return NextResponse.json(data);
    }

    if (action === "detail" && gid) {
      const data = await mrtPost("/v1/products/tna/detail", { gid });
      return NextResponse.json(data);
    }

    if (action === "accommodation") {
      const ci = checkIn || new Date(Date.now() + 86400000).toISOString().split("T")[0];
      const co = checkOut || new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0];
      const data = await mrtPost("/v1/products/accommodation/search", {
        regionId: BUSAN_REGION_ID,
        checkIn: ci,
        checkOut: co,
        adultCount: 1,
        page: page - 1,
        size,
      });
      if (data.data?.items) {
        data.data.items = await enrichWithMyLinks(data.data.items);
      }
      return NextResponse.json(data);
    }

    // Default: tour search
    const body: Record<string, unknown> = { keyword, page, size };
    if (category) body.category = category;

    const data = await mrtPost("/v1/products/tna/search", body);
    if (data.data?.items) {
      data.data.items = await enrichWithMyLinks(data.data.items);
    }
    return NextResponse.json(data);
  } catch {
    // 폴백: API 실패해도 화면 안 깨지게
    return NextResponse.json({
      data: {
        items: [
          { gid: "f1", itemName: "부산 광안대교 야경 크루즈", description: "부산 · 크루즈", salePrice: 25000, priceDisplay: "25,000원", category: "크루즈", reviewScore: 4.8, reviewCount: 150, imageUrl: "", productUrl: "https://www.myrealtrip.com", tags: ["즉시 확정"] },
          { gid: "f2", itemName: "해운대 서핑 레슨", description: "부산 · 액티비티", salePrice: 45000, priceDisplay: "45,000원", category: "액티비티", reviewScore: 4.6, reviewCount: 89, imageUrl: "", productUrl: "https://www.myrealtrip.com", tags: [] },
          { gid: "f3", itemName: "감천문화마을 워킹 투어", description: "부산 · 투어", salePrice: 15000, priceDisplay: "15,000원", category: "투어", reviewScore: 4.9, reviewCount: 210, imageUrl: "", productUrl: "https://www.myrealtrip.com", tags: ["즉시 확정"] },
        ],
        totalCount: 3,
      },
      meta: { totalCount: 3 },
      result: { status: 200, message: "FALLBACK" },
    });
  }
}
