# WK Learning

A local-first, iPhone-friendly PWA for deliberate personal growth: daily
public learning signals, flashcards and concept notes, structured
engineering-thinking tools, personal finance scenario modelling, and daily
reflection. Built with Vite + React + TypeScript, hosted on GitHub Pages,
refreshed by a scheduled GitHub Actions job. One deliberate dark theme,
liquid-glass navigation, and chart colors validated for colorblind safety.

**Live app:** `https://<your-username>.github.io/wk-learning/`

## Features

| Tab | What it does |
| --- | --- |
| **Today** | Daily brief: streak/due/queue at a glance, top public signals from the Pulse, a professional mindset prompt, a thinking challenge, a suggested learning action, quick actions |
| **Learn** | Learning Queue (saved signals + notes), flashcards with a 3D flip review and confidence-based intervals, concept notes with tags/takeaways, JSON import/export |
| **Think** | Thinking Gym: RCA Builder (generates markdown), Decision Matrix (weighted scoring with result bars), Assumption Checker, Risk Scanner with coverage progress |
| **Finance** | Finance Simulator: net-worth projection chart with crosshair tooltip, target progress ring, year-N composition breakdown, savings rate, saved scenario comparison |
| **Reflect** | Daily Reflection: energy/maturity/reliability scores, 7-day sparkline trends, streak, template-based weekly summary |
| **Settings** | Local Data & Privacy: full JSON backup/restore, clear-with-confirmation, pulse source list, app version |

### Daily content never repeats

The Today prompts (mindset / challenge / action) rotate through their
pools with a deterministic shuffled-cycle algorithm
(`dailyRotation` in `src/data/prompts.ts`): every item appears exactly
once per cycle, each cycle is reshuffled, and the same item never shows
on two consecutive days — no repeats until a pool is exhausted. Pulse
signals are deduplicated by URL at fetch time, and signals you have
already saved to the queue are excluded from the next day's top five.

## Privacy model

- **Your data never leaves the browser.** Notes, flashcards, reflections,
  finance inputs and RCA drafts live in `localStorage` under the
  `wk-learning:` prefix (the storage layer in `src/lib/storage.ts` is an
  adapter, so IndexedDB can be swapped in later). Nothing is committed to
  the repository or sent to any server.
- **The repo is safe to make public.** Committed data is limited to source
  code, generic sample content, and pulse JSON generated from public
  sources.
- **The Pulse uses public sources only** — key-free RSS feeds and public
  APIs. No paid APIs, no API keys in frontend code. If a key is ever
  needed, it must go in GitHub Secrets and be used only inside Actions.
- No employer/company-specific information belongs anywhere in this
  repository — keep notes generic when exporting or filing issues.

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript check only
```

Node 20.11+ (CI uses Node 22).

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds the app and deploys it with the
official Pages actions on every push to `main`.

One-time setup: in the repo settings, under **Pages**, set the source to
**GitHub Actions**. The Vite `base` is `/wk-learning/` (see
`vite.config.ts`) — change it if you rename the repository.

## WK Learning Pulse

`.github/workflows/pulse.yml` runs `scripts/pulse-fetch.ts` on a schedule
(default roughly every 15 minutes; a 5-minute variant is commented out in
the workflow) and commits refreshed JSON only when something changed. Each
data commit to `main` triggers the Pages deploy, which is how fresh
signals reach the live site. You can also trigger it manually from the
Actions tab (`workflow_dispatch`).

Notes on scheduling: cron is **UTC**, and GitHub may delay scheduled runs
by several minutes under load — treat the pulse as "recent", not
real-time.

The pipeline:

1. Load sources + keyword config from `public/data/sources.json`.
2. Fetch each enabled source (RSS/Atom, Hacker News Algolia API, GitHub
   search API). A failing source is skipped with a warning.
3. Normalize into `PulseSignal`, dedupe by URL/title.
4. Score relevance from the keyword config (high keywords boost, junk
   keywords sink) plus a recency bonus; assign a category.
5. Write the top 20 to `public/data/latest.json` and merge into
   `public/data/pulse-history.json` (bounded to ~7 days / 300 items).

`scripts/build-daily-brief.ts` (`npm run brief`) re-ranks the existing
history with the current keyword config without refetching.

If `latest.json` is missing or unreachable, the app falls back to a
bundled demo brief (`src/data/samplePulse.ts`), so it always renders.

### Adding a source

Edit `public/data/sources.json` and add an entry:

```json
{
  "id": "my-feed",
  "name": "Some Public Engineering Blog",
  "type": "rss",
  "url": "https://example.com/feed.xml",
  "category": "systems",
  "enabled": true,
  "maxItems": 10
}
```

Supported `type` values: `rss` (RSS 2.0 / Atom), `hn-algolia`,
`github-search`. Only public, key-free endpoints. Tune ranking in the
`keywords.high` / `keywords.low` arrays and per-category terms in
`categoryKeywords` in the same file.

## PWA / iPhone

- `public/manifest.webmanifest` + generated icons (`npx tsx
  scripts/generate-icons.ts` regenerates them) make the app installable:
  open the deployed site in Safari → Share → **Add to Home Screen**.
- A small service worker (`public/sw.js`) gives basic offline support:
  network-first for pulse data and navigation, cache-first for hashed
  static assets. It registers only in production builds.
- Safe-area insets, `viewport-fit=cover`, 16px inputs (no focus zoom) and
  a floating glass tab bar keep it comfortable on iPhone. The theme is a
  single committed dark design; `prefers-reduced-motion` and
  `prefers-reduced-transparency` are honoured.

## Project structure

```
public/
  manifest.webmanifest    PWA manifest
  sw.js                   service worker (offline basics)
  icons/                  generated app icons
  data/                   pulse JSON (sources config + generated output)
src/
  app/App.tsx             shell + bottom-tab navigation (hash routing)
  components/             shared UI primitives + icons
  data/                   bundled sample pulse + daily prompts
  features/               today / learn / think / finance / reflect / settings
  lib/                    storage adapter, date utils, projection math, export
  types/                  shared TypeScript types
scripts/
  pulse-fetch.ts          scheduled public-signal fetcher
  pulse-rank.ts           scoring / categorisation (shared, pure)
  build-daily-brief.ts    re-rank history without refetching
  generate-icons.ts       dependency-free PNG/SVG icon generator
.github/workflows/
  deploy.yml              GitHub Pages build + deploy
  pulse.yml               scheduled pulse fetch + data commit
```

## Disclaimers

The Finance tab is mechanical scenario arithmetic with simplified
assumptions (constant returns, no tax/inflation modelling). It is personal
scenario modelling only, not financial advice.
