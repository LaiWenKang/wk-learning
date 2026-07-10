/**
 * Mind Gym engine — daily selection, scoring, streaks and mastery.
 *
 * Selection reuses the deterministic no-repeat rotation (data/prompts):
 * the same date always yields the same session, nothing repeats until a
 * whole pool is exhausted, and each day's challenge format rotates
 * fallacy → paradox → fermi. All progress lives in localStorage via the
 * shared storage adapter, so it rides along with export/import backups.
 */

import { dailyRotation } from "../data/prompts";
import {
  MENTAL_MODELS,
  type MentalModel,
} from "../content/models";
import {
  CALIBRATION_QUESTIONS,
  type CalibrationQuestion,
} from "../content/calibration";
import {
  CHALLENGE_KINDS,
  FALLACY_CHALLENGES,
  FERMI_CHALLENGES,
  PARADOX_CHALLENGES,
  type Challenge,
  type ChallengeKind,
} from "../content/challenges";
import { storage } from "./storage";
import { addDays, daysBetween } from "./date";

/* ------------------------- daily selection ------------------------- */

export type DailyGym = {
  question: CalibrationQuestion;
  model: MentalModel;
  challenge: Challenge;
  kind: ChallengeKind;
};

/** Which challenge format runs on a given date (3-day rotation). */
export function challengeKindFor(dateKey: string): ChallengeKind {
  const day = Math.floor(Date.parse(`${dateKey}T00:00:00Z`) / 86400000);
  return CHALLENGE_KINDS[((day % 3) + 3) % 3];
}

/* ------------------------ content retiring ------------------------- */

const RETIRED_KEY = "retired-content";
/** Never let personal culls shrink a pool below this. */
const RETIRE_FLOOR = 10;

/**
 * Retired ids effective on a given date. Retirement always takes effect
 * TOMORROW, so today's already-answered session and already-built deck
 * stay stable — the item simply never appears again after today.
 */
export function loadRetired(dateKey: string): Set<string> {
  const raw = storage.get<Record<string, string>>(RETIRED_KEY);
  if (!raw || typeof raw !== "object") return new Set();
  return new Set(
    Object.entries(raw)
      .filter(([, from]) => from <= dateKey)
      .map(([id]) => id),
  );
}

/** "Not for me" — drops an item from this user's rotation from tomorrow. */
export function retireContent(id: string, dateKey: string): void {
  const raw = storage.get<Record<string, string>>(RETIRED_KEY) ?? {};
  storage.set(RETIRED_KEY, { ...raw, [id]: addDays(dateKey, 1) });
}

/** Filter a pool by the retire list, refusing to over-shrink it. */
export function activePool<T extends { id: string }>(
  items: T[],
  retired: Set<string>,
): T[] {
  if (retired.size === 0) return items;
  const filtered = items.filter((i) => !retired.has(i.id));
  return filtered.length >= RETIRE_FLOOR ? filtered : items;
}

/** The full session for a date — deterministic and repeat-free per pool. */
export function pickDaily(dateKey: string, retired?: Set<string>): DailyGym {
  const r = retired ?? new Set<string>();
  const question = dailyRotation(activePool(CALIBRATION_QUESTIONS, r), dateKey, 11);
  const model = dailyRotation(MENTAL_MODELS, dateKey, 12);
  const kind = challengeKindFor(dateKey);
  const challenge: Challenge =
    kind === "fallacy"
      ? dailyRotation(activePool(FALLACY_CHALLENGES, r), dateKey, 13)
      : kind === "paradox"
        ? dailyRotation(activePool(PARADOX_CHALLENGES, r), dateKey, 14)
        : dailyRotation(activePool(FERMI_CHALLENGES, r), dateKey, 15);
  return { question, model, challenge, kind };
}

/* --------------------------- estimate math -------------------------- */

/** How many × an estimate is off from the truth (1 = exact, 2 = 2× off). */
export function ratioError(estimate: number, answer: number): number {
  if (!Number.isFinite(estimate) || estimate <= 0 || answer <= 0) {
    return Infinity;
  }
  return estimate >= answer ? estimate / answer : answer / estimate;
}

export type EstimateGrade = {
  ratio: number;
  within2x: boolean;
  within10x: boolean;
  /** "over" | "under" | "exact" — which side the estimate landed on. */
  side: "over" | "under" | "exact";
};

export function gradeEstimate(estimate: number, answer: number): EstimateGrade {
  const ratio = ratioError(estimate, answer);
  return {
    ratio,
    within2x: ratio <= 2,
    within10x: ratio <= 10,
    side: ratio === 1 ? "exact" : estimate > answer ? "over" : "under",
  };
}

/* ------------------------------ state ------------------------------ */

export type ConfidenceLevel = 50 | 70 | 90;
export const CONFIDENCE_LEVELS: ConfidenceLevel[] = [50, 70, 90];

