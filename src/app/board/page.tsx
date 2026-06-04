import { redirect } from "next/navigation";

/**
 * The old "Busan Meetups" board has moved to the live presence screen.
 * Old data is archived in ./meetups-archive.tsx.
 */
export default function BoardPage() {
  redirect("/connect");
}
