import { describe, expect, it } from "vitest";
import { projectScenario, simulateScenario } from "./scoring";
import type { FinanceScenario } from "../types";

const base: FinanceScenario = {
  id: "t",
  name: "t",
  currency: "SGD",
  currentPortfolio: 50000,
  monthlyIncome: 6000,
  monthlyExpenses: 3000,
  monthlyInvestment: 2000,
  expectedAnnualReturnPct: 5,
  annualSalaryGrowthPct: 3,
  targetNetWorth: 1000000,
  volatilityPct: 10,
};

describe("projectScenario", () => {
  it("starts at the current portfolio in year 0", () => {
    const r = projectScenario(base, 30);
    expect(r.years[0].year).toBe(0);
    expect(r.years[0].portfolio).toBe(50000);
    expect(r.years[0].invested).toBe(0);
  });

  it("produces horizon + 1 yearly points", () => {
    expect(projectScenario(base, 30).years).toHaveLength(31);
  });

  it("grows monotonically with positive return and contributions", () => {
    const { years } = projectScenario(base, 30);
    for (let i = 1; i < years.length; i++) {
      expect(years[i].portfolio).toBeGreaterThan(years[i - 1].portfolio);
    }
  });

  it("splits final value into starting capital + contributions + growth", () => {
    const { years } = projectScenario(base, 30);
    const last = years[years.length - 1];
    expect(last.portfolio).toBeCloseTo(base.currentPortfolio + last.invested + last.growth, 2);
  });

  it("computes the savings rate from income", () => {
    expect(projectScenario(base, 10).monthlySavingsRate).toBeCloseTo(2000 / 6000, 5);
  });

  it("reports null years-to-target when unreachable in the horizon", () => {
    const r = projectScenario({ ...base, monthlyInvestment: 1, targetNetWorth: 1e12 }, 5);
    expect(r.yearsToTarget).toBeNull();
  });

  it("reaches a low target quickly", () => {
    const r = projectScenario({ ...base, targetNetWorth: 60000 }, 30);
    expect(r.yearsToTarget).not.toBeNull();
    expect(r.yearsToTarget!).toBeLessThan(5);
  });
});

describe("simulateScenario", () => {
  it("is deterministic across identical calls (seeded RNG)", () => {
    const a = simulateScenario(base, 20);
    const b = simulateScenario(base, 20);
    expect(a.successRate).toBe(b.successRate);
    expect(a.band.map((p) => p.p50)).toEqual(b.band.map((p) => p.p50));
  });

  it("keeps percentiles ordered p10 <= p50 <= p90", () => {
    const { band } = simulateScenario(base, 20);
    for (const p of band) {
      expect(p.p10).toBeLessThanOrEqual(p.p50);
      expect(p.p50).toBeLessThanOrEqual(p.p90);
    }
  });

  it("returns a success rate in [0, 1]", () => {
    const { successRate } = simulateScenario(base, 20);
    expect(successRate).toBeGreaterThanOrEqual(0);
    expect(successRate).toBeLessThanOrEqual(1);
  });

  it("collapses to a near-deterministic band at zero volatility", () => {
    const { band } = simulateScenario({ ...base, volatilityPct: 0 }, 20);
    const last = band[band.length - 1];
    expect(last.p90 - last.p10).toBeLessThan(1); // no spread without volatility
  });

  it("widens the band as volatility rises", () => {
    const spread = (v: number) => {
      const b = simulateScenario({ ...base, volatilityPct: v }, 20).band;
      const last = b[b.length - 1];
      return last.p90 - last.p10;
    };
    expect(spread(20)).toBeGreaterThan(spread(5));
  });
});