export type CalibrationRecord = {
  date: string;
  qId: string;
  estimate: number;
  answer: number;
  confidence: ConfidenceLevel;
  within2x: boolean;
  within10x: boolean;
};

export type RecallGrade = "missed" | "fuzzy" | "got";

export type ModelMastery = {
  seenAt: string;
  recalls: number;
  got: number;
  lastGrade: RecallGrade;
  /** Date of the most recent recall or review — drives spaced reviews. */
  lastAt: string;
};

export type DomainExam = {
  passedAt: string | null;
  bestScore: number;
  attempts: number;
};

export type GymStats = {
  streak: number;
  lastCompleted: string | null;
  totalSessions: number;
  /** Streak freezes in the bank — one missed day is auto-covered. */
  freezes: number;
  calibrationLog: CalibrationRecord[];
  mastery: Record<string, ModelMastery>;
  exams: Record<string, DomainExam>;
  challenges: {
    fallacyRight: number;
    fallacyTotal: number;
    fermiHit: number;
    fermiTotal: number;
    paradoxSeen: number;
  };
};

export type GymDayChallenge = {
  /** fallacy: chosen option index; fermi: estimate. Paradox stores neither. */
  choiceIdx?: number;
  estimate?: number;
  correct?: boolean;
};

/** One day's in-progress session (resumable mid-way). */
export type GymDay = {
  date: string;
  /** 0 calibrate · 1 learn · 2 recall(+review) · 3 challenge · 4 done */
  step: number;
  calibration?: {
    estimate: number;
    confidence: ConfidenceLevel;
    within2x: boolean;
  };
  recallGrade?: RecallGrade;
  /** Due spaced review chosen when the main recall was graded (null = none due). */
  reviewId?: string | null;
  reviewGrade?: RecallGrade;
  challenge?: GymDayChallenge;
  /** Quick 60-second session: calibration only, streak still counts. */
  minimal?: boolean;
  completedAt?: string;
};

export function emptyStats(): GymStats {
  return {
    streak: 0,
    lastCompleted: null,
    totalSessions: 0,
    freezes: 0,
    calibrationLog: [],
    mastery: {},
    exams: {},
    challenges: {
      fallacyRight: 0,
      fallacyTotal: 0,
      fermiHit: 0,
      fermiTotal: 0,
      paradoxSeen: 0,
    },
  };
}

const STATS_KEY = "mindgym-stats";
const DAY_KEY = "mindgym-day";
const LOG_CAP = 400;

export function loadGymStats(): GymStats {
  const raw = storage.get<GymStats>(STATS_KEY);
  if (!raw || typeof raw !== "object") return emptyStats();
  // Merge over defaults so old backups missing new fields stay safe.
  const base = emptyStats();
  const mastery =
    raw.mastery && typeof raw.mastery === "object" ? { ...raw.mastery } : {};
  // Migration: entries recorded before spaced reviews lack lastAt.
  for (const [id, m] of Object.entries(mastery)) {
    if (!m.lastAt) mastery[id] = { ...m, lastAt: m.seenAt };
  }
  return {
    ...base,
    ...raw,
    calibrationLog: Array.isArray(raw.calibrationLog) ? raw.calibrationLog : [],
    mastery,
    exams: raw.exams && typeof raw.exams === "object" ? raw.exams : {},
    challenges: { ...base.challenges, ...(raw.challenges ?? {}) },
  };
}

export function saveGymStats(stats: GymStats): void {
  storage.set(STATS_KEY, stats);
}

/** Load today's session; a stale record from another day starts fresh. */
export function loadGymDay(dateKey: string): GymDay {
  const raw = storage.get<GymDay>(DAY_KEY);
  if (raw && typeof raw === "object" && raw.date === dateKey) return raw;
  return { date: dateKey, step: 0 };
}

export function saveGymDay(day: GymDay): void {
  storage.set(DAY_KEY, day);
}

/* --------------------------- progress logic ------------------------- */

/** Record the calibration answer into day + stats (call once per day). */
export function recordCalibration(
  stats: GymStats,
  dateKey: string,
  q: CalibrationQuestion,
  estimate: number,
  confidence: ConfidenceLevel,
): GymStats {
  const grade = gradeEstimate(estimate, q.answer);
  const rec: CalibrationRecord = {
    date: dateKey,
    qId: q.id,
    estimate,
    answer: q.answer,
    confidence,
    within2x: grade.within2x,
    within10x: grade.within10x,
  };
  const log = [...stats.calibrationLog, rec].slice(-LOG_CAP);
  return { ...stats, calibrationLog: log };
}

