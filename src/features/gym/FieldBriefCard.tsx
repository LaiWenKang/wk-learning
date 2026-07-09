import { useState } from "react";
import { todayKey } from "../../lib/date";
import { dailyRotation } from "../../data/prompts";
import { storage } from "../../lib/storage";
import {
  FIELD_AREA_LABELS,
  FIELD_AREA_TINTS,
  FIELD_BRIEFS,
  FIELD_BRIEF_BY_ID,
  type FieldBrief,
} from "../../content/fieldGuide";
import { Sheet } from "../../components/ui";
import { BoltIcon } from "../../components/icons";
import type { CSSProperties } from "react";

const READ_KEY = "fieldguide-read";

function loadRead(): Record<string, string> {
  const raw = storage.get<Record<string, string>>(READ_KEY);
  return raw && typeof raw === "object" ? raw : {};
}

/**
 * The Storage Field Desk — one deep domain brief per day (what changed,
 * why it matters to SSD firmware test work, what to watch), with the
 * whole guide browsable from the sheet.
 */
export function FieldBriefCard() {
  const dateKey = todayKey();
  const daily = dailyRotation(FIELD_BRIEFS, dateKey, 21);
  const [openId, setOpenId] = useState<string | null>(null);
  const [read, setRead] = useState<Record<string, string>>(loadRead);

  const open = openId ? FIELD_BRIEF_BY_ID.get(openId) : undefined;
  const readCount = FIELD_BRIEFS.filter((b) => read[b.id]).length;

  const openBrief = (b: FieldBrief) => {
    setOpenId(b.id);
    if (!read[b.id]) {
      const next = { ...read, [b.id]: dateKey };
      storage.set(READ_KEY, next);
      setRead(next);
    }
  };

  return (
    <>
      <div
        className="card brief-card"
        style={{ "--tint": FIELD_AREA_TINTS[daily.area] } as CSSProperties}
      >
        <div className="gym-card-top">
          <span className="brief-kicker">
            <BoltIcon /> Storage Field Desk
          </span>
          <span className="brief-count">
            {readCount}/{FIELD_BRIEFS.length} read
          </span>
        </div>
        <span className="brief-area">{FIELD_AREA_LABELS[daily.area]}</span>
        <p className="gym-card-hook">{daily.title}</p>
        <p className="gym-card-meta brief-teaser">{daily.what}</p>
        <button
          type="button"
          className="btn btn-soft btn-block"
          onClick={() => openBrief(daily)}
        >
          {read[daily.id] ? "Re-read today’s brief" : "Read today’s brief"}
        </button>
      </div>

      {open && (
        <Sheet onClose={() => setOpenId(null)} label={`Brief: ${open.title}`}>
          <div
            className="chapter"
            style={{ "--tint": FIELD_AREA_TINTS[open.area] } as CSSProperties}
          >
            <span className="chapter-domain">{FIELD_AREA_LABELS[open.area]}</span>
            <h2 className="chapter-name">{open.title}</h2>
            <div className="chapter-section">
              <div className="chapter-label">State of play</div>
              <p>{open.what}</p>
            </div>
            <div className="chapter-section">
              <div className="chapter-label">What changed</div>
              <p>{open.changed}</p>
            </div>
            <div className="chapter-section chapter-matters">
              <div className="chapter-label">Why it matters to your work</div>
              <p>{open.matters}</p>
            </div>
            <div className="chapter-section">
              <div className="chapter-label">Watch next</div>
              <ul className="brief-watch">
                {open.watch.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
            <div className="chapter-section">
              <div className="chapter-label">All briefs</div>
              <div className="chip-row">
                {FIELD_BRIEFS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`chip chip-link ${b.id === open.id ? "chip-current" : ""}`}
                    style={{ "--tint": FIELD_AREA_TINTS[b.area] } as CSSProperties}
                    onClick={() => openBrief(b)}
                  >
                    {read[b.id] ? "✓ " : ""}
                    {b.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Sheet>
      )}
    </>
  );
}
