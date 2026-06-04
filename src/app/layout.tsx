import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://busannomads.com";
const TITLE = "BusanNomads — Learn · Work · Play";
const DESCRIPTION =
  "One pass. Three verified spaces. Coworking, fitness, and a cafe across Busan. Learn · Work · Play for digital nomads.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/brand/favicon-32.png",
    apple: "/brand/favicon-180.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "BusanNomads",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: "BusanNomads — Learn · Work · Play",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/brand/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        <SiteHeader />
        <main className="flex-1 pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
