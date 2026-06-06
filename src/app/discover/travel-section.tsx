"use client";

import { useState, useEffect } from "react";

type TravelItem = {
  gid?: string;
  itemId?: number;
  itemName: string;
  description?: string;
  salePrice: number;
  priceDisplay?: string;
  originalPrice?: number;
  category?: string;
  reviewScore: number | string;
  reviewCount: number;
  imageUrl: string;
  productUrl?: string;
  mylinkUrl?: string;
  tags?: string[];
  starRating?: number;
};

type TabType = "tour" | "accommodation";

const tourCategories = [
  { label: "All", value: "" },
  { label: "Tours", value: "tour" },
  { label: "Activities", value: "activity" },
  { label: "Tickets", value: "ticket" },
  { label: "Cruises", value: "cruise_tour" },
  { label: "Spa", value: "spamassage" },
];

export function TravelSection() {
  const [tab, setTab] = useState<TabType>("tour");
  const [cat, setCat] = useState("");
  const [items, setItems] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasCoupon, setHasCoupon] = useState(false);

  useEffect(() => {
    setHasCoupon(!!localStorage.getItem("nomadloop_coupons"));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ size: "6" });

    if (tab === "accommodation") {
      params.set("action", "accommodation");
    } else {
      params.set("keyword", "부산");
      if (cat) params.set("category", cat);
    }

    fetch(`/api/travel?${params}`)
      .then((res) => res.json())
      .then((json) => {
        setItems(json.data?.items || []);
        setTotal(json.data?.totalCount || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab, cat]);

  const formatPrice = (item: TravelItem) => {
    if (hasCoupon) {
      const discounted = Math.round(item.salePrice * 0.8);
      return "₩" + discounted.toLocaleString() + (tab === "accommodation" ? "/박" : "~");
    }
    if (item.priceDisplay) return item.priceDisplay + "~";
    return "₩" + item.salePrice.toLocaleString() + "/박";
  };

  const originalPrice = (item: TravelItem) => {
    if (!hasCoupon) return null;
    return "₩" + item.salePrice.toLocaleString();
  };

  const getUrl = (item: TravelItem) => {
    if (item.mylinkUrl) return item.mylinkUrl;
    if (item.productUrl) return item.productUrl;
    if (item.itemId) return `https://www.myrealtrip.com/offers/${item.itemId}`;
    return "#";
  };

  return (
    <div>
      {/* Main tabs */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            {tab === "tour" ? "Busan Tours" : "Busan Stays"} · MyRealTrip
          </h2>
          {total > 0 && (
            <p className="text-xs text-zinc-600 mt-0.5">{total.toLocaleString()} tours</p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => { setTab("tour"); setCat(""); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              tab === "tour" ? "bg-rose-500/20 text-rose-400" : "bg-zinc-800 text-zinc-500"
            }`}
          >
            Tours & Tickets
          </button>
          <button
            onClick={() => setTab("accommodation")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              tab === "accommodation" ? "bg-violet-500/20 text-violet-400" : "bg-zinc-800 text-zinc-500"
            }`}
          >
            Stays
          </button>
        </div>
      </div>

      {/* Tour category filter */}
      {tab === "tour" && (
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {tourCategories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                cat === c.value
                  ? "bg-rose-500/20 text-rose-400"
                  : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-8">No results found</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <a
              key={item.gid || item.itemId || idx}
              href={getUrl(item)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-1">
                  <h3 className="font-medium text-sm leading-snug line-clamp-2 flex-1">
                    {item.itemName}
                  </h3>
                  {item.starRating && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 shrink-0">
                      {"★".repeat(item.starRating)}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-zinc-500 mb-1">{item.description}</p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <span className={`text-sm font-bold ${hasCoupon ? "text-emerald-400" : tab === "tour" ? "text-rose-400" : "text-violet-400"}`}>
                      {formatPrice(item)}
                    </span>
                    {originalPrice(item) && (
                      <span className="text-xs text-zinc-600 line-through ml-1.5">
                        {originalPrice(item)}
                      </span>
                    )}
                    {hasCoupon && (
                      <span className="text-[10px] ml-1.5 px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400">-20%</span>
                    )}
                    {!hasCoupon && item.originalPrice && item.originalPrice > item.salePrice && (
                      <span className="text-xs text-zinc-600 line-through ml-1.5">
                        ₩{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.tags?.[0] && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        {item.tags[0]}
                      </span>
                    )}
                    <span className="text-xs text-amber-400">
                      ★ {item.reviewScore} ({item.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <p className="text-[10px] text-zinc-600 mt-3 text-center">
        Powered by MyRealTrip Partner API
      </p>
    </div>
  );
}
