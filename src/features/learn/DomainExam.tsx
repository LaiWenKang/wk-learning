import { useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../lib/useFocusTrap";
import { todayKey } from "../../lib/date";
import {
  loadGymStats,
  recordExam,
  recordRecall,
  saveGymStats,
  type GymStats,
} from "../../lib/gym";
import {
  MENTAL_MODELS,
  MODEL_DOMAIN_LABELS,
  MODEL_DOMAIN_TINTS,
  type ModelDomain,
} from "../../content/models";
import type { CSSProperties } from "react";

const PASS_SCORE = 4;
const EXAM_SIZE = 5;

/**
 * Domain boss exam: five recall questions from the domain, biased
 * toward the least-consolidated models. Pass 4/5 to seal the domain
 * gold on the latticework. Grading is binary and honest — self-graded,
 * but the only person you can cheat is you.
 */
export function DomainExam(props: {
  domain: ModelDomain;
  onClose: (statsChanged: boolean) => void;
}) {
  const trapRef = useFocusTrap<HTMLDivElement>();
  const dateKey = todayKey();
  const [stats, setStats] = useState<GymStats>(loadGymStats);
  // Least-consolidated first: fewest clean recalls, then oldest touch.
  const [questions] = useState(() =>
    MENTAL_MODELS.filter((m) => m.domain === props.domain)
      .sort((a, b) => {
        const ma = stats.mastery[a.id];
        const mb = stats.mastery[b.id];
        return (
          (ma?.got ?? 0) - (mb?.got ?? 0) ||
          (ma?.lastAt ?? "").localeCompare(mb?.lastAt ?? "")
        );
      })
      .slice(0, EXAM_SIZE),
  );
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const tint = MODEL_DOMAIN_TINTS[props.domain];
  const model = questions[idx];

  const grade = (got: boolean) => {
    let next = recordRecall(stats, model.id, got ? "got" : "missed", dateKey);
    const newScore = score + (got ? 1 : 0);
    setScore(newScore);
    setRevealed(false);
    if (idx + 1 >= questions.length) {
      next = recordExam(next, props.domain, newScore, dateKey);
      setFinished(true);
    } else {
      setIdx(idx + 1);
    }
    saveGymStats(next);
    setStats(next);
  };

  return createPortal(
    <div
      className="gym-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${MODEL_DOMAIN_LABELS[props.domain]} exam`}
    >
      <div ref={trapRef} className="gym-frame" style={{ "--tint": tint } as CSSProperties}>
        <header className="gym-head">
          <button
            type="button"
            className="gym-close"
            aria-label="Close exam"
            onClick={() => props.onClose(true)}
          >
            ✕
          </button>
          <div className="gym-progress" aria-hidden="true">
            {questions.map((q, i) => (
              <span
                key={q.id}
                className={`gym-dot ${i < idx || finished ? "done" : i === idx ? "active" : ""}`}
              />
            ))}
          </div>
          <span className="gym-step-label">
            {finished ? "Result" : `${idx + 1} of ${questions.length}`}
          </span>
        </header>

        {!finished ? (
          <div className="gym-body" key={idx}>
            <p className="gym-kicker">
              {MODEL_DOMAIN_LABELS[props.domain]} exam · pass {PASS_SCORE}/{questions.length}
            </p>
            <h2 className="gym-question">
              {model.name}: {model.recall.q}
            </h2>
            {!revealed ? (
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => setRevealed(true)}
              >
                Reveal the answer
              </button>
            ) : (
              <>
                <div className="reveal-box">{model.recall.a}</div>
                <div className="grade-label">Exam grading is binary — be honest.</div>
                <div className="grade-row grade-row-2">
                  <button type="button" className="btn grade-missed" onClick={() => grade(false)}>
                    Missed it
                  </button>
                  <button type="button" className="btn grade-got" onClick={() => grade(true)}>
                    Got it
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="gym-body gym-summary">
            <div className="exam-result-score" style={{ color: tint }}>
              {score}/{questions.length}
            </div>
            <h2 className="summary-title">
              {score >= PASS_SCORE ? "Domain sealed" : "Not yet — and that's data"}
            </h2>
            <p className="summary-sub">
              {score >= PASS_SCORE
                ? `${MODEL_DOMAIN_LABELS[props.domain]} is sealed gold on your latticework.`
                : `The misses go back into your review rotation with short intervals — they'll come back until they stick. Retake any time.`}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => props.onClose(true)}
            >
              Back to the latticework
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
