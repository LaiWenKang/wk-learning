import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../lib/useFocusTrap";
import { addDays } from "../../lib/date";
import {
  calibrationSummary,
  completeSession,
  currentStreak,
  describeMiss,
  dueReviews,
  formatBig,
  gradeEstimate,
  loadGymDay,
  loadGymStats,
  loadRetired,
  masteryCounts,
  pickDaily,
  retireContent,
  recordCalibration,
  recordChallenge,
  recordRecall,
  saveGymDay,
  saveGymStats,
  CONFIDENCE_LEVELS,
  type ConfidenceLevel,
  type GymDay,
  type GymStats,
  type RecallGrade,
} from "../../lib/gym";
import {
  MODEL_BY_ID,
  MODEL_DOMAIN_LABELS,
} from "../../content/models";
import { CALIBRATION_CATEGORY_LABELS } from "../../content/calibration";
import type {
  FallacyChallenge,
  FermiChallenge,
  ParadoxChallenge,
} from "../../content/challenges";
import { ModelChapter } from "./ModelChapter";
import { EstimateInput } from "./EstimateInput";
import { FlameIcon } from "../../components/icons";

const STEP_TITLES = ["Calibrate", "Learn", "Recall", "Challenge"];

export const CHALLENGE_KIND_LABELS = {
  fallacy: "fallacy hunt",
  paradox: "paradox",
  fermi: "Fermi problem",
} as const;

/**
 * The daily Mind Gym — a full-screen, five-beat session:
 * estimate → learn a model → recall it → challenge → summary.
 * Every answer persists immediately, so a closed session resumes.
 */
