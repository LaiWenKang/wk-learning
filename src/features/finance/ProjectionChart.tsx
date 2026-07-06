import type { YearProjection } from "../../lib/scoring";
import type { FinanceScenario } from "../../types";
import { formatMoney } from "../../lib/scoring";

/**
 * Lightweight SVG line chart: portfolio value and cumulative contributions
 * per year, with an optional target line. No chart library.
 */
export function ProjectionChart(props: {
  years: YearProjection[];
  target: number;
  currency: FinanceScenario["currency"];
}) {
  const { years, target, currency } = props;
  if (years.length < 2) return null;

  const W = 640;
  const H = 300;
  const PAD = { top: 16, right: 12, bottom: 28, left: 56 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(
    ...years.map((y) => y.portfolio),
    target > 0 ? target : 0,
  );
  const maxYear = years[years.length - 1].year;

  const x = (year: number) => PAD.left + (year / maxYear) * innerW;
  const y = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;

  const line = (get: (p: YearProjection) => number) =>
    years
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${y(get(p)).toFixed(1)}`)
      .join(" ");

  const portfolioPath = line((p) => p.portfolio);
  const investedPath = line((p) => p.invested + years[0].portfolio);

  // ~4 horizontal gridlines at round values
  const step = niceStep(maxVal / 4);
  const gridVals: number[] = [];
  for (let v = step; v <= maxVal; v += step) gridVals.push(v);

  const yearTicks = years
    .filter((p) => p.year % Math.max(1, Math.ceil(maxYear / 6)) === 0)
    .map((p) => p.year);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="Projected net worth by year"
    >
      {gridVals.map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(v)}
            y2={y(v)}
            stroke="var(--border)"
            strokeWidth={1}
          />
          <text
            x={PAD.left - 6}
            y={y(v) + 4}
            textAnchor="end"
            fontSize={11}
            fill="var(--text-tertiary)"
          >
            {formatMoney(v, currency)}
          </text>
        </g>
      ))}
      {yearTicks.map((yr) => (
        <text
          key={yr}
          x={x(yr)}
          y={H - 8}
          textAnchor="middle"
          fontSize={11}
          fill="var(--text-tertiary)"
        >
          Y{yr}
        </text>
      ))}
      {target > 0 && target <= maxVal && (
        <g>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(target)}
            y2={y(target)}
            stroke="var(--warning)"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <text
            x={W - PAD.right}
            y={y(target) - 5}
            textAnchor="end"
            fontSize={11}
            fill="var(--warning)"
          >
            Target
          </text>
        </g>
      )}
      <path d={investedPath} fill="none" stroke="var(--text-tertiary)" strokeWidth={1.5} strokeDasharray="3 3" />
      <path d={portfolioPath} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinejoin="round" />
      {/* Legend */}
      <g fontSize={11}>
        <line x1={PAD.left} x2={PAD.left + 18} y1={PAD.top} y2={PAD.top} stroke="var(--accent)" strokeWidth={2.5} />
        <text x={PAD.left + 24} y={PAD.top + 4} fill="var(--text-secondary)">
          Projected value
        </text>
        <line x1={PAD.left + 130} x2={PAD.left + 148} y1={PAD.top} y2={PAD.top} stroke="var(--text-tertiary)" strokeWidth={1.5} strokeDasharray="3 3" />
        <text x={PAD.left + 154} y={PAD.top + 4} fill="var(--text-secondary)">
          Contributions
        </text>
      </g>
    </svg>
  );
}

function niceStep(rough: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))));
  const base = rough / pow;
  const nice = base <= 1 ? 1 : base <= 2 ? 2 : base <= 5 ? 5 : 10;
  return nice * pow;
}
