import { useEffect, useState } from "react";
import { Card, Field } from "../../components/ui";
import { copyToClipboard } from "../../lib/export";
import { storage } from "../../lib/storage";

type AssumptionDraft = {
  claim: string;
  verified: string;
  assumed: string;
  counterEvidence: string;
  risk: string;
};

const DRAFT_KEY = "assumption-draft";

export function AssumptionChecker() {
  const [initial] = useState<AssumptionDraft>(
    () =>
      storage.get<AssumptionDraft>(DRAFT_KEY) ?? {
        claim: "",
        verified: "",
        assumed: "",
        counterEvidence: "",
        risk: "",
      },
  );
  const [claim, setClaim] = useState(initial.claim);
  const [verified, setVerified] = useState(initial.verified);
  const [assumed, setAssumed] = useState(initial.assumed);
  const [counterEvidence, setCounterEvidence] = useState(initial.counterEvidence);
  const [risk, setRisk] = useState(initial.risk);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    storage.set<AssumptionDraft>(DRAFT_KEY, {
      claim,
      verified,
      assumed,
      counterEvidence,
      risk,
    });
  }, [claim, verified, assumed, counterEvidence, risk]);

  const clearAll = () => {
    setClaim("");
    setVerified("");
    setAssumed("");
    setCounterEvidence("");
    setRisk("");
  };

  const summary = [
    `**Claim:** ${claim.trim() || "—"}`,
    ``,
    `**Verified:** ${verified.trim() || "—"}`,
    ``,
    `**Assumed:** ${assumed.trim() || "—"}`,
    ``,
    `**Evidence that would change my mind:** ${counterEvidence.trim() || "—"}`,
    ``,
    `**Risk if I am wrong:** ${risk.trim() || "—"}`,
  ].join("\n");

  const started = claim.trim().length > 0;

  return (
    <div>
      <Card title="Assumption Checker">
        <p className="card-muted" style={{ marginBottom: 12 }}>
          Take a belief you’re acting on and separate what you know from what
          you’re assuming.
        </p>
        <Field label="The thought or claim">
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="e.g. “The slowdown must be caused by the new cache layer.”"
          />
        </Field>
        {started && (
          <>
            <Field
              label="What is verified?"
              hint="Only things you have directly observed or measured."
            >
              <textarea value={verified} onChange={(e) => setVerified(e.target.value)} />
            </Field>
            <Field
              label="What is assumed?"
              hint="Things you believe but have not checked."
            >
              <textarea value={assumed} onChange={(e) => setAssumed(e.target.value)} />
            </Field>
            <Field
              label="What evidence would change my mind?"
              hint="If nothing could, that's a warning sign."
            >
              <textarea
                value={counterEvidence}
                onChange={(e) => setCounterEvidence(e.target.value)}
              />
            </Field>
            <Field label="What is the risk if I am wrong?">
              <textarea value={risk} onChange={(e) => setRisk(e.target.value)} />
            </Field>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn-danger btn-small"
                onClick={clearAll}
              >
                Clear
              </button>
            </div>
          </>
        )}
      </Card>

      {started && (
        <Card title="Summary">
          <pre className="markdown-output">{summary}</pre>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-soft"
              onClick={async () => {
                const ok = await copyToClipboard(summary);
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
