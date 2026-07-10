import { useRef, useState } from "react";
import type { BandPoint, YearProjection } from "../../lib/scoring";
import type { FinanceScenario } from "../../types";
import { formatMoney, formatMoneyFull } from "../../lib/scoring";

/**
 * Net-worth projection chart. Two series on one scale — projected value
 * (solid, series-1 blue) and cumulative contributions (dashed, series-2
 * aqua) — plus a reference hairline for the target. Colors are the
 * validated chart palette from global.css. Legend + direct labels carry
 * identity; a pointer crosshair with a tooltip covers touch and mouse.
 */
export function ProjectionChart(props: {
  years: YearProjection[];
  target: number;
  currency: FinanceScenario["currency"];
  /** Optional Monte-Carlo p10–p90 band around the expected path. */
  band?: BandPoint[];
  /** Your real logged net worth, as fractional years since first log. */
  actual?: Array<{ year: number; value: number }>;
}) {
  const { years, target, currency, band, actual } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  if (years.length < 2) return null;

  const W = 640;
  const H = 290;
  const PAD = { top: 30, right: 12, bottom: 26, left: 52 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const startValue = years[0].portfolio;
  const maxVal =
    Math.max(
      ...years.map((y) => y.portfolio),
      ...(band ?? []).map((b) => b.p90),
      ...(actual ?? []).map((a) => a.value),
      target > 0 ? target : 0,
    ) * 1.04;
  const maxYear = years[years.length - 1].year;

  const x = (year: number) => PAD.left + (year / maxYear) * innerW;
  const y = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;

  const line = (get: (p: YearProjection) => number) =>
    years
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${y(get(p)).toFixed(1)}`,
      )
      .join(" ");

  const valueOf = (p: YearProjection) => p.portfolio;
  const contribOf = (p: YearProjection) => p.invested + startValue;

  const portfolioPath = line(valueOf);
  const areaPath = `${portfolioPath} L${x(maxYear).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;
  const investedPath = line(contribOf);

  // p10–p90 envelope: p90 across the top, p10 back along the bottom.
  let bandPath = "";
  if (band && band.length > 1) {
    const topPts = band.map(
      (b, i) => `${i === 0 ? "M" : "L"}${x(b.year).toFixed(1)},${y(b.p90).toFixed(1)}`,
    );
    const bottomPts = [...band]
      .reverse()
      .map((b) => `L${x(b.year).toFixed(1)},${y(b.p10).toFixed(1)}`);
    bandPath = `${topPts.join(" ")} ${bottomPts.join(" ")} Z`;
  }
  const bandAt = (year: number) => band?.find((b) => b.year === year);

  // The real trajectory from monthly check-ins, clipped to the horizon.
  const actualPts = (actual ?? []).filter((a) => a.year <= maxYear);
  const actualPath = actualPts
    .map((a, i) => `${i === 0 ? "M" : "L"}${x(a.year).toFixed(1)},${y(a.value).toFixed(1)}`)
    .join(" ");

  const step = niceStep(maxVal / 4);
  const gridVals: number[] = [];
  for (let v = step; v <= maxVal; v += step) gridVals.push(v);

  const yearTickStep = Math.max(1, Math.ceil(maxYear / 6));
  const yearTicks = years.filter((p) => p.year % yearTickStep === 0).map((p) => p.year);

  const hovered = hoverYear !== null ? years.find((p) => p.year === hoverYear) : undefined;

  const onPointer = (e: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frac = ((e.clientX - rect.left) / rect.width) * W;
    const year = Math.round(((frac - PAD.left) / innerW) * maxYear);
    setHoverYear(Math.max(0, Math.min(maxYear, year)));
  };

  // Tooltip position as % of wrapper width, flipped past the midpoint.
  const tipLeftPct = hovered ? (x(hovered.year) / W) * 100 : 0;
  const tipFlip = tipLeftPct > 55;

  return (
    <div>
      {/* Legend (two series) */}
      <div
        style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 8 }}
        aria-hidden="true"
      >
        <LegendItem color="var(--chart-series-1)" label="Projected value" />
        <LegendItem color="var(--chart-series-2)" label="Contributions" dashed />
        {target > 0 && <LegendItem color="var(--chart-ref)" label="Target" dashed />}
        {actualPts.length >= 2 && (
          <LegendItem color="var(--chart-series-3)" label="Actual (your check-ins)" />
        )}
        {bandPath && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--text-secondary)",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 18,
                height: 10,
                borderRadius: 3,
                background: "var(--chart-series-1)",
                opacity: 0.22,
              }}
            />
            Likely range (10–90%)
          </span>
        )}
      </div>

      <div ref={wrapRef} style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "auto", display: "block", touchAction: "pan-y" }}
          role="img"
          aria-label="Projected net worth by year"
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          onPointerLeave={() => setHoverYear(null)}
        >
          <defs>
            <linearGradient id="wk-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-series-1)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--chart-series-1)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridVals.map((v) => (
            <g key={v}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--chart-grid)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 6}
                y={y(v) + 4}
                textAnchor="end"
                fontSize={11}
                fill="var(--chart-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatMoney(v, currency)}
              </text>
            </g>
          ))}
          {yearTicks.map((yr) => (
            <text
              key={yr}
              x={x(yr)}
              y={H - 6}
              textAnchor="middle"
              fontSize={11}
              fill="var(--chart-muted)"
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
                stroke="var(--chart-ref)"
                strokeWidth={1.5}
                strokeDasharray="6 4"
              />
              {/* label sits at the left edge, away from the line-end labels */}
              <text
                x={PAD.left + 4}
                y={y(target) - 5}
                textAnchor="start"
                fontSize={11}
                fontWeight={650}
                fill="var(--chart-ref)"
              >
                Target {formatMoney(target, currency)}
              </text>
            </g>
          )}

          {bandPath && (
            <path
              d={bandPath}
              fill="var(--chart-series-1)"
              opacity={0.13}
              className="fade-in"
            />
          )}
          <path d={areaPath} fill="url(#wk-area)" />
          <path
            d={investedPath}
            fill="none"
            stroke="var(--chart-series-2)"
            strokeWidth={2}
            strokeDasharray="5 4"
            strokeLinejoin="round"
          />
          <path
            d={portfolioPath}
            fill="none"
            stroke="var(--chart-series-1)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            className="draw-in"
          />

          {/* Your real trajectory: monthly check-ins vs the plan. */}
          {actualPts.length >= 2 && (
            <path
              d={actualPath}
              fill="none"
              stroke="var(--chart-series-3)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          {actualPts.map((a) => (
            <circle
              key={a.year}
              cx={x(a.year)}
              cy={y(a.value)}
              r={3.5}
              fill="var(--chart-series-3)"
            />
          ))}

          {/* Direct labels at line ends (relief for the light-mode aqua) */}
          <text
            x={x(maxYear) - 4}
            y={y(valueOf(years[years.length - 1])) - 8}
            textAnchor="end"
            fontSize={11}
            fontWeight={650}
            fill="var(--chart-series-1)"
          >
            Projected
          </text>
          <text
            x={x(maxYear) - 4}
            y={y(contribOf(years[years.length - 1])) + 14}
            textAnchor="end"
            fontSize={11}
            fontWeight={650}
            fill="var(--chart-series-2)"
          >
            Contributed
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
                cy={y(valueOf(hovered))}
                r={5}
                fill="var(--chart-series-1)"
                stroke="var(--bg-elevated)"
                strokeWidth={2}
              />
              <circle
                cx={x(hovered.year)}
                cy={y(contribOf(hovered))}
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
              top: 6,
              transform: tipFlip ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
            }}
          >
            <div className="tip-title">Year {hovered.year}</div>
            <div className="tip-row">
              <span className="tip-dot" style={{ background: "var(--chart-series-1)" }} />
              {formatMoneyFull(valueOf(hovered), currency)}
            </div>
            <div className="tip-row">
              <span className="tip-dot" style={{ background: "var(--chart-series-2)" }} />
              {formatMoneyFull(contribOf(hovered), currency)} contributed
            </div>
            {(() => {
              const b = bandAt(hovered.year);
              return b ? (
                <div className="tip-row">
                  <span
                    className="tip-dot"
                    style={{ background: "var(--chart-series-1)", opacity: 0.3 }}
                  />
                  {formatMoney(b.p10, currency)} – {formatMoney(b.p90, currency)} range
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

function LegendItem(props: { color: string; label: string; dashed?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "var(--text-secondary)",
        fontWeight: 600,
      }}
    >
      <svg width="18" height="4" aria-hidden="true">
        <line
          x1="0"
          y1="2"
          x2="18"
          y2="2"
          stroke={props.color}
          strokeWidth="2.5"
          strokeDasharray={props.dashed ? "4 3" : undefined}
        />
      </svg>
      {props.label}
    </span>
  );
}

function niceStep(rough: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(rough, 1))));
  const base = rough / pow;
  const nice = base <= 1 ? 1 : base <= 2 ? 2 : base <= 5 ? 5 : 10;
  return nice * pow;
}
