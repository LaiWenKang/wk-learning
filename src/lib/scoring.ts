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
