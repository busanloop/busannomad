import type { StayTier } from "@/types/presence";

/** Max days ahead a visitor can set as their last day (matches DB cap). */
export const MAX_STAY_DAYS = 90;

/** Default days added when a nomad checks in without picking a last day. */
export const DEFAULT_STAY_DAYS = 2;

/**
 * Today's calendar date in Busan (Asia/Seoul) as YYYY-MM-DD,
 * regardless of the browser's own timezone. Mirrors DB busan_today().
 */
export function busanToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Add n days to a YYYY-MM-DD calendar date, returning YYYY-MM-DD. */
export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function toUtcMs(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Whole days from Busan-today to the given YYYY-MM-DD (can be negative). */
export function daysUntil(dateStr: string): number {
  return Math.round((toUtcMs(dateStr) - toUtcMs(busanToday())) / 86_400_000);
}

/** Non-overlapping buckets: Short ≤3d, Week-ish 4–14d, Long stay 15+d. */
export function stayTier(stayingUntil: string): StayTier {
  const days = daysUntil(stayingUntil);
  if (days <= 3) return "short";
  if (days <= 14) return "week";
  return "long";
}

/** Format a YYYY-MM-DD date as "Jun 6" for display. */
export function formatStayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export const STAY_TIERS: StayTier[] = ["short", "week", "long"];

export const STAY_TIER_LABELS: Record<StayTier, string> = {
  short: "Short stay",
  week: "Week-ish",
  long: "Long stay",
};

/** Compact label for count chips. */
export const STAY_TIER_SHORT: Record<StayTier, string> = {
  short: "Short",
  week: "Week",
  long: "Long",
};

/** Badge styles aligned with the app's zinc/blue/emerald palette. */
export const STAY_TIER_BADGE: Record<StayTier, string> = {
  short: "bg-amber-500/15 text-amber-400",
  week: "bg-blue-500/15 text-blue-400",
  long: "bg-emerald-500/15 text-emerald-400",
};
