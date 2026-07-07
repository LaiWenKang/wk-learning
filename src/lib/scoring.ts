import type { FinanceScenario } from "../types";

/** One projected year of a finance scenario. */
export type YearProjection = {
  year: number; // 0 = now
  portfolio: number;
  invested: number; // cumulative contributions
  growth: number; // cumulative growth
  monthlyInvestment: number; // contribution rate during that year
};

export type ProjectionResult = {
  years: YearProjection[];
  yearsToTarget: number | null; // null = not reached within horizon
  monthlySavingsRate: number; // fraction of income saved/invested
};

/**
 * Month-by-month compound projection.
 * Monthly investment grows with salary growth (applied yearly).
 * Purely mechanical scenario modelling — not financial advice.
 */
export function projectScenario(
  s: FinanceScenario,
  horizonYears: number,
): ProjectionResult {
  const monthlyReturn = Math.pow(1 + s.expectedAnnualReturnPct / 100, 1 / 12) - 1;
  let portfolio = s.currentPortfolio;
  let invested = 0;
  let monthlyInvestment = s.monthlyInvestment;
  let yearsToTarget: number | null = portfolio >= s.targetNetWorth ? 0 : null;

  const years: YearProjection[] = [
    {
      year: 0,
      portfolio,
      invested: 0,
      growth: 0,
      monthlyInvestment,
    },
  ];

  for (let year = 1; year <= horizonYears; year++) {
    for (let m = 0; m < 12; m++) {
      portfolio = portfolio * (1 + monthlyReturn) + monthlyInvestment;
      invested += monthlyInvestment;
      if (yearsToTarget === null && portfolio >= s.targetNetWorth) {
        yearsToTarget = year - 1 + (m + 1) / 12;
      }
    }
    years.push({
      year,
      portfolio,
      invested,
      growth: portfolio - s.currentPortfolio - invested,
      monthlyInvestment,
    });
    // Assume investment contribution scales with salary growth.
    monthlyInvestment *= 1 + s.annualSalaryGrowthPct / 100;
  }

  const monthlySavingsRate =
    s.monthlyIncome > 0 ? s.monthlyInvestment / s.monthlyIncome : 0;

  return { years, yearsToTarget, monthlySavingsRate };
}

/* ---------------- Monte-Carlo uncertainty simulation ---------------- */

export type BandPoint = { year: number; p10: number; p50: number; p90: number };

export type SimulationResult = {
  band: BandPoint[];
  /** Fraction of runs whose portfolio reached the target within the horizon. */
  successRate: number;
};

/** Deterministic seeded RNG (LCG) + Box–Muller gaussian. */
function makeGaussian(seed: number): () => number {
  let s = (seed ^ 0x9e3779b9) >>> 0;
  const uniform = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return (s + 0.5) / 0x100000000;
  };
  return () => {
    const u = uniform();
    const v = uniform();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

/**
 * Run `runs` seeded simulations with normally-distributed monthly returns
 * around the expected return, and summarize the 10th/50th/90th percentile
 * portfolio value per year plus the share of runs that hit the target.
 * Deterministic (fixed seed) so the UI is stable across renders.
 * Simplified model — scenario exploration, not financial advice.
 */
export function simulateScenario(
  s: FinanceScenario,
  horizonYears: number,
  runs = 200,
): SimulationResult {
  const vol = Math.max(0, s.volatilityPct ?? 0) / 100;
  const meanMonthly = Math.pow(1 + s.expectedAnnualReturnPct / 100, 1 / 12) - 1;
  const sdMonthly = vol / Math.sqrt(12);

  // yearValues[y] = portfolio value of each run at end of year y
  const yearValues: number[][] = Array.from({ length: horizonYears + 1 }, () => []);
  let successes = 0;

  for (let run = 0; run < runs; run++) {
    const gauss = makeGaussian(run * 7919 + 17);
    let portfolio = s.currentPortfolio;
    let monthlyInvestment = s.monthlyInvestment;
    let hit = portfolio >= s.targetNetWorth && s.targetNetWorth > 0;
    yearValues[0].push(portfolio);
    for (let year = 1; year <= horizonYears; year++) {
      for (let m = 0; m < 12; m++) {
        const monthlyReturn = meanMonthly + sdMonthly * gauss();
        portfolio = Math.max(0, portfolio * (1 + monthlyReturn) + monthlyInvestment);
        if (s.targetNetWorth > 0 && portfolio >= s.targetNetWorth) hit = true;
      }
      yearValues[year].push(portfolio);
      monthlyInvestment *= 1 + s.annualSalaryGrowthPct / 100;
    }
    if (hit) successes++;
  }

  const pct = (sorted: number[], p: number) =>
    sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];

  const band: BandPoint[] = yearValues.map((vals, year) => {
    const sorted = [...vals].sort((a, b) => a - b);
    return {
      year,
      p10: pct(sorted, 0.1),
      p50: pct(sorted, 0.5),
      p90: pct(sorted, 0.9),
    };
  });

  return { band, successRate: successes / runs };
}

export function formatMoney(value: number, currency: FinanceScenario["currency"]): string {
  const abs = Math.abs(value);
  let compact: string;
  if (abs >= 1_000_000) compact = (value / 1_000_000).toFixed(2) + "M";
  else if (abs >= 10_000) compact = Math.round(value / 1000) + "k";
  else compact = Math.round(value).toLocaleString();
  return `${currency} ${compact}`;
}

export function formatMoneyFull(
  value: number,
  currency: FinanceScenario["currency"],
): string {
  return `${currency} ${Math.round(value).toLocaleString()}`;
}
