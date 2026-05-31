# Nomad Loop

**Race through Busan, discover real spots, and use them with a Learn · Work · Play city pass for digital nomads.**

> OBA Weekendthon Season 1 | 2026.05.30-31
> 12h · Solo · Claude Code

## Demo

**Live:** https://nomadloop.netlify.app/

| Page | Description |
|------|-------------|
| `/` | Landing + 3D kart viewer |
| `/race` | Busan Drift Race — arcade physics, coins, rewards |
| `/discover` | Busan spots + MyRealTrip live data + KakaoMap restaurants |
| `/pass` | Pass checkout → revenue share → QR check-in |
| `/board` | Same-city nomad board |
| `/about` | Tech deep dive + Go-to-Market + Revenue Model |

## Core Flow

```
Race (arcade drift racing)
 → Checkpoints → earn coupons (NOMAD20)
 → Coins → earn rewards
 → FINISH → "Visit spots"
 → Discover (coupon discount + MyRealTrip real products)
 → Product click → tracked partner link → real purchase
 → Pass → payment mockup → revenue share display → QR → check-in
```

**Learn · Work · Play** — the entire city of Busan as a nomad campus.

## API Integrations (3 live)

| API | How we used it | Data |
|-----|---------------|------|
| **MyRealTrip** | Tour + accommodation search + **tracked partner links** (purchases earn commission) | 279 tours + 1,942 hotels |
| **API Fuse × KakaoMap** | Server-side place search for Gwangalli restaurants/cafes. Fallback on failure | Real-time |
| **Three.js** | Custom drift racing engine with ghost replay, coins, mobile touch | WebGL |

## Racing Features

- Arcade drift physics (3-factor: yaw rate, lateral grip, forward assist)
- 6 Busan checkpoints with real rewards
- Ghost racing (top 3 laps)
- Coin collection (15 coins → reward scaling)
- Traffic light countdown
- Busan night theme + props (lighthouse, food stalls, palm trees, boats, torii)
- Mobile touch controls (joystick + buttons)
- Attract mode (cinematic auto-drive before START)

## Revenue Model (Live)

| Source | Status |
|--------|--------|
| **MyRealTrip commission** | Tracked partner links — live now |
| **Pass revenue share** | F22 / Fitness / Restaurants split |
| **Public workation contracts** | Busan city ₩74.4M annual budget |

## Real Assets (Secured)

- F22 Coworking (300sqm, Busan) — operating
- Fitness partner — agreed
- Hotel network — sales pipeline
- Restaurant curation — in progress

## Tech Stack

Next.js 16 · Tailwind CSS · Three.js · qrcode.react · Netlify

## Run Locally

```bash
npm install
cp .env.example .env.local  # Add MRT_API_KEY, APIFUSE_API_KEY
npm run dev
```