/** Record a recall self-grade for a model (daily session or spaced review). */
export function recordRecall(
  stats: GymStats,
  modelId: string,
  grade: RecallGrade,
  dateKey: string,
): GymStats {
  const prev = stats.mastery[modelId];
  const next: ModelMastery = prev
    ? {
        ...prev,
        recalls: prev.recalls + 1,
        got: prev.got + (grade === "got" ? 1 : 0),
        lastGrade: grade,
        lastAt: dateKey,
      }
    : {
        seenAt: dateKey,
        recalls: 1,
        got: grade === "got" ? 1 : 0,
        lastGrade: grade,
        lastAt: dateKey,
      };
  return { ...stats, mastery: { ...stats.mastery, [modelId]: next } };
}

/* ------------------------- spaced reviews -------------------------- */

/**
 * Days until a trained model should be reviewed again. Missed answers
 * come back fast; clean recalls stretch out (1 → 3 → 7 → 21 → 45).
 */
export function reviewIntervalDays(m: ModelMastery): number {
  if (m.lastGrade === "missed") return 1;
  if (m.lastGrade === "fuzzy") return 3;
  if (m.got <= 1) return 7;
  if (m.got === 2) return 21;
  return 45;
}

/** Trained models whose review is due, most overdue first. */
export function dueReviews(
  stats: GymStats,
  dateKey: string,
  excludeId?: string,
): string[] {
  return Object.entries(stats.mastery)
    .filter(([id, m]) => {
      if (id === excludeId) return false;
      const overdue = daysBetween(m.lastAt, dateKey) - reviewIntervalDays(m);
      return overdue >= 0;
    })
    .sort(
      (a, b) =>
        daysBetween(b[1].lastAt, dateKey) -
        reviewIntervalDays(b[1]) -
        (daysBetween(a[1].lastAt, dateKey) - reviewIntervalDays(a[1])),
    )
    .map(([id]) => id);
}

/* --------------------------- domain exams -------------------------- */

/** Record an exam attempt; passing (score >= 4 of 5) seals the domain. */
export function recordExam(
  stats: GymStats,
  domain: string,
  score: number,
  dateKey: string,
): GymStats {
  const prev = stats.exams[domain];
  const passed = score >= 4;
  const next: DomainExam = {
    passedAt: prev?.passedAt ?? (passed ? dateKey : null),
    bestScore: Math.max(prev?.bestScore ?? 0, score),
    attempts: (prev?.attempts ?? 0) + 1,
  };
  return { ...stats, exams: { ...stats.exams, [domain]: next } };
}

/** Record the challenge outcome. */
export function recordChallenge(
  stats: GymStats,
  kind: ChallengeKind,
  correct: boolean | undefined,
): GymStats {
  const c = { ...stats.challenges };
  if (kind === "fallacy") {
    c.fallacyTotal += 1;
    if (correct) c.fallacyRight += 1;
  } else if (kind === "fermi") {
    c.fermiTotal += 1;
    if (correct) c.fermiHit += 1;
  } else {
    c.paradoxSeen += 1;
  }
  return { ...stats, challenges: c };
}

const FREEZE_CAP = 3;

/**
 * Mark the session complete; idempotent per day. A banked streak freeze
 * auto-covers exactly one missed day; every 7th consecutive day banks a
 * new freeze (capped).
 */
export function completeSession(stats: GymStats, dateKey: string): GymStats {
  if (stats.lastCompleted === dateKey) return stats;
  let streak: number;
  let freezes = stats.freezes;
  if (stats.lastCompleted === addDays(dateKey, -1)) {
    streak = stats.streak + 1;
  } else if (stats.lastCompleted === addDays(dateKey, -2) && freezes > 0) {
    // One day missed — a freeze silently absorbs it.
    freezes -= 1;
    streak = stats.streak + 1;
  } else {
    streak = 1;
  }
  if (streak > 0 && streak % 7 === 0) freezes = Math.min(freezes + 1, FREEZE_CAP);
  return {
    ...stats,
    streak,
    freezes,
    lastCompleted: dateKey,
    totalSessions: stats.totalSessions + 1,
  };
}

/** Streak shown on cards: alive if today, yesterday, or freeze-coverable. */
export function currentStreak(stats: GymStats, dateKey: string): number {
  if (stats.lastCompleted === dateKey) return stats.streak;
  if (stats.lastCompleted === addDays(dateKey, -1)) return stats.streak;
  if (stats.lastCompleted === addDays(dateKey, -2) && stats.freezes > 0) {
    return stats.streak;
  }
  return 0;
}

/* ------------------------- derived summaries ------------------------ */

export type CalibrationSummary = {
  n: number;
  within2xRate: number;
  within10xRate: number;
  /** Hit rate per confidence bucket (claimed vs actual). */
  buckets: Array<{
    confidence: ConfidenceLevel;
    n: number;
    hitRate: number;
  }>;
};

