import { describe, expect, it } from "vitest";
import {
  calibrationSummary,
  challengeKindFor,
  completeSession,
  currentStreak,
  describeMiss,
  emptyStats,
  formatBig,
  gradeEstimate,
  masteryCounts,
  pickDaily,
  ratioError,
  recordCalibration,
  recordChallenge,
  recordRecall,
} from "./gym";
import { addDays } from "./date";
import { MENTAL_MODELS, MODEL_BY_ID, MODEL_DOMAINS } from "../content/models";
import { CALIBRATION_QUESTIONS } from "../content/calibration";
import {
  FALLACY_CHALLENGES,
  FERMI_CHALLENGES,
  PARADOX_CHALLENGES,
} from "../content/challenges";

/* ------------------------- content validation ------------------------ */

describe("content library integrity", () => {
  it("has substantial pools", () => {
    expect(MENTAL_MODELS.length).toBeGreaterThanOrEqual(40);
    expect(CALIBRATION_QUESTIONS.length).toBeGreaterThanOrEqual(55);
    expect(FALLACY_CHALLENGES.length).toBeGreaterThanOrEqual(10);
    expect(PARADOX_CHALLENGES.length).toBeGreaterThanOrEqual(10);
    expect(FERMI_CHALLENGES.length).toBeGreaterThanOrEqual(10);
  });

  it("has unique ids in every pool", () => {
    for (const pool of [
      MENTAL_MODELS.map((m) => m.id),
      CALIBRATION_QUESTIONS.map((q) => q.id),
      [
        ...FALLACY_CHALLENGES.map((c) => c.id),
        ...PARADOX_CHALLENGES.map((c) => c.id),
        ...FERMI_CHALLENGES.map((c) => c.id),
      ],
    ]) {
      expect(new Set(pool).size).toBe(pool.length);
    }
  });

  it("every model is complete and its related ids resolve", () => {
    for (const m of MENTAL_MODELS) {
      expect(MODEL_DOMAINS).toContain(m.domain);
      expect(m.name.trim().length).toBeGreaterThan(3);
      for (const field of [
        m.hook,
        m.mechanism,
        m.example,
        m.failure,
        m.recall.q,
        m.recall.a,
        m.apply,
      ]) {
        expect(field.trim().length).toBeGreaterThan(10);
      }
      expect(m.related.length).toBeGreaterThan(0);
      for (const rel of m.related) {
        expect(MODEL_BY_ID.has(rel), `related id "${rel}" on ${m.id}`).toBe(true);
        expect(rel).not.toBe(m.id);
      }
    }
  });

  it("every domain has at least 5 models", () => {
    for (const d of MODEL_DOMAINS) {
      const n = MENTAL_MODELS.filter((m) => m.domain === d).length;
      expect(n, `domain ${d}`).toBeGreaterThanOrEqual(5);
    }
  });

  it("calibration questions have positive answers and context", () => {
    for (const q of CALIBRATION_QUESTIONS) {
      expect(Number.isFinite(q.answer), q.id).toBe(true);
      expect(q.answer).toBeGreaterThan(0);
      expect(q.unit.trim().length).toBeGreaterThan(0);
      expect(q.explain.trim().length).toBeGreaterThan(20);
    }
  });

  it("fallacy challenges are well-formed", () => {
    for (const c of FALLACY_CHALLENGES) {
      expect(c.options.length).toBe(4);
      expect(c.answerIdx).toBeGreaterThanOrEqual(0);
      expect(c.answerIdx).toBeLessThan(c.options.length);
      expect(c.explain.trim().length).toBeGreaterThan(40);
    }
  });

  it("fermi challenges have coherent accept bands", () => {
    for (const c of FERMI_CHALLENGES) {
      expect(c.low).toBeGreaterThan(0);
      expect(c.low).toBeLessThanOrEqual(c.answer);
      expect(c.answer).toBeLessThanOrEqual(c.high);
      expect(c.walkthrough.trim().length).toBeGreaterThan(40);
    }
  });
});

