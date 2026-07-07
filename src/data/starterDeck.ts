import type { SignalCategory } from "../types";

/** Generic, public-knowledge starter cards for a fresh install. */
export const STARTER_DECK: {
  front: string;
  back: string;
  category: SignalCategory;
  tags: string[];
}[] = [
  {
    front: "What does it mean for an operation to be idempotent?",
    back: "Running it once or many times produces the same result — safe to retry.",
    category: "programming",
    tags: ["fundamentals"],
  },
  {
    front: "What is a race condition?",
    back: "A bug where the outcome depends on the timing/order of concurrent operations touching shared state.",
    category: "systems",
    tags: ["concurrency"],
  },
  {
    front: "Big-O: what does O(n log n) typically indicate?",
    back: "Divide-and-conquer work per element — the usual cost of good comparison sorts like mergesort.",
    category: "programming",
    tags: ["algorithms"],
  },
  {
    front: "What is the difference between latency and throughput?",
    back: "Latency = time for one operation; throughput = operations completed per unit time. Improving one can hurt the other.",
    category: "systems",
    tags: ["performance"],
  },
  {
    front: "What is a context window (LLMs)?",
    back: "The maximum amount of text (tokens) a model can consider at once — prompt plus generated output.",
    category: "ai",
    tags: ["llm"],
  },
  {
    front: "What does RAG stand for and do?",
    back: "Retrieval-Augmented Generation: fetch relevant documents first, then let the model answer using them.",
    category: "ai",
    tags: ["llm"],
  },
  {
    front: "What is dollar-cost averaging?",
    back: "Investing a fixed amount on a fixed schedule regardless of price, smoothing entry points over time.",
    category: "finance",
    tags: ["investing"],
  },
  {
    front: "What does an ETF expense ratio measure?",
    back: "The fund's annual operating cost as a percentage of your holdings — a direct drag on returns.",
    category: "finance",
    tags: ["investing"],
  },
  {
    front: "What three parts make a strong status update?",
    back: "Outcome first, then the current risk, then the specific ask.",
    category: "communication",
    tags: ["writing"],
  },
  {
    front: "What is the Pyramid Principle?",
    back: "Lead with the conclusion, then group supporting arguments beneath it — structure for busy readers.",
    category: "communication",
    tags: ["writing"],
  },
  {
    front: "What is the difference between a root cause and a trigger?",
    back: "The trigger is the event that set the failure off; the root cause is the underlying condition that made failure possible.",
    category: "career",
    tags: ["rca"],
  },
  {
    front: "What is timeboxing?",
    back: "Fixing the time budget for a task in advance and stopping when it's spent — controls open-ended work.",
    category: "productivity",
    tags: ["habits"],
  },
];
