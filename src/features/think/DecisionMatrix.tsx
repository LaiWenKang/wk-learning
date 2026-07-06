import { useMemo, useState } from "react";
import { Card, Field } from "../../components/ui";

type Criterion = { id: number; name: string; weight: number };
type Option = { id: number; name: string };
type Scores = Record<string, number>; // `${criterionId}:${optionId}` -> 1..5

let nextId = 1;
const uid = () => nextId++;

export function DecisionMatrix() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: uid(), name: "Option A" },
    { id: uid(), name: "Option B" },
  ]);
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: uid(), name: "Impact", weight: 5 },
    { id: uid(), name: "Effort (higher = easier)", weight: 3 },
    { id: uid(), name: "Risk (higher = safer)", weight: 4 },
  ]);
  const [scores, setScores] = useState<Scores>({});

  const scoreKey = (c: Criterion, o: Option) => `${c.id}:${o.id}`;
  const getScore = (c: Criterion, o: Option) => scores[scoreKey(c, o)] ?? 3;

  const totals = useMemo(() => {
    const weightSum = criteria.reduce((s, c) => s + c.weight, 0);
    return options.map((o) => {
      const raw = criteria.reduce((s, c) => s + c.weight * getScore(c, o), 0);
      return {
        option: o,
        raw,
        normalized: weightSum > 0 ? raw / (weightSum * 5) : 0,
      };
    });
  }, [options, criteria, scores]);

  const best = useMemo(() => {
    if (totals.length === 0) return null;
    const sorted = [...totals].sort((a, b) => b.raw - a.raw);
    if (sorted.length > 1 && sorted[0].raw === sorted[1].raw) return null; // tie
    return sorted[0];
  }, [totals]);

  const setOptionName = (id: number, name: string) =>
    setOptions((os) => os.map((o) => (o.id === id ? { ...o, name } : o)));

  const setCriterion = (id: number, patch: Partial<Criterion>) =>
    setCriteria((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <div>
      <Card title="Decision Matrix">
        <p className="card-muted" style={{ marginBottom: 12 }}>
          Score each option 1–5 against each weighted criterion. Word criteria so
          that higher is always better.
        </p>
        <Field label="Decision being made">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Which approach for the migration?"
          />
        </Field>

        <h3 className="section-title" style={{ marginTop: 8 }}>Options</h3>
        {options.map((o) => (
          <div key={o.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              value={o.name}
              onChange={(e) => setOptionName(o.id, e.target.value)}
            />
            <button
              type="button"
              className="btn btn-danger btn-small"
              disabled={options.length <= 2}
              onClick={() => setOptions((os) => os.filter((x) => x.id !== o.id))}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-small"
          onClick={() => setOptions((os) => [...os, { id: uid(), name: `Option ${String.fromCharCode(65 + os.length)}` }])}
        >
          + Add option
        </button>

        <h3 className="section-title">Criteria (weight 1–5)</h3>
        {criteria.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              value={c.name}
              onChange={(e) => setCriterion(c.id, { name: e.target.value })}
            />
            <select
              style={{ width: 72, flexShrink: 0 }}
              value={c.weight}
              onChange={(e) => setCriterion(c.id, { weight: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  w{n}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-danger btn-small"
              disabled={criteria.length <= 1}
              onClick={() => setCriteria((cs) => cs.filter((x) => x.id !== c.id))}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-small"
          onClick={() =>
            setCriteria((cs) => [...cs, { id: uid(), name: "New criterion", weight: 3 }])
          }
        >
          + Add criterion
        </button>
      </Card>

      <Card title="Scores">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Criterion</th>
                {options.map((o) => (
                  <th key={o.id}>{o.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.name} <span className="signal-meta">×{c.weight}</span>
                  </td>
                  {options.map((o) => (
                    <td key={o.id}>
                      <select
                        style={{ width: 64, padding: "4px 6px" }}
                        value={getScore(c, o)}
                        onChange={(e) =>
                          setScores((s) => ({
                            ...s,
                            [scoreKey(c, o)]: Number(e.target.value),
                          }))
                        }
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td style={{ fontWeight: 700 }}>Weighted total</td>
                {totals.map((t) => (
                  <td key={t.option.id} style={{ fontWeight: 700 }}>
                    {t.raw} ({Math.round(t.normalized * 100)}%)
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {best ? (
          <div className="notice notice-info" style={{ marginTop: 12, marginBottom: 0 }}>
            Leaning towards <strong>{best.option.name}</strong> at{" "}
            {Math.round(best.normalized * 100)}%. Sanity-check: does this match your
            gut? If not, a criterion or weight is missing.
          </div>
        ) : (
          <div className="notice" style={{ marginTop: 12, marginBottom: 0 }}>
            It’s a tie — add a differentiating criterion or revisit the weights.
          </div>
        )}
      </Card>
    </div>
  );
}
