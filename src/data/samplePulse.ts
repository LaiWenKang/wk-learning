import type { PulseLatest } from "../types";

/**
 * Bundled demo brief shown when public/data/latest.json is missing or
 * unreachable. All entries point at generic public resources.
 */
export const SAMPLE_PULSE: PulseLatest = {
  generatedAt: "2026-01-01T00:00:00.000Z",
  signals: [
    {
      id: "sample-1",
      title: "Attention Is All You Need — the paper behind modern LLMs",
      url: "https://arxiv.org/abs/1706.03762",
      source: "arXiv",
      category: "ai",
      summary:
        "The transformer architecture paper that underpins today's large language models.",
      whyItMatters:
        "Understanding transformers helps you reason about what AI tools can and cannot do.",
      publishedAt: "2017-06-12T00:00:00.000Z",
      fetchedAt: "2026-01-01T00:00:00.000Z",
      score: 9,
      tags: ["ai", "llm", "foundational"],
    },
    {
      id: "sample-2",
      title: "TypeScript Handbook — narrowing and type guards",
      url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      source: "typescriptlang.org",
      category: "programming",
      summary: "Official guide to writing safer TypeScript with control-flow narrowing.",
      whyItMatters: "Narrowing is the core skill that makes strict TypeScript pleasant.",
      fetchedAt: "2026-01-01T00:00:00.000Z",
      score: 8,
      tags: ["typescript", "programming"],
    },
    {
      id: "sample-3",
      title: "What every programmer should know about memory",
      url: "https://lwn.net/Articles/250967/",
      source: "LWN.net",
      category: "systems",
      summary:
        "Ulrich Drepper's classic deep dive into caches, DRAM, and memory hierarchies.",
      whyItMatters:
        "Memory behaviour explains a large share of real-world performance mysteries.",
      fetchedAt: "2026-01-01T00:00:00.000Z",
      score: 8,
      tags: ["systems", "dram", "performance"],
    },
    {
      id: "sample-4",
      title: "The Psychology of Money — key ideas",
      url: "https://www.collabfund.com/blog/the-psychology-of-money/",
      source: "Collab Fund",
      category: "finance",
      summary:
        "Morgan Housel's essay on how behaviour, not spreadsheets, drives financial outcomes.",
      whyItMatters:
        "Long-horizon investing is mostly about temperament and consistency.",
      fetchedAt: "2026-01-01T00:00:00.000Z",
      score: 7,
      tags: ["finance", "investing", "behaviour"],
    },
    {
      id: "sample-5",
      title: "How to write a postmortem — Google SRE workbook",
      url: "https://sre.google/workbook/postmortem-culture/",
      source: "sre.google",
      category: "career",
      summary:
        "Blameless postmortem culture and templates from the Google SRE workbook.",
      whyItMatters:
        "Clear, blameless RCA writing is a visible signal of engineering maturity.",
      fetchedAt: "2026-01-01T00:00:00.000Z",
      score: 7,
      tags: ["career", "rca", "reliability"],
    },
  ],
};
