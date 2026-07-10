import { useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../lib/useFocusTrap";
import { todayKey } from "../../lib/date";
import { storage } from "../../lib/storage";
import {
  CASE_FILES,
  type CaseFile,
  type OptionQuality,
} from "../../content/cases";
import { MODEL_BY_ID } from "../../content/models";
import { ModelChapter } from "../gym/ModelChapter";
import { Sheet } from "../../components/ui";
import type { CSSProperties } from "react";

export const CASES_DONE_KEY = "cases-done";

type CaseResult = { score: number; max: number; at: string };

export function loadCasesDone(): Record<string, CaseResult> {
  return storage.get<Record<string, CaseResult>>(CASES_DONE_KEY) ?? {};
}

const QUALITY_SCORE: Record<OptionQuality, number> = { strong: 2, ok: 1, weak: 0 };
const QUALITY_LABEL: Record<OptionQuality, string> = {
  strong: "Strong call",
  ok: "Defensible",
  weak: "Costly",
};

/** Case list rows for the Think tab. */
export function CaseFilesSection() {
  const [open, setOpen] = useState<CaseFile | null>(null);
  const [done, setDone] = useState(loadCasesDone);

  return (
    <>
      {CASE_FILES.map((c) => {
        const result = done[c.id];
        return (
          <button
            key={c.id}
            type="button"
            className="book-row"
            style={{ "--tint": "var(--cat-firmware)" } as CSSProperties}
            onClick={() => setOpen(c)}
          >
            <span className="book-spine" aria-hidden="true" />
            <span className="book-info">
              <strong>
                {c.title}
                {result ? ` · ${result.score}/${result.max} ✓` : ""}
              </strong>
              <span>{c.setting.slice(0, 90)}…</span>
            </span>
            <span className="feed-entry-cta" aria-hidden="true">→</span>
          </button>
        );
      })}
      {open && (
        <CaseRunner
          caseFile={open}
          onClose={() => {
            setOpen(null);
            setDone(loadCasesDone());
          }}
        />
      )}
    </>
  );
}

/** Full-screen case flow: situation → commit → critique → … → debrief. */
function CaseRunner(props: { caseFile: CaseFile; onClose: () => void }) {
  const trapRef = useFocusTrap<HTMLDivElement>();
  const c = props.caseFile;
  const [stepIdx, setStepIdx] = useState(-1); // -1 = setting screen
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [modelId, setModelId] = useState<string | null>(null);
  const max = c.steps.length * 2;
  const finished = stepIdx >= c.steps.length;
  const step = stepIdx >= 0 && !finished ? c.steps[stepIdx] : null;
  const openModel = modelId ? MODEL_BY_ID.get(modelId) : undefined;

  const choose = (i: number) => {
    if (chosen !== null || !step) return;
    setChosen(i);
    setScore((s) => s + QUALITY_SCORE[step.options[i].quality]);
  };

  const next = () => {
    const nextIdx = stepIdx + 1;
    setChosen(null);
    setStepIdx(nextIdx);
    if (nextIdx >= c.steps.length) {
      const done = loadCasesDone();
      const prev = done[c.id];
      const finalScore =
        chosen !== null && step
          ? score // score already includes the last choice
          : score;
      if (!prev || finalScore > prev.score) {
        storage.set(CASES_DONE_KEY, {
          ...done,
          [c.id]: { score: finalScore, max, at: todayKey() },
        });
      }
    }
  };

  return createPortal(
    <div className="gym-overlay" role="dialog" aria-modal="true" aria-label={`Case: ${c.title}`}>
      <div ref={trapRef} className="gym-frame">
        <header className="gym-head">
          <button type="button" className="gym-close" aria-label="Close case" onClick={props.onClose}>
            ✕
          </button>
          <div className="gym-progress" aria-hidden="true">
            {c.steps.map((_, i) => (
              <span
                key={i}
                className={`gym-dot ${i < stepIdx || finished ? "done" : i === stepIdx ? "active" : ""}`}
              />
            ))}
          </div>
          <span className="gym-step-label">
            {finished ? "Debrief" : stepIdx < 0 ? "The case" : `Decision ${stepIdx + 1} of ${c.steps.length}`}
          </span>
        </header>

        <div className="gym-body" key={stepIdx}>
          {stepIdx < 0 && (
            <>
              <p className="gym-kicker">Case file · judgment under pressure</p>
              <h2 className="gym-question">{c.title}</h2>
              <p className="gym-scenario">{c.setting}</p>
              <p className="gym-footnote">
                You'll face {c.steps.length} decisions. Commit before you read the
                critique — the gap between your instinct and the strong call is
                the lesson.
              </p>
              <button type="button" className="btn btn-primary btn-block" onClick={() => setStepIdx(0)}>
                Take the case
              </button>
            </>
          )}

          {step && (
            <>
              <p className="gym-scenario" style={{ marginBottom: 14 }}>{step.situation}</p>
              <h3 className="gym-subq">{step.prompt}</h3>
              <div className="gym-options">
                {step.options.map((opt, i) => {
                  let cls = "gym-option";
                  if (chosen !== null) {
                    if (opt.quality === "strong") cls += " correct";
                    else if (i === chosen && opt.quality === "weak") cls += " wrong";
                    else if (i === chosen) cls += " chosen-ok";
                    else cls += " dim";
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      className={cls}
                      disabled={chosen !== null}
                      onClick={() => choose(i)}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {chosen !== null && (
                <>
                  <div
                    className={`verdict ${
                      step.options[chosen].quality === "strong"
                        ? "verdict-hit"
                        : "verdict-miss"
                    }`}
                  >
                    <div className="verdict-detail">
                      <strong>{QUALITY_LABEL[step.options[chosen].quality]}.</strong>{" "}
                      {step.options[chosen].critique}
                    </div>
                  </div>
                  {step.options[chosen].quality !== "strong" && (
                    <p className="gym-explain">
                      The strong call:{" "}
                      {step.options.find((o) => o.quality === "strong")?.critique}
                    </p>
                  )}
                  <button type="button" className="btn btn-primary btn-block" onClick={next}>
                    {stepIdx + 1 >= c.steps.length ? "See the debrief" : "Next decision"}
                  </button>
                </>
              )}
            </>
          )}

          {finished && (
            <div className="gym-summary">
              <div className="exam-result-score" style={{ color: "var(--cat-firmware)" }}>
                {score}/{max}
              </div>
              <h2 className="summary-title">
                {score >= max - 1 ? "Sharp judgment" : score >= max / 2 ? "Solid instincts" : "Worth a rerun"}
              </h2>
              <p className="summary-sub" style={{ textAlign: "left" }}>{c.debrief}</p>
              <div className="chapter-section" style={{ textAlign: "left" }}>
                <div className="chapter-label">Models this case exercised</div>
                <div className="chip-row">
                  {c.models.map((id) => {
                    const m = MODEL_BY_ID.get(id);
                    return m ? (
                      <button key={id} type="button" className="chip chip-link" onClick={() => setModelId(id)}>
                        {m.name}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-block" onClick={props.onClose}>
                Close the file
              </button>
            </div>
          )}
        </div>
      </div>
      {openModel && (
        <Sheet onClose={() => setModelId(null)} label={`Model: ${openModel.name}`}>
          <ModelChapter model={openModel} showRelated onOpenRelated={(id) => setModelId(id)} />
        </Sheet>
      )}
    </div>,
    document.body,
  );
}
