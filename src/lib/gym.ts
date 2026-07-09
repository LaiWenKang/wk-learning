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
import { addDays } from "./date";

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

/** The full session for a date — deterministic and repeat-free per pool. */
export function pickDaily(dateKey: string): DailyGym {
  const question = dailyRotation(CALIBRATION_QUESTIONS, dateKey, 11);
  const model = dailyRotation(MENTAL_MODELS, dateKey, 12);
  const kind = challengeKindFor(dateKey);
  const challenge: Challenge =
    kind === "fallacy"
      ? dailyRotation(FALLACY_CHALLENGES, dateKey, 13)
      : kind === "paradox"
        ? dailyRotation(PARADOX_CHALLENGES, dateKey, 14)
        : dailyRotation(FERMI_CHALLENGES, dateKey, 15);
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
};

export type GymStats = {
  streak: number;
  lastCompleted: string | null;
  totalSessions: number;
  calibrationLog: CalibrationRecord[];
  mastery: Record<string, ModelMastery>;
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
  /** 0 calibrate · 1 learn · 2 recall · 3 challenge · 4 done/summary */
  step: number;
  calibration?: {
    estimate: number;
    confidence: ConfidenceLevel;
    within2x: boolean;
  };
  recallGrade?: RecallGrade;
  challenge?: GymDayChallenge;
  completedAt?: string;
};

export function emptyStats(): GymStats {
  return {
    streak: 0,
    lastCompleted: null,
    totalSessions: 0,
    calibrationLog: [],
    mastery: {},
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
  return {
    ...base,
    ...raw,
    calibrationLog: Array.isArray(raw.calibrationLog) ? raw.calibrationLog : [],
    mastery: raw.mastery && typeof raw.mastery === "object" ? raw.mastery : {},
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

/** Record a recall self-grade for a model. */
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
      }
    : {
        seenAt: dateKey,
        recalls: 1,
        got: grade === "got" ? 1 : 0,
        lastGrade: grade,
      };
  return { ...stats, mastery: { ...stats.mastery, [modelId]: next } };
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

/** Mark the session complete; streak math is idempotent per day. */
export function completeSession(stats: GymStats, dateKey: string): GymStats {
  if (stats.lastCompleted === dateKey) return stats;
  const streak =
    stats.lastCompleted === addDays(dateKey, -1) ? stats.streak + 1 : 1;
  return {
    ...stats,
    streak,
    lastCompleted: dateKey,
    totalSessions: stats.totalSessions + 1,
  };
}

/** Streak shown on cards: today counts, and yesterday's run isn't lost yet. */
export function currentStreak(stats: GymStats, dateKey: string): number {
  if (stats.lastCompleted === dateKey) return stats.streak;
  if (stats.lastCompleted === addDays(dateKey, -1)) return stats.streak;
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
