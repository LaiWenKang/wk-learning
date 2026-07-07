export type SignalCategory =
  | "ai"
  | "programming"
  | "semiconductor"
  | "firmware"
  | "systems"
  | "finance"
  | "career"
  | "communication"
  | "productivity"
  | "health";

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  "ai",
  "programming",
  "semiconductor",
  "firmware",
  "systems",
  "finance",
  "career",
  "communication",
  "productivity",
  "health",
];

export const CATEGORY_LABELS: Record<SignalCategory, string> = {
  ai: "AI",
  programming: "Programming",
  semiconductor: "Semiconductor",
  firmware: "Firmware",
  systems: "Systems",
  finance: "Finance",
  career: "Career",
  communication: "Communication",
  productivity: "Productivity",
  health: "Health",
};

export type PulseSignal = {
  id: string;
  title: string;
  url: string;
  source: string;
  category: SignalCategory;
  summary?: string;
  whyItMatters?: string;
  publishedAt?: string;
  fetchedAt: string;
  score: number;
  tags: string[];
};

export type PulseLatest = {
  generatedAt: string;
  signals: PulseSignal[];
};

export type LearningItem = {
  id: string;
  createdAt: string;
  title: string;
  sourceUrl?: string;
  category: SignalCategory;
  note: string;
  keyTakeaway: string;
  action?: string;
  tags: string[];
  archived?: boolean;
};

export type Flashcard = {
  id: string;
  createdAt: string;
  front: string;
  back: string;
  category: SignalCategory;
  confidence: 1 | 2 | 3 | 4 | 5;
  nextReviewAt?: string;
  tags: string[];
};

export type ReflectionEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  energy: 1 | 2 | 3 | 4 | 5;
  maturityScore: 1 | 2 | 3 | 4 | 5;
  reliabilityScore: 1 | 2 | 3 | 4 | 5;
  learnedToday: string;
  improvedToday: string;
  oneThingToDoBetter: string;
  openLoops: string;
};

export type FinanceScenario = {
  id: string;
  name: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyInvestment: number;
  currentPortfolio: number;
  expectedAnnualReturnPct: number;
  annualSalaryGrowthPct: number;
  targetNetWorth: number;
  currency: "SGD" | "MYR" | "USD";
  /** Annual return volatility (std dev, %). Optional for old backups. */
  volatilityPct?: number;
};

export type RcaDraft = {
  id: string;
  createdAt: string;
  title: string;
  whatHappened: string;
  whatWasExpected: string;
  whatChanged: string;
  evidence: string;
  assumptions: string;
  ruledOut: string;
  rootCause: string;
  correctiveAction: string;
  preventionAction: string;
};

export type Rating = 1 | 2 | 3 | 4 | 5;
