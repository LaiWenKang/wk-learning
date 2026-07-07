import { useEffect, useMemo, useState } from "react";
import type { FinanceScenario } from "../../types";
import {
  STORE_KEYS,
  loadList,
  newId,
  removeItem,
  storage,
  upsertItem,
} from "../../lib/storage";
import { formatMoneyFull, projectScenario, simulateScenario } from "../../lib/scoring";
import { Card, EmptyState, Field } from "../../components/ui";
import { ProjectionChart } from "./ProjectionChart";
import { ProgressRing } from "./ProgressRing";

type FinanceInputs = Omit<FinanceScenario, "id" | "name">;

const DEFAULT_INPUTS: FinanceInputs = {
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

const DRAFT_KEY = "finance-draft";

type FinanceDraft = { inputs: FinanceInputs; horizon: number };

export function FinancePage() {
  const [inputs, setInputs] = useState<FinanceInputs>(() => {
    const draft = storage.get<FinanceDraft>(DRAFT_KEY);
    return draft?.inputs ? { ...DEFAULT_INPUTS, ...draft.inputs } : DEFAULT_INPUTS;
  });
  const [horizon, setHorizon] = useState(
    () => storage.get<FinanceDraft>(DRAFT_KEY)?.horizon ?? 30,
  );

  // The inputs survive a reload even without saving a named scenario.
  useEffect(() => {
    storage.set<FinanceDraft>(DRAFT_KEY, { inputs, horizon });
  }, [inputs, horizon]);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarios, setScenarios] = useState<FinanceScenario[]>(() =>
    loadList<FinanceScenario>(STORE_KEYS.financeScenarios),
  );

  const set = <K extends keyof typeof inputs>(key: K, value: (typeof inputs)[K]) =>
    setInputs((s) => ({ ...s, [key]: value }));

  const numField = (
    label: string,
    key: keyof Omit<typeof inputs, "currency">,
    stepVal = 100,
  ) => (
    <Field label={label}>
      <input
        type="number"
        inputMode="decimal"
        step={stepVal}
        value={inputs[key]}
        onChange={(e) => set(key, Number(e.target.value) || 0)}
      />
    </Field>
  );

  const projection = useMemo(
    () => projectScenario({ id: "live", name: "live", ...inputs }, horizon),
    [inputs, horizon],
  );

  const simulation = useMemo(
    () =>
      (inputs.volatilityPct ?? 0) > 0
        ? simulateScenario({ id: "live", name: "live", ...inputs }, horizon)
        : null,
    [inputs, horizon],
  );

  const monthlySurplus = inputs.monthlyIncome - inputs.monthlyExpenses;
  const finalYear = projection.years[projection.years.length - 1];

  const saveScenario = () => {
    const name = scenarioName.trim() || `Scenario ${scenarios.length + 1}`;
    const scenario: FinanceScenario = { id: newId(), name, ...inputs };
    setScenarios(upsertItem(STORE_KEYS.financeScenarios, scenario));
    setScenarioName("");
  };

  const loadScenario = (s: FinanceScenario) => {
    const { id, name, ...rest } = s;
    void id;
    setScenarioName(name);
    // Scenarios saved before v0.3 have no volatility — use the default.
    setInputs({ ...rest, volatilityPct: rest.volatilityPct ?? DEFAULT_INPUTS.volatilityPct });
    window.scrollTo({ top: 0 });
  };

  const deleteScenario = (id: string) =>
    setScenarios(removeItem<FinanceScenario>(STORE_KEYS.financeScenarios, id));

  const comparison = useMemo(
    () =>
      scenarios.map((s) => {
        const p = projectScenario(s, horizon);
        return {
          scenario: s,
          final: p.years[p.years.length - 1].portfolio,
          yearsToTarget: p.yearsToTarget,
          savingsRate: p.monthlySavingsRate,
        };
      }),
    [scenarios, horizon],
  );

  return (
    <div>
      <h1 className="page-title">Finance Simulator</h1>
      <p className="page-subtitle">
        Personal scenario modelling with simplified assumptions — not financial
        advice. Inputs stay on this device.
      </p>

      <Card title="Inputs">
        <Field label="Currency">
          <select
            value={inputs.currency}
            onChange={(e) => set("currency", e.target.value as FinanceScenario["currency"])}
          >
            <option value="SGD">SGD</option>
            <option value="MYR">MYR</option>
            <option value="USD">USD</option>
          </select>
        </Field>
        {numField("Current portfolio", "currentPortfolio", 1000)}
        {numField("Monthly income", "monthlyIncome")}
        {numField("Monthly expenses", "monthlyExpenses")}
        {numField("Monthly investment", "monthlyInvestment")}
        {numField("Expected annual return %", "expectedAnnualReturnPct", 0.5)}
        {numField("Annual salary growth %", "annualSalaryGrowthPct", 0.5)}
        <Field
          label="Return volatility % (annual)"
          hint="How bumpy the ride is. 0 hides the uncertainty band; ~10–18 is typical for broad equity indexes."
        >
          <input
            type="number"
            inputMode="decimal"
            step={1}
            min={0}
            value={inputs.volatilityPct ?? 0}
            onChange={(e) =>
              set("volatilityPct", Math.max(0, Number(e.target.value) || 0))
            }
          />
        </Field>
        {numField("Target net worth", "targetNetWorth", 10000)}
        <Field label={`Years to project: ${horizon}`}>
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </Field>
        {inputs.monthlyInvestment > monthlySurplus && (
          <div className="notice" style={{ marginBottom: 0 }}>
            Monthly investment exceeds income minus expenses — check the inputs.
          </div>
        )}
      </Card>

      <Card title="Projection">
        <div
          className="stat-grid"
          style={{ marginBottom: 14, gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          <div className="stat-tile">
            <div className="stat-value">
              {Math.round(projection.monthlySavingsRate * 100)}%
            </div>
            <div className="stat-label">Savings rate</div>
          </div>
          <div className="stat-tile">
            <div className="stat-value">
              {projection.yearsToTarget === null
                ? `>${horizon}y`
                : `${projection.yearsToTarget.toFixed(1)}y`}
            </div>
            <div className="stat-label">To target</div>
          </div>
          <ProgressRing
            fraction={
              inputs.targetNetWorth > 0
                ? inputs.currentPortfolio / inputs.targetNetWorth
                : 0
            }
            label="Of target today"
          />
          <div className="stat-tile">
            <div className="stat-value" style={{ fontSize: 16 }}>
              {formatMoneyFull(finalYear.portfolio, inputs.currency)}
            </div>
            <div className="stat-label">Year {horizon} value</div>
          </div>
          {simulation && inputs.targetNetWorth > 0 && (
            <div className="stat-tile" style={{ gridColumn: "1 / -1" }}>
              <div className="stat-value">
                {Math.round(simulation.successRate * 100)}%
              </div>
              <div className="stat-label">
                Of {200} simulated runs reach the target within {horizon} years
              </div>
            </div>
          )}
        </div>
        <ProjectionChart
          years={projection.years}
          target={inputs.targetNetWorth}
          currency={inputs.currency}
          band={simulation?.band}
        />

        {/* Where the year-N value comes from: starting capital,
            contributions, and compound growth. */}
        <h3 className="section-title" style={{ marginTop: 18 }}>
          Year {horizon} breakdown
        </h3>
        {(() => {
          const start = Math.max(0, inputs.currentPortfolio);
          const contrib = Math.max(0, finalYear.invested);
          const growth = Math.max(0, finalYear.growth);
          const total = start + contrib + growth || 1;
          const segs = [
            { name: "Starting capital", value: start, color: "var(--chart-series-3)" },
            { name: "Contributions", value: contrib, color: "var(--chart-series-2)" },
            { name: "Growth", value: growth, color: "var(--chart-series-1)" },
          ].filter((s) => s.value > 0);
          return (
            <>
              <div className="composition" role="img" aria-label="Portfolio composition">
                {segs.map((s) => (
                  <div
                    key={s.name}
                    className="comp-seg"
                    style={{ flexGrow: s.value / total, background: s.color }}
                  />
                ))}
              </div>
              <div className="comp-legend">
                {segs.map((s) => (
                  <span key={s.name} className="comp-key">
                    <span className="comp-dot" style={{ background: s.color }} />
                    {s.name} · {formatMoneyFull(s.value, inputs.currency)} (
                    {Math.round((s.value / total) * 100)}%)
                  </span>
                ))}
              </div>
            </>
          );
        })()}
        <div className="table-wrap" style={{ marginTop: 12 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Projected value</th>
                <th>Contributions</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {projection.years
                .filter((p) => p.year % Math.max(1, Math.ceil(horizon / 15)) === 0)
                .map((p) => (
                  <tr key={p.year}>
                    <td>{p.year}</td>
                    <td>{formatMoneyFull(p.portfolio, inputs.currency)}</td>
                    <td>{formatMoneyFull(p.invested, inputs.currency)}</td>
                    <td>{formatMoneyFull(p.growth, inputs.currency)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Save as Scenario">
        <Field label="Scenario name">
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="e.g. Baseline, Aggressive saving, Career switch"
          />
        </Field>
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={saveScenario}>
            Save Scenario
          </button>
        </div>
      </Card>

      <h2 className="section-title">Scenario Comparison</h2>
      {comparison.length === 0 ? (
        <EmptyState>
          No saved scenarios. Save the current inputs to start comparing.
        </EmptyState>
      ) : (
        <Card>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Savings rate</th>
                  <th>Years to target</th>
                  <th>Value @ Y{horizon}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(({ scenario: s, final, yearsToTarget, savingsRate }) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{Math.round(savingsRate * 100)}%</td>
                    <td>{yearsToTarget === null ? `>${horizon}` : yearsToTarget.toFixed(1)}</td>
                    <td>{formatMoneyFull(final, s.currency)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="btn btn-soft btn-small"
                          onClick={() => loadScenario(s)}
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-small"
                          onClick={() => deleteScenario(s.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
