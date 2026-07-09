import { useState } from "react";
import { todayKey } from "../../lib/date";
import {
  currentStreak,
  loadGymDay,
  loadGymStats,
  masteryCounts,
  pickDaily,
  saveGymDay,
} from "../../lib/gym";
import { GymSession, CHALLENGE_KIND_LABELS } from "./GymSession";
import { FlameIcon, BrainIcon } from "../../components/icons";
import { MODEL_DOMAIN_LABELS } from "../../content/models";
import { addDays } from "../../lib/date";
import type { TabId } from "../../app/App";

/**
 * The Today tab's hero: today's Mind Gym session. Opens with the day's
 * actual calibration question as the hook — a question pulls harder
 * than a feature description.
 */
export function GymCard(props: { onNavigate: (tab: TabId) => void }) {
  const dateKey = todayKey();
  const [open, setOpen] = useState(false);
  // Bump to re-read persisted state after the session overlay closes.
  const [, setRefresh] = useState(0);

  const daily = pickDaily(dateKey);
  const stats = loadGymStats();
  const day = loadGymDay(dateKey);
  const streak = currentStreak(stats, dateKey);
  const done = stats.lastCompleted === dateKey || day.step >= 4;
  const inProgress = !done && (day.step > 0 || !!day.calibration);
  const mastery = masteryCounts(stats);

  const close = () => {
    setOpen(false);
    setRefresh((n) => n + 1);
  };

  const wasMinimal = done && day.minimal && !day.recallGrade;

  const upgradeToFull = () => {
    saveGymDay({ ...day, minimal: false, step: 1 });
    setOpen(true);
  };

  if (done) {
    const tomorrow = pickDaily(addDays(dateKey, 1));
    return (
      <>
        <div className="card gym-card gym-card-done">
          <div className="gym-card-top">
            <span className="gym-card-kicker">
              <BrainIcon /> Daily Mind Gym · done ✓
            </span>
            <span className="gym-streak">
              {stats.freezes > 0 && (
                <span className="gym-freeze" title="Streak freezes banked">
                  ❄{stats.freezes}
                </span>
              )}
              {streak > 0 && (
                <>
                  <FlameIcon /> {streak}
                </>
              )}
            </span>
          </div>
          <p className="gym-card-hook">
            {wasMinimal ? (
              <>Quick session done — streak safe.</>
            ) : (
              <>
                Trained <strong>{daily.model.name}</strong> · {mastery.trained}/
                {mastery.total} models in your latticework.
              </>
            )}
          </p>
          <p className="gym-card-meta">
            Tomorrow: a {MODEL_DOMAIN_LABELS[tomorrow.model.domain]} model + a{" "}
            {CHALLENGE_KIND_LABELS[tomorrow.kind]}.
          </p>
          <div className="btn-row">
            {wasMinimal ? (
              <button type="button" className="btn btn-primary btn-small" onClick={upgradeToFull}>
                Do the full session
              </button>
            ) : (
              <button type="button" className="btn btn-soft btn-small" onClick={() => setOpen(true)}>
                Review session
              </button>
            )}
            <button
              type="button"
              className="btn btn-small"
              onClick={() => props.onNavigate("learn")}
            >
              Explore the latticework
            </button>
          </div>
        </div>
        {open && <GymSession dateKey={dateKey} onClose={close} />}
      </>
    );
  }

  const startMinimal = () => {
    saveGymDay({ ...day, minimal: true });
    setOpen(true);
  };

  return (
    <>
      <div className="card gym-card">
        <div className="gym-card-top">
          <span className="gym-card-kicker">
            <BrainIcon /> Daily Mind Gym
          </span>
          <span className="gym-streak">
            {stats.freezes > 0 && (
              <span className="gym-freeze" title="Streak freezes banked">
                ❄{stats.freezes}
              </span>
            )}
            {streak > 0 && (
              <>
                <FlameIcon /> {streak}
              </>
            )}
          </span>
        </div>
        <p className="gym-card-hook">{daily.question.q}</p>
        <p className="gym-card-meta">
          1 estimate · 1 mental model · 1 {CHALLENGE_KIND_LABELS[daily.kind]} · ~5 min
        </p>
        <button type="button" className="btn btn-primary btn-block" onClick={() => setOpen(true)}>
          {inProgress ? `Continue session · step ${Math.min(day.step, 3) + 1} of 4` : "Start today’s session"}
        </button>
        {!inProgress && (
          <button type="button" className="gym-minimal-link" onClick={startMinimal}>
            Only got a minute? Quick session (keeps your streak)
          </button>
        )}
      </div>
      {open && <GymSession dateKey={dateKey} onClose={close} />}
    </>
  );
}
