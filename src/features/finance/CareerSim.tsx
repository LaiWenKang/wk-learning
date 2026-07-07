import { useEffect, useMemo, useRef, useState } from "react";
import type { FinanceScenario } from "../../types";
import { storage } from "../../lib/storage";
import { formatMoney, formatMoneyFull } from "../../lib/scoring";
import { Card, Field } from "../../components/ui";

/**
 * Career Path simulator: compare two salary trajectories — Path A
 * (steady growth) vs Path B (different growth, optionally with a one-time
 * jump such as a job switch). Mechanical arithmetic, not career advice.
 */

type CareerInputs = {
  currency: FinanceScenario["currency"];
  monthlySalary: number;
  growthA: number; // % per year
  growthB: number;
  jumpPct: number; // one-time raise for path B
  jumpYear: number;
  horizon: number;
};

const DEFAULTS: CareerInputs = {
  currency: "SGD",
  monthlySalary: 6000,
  growthA: 3,
  growthB: 4,
  jumpPct: 15,
  jumpYear: 3,
  horizon: 15,
};

const DRAFT_KEY = "career-draft";

type YearPoint = { year: number; a: number; b: number };

function simulatePaths(inp: CareerInputs): {
  points: YearPoint[];
  cumulativeA: number;
  cumulativeB: number;
  breakEvenYear: number | null;
} {
  const points: YearPoint[] = [];
  let cumulativeA = 0;
  let cumulativeB = 0;
  let breakEvenYear: number | null = null;
  for (let y = 0; y <= inp.horizon; y++) {
    const a = inp.monthlySalary * Math.pow(1 + inp.growthA / 100, y);
    const b =
      inp.monthlySalary *
      Math.pow(1 + inp.growthB / 100, y) *
      (y >= inp.jumpYear ? 1 + inp.jumpPct / 100 : 1);
    points.push({ year: y, a, b });
    if (y > 0) {
      cumulativeA += a * 12;
      cumulativeB += b * 12;
      if (breakEvenYear === null && cumulativeB > cumulativeA) breakEvenYear = y;
    }
  }
  return { points, cumulativeA, cumulativeB, breakEvenYear };
}