/* --------------------------- daily selection ------------------------- */

describe("pickDaily", () => {
  it("is deterministic for a given date", () => {
    const a = pickDaily("2026-07-09");
    const b = pickDaily("2026-07-09");
    expect(a.question.id).toBe(b.question.id);
    expect(a.model.id).toBe(b.model.id);
    expect(a.challenge.id).toBe(b.challenge.id);
  });

  it("rotates challenge kinds with period 3 covering all kinds", () => {
    const kinds = [0, 1, 2, 3, 4, 5].map((i) =>
      challengeKindFor(addDays("2026-07-01", i)),
    );
    expect(new Set(kinds.slice(0, 3)).size).toBe(3);
    expect(kinds[3]).toBe(kinds[0]);
    expect(kinds[4]).toBe(kinds[1]);
    expect(kinds[5]).toBe(kinds[2]);
  });

  it("challenge kind matches the served challenge shape", () => {
    for (let i = 0; i < 6; i++) {
      const day = pickDaily(addDays("2026-03-10", i));
      expect(day.challenge.kind).toBe(day.kind);
    }
  });

  it("never repeats a model within a full pool cycle", () => {
    const n = MENTAL_MODELS.length;
    // Align to the rotation's cycle boundary (cycles group absolute days).
    const someDay = Math.floor(Date.parse("2026-01-01T00:00:00Z") / 86400000);
    const cycleStart = Math.ceil(someDay / n) * n;
    const startKey = new Date(cycleStart * 86400000).toISOString().slice(0, 10);
    const seen = new Set<string>();
    for (let i = 0; i < n; i++) {
      seen.add(pickDaily(addDays(startKey, i)).model.id);
    }
    expect(seen.size).toBe(n);
  });
});

/* ---------------------------- estimate math -------------------------- */

describe("estimate grading", () => {
  it("computes symmetric ratio error", () => {
    expect(ratioError(100, 100)).toBe(1);
    expect(ratioError(200, 100)).toBe(2);
    expect(ratioError(50, 100)).toBe(2);
    expect(ratioError(1000, 100)).toBe(10);
  });

  it("treats invalid estimates as infinitely wrong", () => {
    expect(ratioError(0, 100)).toBe(Infinity);
    expect(ratioError(-5, 100)).toBe(Infinity);
    expect(ratioError(NaN, 100)).toBe(Infinity);
    expect(gradeEstimate(0, 100).within10x).toBe(false);
  });

  it("grades within-2x and within-10x at their boundaries", () => {
    expect(gradeEstimate(200, 100).within2x).toBe(true);
    expect(gradeEstimate(201, 100).within2x).toBe(false);
    expect(gradeEstimate(1000, 100).within10x).toBe(true);
    expect(gradeEstimate(1001, 100).within10x).toBe(false);
  });

  it("reports the miss side", () => {
    expect(gradeEstimate(100, 100).side).toBe("exact");
    expect(gradeEstimate(300, 100).side).toBe("over");
    expect(gradeEstimate(30, 100).side).toBe("under");
    expect(describeMiss(gradeEstimate(300, 100))).toBe("3× over");
    expect(describeMiss(gradeEstimate(100, 100))).toBe("spot on");
  });
});

/* ------------------------------ streaks ------------------------------ */

