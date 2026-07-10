import { useMemo, useState } from "react";
import { Segmented, Card } from "../../components/ui";
import { ReflectPage } from "../reflect/ReflectPage";
import { FinancePage } from "../finance/FinancePage";
import { buildWeeklyRecap } from "../../lib/recap";
import { loadGymStats } from "../../lib/gym";
import { STORE_KEYS, loadList, storage } from "../../lib/storage";
import { todayKey } from "../../lib/date";
import { SparkleIcon } from "../../components/icons";
import type { ReflectionEntry } from "../../types";

type YouView = "journal" | "money";

/**
 * You — the mirror: reflection, calibration, streaks, money, and the
 * weekly recap that ties it together.
 */
export function YouPage() {
  const [view, setView] = useState<YouView>("journal");

  return (
    <div>
      <h1 className="page-title">You</h1>
      <p className="page-subtitle">
        The mirror — everything here is about you, and stays with you.
      </p>

      <WeeklyRecapCard />

      <Segmented<YouView>
        value={view}
        onChange={setView}
        options={[
          { value: "journal", label: "Journal" },
          { value: "money", label: "Money" },
        ]}
      />
      {view === "journal" && <ReflectPage />}
      {view === "money" && <FinancePage />}
    </div>
  );
}

/** The Sunday Wrapped — collapsed to one line on weekdays, open on Sundays. */
function WeeklyRecapCard() {
  const dateKey = todayKey();
  const isSunday = new Date().getDay() === 0;
  const [open, setOpen] = useState(isSunday);

  const recap = useMemo(() => {
    const briefsRead = Object.values(
      storage.get<Record<string, string>>("fieldguide-read") ?? {},
    );
    return buildWeeklyRecap(
      dateKey,
      loadGymStats(),
      loadList<ReflectionEntry>(STORE_KEYS.reflections),
      briefsRead,
    );
  }, [dateKey]);

  if (!open) {
    return (
      <button type="button" className="feed-entry" onClick={() => setOpen(true)}>
        <span className="feed-entry-icon">
          <SparkleIcon />
        </span>
        <span className="feed-entry-text">
          <strong>Your week, wrapped</strong>
          <span>Streak, calibration, best line — the Sunday ritual, any day.</span>
        </span>
        <span className="feed-entry-cta" aria-hidden="true">→</span>
      </button>
    );
  }

  const delta =
    recap.calibration.prevRate !== null && recap.calibration.n > 0
      ? Math.round((recap.calibration.rate - recap.calibration.prevRate) * 100)
      : null;

  return (
    <Card className="recap-card">
      <div className="gym-card-top">
        <span className="brief-kicker" style={{ color: "var(--cat-career)" }}>
          <SparkleIcon /> Your week · {recap.from.slice(5)} → {recap.to.slice(5)}
        </span>
        <button type="button" className="retire-link" style={{ margin: 0 }} onClick={() => setOpen(false)}>
          collapse
        </button>
      </div>

      <div className="summary-grid" style={{ textAlign: "left" }}>
        <div className="summary-cell">
          <span className="summary-value">🔥 {recap.streak}</span>
          <span className="summary-label">day streak</span>
        </div>
        <div className="summary-cell">
          <span className="summary-value">
            {recap.calibration.n > 0 ? `${Math.round(recap.calibration.rate * 100)}%` : "—"}
            {delta !== null && (
              <span className={delta >= 0 ? "recap-up" : "recap-down"}>
                {" "}{delta >= 0 ? "▲" : "▼"}{Math.abs(delta)}
              </span>
            )}
          </span>
          <span className="summary-label">
            calibration this week (n={recap.calibration.n})
          </span>
        </div>
        <div className="summary-cell">
          <span className="summary-value">{recap.modelsTrained.length}</span>
          <span className="summary-label">
            {recap.modelsTrained.length > 0
              ? `models: ${recap.modelsTrained.slice(0, 2).join(", ")}${recap.modelsTrained.length > 2 ? "…" : ""}`
              : "models trained"}
          </span>
        </div>
        <div className="summary-cell">
          <span className="summary-value">{recap.reflections}/7</span>
          <span className="summary-label">
            days reflected · {recap.briefsRead} brief{recap.briefsRead === 1 ? "" : "s"} read
          </span>
        </div>
      </div>

      {recap.bestLine && (
        <p className="recap-line">
          Your line of the week: <em>“{recap.bestLine}”</em>
        </p>
      )}
      {recap.memory && (
        <p className="recap-memory">
          {recap.memory.daysAgo} days ago you wrote: “{recap.memory.text}” — still true?
        </p>
      )}
      {!recap.bestLine && recap.reflections === 0 && (
        <p className="card-muted">
          No reflections this week — even one line in the Journal below gives
          next Sunday something to wrap.
        </p>
      )}
    </Card>
  );
}
