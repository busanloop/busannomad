import type { Entry, NewEntry } from "@/lib/review-types";

export type { Entry, NewEntry, Cat, ArticleStatus } from "@/lib/review-types";

const ENDPOINT = "/api/review/entries";

export async function listEntries(): Promise<Entry[]> {
  const r = await fetch(ENDPOINT, { method: "GET", cache: "no-store" });
  const data = await r.json();
  if (!data.ok) throw new Error(data.error || "list failed");
  return data.entries as Entry[];
}

export async function createEntry(e: NewEntry): Promise<Entry> {
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e),
  });
  const data = await r.json();
  if (!data.ok) throw new Error(data.error || "create failed");
  return data.entry as Entry;
}

export async function updateEntry(id: string, patch: Partial<NewEntry>): Promise<Entry> {
  const r = await fetch(ENDPOINT, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, patch }),
  });
  const data = await r.json();
  if (!data.ok) throw new Error(data.error || "update failed");
  return data.entry as Entry;
}
