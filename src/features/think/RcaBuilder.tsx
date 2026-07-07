import { Fragment, useState } from "react";
import type { CSSProperties } from "react";
import type { RcaDraft } from "../../types";
import { STORE_KEYS, loadList, newId, removeItem, upsertItem } from "../../lib/storage";
import { copyToClipboard, downloadText } from "../../lib/export";
import { todayKey, relativeTime } from "../../lib/date";
import { Card, EmptyState, Field } from "../../components/ui";

type RcaFields = Omit<RcaDraft, "id" | "createdAt">;

const EMPTY: RcaFields = {
  title: "",
  whatHappened: "",
  whatWasExpected: "",
  whatChanged: "",
  evidence: "",
  assumptions: "",
  ruledOut: "",
  rootCause: "",
  correctiveAction: "",
  preventionAction: "",
};

const FIELD_DEFS: { key: keyof RcaFields; label: string; placeholder: string }[] = [
  { key: "whatHappened", label: "What happened?", placeholder: "Observable symptoms, timeline, scope." },
  { key: "whatWasExpected", label: "What was expected?", placeholder: "The correct behaviour." },
  { key: "whatChanged", label: "What changed recently?", placeholder: "Deploys, config, environment, data, timing." },
  { key: "evidence", label: "What evidence do I have?", placeholder: "Logs, metrics, reproduction steps — facts only." },
  { key: "assumptions", label: "What assumptions am I making?", placeholder: "Things believed but not verified." },
  { key: "ruledOut", label: "What did I rule out?", placeholder: "Hypotheses eliminated, and how." },
  { key: "rootCause", label: "Most likely root cause", placeholder: "The best current explanation." },
  { key: "correctiveAction", label: "Corrective action", placeholder: "What fixes it now." },
  { key: "preventionAction", label: "Prevention action", placeholder: "What stops it happening again." },
];

export function buildRcaMarkdown(d: RcaFields, dateKey: string): string {
  const section = (h: string, body: string) =>
    `## ${h}\n\n${body.trim() || "_Not filled in._"}\n`;
  return [
    `# RCA: ${d.title.trim() || "Untitled incident"}`,
    ``,
    `_Date: ${dateKey}_`,
    ``,
    section("What happened", d.whatHappened),
    section("What was expected", d.whatWasExpected),
    section("What changed recently", d.whatChanged),
    section("Evidence", d.evidence),
    section("Assumptions", d.assumptions),
    section("Ruled out", d.ruledOut),
    section("Most likely root cause", d.rootCause),
    section("Corrective action", d.correctiveAction),
    section("Prevention action", d.preventionAction),
  ].join("\n");
}

export function RcaBuilder() {
  const [fields, setFields] = useState<RcaFields>(EMPTY);
  const [drafts, setDrafts] = useState<RcaDraft[]>(() =>
    loadList<RcaDraft>(STORE_KEYS.rcaDrafts),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof RcaFields, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const markdown = buildRcaMarkdown(fields, todayKey());

  const saveDraft = () => {
    const existing = editingId ? drafts.find((d) => d.id === editingId) : undefined;
    const draft: RcaDraft = {
      id: existing?.id ?? newId(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      ...fields,
      title: fields.title.trim() || "Untitled incident",
    };
    setDrafts(upsertItem(STORE_KEYS.rcaDrafts, draft));
    setEditingId(draft.id);
  };

  const loadDraft = (d: RcaDraft) => {
    const { id, createdAt, ...rest } = d;
    void createdAt;
    setFields(rest);
    setEditingId(id);
    setShowOutput(false);
    window.scrollTo({ top: 0 });
  };

  const deleteDraft = (id: string) => {
    setDrafts(removeItem<RcaDraft>(STORE_KEYS.rcaDrafts, id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div>
      <Card title="RCA Builder">
        {/* The path the form walks — facts first, causes last. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 6,
            marginBottom: 10,
          }}
        >
          {[
            { label: "Observe", tint: "var(--cat-systems)" },
            { label: "Evidence", tint: "var(--cat-programming)" },
            { label: "Hypotheses", tint: "var(--cat-ai)" },
            { label: "Root cause", tint: "var(--cat-semiconductor)" },
            { label: "Prevent", tint: "var(--cat-finance)" },
          ].map((s, i, arr) => (
            <Fragment key={s.label}>
              <span
                className="chip chip-cat"
                style={{ "--cat": s.tint, flexShrink: 0 } as CSSProperties}
              >
                {i + 1}. {s.label}
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: "var(--text-tertiary)", flexShrink: 0 }}>→</span>
              )}
            </Fragment>
          ))}
        </div>
        <p className="card-muted" style={{ marginBottom: 12 }}>
          Work through the questions in order — facts before causes. The output
          is clean markdown you can paste anywhere. Keep it generic — no
          confidential details.
        </p>
        <Field label="Incident title">
          <input
            type="text"
            value={fields.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Short neutral description"
          />
        </Field>
        {FIELD_DEFS.map((f) => (
          <Field key={f.key} label={f.label}>
            <textarea
              value={fields[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          </Field>
        ))}
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowOutput(!showOutput)}
          >
            {showOutput ? "Hide Markdown" : "Generate Markdown"}
          </button>
          <button type="button" className="btn" onClick={saveDraft}>
            {editingId ? "Update Draft" : "Save Draft"}
          </button>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => {
              setFields(EMPTY);
              setEditingId(null);
              setShowOutput(false);
            }}
          >
            Clear
          </button>
        </div>
      </Card>

      {showOutput && (
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
            <button
              type="button"
              className="btn"
              onClick={() =>
                downloadText(
                  `rca-${todayKey()}-${(fields.title || "untitled")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .slice(0, 40)}.md`,
                  markdown,
                )
              }
            >
              Download .md
            </button>
          </div>
        </Card>
      )}

      <h2 className="section-title">Saved Drafts</h2>
      {drafts.length === 0 ? (
        <EmptyState>No saved RCA drafts.</EmptyState>
      ) : (
        drafts.map((d) => (
          <Card key={d.id}>
            <p className="signal-title">{d.title}</p>
            <div className="signal-meta">saved {relativeTime(d.createdAt)}</div>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn-soft btn-small"
                onClick={() => loadDraft(d)}
              >
                Load
              </button>
              <button
                type="button"
                className="btn btn-danger btn-small"
                onClick={() => deleteDraft(d.id)}
              >
                Delete
              </button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