export function CareerSim() {
  const [inp, setInp] = useState<CareerInputs>(() => ({
    ...DEFAULTS,
    ...(storage.get<CareerInputs>(DRAFT_KEY) ?? {}),
  }));

  useEffect(() => {
    storage.set(DRAFT_KEY, inp);
  }, [inp]);

  const set = <K extends keyof CareerInputs>(key: K, value: CareerInputs[K]) =>
    setInp((s) => ({ ...s, [key]: value }));

  const sim = useMemo(() => simulatePaths(inp), [inp]);
  const diff = sim.cumulativeB - sim.cumulativeA;

  const num = (
    label: string,
    key: Exclude<keyof CareerInputs, "currency">,
    stepVal = 1,
    hint?: string,
  ) => (
    <Field label={label} hint={hint}>
      <input
        type="number"
        inputMode="decimal"
        step={stepVal}
        value={inp[key]}
        onChange={(e) => set(key, Number(e.target.value) || 0)}
      />
    </Field>
  );

  return (
    <div>
      <Card title="Career Path Comparison">
        <p className="card-muted" style={{ marginBottom: 12 }}>
          Compare staying on your current trajectory (Path A) against an
          alternative (Path B) — for example a switch with a one-time raise but
          different long-term growth. Numbers only; the non-salary factors are
          yours to weigh.
        </p>
        <Field label="Currency">
          <select
            value={inp.currency}
            onChange={(e) => set("currency", e.target.value as CareerInputs["currency"])}
          >
            <option value="SGD">SGD</option>
            <option value="MYR">MYR</option>
            <option value="USD">USD</option>
          </select>
        </Field>
        {num("Current monthly salary", "monthlySalary", 100)}
        {num("Path A · annual growth %", "growthA", 0.5, "Steady path")}
        {num("Path B · annual growth %", "growthB", 0.5, "Alternative path")}
        {num("Path B · one-time raise %", "jumpPct", 1, "e.g. a switch or promotion bump")}
        {num("…applied from year", "jumpYear", 1)}
        <Field label={`Years to compare: ${inp.horizon}`}>
          <input
            type="range"
            min={3}
            max={30}
            step={1}
            value={inp.horizon}
            onChange={(e) => set("horizon", Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </Field>
      </Card>

      <Card title="Result">
        <div
          className="stat-grid"
          style={{ marginBottom: 14, gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          <div className="stat-tile">
            <div className="stat-value" style={{ fontSize: 16 }}>
              {formatMoneyFull(sim.points[sim.points.length - 1].a, inp.currency)}
            </div>
            <div className="stat-label">Path A · monthly @ Y{inp.horizon}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-value" style={{ fontSize: 16 }}>
              {formatMoneyFull(sim.points[sim.points.length - 1].b, inp.currency)}
            </div>
            <div className="stat-label">Path B · monthly @ Y{inp.horizon}</div>
          </div>
          <div className="stat-tile" style={{ gridColumn: "1 / -1" }}>
            <div
              className="stat-value"
              style={{
                fontSize: 17,
                color: diff >= 0 ? "var(--positive)" : "var(--danger)",
              }}
            >
              {diff >= 0 ? "+" : "−"}
              {formatMoneyFull(Math.abs(diff), inp.currency)}
            </div>
            <div className="stat-label">
              Path B cumulative earnings vs Path A over {inp.horizon} years
              {sim.breakEvenYear !== null && diff >= 0
                ? ` · ahead from year ${sim.breakEvenYear}`
                : ""}
            </div>
          </div>
        </div>
        <CareerChart points={sim.points} currency={inp.currency} />
      </Card>
    </div>
  );
}

/* Two-series salary chart with crosshair tooltip. */
function CareerChart(props: { points: YearPoint[]; currency: CareerInputs["currency"] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const { points, currency } = props;
  if (points.length < 2) return null;

  const W = 640;
  const H = 260;
  const PAD = { top: 24, right: 12, bottom: 26, left: 66 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxYear = points[points.length - 1].year;
  const maxVal = Math.max(...points.map((p) => Math.max(p.a, p.b))) * 1.06;

  const x = (year: number) => PAD.left + (year / maxYear) * innerW;
  const y = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;
  const line = (get: (p: YearPoint) => number) =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${y(get(p)).toFixed(1)}`)
      .join(" ");

  const yearTickStep = Math.max(1, Math.ceil(maxYear / 6));
  const hovered = hoverYear !== null ? points.find((p) => p.year === hoverYear) : undefined;

  const onPointer = (e: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frac = ((e.clientX - rect.left) / rect.width) * W;
    const year = Math.round(((frac - PAD.left) / innerW) * maxYear);
    setHoverYear(Math.max(0, Math.min(maxYear, year)));
  };

  const tipLeftPct = hovered ? (x(hovered.year) / W) * 100 : 0;
  const tipFlip = tipLeftPct > 55;
  const last = points[points.length - 1];

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block", touchAction: "pan-y" }}
        role="img"
        aria-label="Monthly salary by year for both paths"
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onPointerLeave={() => setHoverYear(null)}
      >
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(maxVal * f)}
              y2={y(maxVal * f)}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 6}
              y={y(maxVal * f) + 4}
              textAnchor="end"
              fontSize={11}
              fill="var(--chart-muted)"
            >
              {formatMoney(maxVal * f, currency)}
            </text>
          </g>
        ))}
        {points
          .filter((p) => p.year % yearTickStep === 0)
          .map((p) => (
            <text
              key={p.year}
              x={x(p.year)}
              y={H - 6}
              textAnchor="middle"
              fontSize={11}
              fill="var(--chart-muted)"
            >
              Y{p.year}
            </text>
          ))}
        <path
          d={line((p) => p.a)}
          fill="none"
          stroke="var(--chart-series-1)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          pathLength={1}
          className="draw-in"
        />
        <path
          d={line((p) => p.b)}
          fill="none"
          stroke="var(--chart-series-2)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          pathLength={1}
          className="draw-in"
        />
        <text
          x={x(maxYear) - 4}
          y={y(last.a) + (last.a <= last.b ? 16 : -8)}
          textAnchor="end"
          fontSize={11}
          fontWeight={650}
          fill="var(--chart-series-1)"
        >
          Path A
        </text>
        <text
          x={x(maxYear) - 4}
          y={y(last.b) + (last.b < last.a ? 16 : -8)}
          textAnchor="end"
          fontSize={11}
          fontWeight={650}
          fill="var(--chart-series-2)"
        >
          Path B
        </text>
        {hovered && (
          <g>
            <line
              x1={x(hovered.year)}
              x2={x(hovered.year)}
              y1={PAD.top}
              y2={PAD.top + innerH}
              stroke="var(--border-strong)"
              strokeWidth={1}
            />
            <circle
              cx={x(hovered.year)}
              cy={y(hovered.a)}
              r={5}
              fill="var(--chart-series-1)"
              stroke="var(--bg-elevated)"
              strokeWidth={2}
            />
            <circle
              cx={x(hovered.year)}
              cy={y(hovered.b)}
              r={5}
              fill="var(--chart-series-2)"
              stroke="var(--bg-elevated)"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>
      {hovered && (
        <div
          className="chart-tip"
          style={{
            left: `${tipLeftPct}%`,
            top: 4,
            transform: tipFlip ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
          }}
        >
          <div className="tip-title">Year {hovered.year}</div>
          <div className="tip-row">
            <span className="tip-dot" style={{ background: "var(--chart-series-1)" }} />
            A · {formatMoneyFull(hovered.a, currency)}/mo
          </div>
          <div className="tip-row">
            <span className="tip-dot" style={{ background: "var(--chart-series-2)" }} />
            B · {formatMoneyFull(hovered.b, currency)}/mo
          </div>
        </div>
      )}
    </div>
  );
}
