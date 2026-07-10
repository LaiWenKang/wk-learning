/**
 * The Feed That Ends — a finite, swipeable daily deck.
 *
 * Same variable-reward pattern as an infinite feed (you never know what
 * the next card is), except it's built from the app's own knowledge
 * pools and your own history, and it ends on purpose: the last card
 * says you're caught up. Deterministic per date; pure function of its
 * inputs so it's fully testable.
 */

import { MENTAL_MODELS, type MentalModel } from "../content/models";
import {
  CALIBRATION_QUESTIONS,
  type CalibrationQuestion,
} from "../content/calibration";
import {
  PARADOX_CHALLENGES,
  type ParadoxChallenge,
} from "../content/challenges";
import { FIELD_BRIEFS, type FieldBrief } from "../content/fieldGuide";
import { UNPACKED_QUOTES, type UnpackedQuote } from "../content/quotes";
import type { PulseSignal, ReflectionEntry, LearningItem } from "../types";
import { activePool, type CalibrationRecord } from "./gym";
import { daysBetween } from "./date";

/* ------------------------------ cards ------------------------------ */

export type FeedCard =
  | { kind: "intro"; total: number }
  | { kind: "fact"; q: CalibrationQuestion }
  | { kind: "hook"; model: MentalModel }
  | { kind: "paradox"; paradox: ParadoxChallenge }
  | { kind: "brief"; brief: FieldBrief }
  | { kind: "quote"; quote: UnpackedQuote }
  | { kind: "guess"; q: CalibrationQuestion; options: number[]; answerIdx: number }
  | { kind: "pulse"; signal: PulseSignal }
  | { kind: "memory"; text: string; source: string; daysAgo: number }
  | { kind: "rematch"; q: CalibrationQuestion; previousEstimate: number; daysAgo: number }
  | { kind: "outro"; streak: number };

export type FeedInputs = {
  signals: PulseSignal[];
  reflections: ReflectionEntry[];
  notes: LearningItem[];
  calibrationLog: CalibrationRecord[];
  streak: number;
  /** Content ids the user has retired ("not for me"). */
  retired?: Set<string>;
};

/* --------------------------- seeded picks --------------------------- */

function daySeed(dateKey: string, salt: number): number {
  const day = Math.floor(Date.parse(`${dateKey}T00:00:00Z`) / 86400000);
  return (Math.imul(day, 2654435761) ^ Math.imul(salt, 40503)) >>> 0;
}

/** Deterministic Fisher–Yates; returns the first `count` indices. */
function pickIndices(n: number, count: number, seed: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  let s = (seed ^ 0x9e3779b9) >>> 0;
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.slice(0, Math.min(count, n));
}

function pickSome<T>(items: T[], count: number, seed: number): T[] {
  return pickIndices(items.length, count, seed).map((i) => items[i]);
}

/* --------------------------- memory mining -------------------------- */

const MEMORY_MIN_AGE_DAYS = 30;

function mineMemories(
  dateKey: string,
  inputs: FeedInputs,
  seed: number,
): FeedCard[] {
  const out: FeedCard[] = [];

  const oldReflections = inputs.reflections.filter(
    (r) =>
      daysBetween(r.date, dateKey) >= MEMORY_MIN_AGE_DAYS &&
      r.learnedToday.trim().length > 12,
  );
  for (const r of pickSome(oldReflections, 1, seed)) {
    out.push({
      kind: "memory",
      text: r.learnedToday.trim(),
      source: "You wrote this in your reflection",
      daysAgo: daysBetween(r.date, dateKey),
    });
  }

  const oldNotes = inputs.notes.filter((n) => {
    const created = n.createdAt.slice(0, 10);
    return (
      daysBetween(created, dateKey) >= MEMORY_MIN_AGE_DAYS &&
      (n.keyTakeaway.trim().length > 12 || n.note.trim().length > 12)
    );
  });
  for (const n of pickSome(oldNotes, 1, seed + 1)) {
    out.push({
      kind: "memory",
      text: n.keyTakeaway.trim() || n.note.trim().slice(0, 200),
      source: `From your note “${n.title.slice(0, 60)}”`,
      daysAgo: daysBetween(n.createdAt.slice(0, 10), dateKey),
    });
  }

  // Rematch: a question you missed badly, long enough ago to retry.
  const misses = inputs.calibrationLog.filter(
    (r) => !r.within2x && daysBetween(r.date, dateKey) >= MEMORY_MIN_AGE_DAYS,
  );
  for (const m of pickSome(misses, 1, seed + 2)) {
    const q = CALIBRATION_QUESTIONS.find((c) => c.id === m.qId);
    if (q) {
      out.push({
        kind: "rematch",
        q,
        previousEstimate: m.estimate,
        daysAgo: daysBetween(m.date, dateKey),
      });
    }
  }

  return out;
}

