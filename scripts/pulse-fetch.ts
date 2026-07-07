/**
 * WK Learning Pulse — public signal fetcher.
 *
 * Reads source config from public/data/sources.json, fetches public
 * RSS/Atom feeds and key-free public APIs, normalizes everything into
 * PulseSignal, scores relevance, and writes:
 *   - public/data/latest.json        (top signals for the app)
 *   - public/data/pulse-history.json (rolling window)
 *
 * Public sources only. No API keys. A failing source is skipped with a
 * warning — the run still succeeds if at least one source works.
 *
 * Run: npm run pulse
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  categorize,
  dedupeSignals,
  idFromUrl,
  isSafeHttpUrl,
  scoreSignal,
  whyItMatters,
  type CategoryKeywords,
  type KeywordConfig,
  type PulseSignal,
  type SignalCategory,
} from "./pulse-rank.ts";

const ROOT = resolve(import.meta.dirname, "..");
const DATA_DIR = resolve(ROOT, "public/data");
const LATEST_LIMIT = 20;
const HISTORY_MAX_ITEMS = 300;
const HISTORY_MAX_DAYS = 7;
const FETCH_TIMEOUT_MS = 20000;

type SourceConfig = {
  id: string;
  name: string;
  type: "rss" | "hn-algolia" | "github-search";
  url: string;
  category: SignalCategory;
  enabled: boolean;
  maxItems?: number;
};

type SourcesFile = {
  sources: SourceConfig[];
  keywords: KeywordConfig;
  categoryKeywords: CategoryKeywords;
};

type RawItem = {
  title: string;
  url: string;
  summary?: string;
  publishedAt?: string;
};

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      "user-agent": "wk-learning-pulse (personal learning app; public data only)",
      accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, application/json, */*",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/* ---------- Minimal RSS/Atom parsing (no dependencies) ---------- */

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

function stripHtml(s: string): string {
  return decodeEntities(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagContent(block: string, tag: string): string | undefined {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].trim() : undefined;
}

function parseFeed(xml: string): RawItem[] {
  const items: RawItem[] = [];
  const blocks =
    xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ??
    xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ??
    [];
  for (const block of blocks) {
    const title = tagContent(block, "title");
    if (!title) continue;

    // RSS: <link>url</link>. Atom: <link href="url"/> (prefer rel="alternate").
    let url = tagContent(block, "link");
    if (!url || url === "") {
      const alt =
        block.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) ??
        block.match(/<link[^>]*href=["']([^"']+)["']/i);
      url = alt?.[1];
    }
    if (!url) continue;

    const summaryRaw =
      tagContent(block, "description") ??
      tagContent(block, "summary") ??
      tagContent(block, "content");
    const published =
      tagContent(block, "pubDate") ??
      tagContent(block, "published") ??
      tagContent(block, "updated") ??
      tagContent(block, "dc:date");

    let publishedAt: string | undefined;
    if (published) {
      const d = new Date(decodeEntities(published));
      if (!Number.isNaN(d.getTime())) publishedAt = d.toISOString();
    }

    items.push({
      title: stripHtml(title),
      url: decodeEntities(url).trim(),
      summary: summaryRaw ? stripHtml(summaryRaw).slice(0, 280) : undefined,
      publishedAt,
    });
  }
  return items;
}

/* ---------- Source-type fetchers ---------- */

async function fetchRss(source: SourceConfig): Promise<RawItem[]> {
  return parseFeed(await fetchText(source.url));
}

async function fetchHnAlgolia(source: SourceConfig): Promise<RawItem[]> {
  const json = JSON.parse(await fetchText(source.url)) as {
    hits?: {
      title?: string;
      url?: string;
      objectID?: string;
      created_at?: string;
      points?: number;
    }[];
  };
  return (json.hits ?? [])
    .filter((h) => h.title)
    .map((h) => ({
      title: h.title!,
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      summary: h.points ? `${h.points} points on Hacker News` : undefined,
      publishedAt: h.created_at,
    }));
}

