import type { MentalModel } from "../../content/models";
import {
  MODEL_BY_ID,
  MODEL_DOMAIN_LABELS,
  MODEL_DOMAIN_TINTS,
} from "../../content/models";
import type { CSSProperties } from "react";

/**
 * One mental model rendered as a readable chapter — used inside the
 * daily session and in the Learn tab's library sheet.
 */
export function ModelChapter(props: {
  model: MentalModel;
  /** Show the related-models footer (library view only). */
  showRelated?: boolean;
  onOpenRelated?: (id: string) => void;
}) {
  const m = props.model;
  const tint = MODEL_DOMAIN_TINTS[m.domain];
  return (
    <div className="chapter" style={{ "--tint": tint } as CSSProperties}>
      <span className="chapter-domain">{MODEL_DOMAIN_LABELS[m.domain]}</span>
      <h2 className="chapter-name">{m.name}</h2>
      <p className="chapter-hook">“{m.hook}”</p>

      <div className="chapter-section">
        <div className="chapter-label">How it works</div>
        <p>{m.mechanism}</p>
      </div>
      <div className="chapter-section">
        <div className="chapter-label">In the wild</div>
        <p>{m.example}</p>
      </div>
      <div className="chapter-section chapter-failure">
        <div className="chapter-label">Where it fails</div>
        <p>{m.failure}</p>
      </div>

      {props.showRelated && m.related.length > 0 && (
        <div className="chapter-section">
          <div className="chapter-label">Connects to</div>
          <div className="chip-row">
            {m.related.map((id) => {
              const rel = MODEL_BY_ID.get(id);
              if (!rel) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className="chip chip-link"
                  onClick={() => props.onOpenRelated?.(id)}
                >
                  {rel.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
