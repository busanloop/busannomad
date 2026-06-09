// 순수 모듈 (fetch/supabase 의존 없음) — 클라이언트 store 와 서버 라우트가 공유.

export type Cat = "events" | "fnb" | "thoughts";
export type ArticleStatus = "none" | "draft" | "published";

export type Entry = {
  id: string;
  cat: Cat;
  date: string; // YYYY-MM-DD
  title: string;
  loc: string;
  note: string;
  rating: number | null;
  src: string;
  image: string;
  attendees: string[];
  article: ArticleStatus | null;
  articleUrl: string;
  publishedToNomads: boolean;
};

export type NewEntry = Omit<Entry, "id">;

export const TABLE = "entries";

// Supabase row(snake_case) <-> Entry(camelCase)
export type Row = {
  id: string;
  cat: Cat;
  date: string;
  title: string;
  loc: string | null;
  note: string | null;
  rating: number | null;
  src: string | null;
  image: string | null;
  attendees: string[] | null;
  article: ArticleStatus | null;
  article_url: string | null;
  published_to_nomads: boolean | null;
};

export function rowToEntry(r: Row): Entry {
  return {
    id: r.id,
    cat: r.cat,
    date: r.date,
    title: r.title,
    loc: r.loc ?? "",
    note: r.note ?? "",
    rating: r.rating,
    src: r.src ?? "",
    image: r.image ?? "",
    attendees: r.attendees ?? [],
    article: r.article,
    articleUrl: r.article_url ?? "",
    publishedToNomads: r.published_to_nomads ?? false,
  };
}

export function entryToRow(e: NewEntry): Omit<Row, "id"> {
  return {
    cat: e.cat,
    date: e.date,
    title: e.title,
    loc: e.loc,
    note: e.note,
    rating: e.rating,
    src: e.src,
    image: e.image,
    attendees: e.attendees,
    article: e.article,
    article_url: e.articleUrl,
    published_to_nomads: e.publishedToNomads,
  };
}

// camelCase 패치 → snake_case 컬럼
export const COLMAP: Record<keyof NewEntry, string> = {
  cat: "cat", date: "date", title: "title", loc: "loc", note: "note",
  rating: "rating", src: "src", image: "image", attendees: "attendees",
  article: "article", articleUrl: "article_url", publishedToNomads: "published_to_nomads",
};

// Supabase 미설정 시 서버 in-memory fallback 시드
export const SEED: Entry[] = [
  { id: "s1", cat: "thoughts", date: "2026-06-09", title: "포화의 신호", loc: "", note: "부산 실내테니스 시설이 쉰 곳을 넘겼다.\n다들 같은 걸 판다. 차별화는 코트 수가 아니라 그 다음에 있다.", rating: null, src: "", image: "", attendees: [], article: null, articleUrl: "", publishedToNomads: false },
  { id: "s2", cat: "events", date: "2026-06-08", title: "AI 핀테크 컨퍼런스", loc: "벡스코 · 부산", note: "세션 3개 참관.\n키노트의 규제 샌드박스 확대 얘기가 기사 포인트. 명함 5장 — 후속 정리 필요.", rating: null, src: "https://example.com/ai-fintech-2026", image: "", attendees: ["그레이"], article: "none", articleUrl: "", publishedToNomads: false },
  { id: "s3", cat: "fnb", date: "2026-06-07", title: "광안리, 이름 없는 자리", loc: "광안리", note: "플랫 화이트 한 잔.\n바다는 멀고 소음은 가까웠다. 그래도 다시 올 것 같다.", rating: 4, src: "", image: "", attendees: [], article: null, articleUrl: "", publishedToNomads: false },
  { id: "s4", cat: "events", date: "2026-06-05", title: "BusanNomads 체크인 베타 데모", loc: "BIFC2 22F", note: "다섯 개 역, 익명 체크인.\n장소가 아니라 사람이 보이기 시작했다. 데모 반응 → 기사화.", rating: null, src: "", image: "", attendees: ["그레이"], article: "none", articleUrl: "", publishedToNomads: false },
  { id: "s5", cat: "events", date: "2026-05-28", title: "데스커 파트너십 미팅", loc: "부산역", note: "리모델링 1호 협력 논의.\n초안 작성 중 — 발행 전 팩트 체크 한 번 더.", rating: null, src: "", image: "", attendees: ["그레이"], article: "draft", articleUrl: "", publishedToNomads: false },
  { id: "s6", cat: "events", date: "2026-05-14", title: "베트남 대표단 호찌민", loc: "Ho Chi Minh", note: "8인 공식 대표단, 리드 오거나이저.\n현장 스케치 + 인터뷰 → 발행 완료.", rating: null, src: "", image: "", attendees: ["그레이"], article: "published", articleUrl: "https://busanloop.com/", publishedToNomads: false },
];
