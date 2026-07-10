/**
 * One search box across the whole body of knowledge: models, books,
 * field briefs, playbooks, cases, quotes and serial instalments.
 * Pure substring matching with title-first ranking — fast, predictable,
 * fully local.
 */

import { MENTAL_MODELS } from "../content/models";
import { BOOKS } from "../content/books";
import { FIELD_BRIEFS } from "../content/fieldGuide";
import { PLAYBOOKS } from "../content/playbooks";
import { CASE_FILES } from "../content/cases";
import { UNPACKED_QUOTES } from "../content/quotes";
import { MEDITATIONS_SERIAL } from "../content/meditations";

export type SearchResultType =
  | "model"
  | "book"
  | "brief"
  | "playbook"
  | "case"
  | "quote"
  | "meditation";

export const SEARCH_TYPE_LABELS: Record<SearchResultType, string> = {
  model: "Mental model",
  book: "Book",
  brief: "Field brief",
  playbook: "Playbook",
  case: "Case file",
  quote: "Quote",
  meditation: "Meditations",
};

export type SearchResult = {
  type: SearchResultType;
  id: string;
  title: string;
  snippet: string;
  /** 0 = title hit, 1 = body hit — title hits rank first. */
  rank: number;
};

function snippetAround(text: string, q: string, radius = 70): string {
  const idx = text.toLowerCase().indexOf(q);
  if (idx < 0) return text.slice(0, radius * 2) + "…";
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + q.length + radius);
  return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
}

function match(
  q: string,
  type: SearchResultType,
  id: string,
  title: string,
  body: string,
): SearchResult | null {
  const lq = q.toLowerCase();
  if (title.toLowerCase().includes(lq)) {
    return { type, id, title, snippet: body.slice(0, 130) + "…", rank: 0 };
  }
  if (body.toLowerCase().includes(lq)) {
    return { type, id, title, snippet: snippetAround(body, lq), rank: 1 };
  }
  return null;
}

/** Search everything. Query under 2 chars returns nothing (too noisy). */
export function searchLibrary(query: string, limit = 30): SearchResult[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const out: SearchResult[] = [];
  const push = (r: SearchResult | null) => r && out.push(r);

  for (const m of MENTAL_MODELS) {
    push(match(q, "model", m.id, m.name, `${m.hook} ${m.mechanism} ${m.example} ${m.failure}`));
  }
  for (const b of BOOKS) {
    push(
      match(
        q,
        "book",
        b.id,
        `${b.title} — ${b.author}`,
        `${b.thesis} ${b.ideas.map((i) => `${i.name} ${i.text}`).join(" ")} ${b.critics}`,
      ),
    );
  }
  for (const f of FIELD_BRIEFS) {
    push(match(q, "brief", f.id, f.title, `${f.what} ${f.changed} ${f.matters}`));
  }
  for (const p of PLAYBOOKS) {
    push(match(q, "playbook", p.id, p.title, `${p.when} ${p.steps.map((s) => s.do).join(" ")}`));
  }
  for (const c of CASE_FILES) {
    push(match(q, "case", c.id, c.title, `${c.setting} ${c.debrief}`));
  }
  for (const u of UNPACKED_QUOTES) {
    push(match(q, "quote", u.id, `“${u.text.slice(0, 60)}…” — ${u.who}`, `${u.text} ${u.who} ${u.meaning} ${u.context}`));
  }
  for (const m of MEDITATIONS_SERIAL) {
    push(match(q, "meditation", String(m.idx), `${m.title} (${m.ref})`, m.text));
  }

  out.sort((a, b) => a.rank - b.rank);
  return out.slice(0, limit);
}
