import { describe, expect, it } from "vitest";
import { buildFeed, buildGuess, type FeedInputs } from "./feed";
import { CALIBRATION_QUESTIONS } from "../content/calibration";

const emptyInputs: FeedInputs = {
  signals: [],
  reflections: [],
  notes: [],
  calibrationLog: [],
  streak: 3,
};

const signal = (id: string) => ({
  id,
  title: `Signal ${id}`,
  url: `https://example.com/${id}`,
  source: "Test",
  category: "ai" as const,
  fetchedAt: "2026-07-09T00:00:00Z",
  score: 5,
  tags: [],
});

describe("buildFeed", () => {
  it("is deterministic per date and finite", () => {
    const a = buildFeed("2026-07-09", emptyInputs);
    const b = buildFeed("2026-07-09", emptyInputs);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.length).toBeGreaterThanOrEqual(10);
    expect(a.length).toBeLessThanOrEqual(20);
    expect(a[0].kind).toBe("intro");
    expect(a[a.length - 1].kind).toBe("outro");
  });

  it("varies between days", () => {
    const a = buildFeed("2026-07-09", emptyInputs);
    const b = buildFeed("2026-07-10", emptyInputs);
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });

  it("never duplicates a fact as the guess question", () => {
    for (let i = 0; i < 30; i++) {
      const date = `2026-08-${String(i + 1).padStart(2, "0")}`;
      const deck = buildFeed(date.slice(0, 10), emptyInputs);
      const factIds = deck
        .filter((c) => c.kind === "fact")
        .map((c) => (c.kind === "fact" ? c.q.id : ""));
      const guess = deck.find((c) => c.kind === "guess");
      expect(guess).toBeDefined();
      if (guess?.kind === "guess") {
        expect(factIds).not.toContain(guess.q.id);
      }
    }
  });

  it("includes up to three pulse signals when available", () => {
    const deck = buildFeed("2026-07-09", {
      ...emptyInputs,
      signals: [signal("a"), signal("b"), signal("c"), signal("d")],
    });
    expect(deck.filter((c) => c.kind === "pulse").length).toBe(3);
  });

  it("mines memories only past the age threshold", () => {
    const young = buildFeed("2026-07-09", {
      ...emptyInputs,
      reflections: [
        {
          id: "r1",
          date: "2026-07-01", // 8 days old — too fresh
          energy: 3,
          maturityScore: 3,
          reliabilityScore: 3,
          learnedToday: "Something meaningful I learned that day",
          improvedToday: "",
          oneThingToDoBetter: "",
          openLoops: "",
        },
      ],
    });
    expect(young.filter((c) => c.kind === "memory").length).toBe(0);

    const old = buildFeed("2026-07-09", {
      ...emptyInputs,
      reflections: [
        {
          id: "r1",
          date: "2026-05-01", // 69 days old
          energy: 3,
          maturityScore: 3,
          reliabilityScore: 3,
          learnedToday: "Something meaningful I learned that day",
          improvedToday: "",
          oneThingToDoBetter: "",
          openLoops: "",
        },
      ],
    });
    const mems = old.filter((c) => c.kind === "memory");
    expect(mems.length).toBe(1);
    if (mems[0].kind === "memory") expect(mems[0].daysAgo).toBe(69);
  });

  it("offers a rematch only for old bad misses", () => {
    const deck = buildFeed("2026-07-09", {
      ...emptyInputs,
      calibrationLog: [
        {
          date: "2026-05-01",
          qId: "moon-distance",
          estimate: 5000,
          answer: 384400,
          confidence: 90,
          within2x: false,
          within10x: false,
        },
        {
          date: "2026-07-05", // too recent
          qId: "everest-height",
          estimate: 100,
          answer: 8849,
          confidence: 50,
          within2x: false,
          within10x: false,
        },
      ],
    });
    const rematches = deck.filter((c) => c.kind === "rematch");
    expect(rematches.length).toBe(1);
    if (rematches[0].kind === "rematch") {
      expect(rematches[0].q.id).toBe("moon-distance");
      expect(rematches[0].previousEstimate).toBe(5000);
    }
  });
});

describe("buildGuess", () => {
  it("contains the true answer exactly once among three options", () => {
    for (const q of CALIBRATION_QUESTIONS.slice(0, 20)) {
      for (let seed = 0; seed < 5; seed++) {
        const g = buildGuess(q, seed);
        expect(g.options.length).toBe(3);
        expect(g.options.filter((o) => o === q.answer).length).toBe(1);
        expect(g.options[g.answerIdx]).toBe(q.answer);
        // Distractors are meaningfully wrong (>= 4x off).
        for (const o of g.options) {
          if (o !== q.answer) {
            const ratio = o > q.answer ? o / q.answer : q.answer / o;
            expect(ratio).toBeGreaterThanOrEqual(4);
          }
        }
      }
    }
  });
});
