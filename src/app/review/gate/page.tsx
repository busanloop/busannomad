"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const serif = '"Fraunces","Newsreader",Georgia,serif';

function Gate() {
  const router = useRouter();
  const sp = useSearchParams();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!code.trim()) return;
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/review-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const d = await r.json();
      if (d.ok) {
        router.push(sp.get("next") || "/review");
        router.refresh();
        return;
      }
      setErr(
        d.error === "REVIEW_ACCESS_CODE not configured"
          ? "서버에 액세스 코드가 설정되지 않았어 (REVIEW_ACCESS_CODE)."
          : "코드가 틀렸어.",
      );
    } catch {
      setErr("요청 실패. 다시 시도해줘.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-5">
      <h1 style={{ fontFamily: serif }} className="text-3xl font-medium tracking-tight">
        Review Board
      </h1>
      <p className="mt-2 mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        액세스 코드를 입력해줘
      </p>
      <input
        type="password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="access code"
        autoFocus
        className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-[15px] text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
      />
      {err && <p className="mt-2 font-mono text-[11px] text-[#E2603F]">{err}</p>}
      <button
        onClick={submit}
        disabled={busy}
        className="mt-4 rounded-sm bg-white px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-900 transition hover:opacity-80 disabled:opacity-50"
      >
        {busy ? "..." : "들어가기"}
      </button>
    </div>
  );
}

export default function GatePage() {
  return (
    <Suspense fallback={null}>
      <Gate />
    </Suspense>
  );
}
