"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  // /race is a full-screen 3D experience with its own overlay UI.
  if (pathname === "/race") return null;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-lg mx-auto flex items-center px-5 h-12">
        <Link href="/" aria-label="BusanNomads home" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wordmark-reversed.svg"
            alt="BusanNomads"
            className="h-6 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
