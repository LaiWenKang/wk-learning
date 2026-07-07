/**
 * Stat tile with a 7-day sparkline (single series — the tile title names
 * it, so no legend is needed). Fixed 1–5 domain matching the rating scale;
 * missing days break the line rather than interpolating.
 */
export function TrendTile(props: {
  label: string;
  value: string;
  color: string;
  points: (number | null)[]; // oldest → newest, length 7
}) {
  const W = 96;
  const H = 30;
  const PAD = 4;
  const n = props.points.length;
  const x = (i: number) => PAD + (i / Math.max(1, n - 1)) * (W - PAD * 2);
  const y = (v: number) => PAD + (1 - (v - 1) / 4) * (H - PAD * 2);

  // Build path segments, breaking at nulls.
  let d = "";
  let pen = false;
  props.points.forEach((v, i) => {
    if (v === null) {
      pen = false;
      return;
    }
    d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
    pen = true;
  });

  let lastIdx = -1;
  for (let i = props.points.length - 1; i >= 0; i--) {
    if (props.points[i] !== null) {
      lastIdx = i;
      break;
    }
  }
  const lastVal = lastIdx >= 0 ? props.points[lastIdx] : null;
  const hasLine = d.includes("L");

  return (
    <div className="stat-tile">
      <div className="stat-value" style={{ fontSize: 19 }}>
        {props.value}
      </div>
      <div className="stat-label">{props.label}</div>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block", marginTop: 6 }}
        aria-hidden="true"
      >
        {hasLine && (
          <path d={d} fill="none" stroke={props.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {lastVal !== null && (
          <circle cx={x(lastIdx)} cy={y(lastVal)} r={3.5} fill={props.color} />
        )}
      </svg>
    </div>
  );
}
