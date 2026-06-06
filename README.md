# Busannomads

**Busan has places to work. We have the people in them.**

Busannomads connects visiting digital nomads in Busan with each other — and with three verified physical spaces to work, move, and meet. We implement **Learn · Work · Play** not inside one building, but at the scale of the city.

> Site: https://busannomads.com · IG [@busannomads](https://instagram.com/busannomads) · Contact: busannomads@gmail.com

---

## What it is

Busan is full of places to work. What's missing is someone to work beside. Busannomads fixes that.

- **Connect** *(core)* — anonymous, login-free check-in showing which spots have nomads right now, so you can join them instead of just finding a desk.
- **Three verified spaces** — visited and confirmed, not a listing:
  - **f22** — coworking lounge, BIFC2 22F, Munhyeon, Nam-gu
  - **Fitness Korea Munhyeon** — gym, near f22
  - **Daniels Tribe** — quiet deep-work café, Suyeong-gu
- **Learn · Work · Play** — the whole city as a nomad campus.

First cohort: ~60 visiting nomads in July 2026, via the Korea Nomad Alliance.

---

## Routes

| Page | Description |
|------|-------------|
| `/` | Landing — connection-first ("you don't work alone") |
| `/connect` | **Core.** Anonymous check-in: who's in Busan right now |
| `/discover` | Verified spaces + nearby eats + MyRealTrip tours |
| `/pass` | Day pass (single-plan; checkout/QR behind flags) |
| `/about` | Background |
| `/race` | Legacy drift-racing demo (hidden from nav, preserved) |
| `/board` | Legacy nomad board (hidden from nav, preserved) |

---

## Tech stack

Next.js 16 · React 19 · Tailwind CSS 4 · Supabase (Connect presence) · Three.js (legacy demo) · Netlify (auto-deploy on push to `main`)

> ⚠️ Next.js 16 has breaking changes vs. earlier versions. See `AGENTS.md` before writing code.

---

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Environment variables

| Var | Used for |
|-----|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Connect live presence (**required** — without it, /connect falls back to demo mode) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Connect live presence (**required**) |
| `MRT_API_KEY` | MyRealTrip tours (Discover) |
| `APIFUSE_API_KEY` | API Fuse × KakaoMap place search (Discover) |

---

## External integrations

| API | How it's used |
|-----|---------------|
| **MyRealTrip** | Tour/accommodation search + tracked partner links, on Discover |
| **API Fuse × KakaoMap** | Server-side place search for nearby eats; fallback data on failure |
| **Supabase** | Anonymous presence store for Connect (device_id never exposed in reads) |

---

## Deploy

Push to `main` → Netlify auto-deploys. Connect's live mode depends on the two `NEXT_PUBLIC_SUPABASE_*` vars being set in Netlify env.