describe("streaks and session completion", () => {
  it("starts a streak at 1", () => {
    const s = completeSession(emptyStats(), "2026-07-09");
    expect(s.streak).toBe(1);
    expect(s.totalSessions).toBe(1);
    expect(s.lastCompleted).toBe("2026-07-09");
  });

  it("increments on consecutive days and resets after a gap", () => {
    let s = completeSession(emptyStats(), "2026-07-01");
    s = completeSession(s, "2026-07-02");
    expect(s.streak).toBe(2);
    s = completeSession(s, "2026-07-04"); // skipped the 3rd
    expect(s.streak).toBe(1);
    expect(s.totalSessions).toBe(3);
  });

  it("is idempotent within the same day", () => {
    let s = completeSession(emptyStats(), "2026-07-09");
    s = completeSession(s, "2026-07-09");
    expect(s.streak).toBe(1);
    expect(s.totalSessions).toBe(1);
  });

  it("currentStreak keeps yesterday's run alive but zeroes older ones", () => {
    let s = completeSession(emptyStats(), "2026-07-01");
    s = completeSession(s, "2026-07-02");
    expect(currentStreak(s, "2026-07-02")).toBe(2);
    expect(currentStreak(s, "2026-07-03")).toBe(2); // still today to extend
    expect(currentStreak(s, "2026-07-04")).toBe(0); // chain broken
  });
});

/* --------------------------- records & mastery ----------------------- */

describe("progress records", () => {
  it("logs calibration answers with grading", () => {
    const q = CALIBRATION_QUESTIONS[0];
    const s = recordCalibration(emptyStats(), "2026-07-09", q, q.answer * 1.5, 90);
    expect(s.calibrationLog.length).toBe(1);
    expect(s.calibrationLog[0].within2x).toBe(true);
    expect(s.calibrationLog[0].confidence).toBe(90);
  });

  it("summarizes calibration per confidence bucket", () => {
    const q = CALIBRATION_QUESTIONS[0];
    let s = emptyStats();
    s = recordCalibration(s, "d1", q, q.answer, 90); // hit
    s = recordCalibration(s, "d2", q, q.answer * 3, 90); // miss (>2x)
    s = recordCalibration(s, "d3", q, q.answer * 1.2, 50); // hit
    const sum = calibrationSummary(s.calibrationLog);
    expect(sum.n).toBe(3);
    expect(sum.within2xRate).toBeCloseTo(2 / 3);
    const b90 = sum.buckets.find((b) => b.confidence === 90)!;
    expect(b90.n).toBe(2);
    expect(b90.hitRate).toBeCloseTo(0.5);
  });

  it("tracks model mastery through recall grades", () => {
    let s = emptyStats();
    s = recordRecall(s, "inversion", "fuzzy", "2026-07-09");
    expect(s.mastery["inversion"].recalls).toBe(1);
    expect(s.mastery["inversion"].got).toBe(0);
    s = recordRecall(s, "inversion", "got", "2026-07-10");
    expect(s.mastery["inversion"].recalls).toBe(2);
    expect(s.mastery["inversion"].got).toBe(1);
    expect(s.mastery["inversion"].seenAt).toBe("2026-07-09");
    const counts = masteryCounts(s);
    expect(counts.trained).toBe(1);
    expect(counts.solid).toBe(1);
    expect(counts.total).toBe(MENTAL_MODELS.length);
  });

  it("tallies challenge outcomes by kind", () => {
    let s = emptyStats();
    s = recordChallenge(s, "fallacy", true);
    s = recordChallenge(s, "fallacy", false);
    s = recordChallenge(s, "fermi", true);
    s = recordChallenge(s, "paradox", undefined);
    expect(s.challenges.fallacyRight).toBe(1);
    expect(s.challenges.fallacyTotal).toBe(2);
    expect(s.challenges.fermiHit).toBe(1);
    expect(s.challenges.fermiTotal).toBe(1);
    expect(s.challenges.paradoxSeen).toBe(1);
  });
});

/* ----------------------------- formatting ---------------------------- */

describe("formatBig", () => {
  it("renders large scales in words and keeps small numbers exact", () => {
    expect(formatBig(3000000000000)).toBe("3 trillion");
    expect(formatBig(8100000000)).toBe("8.1 billion");
    expect(formatBig(2500000)).toBe("2.5 million");
    expect(formatBig(384400)).toBe("384,400");
    expect(formatBig(206)).toBe("206");
    expect(formatBig(2.5)).toBe("2.5");
  });
});
