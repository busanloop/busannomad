export type EventMeta = {
  title: string;
  date: string;
  loc: string;
  note: string;
  image: string;
  siteName: string;
  sourceUrl: string;
};

export async function fetchMeta(url: string): Promise<EventMeta> {
  const r = await fetch("/api/fetch-meta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await r.json();
  if (!data.ok) throw new Error(data.error || "meta fetch failed");
  return data.meta as EventMeta;
}
