export type StationCode =
  | "seomyeon"
  | "haeundae"
  | "gwangan"
  | "bifc"
  | "nampo";

/** Stay length bucket derived from staying_until vs Busan-today. */
export type StayTier = "short" | "week" | "long";

/** A row from the `presence_live` Supabase view (device_id is never exposed). */
export interface PresenceRow {
  /** Presence row UUID (not the device id). */
  id: string;
  display_name: string;
  station: StationCode;
  /** ISO date (YYYY-MM-DD) — last day in Busan. */
  staying_until: string;
  city: string;
  updated_at: string;
}
