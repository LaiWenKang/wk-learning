import { useState } from "react";
import {
  MENTAL_MODELS,
  MODEL_BY_ID,
  MODEL_DOMAINS,
  MODEL_DOMAIN_LABELS,
  MODEL_DOMAIN_TINTS,
} from "../../content/models";
import { loadGymStats, masteryCounts } from "../../lib/gym";
import { ModelChapter } from "../gym/ModelChapter";
import { Sheet } from "../../components/ui";
import type { CSSProperties } from "react";

/**
 * The latticework — every mental model in the library, grouped by
 * domain, lighting up as the daily gym trains them. Untrained models
 * stay readable: the library is for browsing, the light is for progress.
 */
export function ModelsView() {
  const [openId, setOpenId] = useState<string | null>(null);
  const stats = loadGymStats();
  const counts = masteryCounts(stats);
  const open = openId ? MODEL_BY_ID.get(openId) : undefined;
  const openMastery = openId ? stats.mastery[openId] : undefined;

  return (
    <div>
      <div className="card lattice-header">
        <div className="lattice-progress-row">
          <span className="lattice-count">
            {counts.trained}
            <span className="lattice-count-total">/{counts.total}</span>
          </span>
          <div className="lattice-progress-text">
            <strong>Your latticework</strong>
            <span>
              {counts.trained === 0
                ? "Models light up as the daily gym trains them."
                : `${counts.trained} trained · ${counts.solid} recalled cleanly`}
            </span>
          </div>
        </div>
        <div className="lattice-bar" aria-hidden="true">
          <div
            className="lattice-bar-fill"
            style={{ width: `${Math.max(2, (counts.trained / counts.total) * 100)}%` }}
          />
        </div>
      </div>

      {MODEL_DOMAINS.map((domain) => {
        const models = MENTAL_MODELS.filter((m) => m.domain === domain);
        const trained = models.filter((m) => stats.mastery[m.id]).length;
        return (
          <div key={domain} className="lattice-domain">
            <div className="lattice-domain-head">
              <span
                className="lattice-domain-dot"
                style={{ background: MODEL_DOMAIN_TINTS[domain] }}
              />
              <h3>{MODEL_DOMAIN_LABELS[domain]}</h3>
              <span className="lattice-domain-count">
                {trained}/{models.length}
              </span>
            </div>
            <div className="lattice-grid">
              {models.map((m) => {
                const mastery = stats.mastery[m.id];
                const cls = mastery
                  ? mastery.got > 0
                    ? "lattice-chip solid"
                    : "lattice-chip seen"
                  : "lattice-chip";
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={cls}
                    style={{ "--tint": MODEL_DOMAIN_TINTS[domain] } as CSSProperties}
                    onClick={() => setOpenId(m.id)}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="signal-meta" style={{ textAlign: "center", marginTop: 14 }}>
        Tap any model to read it now — the daily gym covers one per day.
      </p>

      {open && (
        <Sheet onClose={() => setOpenId(null)} label={`Model: ${open.name}`}>
          <ModelChapter model={open} showRelated onOpenRelated={(id) => setOpenId(id)} />
          <div className="sheet-section">
            <div className="sheet-section-label">Try it today</div>
            <p className="card-muted" style={{ color: "var(--text)" }}>{open.apply}</p>
          </div>
          {openMastery ? (
            <p className="signal-meta">
              Trained {openMastery.recalls}×, first on {openMastery.seenAt} — last
              recall: {openMastery.lastGrade === "got" ? "got it" : openMastery.lastGrade}.
            </p>
          ) : (
            <p className="signal-meta">Not yet trained in the daily gym.</p>
          )}
        </Sheet>
      )}
    </div>
  );
}
