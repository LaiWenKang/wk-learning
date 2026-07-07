import { describe, expect, it } from "vitest";
import {
  LEARNING_ACTIONS,
  MINDSET_PROMPTS,
  THINKING_CHALLENGES,
  dailyRotation,
} from "./prompts";

function dateKey(dayOffset: number): string {
  const d = new Date(Date.UTC(2026, 0, 1) + dayOffset * 86400000);
  return d.toISOString().slice(0, 10);
}

const POOLS = [
  ["mindset", MINDSET_PROMPTS, 1],
  ["challenge", THINKING_CHALLENGES, 2],
  ["action", LEARNING_ACTIONS, 3],
] as const;

describe("dailyRotation", () => {
  it("is deterministic for a given date + salt", () => {
    expect(dailyRotation(MINDSET_PROMPTS, dateKey(10), 1)).toBe(
      dailyRotation(MINDSET_PROMPTS, dateKey(10), 1),
    );
  });

  it("never repeats on two consecutive days", () => {
    for (const [, pool, salt] of POOLS) {
      for (let d = 0; d < pool.length * 12; d++) {
        const a = dailyRotation(pool, dateKey(d), salt);
        const b = dailyRotation(pool, dateKey(d + 1), salt);
        expect(a).not.toBe(b);
      }
    }
  });

  it("covers every item exactly once within a full cycle", () => {
    // Cycles are aligned to absolute epoch days (floor(day / n)), so the
    // test window must start on a real cycle boundary, not an arbitrary date.
    const DAY_MS = 86400000;
    const keyForAbsDay = (absDay: number) =>
      new Date(absDay * DAY_MS).toISOString().slice(0, 10);
    for (const [, pool, salt] of POOLS) {
      const n = pool.length;
      const someDay = Math.floor(Date.UTC(2026, 0, 1) / DAY_MS) + n * 3;
      const cycleStart = Math.ceil(someDay / n) * n; // next cycle boundary
      const seen = new Set<string>();
      for (let d = cycleStart; d < cycleStart + n; d++) {
        seen.add(dailyRotation(pool, keyForAbsDay(d), salt));
      }
      expect(seen.size).toBe(n);
    }
  });

  it("handles a single-item pool", () => {
    expect(dailyRotation(["only"], dateKey(5))).toBe("only");
  });

  it("throws on an empty pool", () => {
    expect(() => dailyRotation([], dateKey(0))).toThrow();
  });
});
