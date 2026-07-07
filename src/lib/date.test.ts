import { describe, expect, it } from "vitest";
import { addDays, daysBetween, greetingForHour, todayKey } from "./date";

describe("date helpers", () => {
  it("todayKey formats as YYYY-MM-DD", () => {
    expect(todayKey(new Date("2026-07-07T13:00:00"))).toBe("2026-07-07");
  });

  it("addDays crosses month boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("daysBetween counts forward and backward", () => {
    expect(daysBetween("2026-01-01", "2026-01-08")).toBe(7);
    expect(daysBetween("2026-01-08", "2026-01-01")).toBe(-7);
  });

  it("greetingForHour changes across the day", () => {
    expect(greetingForHour(8)).toMatch(/morning/i);
    expect(greetingForHour(14)).toMatch(/afternoon/i);
    expect(greetingForHour(20)).toMatch(/evening/i);
  });
});

// The reflection streak logic lives in stats.ts but depends on `todayKey`
// (real clock); addDays/daysBetween are its pure building blocks, covered above.
