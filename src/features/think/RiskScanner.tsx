import { useState } from "react";
import { Card, Field } from "../../components/ui";
import { copyToClipboard } from "../../lib/export";

type RiskState = "unchecked" | "ok" | "risk";

const RISK_ITEMS: { id: string; label: string; probe: string }[] = [
  {
    id: "requirement",
    label: "Unclear requirement",
    probe: "Could two reasonable people read the requirement differently?",
  },
  {
    id: "validation",
    label: "Missing validation",
    probe: "What happens with empty, huge, malformed or duplicate input?",
  },
  {
    id: "environment",
    label: "Environment difference",
    probe: "What differs between where it was tested and where it will run?",
  },
  {
    id: "state",
    label: "State transition issue",
    probe: "Can it be interrupted mid-way? What does a retry see?",
  },
  {
    id: "concurrency",
    label: "Concurrency issue",
    probe: "What if two of these run at the same time on the same data?",
  },
  {
    id: "timeout",
    label: "Timeout / retry issue",
    probe: "Is the operation idempotent? What do retries amplify?",
  },
  {
    id: "observability",
    label: "Poor observability",
    probe: "If it breaks at 3am, what tells you — and what tells you why?",
  },
  {
    id: "rollback",
    label: "Insufficient rollback / recovery",
    probe: "How do you undo this? How long does undo take?",
  },
  {
    id: "communication",
    label: "Communication gap",
    probe: "Who is affected but hasn't been told? Who approves?",
  },
];

const STATE_CYCLE: Record<RiskState, RiskState> = {
  unchecked: "ok",
  ok: "risk",
  risk: "unchecked",
};

export function RiskScanner() {
  const [context, setContext] = useState("");
  const [states, setStates] = useState<Record<string, RiskState>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const stateOf = (id: string): RiskState => states[id] ?? "unchecked";
  const flagged = RISK_ITEMS.filter((r) => stateOf(r.id) === "risk");
  const reviewed = RISK_ITEMS.filter((r) => stateOf(r.id) !== "unchecked").length;

  const report = [
    `# Risk scan${context.trim() ? `: ${context.trim()}` : ""}`,
    ``,
    `Reviewed ${reviewed}/${RISK_ITEMS.length} checks. Flagged risks:`,
    ``,
    ...(flagged.length === 0
      ? ["_No risks flagged._"]
      : flagged.map(
          (r) => `- **${r.label}**${notes[r.id]?.trim() ? ` — ${notes[r.id].trim()}` : ""}`,
        )),
  ].join("\n");

  return (
    <div>
      <Card title="Risk Scanner">
        <p className="card-muted" style={{ marginBottom: 12 }}>
          A generic pre-flight checklist for any change or design. Tap a check to
          cycle: unchecked → OK → risk.
        </p>
        <Field label="What are you scanning? (optional)">
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. New batch job design"
          />
        </Field>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            fontWeight: 650,
            color: "var(--text-tertiary)",
            marginBottom: 6,
          }}
        >
          <span>
            {reviewed}/{RISK_ITEMS.length} reviewed
          </span>
          <span>{flagged.length} flagged</span>
        </div>
        <div className="progress-thin" style={{ marginBottom: 14 }}>
          <div
            className="progress-fill"
            style={{ width: `${(reviewed / RISK_ITEMS.length) * 100}%` }}
          />
        </div>
        {RISK_ITEMS.map((r) => {
          const st = stateOf(r.id);
          return (
            <div key={r.id} style={{ marginBottom: 10 }}>
              <button
                type="button"
                className="btn"
                style={{ width: "100%", justifyContent: "space-between" }}
                onClick={() =>
                  setStates((s) => ({ ...s, [r.id]: STATE_CYCLE[st] }))
                }
              >
                <span>{r.label}</span>
                <span
                  className={
                    st === "ok"
                      ? "chip chip-positive"
                      : st === "risk"
                        ? "chip chip-warning"
                        : "chip chip-neutral"
                  }
                >
                  {st === "ok" ? "OK" : st === "risk" ? "Risk" : "—"}
                </span>
              </button>
              <p className="field-hint" style={{ margin: "4px 2px 0" }}>
                {r.probe}
              </p>
              {st === "risk" && (
                <input
                  type="text"
                  style={{ marginTop: 6 }}
                  value={notes[r.id] ?? ""}
                  onChange={(e) =>
                    setNotes((n) => ({ ...n, [r.id]: e.target.value }))
                  }
                  placeholder="Note the specific concern + mitigation"
                />
              )}
            </div>
          );
        })}
      </Card>

      <Card title="Scan Result">
        <pre className="markdown-output">{report}</pre>
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-soft"
            onClick={async () => {
              const ok = await copyToClipboard(report);
              setCopied(ok);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </Card>
    </div>
  );
}
