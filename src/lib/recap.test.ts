import { describe, expect, it } from "vitest";
import { buildWeeklyRecap } from "./recap";
import { emptyStats, recordCalibration, recordRecall } from "./gym";
import { CALIBRATION_QUESTIONS } from "../content/calibration";
import { searchLibrary } from "./librarySearch";
import type { ReflectionEntry } from "../types";

const refl = (date: string, learned: string): ReflectionEntry => ({
  id: date, date, energy: 3, maturityScore: 3, reliabilityScore: 3,
  learnedToday: learned, improvedToday: "", oneThingToDoBetter: "", openLoops: "",
});

describe("weekly recap", () => {
  it("aggregates the week and computes the calibration delta", () => {
    const q = CALIBRATION_QUESTIONS[0];
    let s = emptyStats();
    s = recordCalibration(s, "2026-07-01", q, q.answer * 5, 70); // prev week miss
    s = recordCalibration(s, "2026-07-08", q, q.answer, 70); // this week hit
    s = recordCalibration(s, "2026-07-09", q, q.answer * 1.5, 70); // hit
    s = recordRecall(s, "inversion", "got", "2026-07-09");
    s = { ...s, streak: 4 };
    const r = buildWeeklyRecap("2026-07-10", s, [
      refl("2026-07-09", "Correlation across failures beats depth-first"),
      refl("2026-05-01", "Old wisdom from months ago worth resurfacing"),
    ], ["2026-07-08", "2026-06-01"]);
    expect(r.streak).toBe(4);
    expect(r.calibration.n).toBe(2);
    expect(r.calibration.rate).toBe(1);
    expect(r.calibration.prevRate).toBe(0);
    expect(r.modelsTrained).toContain("Inversion");
    expect(r.briefsRead).toBe(1);
    expect(r.reflections).toBe(1);
    expect(r.bestLine).toContain("Correlation");
    expect(r.memory?.daysAgo).toBe(70);
  });
});

describe("library search", () => {
  it("finds items across all content types with title hits first", () => {
    const r = searchLibrary("inversion");
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].type).toBe("model");
    expect(r[0].title).toBe("Inversion");
    const types = new Set(searchLibrary("incentive").map((x) => x.type));
    expect(types.size).toBeGreaterThanOrEqual(3); // models, books, quotes...
  });

  it("ignores sub-2-char queries and caps results", () => {
    expect(searchLibrary("a")).toEqual([]);
    expect(searchLibrary("the").length).toBeLessThanOrEqual(30);
  });

  it("reaches every content type", () => {
    expect(searchLibrary("NAND").some((r) => r.type === "brief")).toBe(true);
    expect(searchLibrary("qual").some((r) => r.type === "case")).toBe(true);
    expect(searchLibrary("triage").some((r) => r.type === "playbook")).toBe(true);
    expect(searchLibrary("Munger").some((r) => r.type === "book" || r.type === "quote")).toBe(true);
    expect(searchLibrary("morning").some((r) => r.type === "meditation")).toBe(true);
  });
});
