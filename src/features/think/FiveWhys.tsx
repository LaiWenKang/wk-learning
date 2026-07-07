import { useEffect, useState } from "react";
import { Card, Field } from "../../components/ui";
import { copyToClipboard } from "../../lib/export";
import { storage } from "../../lib/storage";
import { todayKey } from "../../lib/date";

/**
 * 5 Whys ladder: start from the observable problem and ask "why?" until
 * the answer is a process or design condition you can change. Each level
 * indents deeper; the deepest filled level is treated as the root cause.
 */

type WhysDraft = {
  problem: string;
  whys: string[]; // 5 levels
  countermeasure: string;
};

const DRAFT_KEY = "fivewhys-draft";
const EMPTY: WhysDraft = { problem: "", whys: ["", "", "", "", ""], countermeasure: "" };

export function FiveWhys() {
  const [initial] = useState<WhysDraft>(() => {
    const saved = storage.get<WhysDraft>(DRAFT_KEY);
    return saved && Array.isArray(saved.whys) && saved.whys.length === 5 ? saved : EMPTY;
  });
  const [problem, setProblem] = useState(initial.problem);
  const [whys, setWhys] = useState<string[]>(initial.whys);
  const [countermeasure, setCountermeasure] = useState(initial.countermeasure);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    storage.set<WhysDraft>(DRAFT_KEY, { problem, whys, countermeasure });
  }, [problem, whys, countermeasure]);

  const setWhy = (i: number, value: string) =>
    setWhys((w) => w.map((x, j) => (j === i ? value : x)));

  const deepest = whys.reduce((acc, w, i) => (w.trim() ? i : acc), -1);
  const visibleLevels = Math.min(4, deepest + 1);

  const markdown = [
    `# 5 Whys: ${problem.trim() || "Untitled"}`,
    ``,
    `_Date: ${todayKey()}_`,
    ``,
    ...whys
      .slice(0, deepest + 1)
      .map((w, i) => `${i + 1}. **Why?** ${w.trim() || "_—_"}`),
    ``,
    `**Root cause:** ${deepest >= 0 ? whys[deepest].trim() : "_not reached yet_"}`,
    ``,
    `**Countermeasure:** ${countermeasure.trim() || "_—_"}`,
  ].join("\n");

  const reset = () => {
    setProblem("");
    setWhys(["", "", "", "", ""]);
    setCountermeasure("");
  };

  return (
    <div>
      <Card title="5 Whys">
        <p className="card-muted" style={{ marginBottom: 12 }}>
          Ask “why?” up to five times, drilling from the symptom toward a
          condition you can actually change. Stop when another “why” would
          leave your control.
        </p>
        <Field label="The problem (observable symptom)">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g. “The report was sent a day late.”"
          />
        </Field>
        {problem.trim() &&
          whys.map((w, i) => {
            if (i > visibleLevels) return null;
            const isRoot = i === deepest;
            return (
              <div
                key={i}
                style={{
                  marginLeft: i * 14,
                  paddingLeft: 12,
                  borderLeft: `2.5px solid ${
                    isRoot ? "var(--positive)" : "var(--accent)"
                  }`,
                  marginBottom: 4,
                }}
              >
                <Field
                  label={`Why? (${i + 1}/5)${isRoot ? " — current root cause" : ""}`}
                >
                  <textarea
                    value={w}
                    onChange={(e) => setWhy(i, e.target.value)}
                    placeholder={
                      i === 0
                        ? "Because…"
                        : "And why was that?"
                    }
                    style={{ minHeight: 56 }}
                  />
                </Field>
              </div>
            );
          })}
        {problem.trim() && deepest >= 0 && (
          <Field
            label="Countermeasure"
            hint="What change removes the root condition (not just the symptom)?"
          >
            <textarea
              value={countermeasure}
              onChange={(e) => setCountermeasure(e.target.value)}
              style={{ minHeight: 56 }}
            />
          </Field>
        )}
        <div className="btn-row">
          <button type="button" className="btn btn-danger btn-small" onClick={reset}>
            Start over
          </button>
        </div>
      </Card>

      {problem.trim() && deepest >= 0 && (
        <Card title="Markdown Output">
          <pre className="markdown-output">{markdown}</pre>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-soft"
              onClick={async () => {
                const ok = await copyToClipboard(markdown);
                setCopied(ok);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
