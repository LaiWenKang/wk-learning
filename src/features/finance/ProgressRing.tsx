import { useEffect, useState } from "react";

/** Circular progress toward the target, animated on mount. */
export function ProgressRing(props: { fraction: number; label: string }) {
  const clamped = Math.max(0, Math.min(1, props.fraction));
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <div className="stat-tile" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="var(--bg-elevated)"
          strokeWidth="7"
        />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="var(--chart-series-1)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - shown)}
          transform="rotate(-90 32 32)"
          style={{ transition: "stroke-dashoffset 800ms var(--ease-spring)" }}
        />
      </svg>
      <div>
        <div className="stat-value">{Math.round(clamped * 100)}%</div>
        <div className="stat-label">{props.label}</div>
      </div>
    </div>
  );
}
