/**
 * Rebuild public/data/latest.json from the rolling history using the
 * current keyword configuration — useful after editing sources.json
 * keywords without waiting for the next fetch.
 *
 * Run: npm run brief
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  categorize,
  dedupeSignals,
  scoreSignal,
  whyItMatters,
  type CategoryKeywords,
  type KeywordConfig,
  type PulseSignal,
} from "./pulse-rank.ts";

const DATA_DIR = resolve(import.meta.dirname, "../public/data");
const LATEST_LIMIT = 20;

type SourcesFile = {
  keywords: KeywordConfig;
  categoryKeywords: CategoryKeywords;
};

const config = JSON.parse(
  readFileSync(resolve(DATA_DIR, "sources.json"), "utf8"),
) as SourcesFile;

let history: PulseSignal[];
try {
  history = (
    JSON.parse(readFileSync(resolve(DATA_DIR, "pulse-history.json"), "utf8")) as {
      signals?: PulseSignal[];
    }
  ).signals ?? [];
} catch {
  console.error("[brief] no pulse-history.json yet — run `npm run pulse` first");
  process.exit(1);
}

if (history.length === 0) {
  console.error("[brief] history is empty — run `npm run pulse` first");
  process.exit(1);
}

const rescored = history.map((s) => {
  const { score, matched } = scoreSignal(
    s.title,
    s.summary,
    s.publishedAt,
    config.keywords,
  );
  const category = categorize(s.title, s.summary, s.category, config.categoryKeywords);
  return {
    ...s,
    score,
    category,
    whyItMatters: whyItMatters(matched, category) ?? s.whyItMatters,
    tags: matched.slice(0, 5),
  };
});

const latest = dedupeSignals(rescored)
  .filter((s) => s.score > 0)
  .sort(
    (a, b) =>
      b.score - a.score || (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  )
  .slice(0, LATEST_LIMIT);

writeFileSync(
  resolve(DATA_DIR, "latest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), signals: latest }, null, 2) +
    "\n",
);

console.log(`[brief] rebuilt latest.json with ${latest.length} signals from history`);
