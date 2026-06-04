import type { Metadata } from "next";

// /connect is the Instagram bio-link landing page, so it needs its own share
// preview instead of the site-wide LWP-pass OG. Metadata is shallowly merged,
// meaning a child openGraph/twitter object fully replaces the root one — so we
// must restate every field we want, not just the overrides.
const CONNECT_TITLE = "Who's in Busan right now — BusanNomads";
const CONNECT_DESCRIPTION =
  "See which digital nomads are in Busan and check in anonymously. No login.";

export const metadata: Metadata = {
  title: CONNECT_TITLE,
  description: CONNECT_DESCRIPTION,
  openGraph: {
    type: "website",
    url: "https://busannomads.com/connect",
    siteName: "BusanNomads",
    title: CONNECT_TITLE,
    description: CONNECT_DESCRIPTION,
    images: [
      {
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: "BusanNomads — Who's in Busan now",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: CONNECT_TITLE,
    description: CONNECT_DESCRIPTION,
    images: ["/brand/og.png"],
  },
};

export default function ConnectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
