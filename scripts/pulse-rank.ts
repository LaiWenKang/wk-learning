/**
 * Relevance scoring and categorisation for pulse signals.
 * Shared by pulse-fetch.ts and build-daily-brief.ts. Pure functions only —
 * keyword configuration lives in public/data/sources.json.
 */

export type SignalCategory =
  | "ai"
  | "programming"
  | "semiconductor"
  | "firmware"
  | "systems"
  | "finance"
  | "career"
  | "communication"
  | "productivity"
  | "health";

export type PulseSignal = {
  id: string;
  title: string;
  url: string;
  source: string;
  category: SignalCategory;
  summary?: string;
  whyItMatters?: string;
  publishedAt?: string;
  fetchedAt: string;
  score: number;
  tags: string[];
};

export type KeywordConfig = {
  high: string[];
  low: string[];
};

export type CategoryKeywords = Partial<Record<SignalCategory, string[]>>;

function matchKeyword(text: string, keyword: string): boolean {
  // Word-boundary match so "ai" doesn't hit "maintain".
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\W)${escaped}(\\W|$)`, "i").test(text);
}

export function matchedKeywords(text: string, keywords: string[]): string[] {
  return keywords.filter((k) => matchKeyword(text, k));
}

/**
 * Score a signal 0..10 from keyword relevance and recency.
 * High keywords add, low keywords subtract heavily.
 */
export function scoreSignal(
  title: string,
  summary: string | undefined,
  publishedAt: string | undefined,
  keywords: KeywordConfig,
): { score: number; matched: string[] } {
  const text = `${title} ${summary ?? ""}`;
  const high = matchedKeywords(text, keywords.high);
  const low = matchedKeywords(text, keywords.low);

  let score = 3; // neutral base so keyword-free items still rank by recency
  score += Math.min(high.length * 1.5, 5);
  score -= low.length * 4;

  // Recency bonus: full point under 24h, fades to 0 by 72h.
  if (publishedAt) {
    const ageHours = (Date.now() - new Date(publishedAt).getTime()) / 3600000;
    if (!Number.isNaN(ageHours) && ageHours >= 0) {
      score += Math.max(0, 1 - ageHours / 72) * 2;
    }
  }

  return { score: Math.max(0, Math.min(10, Math.round(score * 10) / 10)), matched: high };
}

export function categorize(
  title: string,
  summary: string | undefined,
  fallback: SignalCategory,
  categoryKeywords: CategoryKeywords,
): SignalCategory {
  const text = `${title} ${summary ?? ""}`;
  let best: SignalCategory = fallback;
  let bestCount = 0;
  for (const [cat, words] of Object.entries(categoryKeywords) as [
    SignalCategory,
    string[],
  ][]) {
    const count = matchedKeywords(text, words).length;
    if (count > bestCount) {
      best = cat;
      bestCount = count;
    }
  }
  return best;
}

export function whyItMatters(matched: string[], category: SignalCategory): string | undefined {
  if (matched.length === 0) return undefined;
  const topics = matched.slice(0, 3).join(", ");
  const angle: Record<SignalCategory, string> = {
    ai: "keeping your AI/tooling knowledge current",
    programming: "sharpening day-to-day engineering skills",
    semiconductor: "understanding the hardware landscape",
    firmware: "staying close to low-level engineering",
    systems: "building stronger systems intuition",
    finance: "long-term personal finance thinking",
    career: "growing professionally",
    communication: "communicating with more impact",
    productivity: "working more deliberately",
    health: "sustaining energy for the long run",
  };
  return `Touches ${topics} — relevant to ${angle[category]}.`;
}

/** Stable id from URL so refetches don't duplicate history entries. */
export function idFromUrl(url: string): string {
  let hash = 5381;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) + hash + url.charCodeAt(i)) >>> 0;
  }
  return `sig-${hash.toString(36)}`;
}

/** Only plain web URLs may enter the dataset (blocks javascript:, data:, etc.). */
export function isSafeHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    u.search = u.search
      .replace(/([?&])(utm_[^=]+|ref|source)=[^&]*/g, "$1")
      .replace(/[?&]+$/, "");
    return u.toString().replace(/\/+$/, "");
  } catch {
    return url.trim();
  }
}

export function dedupeSignals(signals: PulseSignal[]): PulseSignal[] {
  const seenUrl = new Set<string>();
  const seenTitle = new Set<string>();
  const out: PulseSignal[] = [];
  for (const s of signals) {
    const urlKey = normalizeUrl(s.url).toLowerCase();
    const titleKey = s.title.toLowerCase().replace(/\s+/g, " ").trim();
    if (seenUrl.has(urlKey) || seenTitle.has(titleKey)) continue;
    seenUrl.add(urlKey);
    seenTitle.add(titleKey);
    out.push(s);
  }
  return out;
}
