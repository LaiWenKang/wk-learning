import { useState } from "react";
import { Segmented, Sheet, TintCard } from "../../components/ui";
import { BoltIcon } from "../../components/icons";
import { RcaBuilder } from "./RcaBuilder";
import { DecisionMatrix } from "./DecisionMatrix";
import { AssumptionChecker } from "./AssumptionChecker";
import { RiskScanner } from "./RiskScanner";
import { FiveWhys } from "./FiveWhys";
import { THINK_WARMUPS, dailyRotation } from "../../data/prompts";
import { todayKey } from "../../lib/date";
import { PLAYBOOKS, type Playbook } from "../../content/playbooks";
import type { CSSProperties } from "react";

type ThinkTool = "rca" | "fivewhys" | "matrix" | "assumptions" | "risks";

export function ThinkPage() {
  const [tool, setTool] = useState<ThinkTool>("rca");
  const warmup = dailyRotation(THINK_WARMUPS, todayKey(), 4);

  return (
    <div>
      <h1 className="page-title">Thinking Gym</h1>
      <p className="page-subtitle">
        Structured tools for engineering judgement. Everything stays on this device.
      </p>

      {/* A fresh two-minute drill every day — never repeats until the
          whole pool has been used. */}
      <TintCard tint="var(--cat-ai)" icon={<BoltIcon />} title="Today’s Warm-up">
        <p className="card-muted" style={{ color: "var(--text)", fontSize: 15 }}>
          {warmup}
        </p>
      </TintCard>
      <Segmented<ThinkTool>
        value={tool}
        onChange={setTool}
        options={[
          { value: "rca", label: "RCA" },
          { value: "fivewhys", label: "5 Whys" },
          { value: "matrix", label: "Decision" },
          { value: "assumptions", label: "Assumptions" },
          { value: "risks", label: "Risks" },
        ]}
      />
      {tool === "rca" && <RcaBuilder />}
      {tool === "fivewhys" && <FiveWhys />}
      {tool === "matrix" && <DecisionMatrix />}
      {tool === "assumptions" && <AssumptionChecker />}
      {tool === "risks" && <RiskScanner />}

      <div className="lattice-domain-head" style={{ marginTop: 22 }}>
        <h3>Playbooks</h3>
        <span className="lattice-domain-count">for recurring moments</span>
      </div>
      <Playbooks />
    </div>
  );
}

/** Dense checklists for moments that recur — open, run, close. */
function Playbooks() {
  const [open, setOpen] = useState<Playbook | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const openBook = (p: Playbook) => {
    setOpen(p);
    setChecked(new Set());
  };
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <>
      {PLAYBOOKS.map((p) => (
        <button
          key={p.id}
          type="button"
          className="book-row"
          style={{ "--tint": "var(--cat-systems)" } as CSSProperties}
          onClick={() => openBook(p)}
        >
          <span className="book-spine" aria-hidden="true" />
          <span className="book-info">
            <strong>{p.title}</strong>
            <span>{p.when}</span>
          </span>
          <span className="feed-entry-cta" aria-hidden="true">→</span>
        </button>
      ))}
      {open && (
        <Sheet onClose={() => setOpen(null)} label={`Playbook: ${open.title}`}>
          <h3>{open.title}</h3>
          <p className="card-muted" style={{ marginBottom: 12 }}>{open.when}</p>
          {open.steps.map((s, i) => (
            <label key={i} className={`playbook-step ${checked.has(i) ? "done" : ""}`}>
              <input
                type="checkbox"
                checked={checked.has(i)}
                onChange={() => toggle(i)}
              />
              <span>
                <strong>{s.do}</strong>
                {s.why && <em>{s.why}</em>}
              </span>
            </label>
          ))}
          <p className="signal-meta" style={{ marginTop: 10 }}>
            {checked.size}/{open.steps.length} — checklist resets when closed;
            the point is the run, not the record.
          </p>
        </Sheet>
      )}
    </>
  );
}
