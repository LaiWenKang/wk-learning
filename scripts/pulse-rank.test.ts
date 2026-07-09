import { describe, expect, it } from "vitest";
import {
  categorize,
  dedupeSignals,
  isSafeHttpUrl,
  normalizeUrl,
  scoreSignal,
  type PulseSignal,
} from "./pulse-rank.ts";

const keywords = {
  priority: ["nvme", "nand", "ssd controller"],
  high: ["ai", "typescript", "claude"],
  low: ["gossip", "meme coin"],
};

describe("isSafeHttpUrl", () => {
  it("accepts http and https", () => {
    expect(isSafeHttpUrl("https://example.com")).toBe(true);
    expect(isSafeHttpUrl("http://example.com/x")).toBe(true);
  });
  it("rejects javascript:, data:, and garbage", () => {
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("data:text/html,<script>")).toBe(false);
    expect(isSafeHttpUrl("not a url")).toBe(false);
    expect(isSafeHttpUrl("")).toBe(false);
  });
});

describe("scoreSignal", () => {
  it("boosts high-relevance keywords with whole-word matching", () => {
    const hit = scoreSignal("A guide to TypeScript and AI", undefined, undefined, keywords);
    const miss = scoreSignal("A guide to gardening", undefined, undefined, keywords);
    expect(hit.score).toBeGreaterThan(miss.score);
    expect(hit.matched).toContain("typescript");
  });

  it("does not match keywords inside other words (ai !== maintain)", () => {
    const r = scoreSignal("How to maintain a chairlift", undefined, undefined, keywords);
    expect(r.matched).not.toContain("ai");
  });

  it("sinks low-relevance keywords below the neutral base", () => {
    const r = scoreSignal("Celebrity gossip and meme coin hype", undefined, undefined, keywords);
    expect(r.score).toBeLessThan(3);
  });

  it("clamps into the 0..10 range", () => {
    const r = scoreSignal("ai ai ai typescript claude ai", undefined, undefined, keywords);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(10);
  });

  it("ranks priority-domain matches above general-interest matches", () => {
    const domain = scoreSignal("New NVMe NAND behavior found", undefined, undefined, keywords);
    const general = scoreSignal("New AI TypeScript tooling", undefined, undefined, keywords);
    expect(domain.score).toBeGreaterThan(general.score);
    expect(domain.matched[0]).toBe("nvme");
  });

  it("works without a priority list (backward compatible)", () => {
    const r = scoreSignal("An AI article", undefined, undefined, {
      high: ["ai"],
      low: [],
    });
    expect(r.matched).toEqual(["ai"]);
    expect(r.score).toBeGreaterThan(3);
  });

  it("puts priority tags ahead of high tags without duplicates", () => {
    const r = scoreSignal(
      "NVMe meets AI: an nvme story",
      undefined,
      undefined,
      keywords,
    );
    expect(r.matched[0]).toBe("nvme");
    expect(r.matched.filter((t) => t === "nvme").length).toBe(1);
    expect(r.matched).toContain("ai");
  });
});

describe("categorize", () => {
  it("picks the category with the most keyword hits", () => {
    const cat = categorize("A new LLM agent from an AI lab", undefined, "programming", {
      ai: ["llm", "ai", "agent"],
      programming: ["typescript"],
    });
    expect(cat).toBe("ai");
  });
  it("falls back when nothing matches", () => {
    expect(categorize("gardening tips", undefined, "health", { ai: ["llm"] })).toBe("health");
  });
});

describe("normalizeUrl", () => {
  it("strips tracking params and trailing slashes", () => {
    expect(normalizeUrl("https://x.com/a/?utm_source=y")).toBe("https://x.com/a");
  });
});

describe("dedupeSignals", () => {
  const mk = (id: string, url: string, title: string): PulseSignal => ({
    id,
    title,
    url,
    source: "s",
    category: "ai",
    fetchedAt: "2026-01-01T00:00:00Z",
    score: 5,
    tags: [],
  });

  it("removes duplicate URLs and titles", () => {
    const out = dedupeSignals([
      mk("1", "https://a.com/x", "Alpha"),
      mk("2", "https://a.com/x?utm_source=z", "Different title"),
      mk("3", "https://b.com/y", "Alpha"),
      mk("4", "https://c.com/z", "Gamma"),
    ]);
    // #2 dupes #1 by normalized URL; #3 dupes #1 by title.
    expect(out.map((s) => s.id)).toEqual(["1", "4"]);
  });
});