async function fetchGithubSearch(source: SourceConfig): Promise<RawItem[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .slice(0, 10);
  const url = source.url.replace("{{DATE_7D}}", sevenDaysAgo);
  const json = JSON.parse(await fetchText(url)) as {
    items?: {
      full_name?: string;
      html_url?: string;
      description?: string | null;
      stargazers_count?: number;
      created_at?: string;
      language?: string | null;
    }[];
  };
  return (json.items ?? [])
    .filter((r) => r.full_name && r.html_url)
    .map((r) => ({
      title: `${r.full_name}${r.language ? ` (${r.language})` : ""} — trending new repo`,
      url: r.html_url!,
      summary: [r.description ?? "", `★ ${r.stargazers_count ?? 0}`]
        .filter(Boolean)
        .join(" · ")
        .slice(0, 280),
      publishedAt: r.created_at,
    }));
}

/* ---------- Main ---------- */

async function main(): Promise<void> {
  const config = JSON.parse(
    readFileSync(resolve(DATA_DIR, "sources.json"), "utf8"),
  ) as SourcesFile;
  const fetchedAt = new Date().toISOString();
  const all: PulseSignal[] = [];
  let okSources = 0;

  for (const source of config.sources) {
    if (!source.enabled) continue;
    try {
      let raw: RawItem[];
      switch (source.type) {
        case "rss":
          raw = await fetchRss(source);
          break;
        case "hn-algolia":
          raw = await fetchHnAlgolia(source);
          break;
        case "github-search":
          raw = await fetchGithubSearch(source);
          break;
        default:
          console.warn(`[pulse] ${source.id}: unknown type, skipping`);
          continue;
      }
      raw = raw
        .filter((item) => isSafeHttpUrl(item.url))
        .slice(0, source.maxItems ?? 20);
      for (const item of raw) {
        const { score, matched } = scoreSignal(
          item.title,
          item.summary,
          item.publishedAt,
          config.keywords,
        );
        const category = categorize(
          item.title,
          item.summary,
          source.category,
          config.categoryKeywords,
        );
        all.push({
          id: idFromUrl(item.url),
          title: item.title.slice(0, 200),
          url: item.url,
          source: source.name,
          category,
          summary: item.summary,
          whyItMatters: whyItMatters(matched, category),
          publishedAt: item.publishedAt,
          fetchedAt,
          score,
          tags: matched.slice(0, 5),
        });
      }
      okSources++;
      console.log(`[pulse] ${source.id}: ${raw.length} items`);
    } catch (err) {
      console.warn(
        `[pulse] ${source.id}: skipped (${err instanceof Error ? err.message : err})`,
      );
    }
  }

  if (okSources === 0) {
    // Leave existing JSON untouched rather than clobbering it with nothing.
    console.error("[pulse] every source failed; keeping previous data");
    process.exitCode = 1;
    return;
  }

  const deduped = dedupeSignals(all).filter((s) => s.score > 0);
  deduped.sort(
    (a, b) =>
      b.score - a.score ||
      (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
  const latest = deduped.slice(0, LATEST_LIMIT);

  writeFileSync(
    resolve(DATA_DIR, "latest.json"),
    JSON.stringify({ generatedAt: fetchedAt, signals: latest }, null, 2) + "\n",
  );

  // Merge into rolling history (bounded by age and count).
  let history: PulseSignal[] = [];
  try {
    const parsed = JSON.parse(
      readFileSync(resolve(DATA_DIR, "pulse-history.json"), "utf8"),
    ) as { signals?: PulseSignal[] };
    history = parsed.signals ?? [];
  } catch {
    // first run or corrupt file — start fresh
  }
  const cutoff = new Date(Date.now() - HISTORY_MAX_DAYS * 86400000).toISOString();
  const merged = dedupeSignals([...latest, ...history])
    .filter((s) => s.fetchedAt >= cutoff)
    .slice(0, HISTORY_MAX_ITEMS);

  writeFileSync(
    resolve(DATA_DIR, "pulse-history.json"),
    JSON.stringify({ updatedAt: fetchedAt, signals: merged }, null, 2) + "\n",
  );

  console.log(
    `[pulse] wrote ${latest.length} latest signals, ${merged.length} in history (${okSources} sources ok)`,
  );
}

main().catch((err) => {
  console.error("[pulse] fatal:", err);
  process.exit(1);
});