export function calibrationSummary(log: CalibrationRecord[]): CalibrationSummary {
  const n = log.length;
  const hits2 = log.filter((r) => r.within2x).length;
  const hits10 = log.filter((r) => r.within10x).length;
  const buckets = CONFIDENCE_LEVELS.map((confidence) => {
    const sub = log.filter((r) => r.confidence === confidence);
    const hits = sub.filter((r) => r.within2x).length;
    return {
      confidence,
      n: sub.length,
      hitRate: sub.length > 0 ? hits / sub.length : 0,
    };
  });
  return {
    n,
    within2xRate: n > 0 ? hits2 / n : 0,
    within10xRate: n > 0 ? hits10 / n : 0,
    buckets,
  };
}

export type MasteryCounts = {
  trained: number;
  solid: number; // recalled with at least one "got"
  total: number;
};

export function masteryCounts(stats: GymStats): MasteryCounts {
  const entries = Object.values(stats.mastery);
  return {
    trained: entries.length,
    solid: entries.filter((m) => m.got > 0).length,
    total: MENTAL_MODELS.length,
  };
}

/* --------------------------- formatting ---------------------------- */

/** Human-readable large numbers: 3400 → "3,400", 2.5e6 → "2.5 million". */
export function formatBig(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e12) return trim(n / 1e12) + " trillion";
  if (abs >= 1e9) return trim(n / 1e9) + " billion";
  if (abs >= 1e6) return trim(n / 1e6) + " million";
  if (abs >= 10000) return Math.round(n).toLocaleString("en-US");
  if (Number.isInteger(n)) return n.toLocaleString("en-US");
  return String(n);
}

function trim(x: number): string {
  const rounded = Math.round(x * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Describe how far off an estimate was, e.g. "2.3× under". */
export function describeMiss(grade: EstimateGrade): string {
  if (grade.side === "exact") return "spot on";
  if (!Number.isFinite(grade.ratio)) return "no valid estimate";
  const r = grade.ratio >= 10 ? Math.round(grade.ratio) : Math.round(grade.ratio * 10) / 10;
  return `${r}× ${grade.side}`;
}

/* ------------------------------ badges ----------------------------- */

export type Badge = {
  id: string;
  name: string;
  detail: string;
  earned: boolean;
};

/** Milestones derived from stats — nothing extra to store or migrate. */
export function earnedBadges(stats: GymStats): Badge[] {
  const cal = calibrationSummary(stats.calibrationLog);
  const b90 = cal.buckets.find((b) => b.confidence === 90);
  const mastery = masteryCounts(stats);
  const examsPassed = Object.values(stats.exams).filter((e) => e.passedAt).length;
  return [
    {
      id: "week-streak",
      name: "One Solid Week",
      detail: "7-day session streak",
      earned: stats.streak >= 7 || stats.totalSessions >= 7,
    },
    {
      id: "month-streak",
      name: "The Habit Is Real",
      detail: "30-day session streak",
      earned: stats.streak >= 30,
    },
    {
      id: "well-calibrated",
      name: "Well-Calibrated",
      detail: "“90% sure” right 85–95% of the time (20+ answers)",
      earned:
        !!b90 && b90.n >= 20 && b90.hitRate >= 0.85 && b90.hitRate <= 0.95,
    },
    {
      id: "first-exam",
      name: "First Seal",
      detail: "Pass a domain exam",
      earned: examsPassed >= 1,
    },
    {
      id: "all-exams",
      name: "Master of the Lattice",
      detail: "Pass every domain exam",
      earned: examsPassed >= 6,
    },
    {
      id: "full-lattice",
      name: "Full Lattice",
      detail: "Train all mental models",
      earned: mastery.trained >= mastery.total,
    },
    {
      id: "century",
      name: "Century",
      detail: "100 total sessions",
      earned: stats.totalSessions >= 100,
    },
  ];
}

/* ------------------------ calibration insight ---------------------- */

export type CategoryBias = {
  category: string;
  n: number;
  /** Net direction: positive = overestimates, negative = underestimates. */
  net: number;
};

/**
 * Per-category over/under tendency from the answer log. Uses the qId
 * prefix-agnostic category passed by the caller via a lookup function.
 */
export function categoryBias(
  log: CalibrationRecord[],
  categoryOf: (qId: string) => string | undefined,
): CategoryBias[] {
  const acc = new Map<string, { n: number; net: number }>();
  for (const r of log) {
    const cat = categoryOf(r.qId);
    if (!cat || r.estimate <= 0 || r.answer <= 0) continue;
    const cur = acc.get(cat) ?? { n: 0, net: 0 };
    cur.n += 1;
    cur.net += r.estimate > r.answer ? 1 : r.estimate < r.answer ? -1 : 0;
    acc.set(cat, cur);
  }
  return [...acc.entries()]
    .map(([category, v]) => ({ category, n: v.n, net: v.net }))
    .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
}
