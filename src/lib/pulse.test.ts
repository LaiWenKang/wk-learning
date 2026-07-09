import { describe, expect, it } from "vitest";
import {
  defaultWeights,
  groupOfCategory,
  weightedTopSignals,
} from "./pulse";
import { BOOK_DUELS } from "../content/duels";
import { PLAYBOOKS } from "../content/playbooks";
import type { PulseSignal } from "../types";

const sig = (id: string, category: PulseSignal["category"], score: number): PulseSignal => ({
  id,
  title: id,
  url: `https://example.com/${id}`,
  source: "t",
  category,
  fetchedAt: "2026-07-09T00:00:00Z",
  score,
  tags: [],
});

describe("signal tuning", () => {
  it("maps categories into dial groups", () => {
    expect(groupOfCategory("semiconductor")).toBe("storage");
    expect(groupOfCategory("firmware")).toBe("storage");
    expect(groupOfCategory("ai")).toBe("ai");
    expect(groupOfCategory("career")).toBe("other");
  });

  it("re-ranks by user weights and hides zeroed groups", () => {
    const data = {
      generatedAt: "",
      signals: [sig("a", "ai", 9), sig("s", "semiconductor", 6), sig("f", "finance", 8)],
    };
    const neutral = weightedTopSignals(data, 3, defaultWeights());
    expect(neutral.map((x) => x.id)).toEqual(["a", "f", "s"]);

    const tuned = weightedTopSignals(data, 3, {
      ...defaultWeights(),
      storage: 2,
      ai: 0.5,
    });
    expect(tuned[0].id).toBe("s"); // 6*2 = 12 beats 8 and 4.5

    const hidden = weightedTopSignals(data, 3, { ...defaultWeights(), finance: 0 });
    expect(hidden.map((x) => x.id)).not.toContain("f");
  });
});

describe("duel and playbook content", () => {
  it("duels are complete with substantial synthesis", () => {
    expect(BOOK_DUELS.length).toBeGreaterThanOrEqual(4);
    expect(new Set(BOOK_DUELS.map((d) => d.id)).size).toBe(BOOK_DUELS.length);
    for (const d of BOOK_DUELS) {
      expect(d.a.thesis.length).toBeGreaterThan(150);
      expect(d.b.thesis.length).toBeGreaterThan(150);
      expect(d.synthesis.length, d.id).toBeGreaterThan(300);
      expect(d.question.length).toBeGreaterThan(20);
    }
  });

  it("playbooks have earned steps", () => {
    expect(PLAYBOOKS.length).toBeGreaterThanOrEqual(6);
    for (const p of PLAYBOOKS) {
      expect(p.steps.length).toBeGreaterThanOrEqual(5);
      for (const s of p.steps) expect(s.do.length).toBeGreaterThan(15);
    }
  });
});