/* ---------------------------- guess card ---------------------------- */

const GUESS_FACTORS = [4, 8, 25];

export function buildGuess(
  q: CalibrationQuestion,
  seed: number,
): { options: number[]; answerIdx: number } {
  const f1 = GUESS_FACTORS[seed % GUESS_FACTORS.length];
  const f2 = GUESS_FACTORS[(seed + 1) % GUESS_FACTORS.length];
  const distractors = [q.answer * f1, q.answer / f2];
  const order = pickIndices(3, 3, seed);
  const options = order.map((i) => [q.answer, ...distractors][i]);
  return { options, answerIdx: options.indexOf(q.answer) };
}

/* ----------------------------- the deck ----------------------------- */

/**
 * Build the day's deck. Finite by design: 12–17 cards, then the outro.
 * All selection is deterministic per date.
 */
export function buildFeed(dateKey: string, inputs: FeedInputs): FeedCard[] {
  const retired = inputs.retired ?? new Set<string>();
  const calPool = activePool(CALIBRATION_QUESTIONS, retired);
  const facts = pickSome(calPool, 4, daySeed(dateKey, 31));
  const hooks = pickSome(MENTAL_MODELS, 3, daySeed(dateKey, 32));
  const paradoxes = pickSome(PARADOX_CHALLENGES, 2, daySeed(dateKey, 33));
  const briefs = pickSome(FIELD_BRIEFS, 1, daySeed(dateKey, 34));
  const quotes = pickSome(UNPACKED_QUOTES, 1, daySeed(dateKey, 38));
  const guessQ = pickSome(calPool, 1, daySeed(dateKey, 35))[0];
  const signals = inputs.signals.slice(0, 3);
  const memories = mineMemories(dateKey, inputs, daySeed(dateKey, 36));

  // The guess question must not duplicate a fact card.
  const factSet = new Set(facts.map((f) => f.id));
  const guess =
    guessQ && !factSet.has(guessQ.id)
      ? guessQ
      : calPool.find((q) => !factSet.has(q.id))!;

  const middle: FeedCard[] = [];
  const push = (c: FeedCard | undefined) => c && middle.push(c);

  // Fixed interleave pattern — variety of format is the variable reward.
  push(hooks[0] && { kind: "hook", model: hooks[0] });
  push(facts[0] && { kind: "fact", q: facts[0] });
  push(signals[0] && { kind: "pulse", signal: signals[0] });
  push({ kind: "guess", q: guess, ...buildGuess(guess, daySeed(dateKey, 37)) });
  push(paradoxes[0] && { kind: "paradox", paradox: paradoxes[0] });
  push(memories[0]);
  push(facts[1] && { kind: "fact", q: facts[1] });
  push(briefs[0] && { kind: "brief", brief: briefs[0] });
  push(signals[1] && { kind: "pulse", signal: signals[1] });
  push(quotes[0] && { kind: "quote", quote: quotes[0] });
  push(hooks[1] && { kind: "hook", model: hooks[1] });
  push(memories[1]);
  push(facts[2] && { kind: "fact", q: facts[2] });
  push(paradoxes[1] && { kind: "paradox", paradox: paradoxes[1] });
  push(signals[2] && { kind: "pulse", signal: signals[2] });
  push(memories[2]);
  push(hooks[2] && { kind: "hook", model: hooks[2] });
  push(facts[3] && { kind: "fact", q: facts[3] });

  return [
    { kind: "intro", total: middle.length + 2 },
    ...middle,
    { kind: "outro", streak: inputs.streak },
  ];
}