export function GymSession(props: { dateKey: string; onClose: () => void }) {
  const trapRef = useFocusTrap<HTMLDivElement>();
  const daily = pickDaily(props.dateKey, loadRetired(props.dateKey));
  const [day, setDay] = useState<GymDay>(() => loadGymDay(props.dateKey));
  const [stats, setStats] = useState<GymStats>(loadGymStats);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [props]);

  const update = (nextDay: GymDay, nextStats?: GymStats) => {
    saveGymDay(nextDay);
    setDay(nextDay);
    if (nextStats) {
      saveGymStats(nextStats);
      setStats(nextStats);
    }
  };

  /* ---- step handlers ---- */

  const submitCalibration = (estimate: number, confidence: ConfidenceLevel) => {
    if (day.calibration) return;
    const grade = gradeEstimate(estimate, daily.question.answer);
    update(
      { ...day, calibration: { estimate, confidence, within2x: grade.within2x } },
      recordCalibration(stats, props.dateKey, daily.question, estimate, confidence),
    );
  };

  const submitRecall = (grade: RecallGrade) => {
    if (day.recallGrade) return;
    const nextStats = recordRecall(stats, daily.model.id, grade, props.dateKey);
    // Spaced repetition: pull in the most-overdue trained model, if any.
    const due = dueReviews(nextStats, props.dateKey, daily.model.id);
    const reviewId = due.length > 0 ? due[0] : null;
    update(
      { ...day, recallGrade: grade, reviewId, step: reviewId ? 2 : 3 },
      nextStats,
    );
  };

  const submitReview = (grade: RecallGrade) => {
    if (!day.reviewId || day.reviewGrade) return;
    update(
      { ...day, reviewGrade: grade, step: 3 },
      recordRecall(stats, day.reviewId, grade, props.dateKey),
    );
  };

  const finishMinimal = () => {
    update(
      { ...day, step: 4, completedAt: new Date().toISOString() },
      completeSession(stats, props.dateKey),
    );
  };

  const submitFallacy = (choiceIdx: number) => {
    if (day.challenge) return;
    const c = daily.challenge as FallacyChallenge;
    const correct = choiceIdx === c.answerIdx;
    update(
      { ...day, challenge: { choiceIdx, correct } },
      recordChallenge(stats, "fallacy", correct),
    );
  };

  const submitFermi = (estimate: number) => {
    if (day.challenge) return;
    const c = daily.challenge as FermiChallenge;
    const correct = estimate >= c.low && estimate <= c.high;
    update(
      { ...day, challenge: { estimate, correct } },
      recordChallenge(stats, "fermi", correct),
    );
  };

  const finishParadox = () => {
    if (day.challenge) return;
    const withChallenge = recordChallenge(stats, "paradox", undefined);
    update(
      { ...day, challenge: {}, step: 4, completedAt: new Date().toISOString() },
      completeSession(withChallenge, props.dateKey),
    );
  };

  const finishAfterChallenge = () => {
    update(
      { ...day, step: 4, completedAt: day.completedAt ?? new Date().toISOString() },
      completeSession(stats, props.dateKey),
    );
  };

  /* ---- render ---- */

  const step = Math.min(day.step, 4);

  return createPortal(
    <div className="gym-overlay" role="dialog" aria-modal="true" aria-label="Daily Mind Gym">
      <div ref={trapRef} className="gym-frame">
        <header className="gym-head">
          <button type="button" className="gym-close" aria-label="Close session" onClick={props.onClose}>
            ✕
          </button>
          <div className="gym-progress" aria-hidden="true">
            {STEP_TITLES.map((t, i) => (
              <span key={t} className={`gym-dot ${i < step ? "done" : i === step ? "active" : ""}`} />
            ))}
          </div>
          <span className="gym-step-label">
            {step >= 4 ? "Complete" : `${STEP_TITLES[step]} · ${step + 1} of 4`}
          </span>
        </header>

        <div className="gym-body" key={step}>
          {step === 0 && (
            <CalibrateStep
              daily={daily}
              day={day}
              dateKey={props.dateKey}
              onSubmit={submitCalibration}
              onContinue={day.minimal ? finishMinimal : () => update({ ...day, step: 1 })}
              continueLabel={day.minimal ? "Done — streak safe" : "Continue"}
            />
          )}
          {step === 1 && (
            <div>
              <p className="gym-kicker">Today’s mental model</p>
              <ModelChapter model={daily.model} />
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => update({ ...day, step: 2 })}
              >
                Got it — test me
              </button>
            </div>
          )}
          {step === 2 && !day.recallGrade && (
            <RecallStep
              kicker="Active recall · answer in your head first"
              q={daily.model.recall.q}
              a={daily.model.recall.a}
              onGrade={submitRecall}
            />
          )}
          {step === 2 && day.recallGrade && day.reviewId && (
            <ReviewStep reviewId={day.reviewId} onGrade={submitReview} />
          )}
          {step === 3 && daily.kind === "fallacy" && (
            <FallacyStep
              challenge={daily.challenge as FallacyChallenge}
              day={day}
              onChoose={submitFallacy}
              onContinue={finishAfterChallenge}
            />
          )}
          {step === 3 && daily.kind === "paradox" && (
            <ParadoxStep challenge={daily.challenge as ParadoxChallenge} onDone={finishParadox} />
          )}
          {step === 3 && daily.kind === "fermi" && (
            <FermiStep
              challenge={daily.challenge as FermiChallenge}
              day={day}
              onSubmit={submitFermi}
              onContinue={finishAfterChallenge}
            />
          )}
          {step >= 4 && (
            <SummaryStep dateKey={props.dateKey} stats={stats} day={day} modelName={daily.model.name} onClose={props.onClose} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------ steps ------------------------------ */

function CalibrateStep(props: {
  daily: ReturnType<typeof pickDaily>;
  day: GymDay;
  dateKey: string;
  onSubmit: (estimate: number, confidence: ConfidenceLevel) => void;
  onContinue: () => void;
  continueLabel?: string;
}) {
  const [confidence, setConfidence] = useState<ConfidenceLevel>(70);
  const q = props.daily.question;
  const done = props.day.calibration;

  if (done) {
    const grade = gradeEstimate(done.estimate, q.answer);
    return (
      <div>
        <p className="gym-kicker">{CALIBRATION_CATEGORY_LABELS[q.category]}</p>
        <h2 className="gym-question">{q.q}</h2>
        <div className={`verdict ${grade.within2x ? "verdict-hit" : "verdict-miss"}`}>
          <div className="verdict-answer">
            {formatBig(q.answer)} <span className="verdict-unit">{q.unit}</span>
          </div>
          <div className="verdict-detail">
            You said {formatBig(done.estimate)} — {describeMiss(grade)}.{" "}
            {grade.within2x
              ? `Within 2×, with ${done.confidence}% confidence claimed. `
              : grade.within10x
                ? "Within 10× — in the zone, not yet sharp. "
                : "More than 10× off — a blind spot found. "}
          </div>
        </div>
        <p className="gym-explain">{q.explain}</p>
        <RetireLink id={q.id} dateKey={props.dateKey} />
        <button type="button" className="btn btn-primary btn-block" onClick={props.onContinue}>
          {props.continueLabel ?? "Continue"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="gym-kicker">{CALIBRATION_CATEGORY_LABELS[q.category]} · estimate, don’t look it up</p>
      <h2 className="gym-question">{q.q}</h2>
      <div className="conf-block">
        <div className="conf-label">How sure are you that you’re within 2× of the truth?</div>
        <div className="scale-chips" role="radiogroup" aria-label="Confidence">
          {CONFIDENCE_LEVELS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={confidence === c}
              className={`scale-chip ${confidence === c ? "active" : ""}`}
              onClick={() => setConfidence(c)}
            >
              {c}%
            </button>
          ))}
        </div>
      </div>
      <EstimateInput
        unit={q.unit}
        submitLabel="Lock in & reveal"
        onSubmit={(v) => props.onSubmit(v, confidence)}
      />
      <p className="gym-footnote">
        This trains calibration — over time you’ll see how often your “90% sure” is actually right.
      </p>
    </div>
  );
}

function RecallStep(props: {
  kicker: string;
  q: string;
  a: string;
  onGrade: (g: RecallGrade) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <p className="gym-kicker">{props.kicker}</p>
      <h2 className="gym-question">{props.q}</h2>
      {!revealed ? (
        <button type="button" className="btn btn-primary btn-block" onClick={() => setRevealed(true)}>
          Reveal the answer
        </button>
      ) : (
        <>
          <div className="reveal-box">{props.a}</div>
          <div className="grade-label">How did you do?</div>
          <div className="grade-row">
            <button type="button" className="btn grade-missed" onClick={() => props.onGrade("missed")}>
              Missed it
            </button>
            <button type="button" className="btn grade-fuzzy" onClick={() => props.onGrade("fuzzy")}>
              Fuzzy
            </button>
            <button type="button" className="btn grade-got" onClick={() => props.onGrade("got")}>
              Got it
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** Spaced review of a previously trained model, injected when due. */
function ReviewStep(props: {
  reviewId: string;
  onGrade: (g: RecallGrade) => void;
}) {
  const model = MODEL_BY_ID.get(props.reviewId);
  if (!model) {
    // Shouldn't happen (ids come from mastery of shipped models), but
    // never strand the session on missing content.
    props.onGrade("fuzzy");
    return null;
  }
  return (
    <RecallStep
      kicker={`From your lattice · trained earlier — still there?`}
      q={`${model.name}: ${model.recall.q}`}
      a={model.recall.a}
      onGrade={props.onGrade}
    />
  );
}

function FallacyStep(props: {
  challenge: FallacyChallenge;
  day: GymDay;
  onChoose: (idx: number) => void;
  onContinue: () => void;
}) {
  const c = props.challenge;
  const chosen = props.day.challenge?.choiceIdx;
  const answered = chosen !== undefined;
  return (
    <div>
      <p className="gym-kicker">Fallacy hunt · something here is broken</p>
      <blockquote className="gym-scenario">{c.scenario}</blockquote>
      <h3 className="gym-subq">{c.question}</h3>
      <div className="gym-options">
        {c.options.map((opt, i) => {
          let cls = "gym-option";
          if (answered) {
            if (i === c.answerIdx) cls += " correct";
            else if (i === chosen) cls += " wrong";
            else cls += " dim";
          }
          return (
            <button
              key={opt}
              type="button"
              className={cls}
              disabled={answered}
              onClick={() => props.onChoose(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <>
          <div className={`verdict ${props.day.challenge?.correct ? "verdict-hit" : "verdict-miss"}`}>
            <div className="verdict-detail">
              {props.day.challenge?.correct ? "Caught it." : "Not this one — the trap was subtler."}{" "}
              {c.explain}
            </div>
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={props.onContinue}>
            Finish session
          </button>
        </>
      )}
    </div>
  );
}

function ParadoxStep(props: { challenge: ParadoxChallenge; onDone: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const c = props.challenge;
  return (
    <div>
      <p className="gym-kicker">Paradox · commit to an instinct first</p>
      <h2 className="gym-question">{c.name}</h2>
      <p className="gym-scenario">{c.setup}</p>
      <h3 className="gym-subq">{c.prompt}</h3>
      {!revealed ? (
        <button type="button" className="btn btn-primary btn-block" onClick={() => setRevealed(true)}>
          I’ve committed — show me
        </button>
      ) : (
        <>
          <div className="reveal-box">{c.resolution}</div>
          <button type="button" className="btn btn-primary btn-block" onClick={props.onDone}>
            Finish session
          </button>
        </>
      )}
    </div>
  );
}

function FermiStep(props: {
  challenge: FermiChallenge;
  day: GymDay;
  onSubmit: (estimate: number) => void;
  onContinue: () => void;
}) {
  const c = props.challenge;
  const done = props.day.challenge;
  if (done && done.estimate !== undefined) {
    const grade = gradeEstimate(done.estimate, c.answer);
    return (
      <div>
        <p className="gym-kicker">Fermi problem</p>
        <h2 className="gym-question">{c.q}</h2>
        <div className={`verdict ${done.correct ? "verdict-hit" : "verdict-miss"}`}>
          <div className="verdict-answer">
            ≈ {formatBig(c.answer)} <span className="verdict-unit">{c.unit}</span>
          </div>
          <div className="verdict-detail">
            You said {formatBig(done.estimate)} ({describeMiss(grade)}).{" "}
            {done.correct
              ? "Inside the accepted band — solid decomposition."
              : `Accepted band: ${formatBig(c.low)} – ${formatBig(c.high)}.`}
          </div>
        </div>
        <div className="reveal-box">{c.walkthrough}</div>
        <button type="button" className="btn btn-primary btn-block" onClick={props.onContinue}>
          Finish session
        </button>
      </div>
    );
  }
  return (
    <div>
      <p className="gym-kicker">Fermi problem · decompose, don’t recall</p>
      <h2 className="gym-question">{c.q}</h2>
      <p className="gym-footnote" style={{ marginTop: 0 }}>
        Break it into pieces you can roughly know, multiply, and trust the chain.
      </p>
      <EstimateInput unit={c.unit} submitLabel="Lock in & reveal" onSubmit={props.onSubmit} />
    </div>
  );
}

function SummaryStep(props: {
  dateKey: string;
  stats: GymStats;
  day: GymDay;
  modelName: string;
  onClose: () => void;
}) {
  const { stats } = props;
  const streak = currentStreak(stats, props.dateKey);
  const cal = calibrationSummary(stats.calibrationLog);
  const mastery = masteryCounts(stats);
  const tomorrowKey = addDays(props.dateKey, 1);
  const tomorrow = pickDaily(tomorrowKey, loadRetired(tomorrowKey));
  const bucket90 = cal.buckets.find((b) => b.confidence === 90);

  return (
    <div className="gym-summary">
      <div className="summary-flame">
        <FlameIcon />
        <span className="summary-streak">{streak}</span>
      </div>
      <h2 className="summary-title">
        {streak <= 1 ? "Session complete" : `${streak}-day streak`}
      </h2>
      <p className="summary-sub">
        {props.day.minimal && !props.day.recallGrade ? (
          "Quick session — streak safe. The full session is still here if you find five minutes."
        ) : (
          <>
            Trained <strong>{props.modelName}</strong>
            {props.day.recallGrade === "got" ? " — recalled cleanly." : "."}
            {props.day.reviewGrade ? " Plus one review from your lattice." : ""}
          </>
        )}
      </p>
      {stats.freezes > 0 && (
        <p className="summary-freeze">
          ❄ {stats.freezes} streak freeze{stats.freezes > 1 ? "s" : ""} banked — one
          missed day is covered automatically.
        </p>
      )}

      <div className="summary-grid">
        <div className="summary-cell">
          <span className="summary-value">
            {cal.n > 0 ? `${Math.round(cal.within2xRate * 100)}%` : "—"}
          </span>
          <span className="summary-label">estimates within 2× (n={cal.n})</span>
        </div>
        <div className="summary-cell">
          <span className="summary-value">
            {mastery.trained}/{mastery.total}
          </span>
          <span className="summary-label">models trained</span>
        </div>
        <div className="summary-cell">
          <span className="summary-value">
            {stats.challenges.fallacyTotal > 0
              ? `${stats.challenges.fallacyRight}/${stats.challenges.fallacyTotal}`
              : "—"}
          </span>
          <span className="summary-label">fallacies caught</span>
        </div>
        <div className="summary-cell">
          <span className="summary-value">{stats.totalSessions}</span>
          <span className="summary-label">total sessions</span>
        </div>
      </div>

      {bucket90 && bucket90.n >= 5 && (
        <p className="summary-calibration">
          When you say “90% sure”, you’ve been right{" "}
          <strong>{Math.round(bucket90.hitRate * 100)}%</strong> of the time
          {bucket90.hitRate < 0.75
            ? " — overconfident. Widen your internal error bars."
            : bucket90.hitRate > 0.97
              ? " — possibly underconfident. Trust yourself more."
              : " — well calibrated."}
        </p>
      )}

      <p className="summary-tomorrow">
        Tomorrow: a <strong>{MODEL_DOMAIN_LABELS[tomorrow.model.domain]}</strong> model
        {" + a "}
        <strong>{CHALLENGE_KIND_LABELS[tomorrow.kind]}</strong>.
      </p>

      <button type="button" className="btn btn-primary btn-block" onClick={props.onClose}>
        Done for today
      </button>
    </div>
  );
}

/** "Not for me" — retires a content item from tomorrow onward. */
function RetireLink(props: { id: string; dateKey: string }) {
  const [done, setDone] = useState(false);
  if (done) {
    return <p className="retire-done">Retired — it won’t appear again.</p>;
  }
  return (
    <button
      type="button"
      className="retire-link"
      onClick={() => {
        retireContent(props.id, props.dateKey);
        setDone(true);
      }}
    >
      ✕ Not for me — never show this one again
    </button>
  );
}
