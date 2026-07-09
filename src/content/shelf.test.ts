import { beforeEach, describe, expect, it, vi } from "vitest";
import { BOOKS, BOOK_AREAS, BOOK_BY_ID } from "./books";
import { UNPACKED_QUOTES, QUOTE_BY_ID } from "./quotes";
import { MEDITATIONS_SERIAL } from "./meditations";
import { MODEL_BY_ID } from "./models";

describe("bookshelf content integrity", () => {
  it("has substantial pools with unique ids", () => {
    expect(BOOKS.length).toBeGreaterThanOrEqual(12);
    expect(UNPACKED_QUOTES.length).toBeGreaterThanOrEqual(40);
    expect(MEDITATIONS_SERIAL.length).toBe(30);
    expect(new Set(BOOKS.map((b) => b.id)).size).toBe(BOOKS.length);
    expect(new Set(UNPACKED_QUOTES.map((q) => q.id)).size).toBe(UNPACKED_QUOTES.length);
    expect(BOOK_BY_ID.size).toBe(BOOKS.length);
    expect(QUOTE_BY_ID.size).toBe(UNPACKED_QUOTES.length);
  });

  it("every book distillation is complete and links resolve", () => {
    for (const b of BOOKS) {
      expect(BOOK_AREAS).toContain(b.area);
      expect(b.thesis.length).toBeGreaterThan(150);
      expect(b.ideas.length).toBeGreaterThanOrEqual(4);
      for (const idea of b.ideas) {
        expect(idea.name.length).toBeGreaterThan(3);
        expect(idea.text.length).toBeGreaterThan(80);
      }
      expect(b.quotes.length).toBeGreaterThanOrEqual(2);
      expect(b.critics.length, `${b.id} critics`).toBeGreaterThan(120);
      expect(b.oneThing.length).toBeGreaterThan(30);
      for (const rel of b.related) {
        expect(MODEL_BY_ID.has(rel), `book ${b.id} related "${rel}"`).toBe(true);
      }
    }
  });

  it("every quote carries all four unpacking parts", () => {
    for (const q of UNPACKED_QUOTES) {
      expect(q.text.length).toBeGreaterThan(15);
      expect(q.who.length).toBeGreaterThan(3);
      expect(q.context.length, q.id).toBeGreaterThan(50);
      expect(q.meaning.length, q.id).toBeGreaterThan(60);
      expect(q.failure.length, q.id).toBeGreaterThan(60);
      expect(q.ask.length, q.id).toBeGreaterThan(20);
    }
  });

  it("the serial is sequential and complete", () => {
    MEDITATIONS_SERIAL.forEach((inst, i) => {
      expect(inst.idx).toBe(i);
      expect(inst.ref).toMatch(/^Book \d+/);
      expect(inst.text.length, `instalment ${i}`).toBeGreaterThan(150);
      expect(inst.question.length, `instalment ${i}`).toBeGreaterThan(30);
    });
  });
});

/* serial state machine (uses localStorage via the storage adapter) */
describe("serial progression", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      key: (i: number) => [...store.keys()][i] ?? null,
      get length() {
        return store.size;
      },
    });
  });

  it("advances once per day and resumes after gaps", async () => {
    const { loadSerial, advanceSerial, serialDone } = await import("../lib/shelf");
    let s = loadSerial();
    expect(s.idx).toBe(0);
    s = advanceSerial(s, "2026-07-09");
    expect(s.idx).toBe(1);
    // Second read same day: no advance (re-reading is free).
    s = advanceSerial(s, "2026-07-09");
    expect(s.idx).toBe(1);
    // Missed three days — resumes at instalment 1, not 4.
    s = advanceSerial(s, "2026-07-13");
    expect(s.idx).toBe(2);
    expect(serialDone(s)).toBe(false);
  });
});
