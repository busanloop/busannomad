import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BusanNomads — 釜山でつながるデジタルノマドコミュニティ",
  description:
    "釜山のデジタルノマド向けコミュニティ。検証済みワークスペース3カ所とつながるプログラムをひとつのパスで。個人・グループワーケーション対応。",
};

const spots = [
  {
    name: "f22",
    desc: "BIFC2の22階、24時間営業のコワーキングラウンジ（会議室・セミナー室あり）",
  },
  {
    name: "Fitness Korea Munhyeon",
    desc: "f22から徒歩10分のジム",
  },
  {
    name: "Daniels Tribe",
    desc: "水営区の集中作業向けカフェ（8:00–23:00）",
  },
];

export default function JaPage() {
  return (
    <div lang="ja" className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-zinc-950/80 to-zinc-950" />
        <div className="relative z-10 max-w-lg mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            釜山で、ひとりで働かない。
          </h1>
          <p className="text-lg text-zinc-300 max-w-md mx-auto">
            BusanNomadsは、釜山に来たデジタルノマドをつなぐコミュニティです。
            検証済みのワークスペース3カ所と、人とつながるプログラムをひとつのパスで。
          </p>
        </div>
      </section>

      {/* 3つの拠点 */}
      <section className="px-6 py-8">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6 text-center">
          3つの拠点
        </h2>
        <div className="space-y-3 max-w-lg mx-auto">
          {spots.map((s) => (
            <div
              key={s.name}
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <p className="font-medium text-zinc-100">{s.name}</p>
              <p className="text-sm text-zinc-400 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* アクセス */}
      <section className="px-6 py-8">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 text-center">
          アクセス
        </h2>
        <div className="max-w-lg mx-auto text-center">
          <p className="text-zinc-300">
            福岡から飛行機で約50分、フェリーでも。大阪・東京からの直行便多数。
          </p>
          <p className="text-sm text-zinc-400 mt-2">
            金海空港から各拠点までの行き方は到着時にご案内します。
          </p>
        </div>
      </section>

      {/* グループ・企業の方へ */}
      <section className="px-6 py-8">
        <div className="max-w-lg mx-auto p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-blue-950/50 border border-emerald-900/30">
          <h2 className="font-semibold text-zinc-100 mb-2">
            グループ・企業の方へ
          </h2>
          <p className="text-sm text-zinc-400 mb-2">
            ワーケーション、チームリトリート、研修旅行 —
            スペース手配・現地コーディネート・請求書の一本化まで対応します。
          </p>
          <p className="text-sm text-zinc-300 font-medium">
            2026年7月、日本からの60名のノマドをホストします。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-10 text-center">
        <a
          href="mailto:busannomads@gmail.com"
          className="inline-flex px-8 py-3.5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors text-lg"
        >
          busannomads@gmail.com
        </a>
        <p className="text-sm text-zinc-500 mt-3">日本語可</p>
        <p className="text-sm text-zinc-500 mt-1">
          Instagram:{" "}
          <a
            href="https://instagram.com/busannomads"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            @busannomads
          </a>
        </p>
      </section>

      {/* English link */}
      <section className="px-6 pb-10 text-center">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          English &rarr;
        </Link>
      </section>
    </div>
  );
}
