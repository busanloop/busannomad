import type { StationCode } from "@/types/presence";

export interface BusanStation {
  code: StationCode;
  /** Tap-button / list label (English UI). */
  nameEn: string;
  nameKo: string;
  /** Busan Metro line number(s). */
  lines: number[];
  lat: number;
  lng: number;
}

/**
 * The five Busan Metro hubs offered in Connect.
 * Coordinates verified against Humetro / Wikidata official data.
 */
export const BUSAN_STATIONS: BusanStation[] = [
  {
    code: "seomyeon",
    nameEn: "Seomyeon",
    nameKo: "서면",
    lines: [1, 2],
    lat: 35.15778,
    lng: 129.05917,
  },
  {
    code: "haeundae",
    nameEn: "Haeundae",
    nameKo: "해운대",
    lines: [2],
    lat: 35.1637,
    lng: 129.1589,
  },
  {
    code: "gwangan",
    nameEn: "Gwangan",
    nameKo: "광안",
    lines: [2],
    lat: 35.15792,
    lng: 129.11317,
  },
  {
    code: "bifc",
    nameEn: "BIFC·Munhyeon",
    nameKo: "국제금융센터·부산은행",
    lines: [2],
    lat: 35.1457,
    lng: 129.0667,
  },
  {
    code: "nampo",
    nameEn: "Nampo",
    nameKo: "남포",
    lines: [1],
    lat: 35.097883,
    lng: 129.034663,
  },
];

export const STATION_BY_CODE: Record<StationCode, BusanStation> =
  Object.fromEntries(BUSAN_STATIONS.map((s) => [s.code, s])) as Record<
    StationCode,
    BusanStation
  >;
