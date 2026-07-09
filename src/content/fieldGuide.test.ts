import { describe, expect, it } from "vitest";
import {
  FIELD_AREAS,
  FIELD_BRIEFS,
  FIELD_BRIEF_BY_ID,
} from "./fieldGuide";

describe("field guide integrity", () => {
  it("has a substantial pool with unique ids", () => {
    expect(FIELD_BRIEFS.length).toBeGreaterThanOrEqual(12);
    expect(new Set(FIELD_BRIEFS.map((b) => b.id)).size).toBe(FIELD_BRIEFS.length);
    expect(FIELD_BRIEF_BY_ID.size).toBe(FIELD_BRIEFS.length);
  });

  it("every brief is complete and deep", () => {
    for (const b of FIELD_BRIEFS) {
      expect(FIELD_AREAS).toContain(b.area);
      expect(b.title.trim().length).toBeGreaterThan(5);
      // Real chapters, not one-liners.
      expect(b.what.trim().length, `${b.id} what`).toBeGreaterThan(120);
      expect(b.changed.trim().length, `${b.id} changed`).toBeGreaterThan(120);
      expect(b.matters.trim().length, `${b.id} matters`).toBeGreaterThan(120);
      expect(b.watch.length, `${b.id} watch`).toBeGreaterThanOrEqual(3);
      for (const w of b.watch) expect(w.trim().length).toBeGreaterThan(10);
    }
  });

  it("covers every area with at least one brief", () => {
    for (const area of FIELD_AREAS) {
      expect(
        FIELD_BRIEFS.some((b) => b.area === area),
        `area ${area}`,
      ).toBe(true);
    }
  });
});
