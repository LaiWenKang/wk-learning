import {
  calibrationSummary,
  categoryBias,
  loadGymStats,
} from "../../lib/gym";
import {
  CALIBRATION_BY_ID,
  CALIBRATION_CATEGORY_LABELS,
} from "../../content/calibration";
import { Card } from "../../components/ui";
import { TargetIcon } from "../../components/icons";

/**
 * Your judgment, measured: per-confidence hit rates vs what you
 * claimed, overall sharpness, and which domains you systematically
 * over- or under-estimate. Data comes from daily gym answers.
 */
export function CalibrationCard() {
  const stats = loadGymStats();
  const sum = calibrationSummary(stats.calibrationLog);

  if (sum.n === 0) {
    return (
      <Card title="Calibration">
        <p className="card-muted">
          Answer daily gym estimates and this becomes a measured profile of
          your own judgment — how often your “90% sure” is actually right.
        </p>
      </Card>
    );
  }

  const bias = categoryBias(stats.calibrationLog, (qId) => {
    const q = CALIBRATION_BY_ID.get(qId);
    return q ? CALIBRATION_CATEGORY_LABELS[q.category] : undefined;
  }).filter((b) => b.n >= 3 && Math.abs(b.net) >= 2);
  const worst = bias[0];

  return (
    <Card>
      <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <TargetIcon /> Calibration · {sum.n} answers
      </h3>
      <p className="card-muted" style={{ marginBottom: 12 }}>
        {Math.round(sum.within2xRate * 100)}% of your estimates land within 2×
        of the truth ({Math.round(sum.within10xRate * 100)}% within 10×).
      </p>

      {sum.buckets.map((b) => {
        if (b.n === 0) return null;
        const actual = Math.round(b.hitRate * 100);
        const gap = actual - b.confidence;
        return (
          <div key={b.confidence} className="calib-row">
            <span className="calib-label">“{b.confidence}% sure”</span>
            <div className="calib-track">
              <div
                className="calib-claim"
                style={{ left: `${b.confidence}%` }}
                title={`claimed ${b.confidence}%`}
              />
              <div
                className={`calib-fill ${gap < -10 ? "calib-over" : gap > 10 ? "calib-under" : "calib-good"}`}
                style={{ width: `${Math.max(3, actual)}%` }}
              />
            </div>
            <span className="calib-actual">
              {actual}% <span className="calib-n">(n={b.n})</span>
            </span>
          </div>
        );
      })}
      <p className="signal-meta" style={{ marginTop: 8 }}>
        Bar = how often you were actually right · tick = what you claimed.
        Bar left of tick means overconfident.
      </p>

      {worst && (
        <p className="calib-bias">
          Pattern: you tend to{" "}
          <strong>{worst.net > 0 ? "overestimate" : "underestimate"}</strong>{" "}
          {worst.category} ({Math.abs(worst.net)} of {worst.n} leaned{" "}
          {worst.net > 0 ? "high" : "low"}).
        </p>
      )}
    </Card>
  );
}
