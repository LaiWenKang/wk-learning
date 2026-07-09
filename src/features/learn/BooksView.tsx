import { useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../lib/useFocusTrap";
import { todayKey } from "../../lib/date";
import { dailyRotation } from "../../data/prompts";
import {
  advanceSerial,
  loadBooksRead,
  loadSerial,
  markBookRead,
  serialDone,
} from "../../lib/shelf";
import {
  BOOKS,
  BOOK_AREA_LABELS,
  BOOK_AREA_TINTS,
  type BookDistillation,
} from "../../content/books";
import { UNPACKED_QUOTES } from "../../content/quotes";
import { MEDITATIONS_SERIAL } from "../../content/meditations";
import { MODEL_BY_ID } from "../../content/models";
import { ModelChapter } from "../gym/ModelChapter";
import { Sheet } from "../../components/ui";
import { STORE_KEYS, newId, storage, upsertItem } from "../../lib/storage";
import { BOOK_DUELS, type BookDuel } from "../../content/duels";
import type { LearningItem } from "../../types";
import { BookIcon, PencilIcon, SparkleIcon } from "../../components/icons";
import type { CSSProperties } from "react";

/**
 * The Bookshelf: a serialized classic (one instalment a day), the
 * distillation shelf, today's unpacked quote, and the commonplace-book
 * capture flow for passages from your real reading.
 */
export function BooksView() {
  const dateKey = todayKey();
  const [serial, setSerial] = useState(loadSerial);
  const [read, setRead] = useState<Record<string, string>>(loadBooksRead);
  const [openBook, setOpenBook] = useState<BookDistillation | null>(null);
  const [serialOpen, setSerialOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);

  const quote = dailyRotation(UNPACKED_QUOTES, dateKey, 41);
  const done = serialDone(serial);
  // After today's advance, "current" stays on the passage just read —
  // the next instalment belongs to tomorrow, not to a second tap today.
  const currentIdx = Math.min(
    serial.lastAt === dateKey && serial.idx > 0 ? serial.idx - 1 : serial.idx,
    MEDITATIONS_SERIAL.length - 1,
  );
  const instalment = MEDITATIONS_SERIAL[currentIdx];
  const readCount = Object.keys(read).length;

  const openReader = (b: BookDistillation) => {
    setOpenBook(b);
    setRead(markBookRead(b.id, dateKey));
  };

  return (
    <div>
      {/* Serialized classic */}
      <div className="card serial-card">
        <div className="gym-card-top">
          <span className="brief-kicker" style={{ color: "var(--cat-communication)" }}>
            <BookIcon /> Serialized classic
          </span>
          <span className="brief-count">
            {done ? "complete ✓" : `Day ${currentIdx + 1}/${MEDITATIONS_SERIAL.length}`}
          </span>
        </div>
        <p className="gym-card-hook">
          Meditations — {done ? "the full run, yours to re-read" : instalment.title}
        </p>
        <p className="gym-card-meta">
          Marcus Aurelius, one passage a day. Miss a day and you simply resume —
          the serial waits.
        </p>
        <button type="button" className="btn btn-soft btn-block" onClick={() => setSerialOpen(true)}>
          {done
            ? "Re-read any instalment"
            : serial.lastAt === dateKey
              ? "Re-read today’s passage"
              : "Read today’s passage"}
        </button>
      </div>

      {/* Quote of the day */}
      <div className="card quote-card">
        <span className="brief-kicker" style={{ color: "var(--cat-career)" }}>
          <SparkleIcon /> Unpacked quote
        </span>
        <p className="quote-text">“{quote.text}”</p>
        <p className="quote-who">— {quote.who}</p>
        <div className="chapter-section">
          <div className="chapter-label">The context</div>
          <p>{quote.context}</p>
        </div>
        <div className="chapter-section">
          <div className="chapter-label">What it really means</div>
          <p>{quote.meaning}</p>
        </div>
        <div className="chapter-section chapter-failure">
          <div className="chapter-label">Where it fails</div>
          <p>{quote.failure}</p>
        </div>
        <p className="quote-ask">{quote.ask}</p>
      </div>

      {/* The shelf */}
      <div className="lattice-domain-head" style={{ marginTop: 18 }}>
        <h3>The shelf</h3>
        <span className="lattice-domain-count">
          {readCount}/{BOOKS.length} read
        </span>
      </div>
      {BOOKS.map((b) => (
        <button
          key={b.id}
          type="button"
          className="book-row"
          style={{ "--tint": BOOK_AREA_TINTS[b.area] } as CSSProperties}
          onClick={() => openReader(b)}
        >
          <span className="book-spine" aria-hidden="true" />
          <span className="book-info">
            <strong>
              {b.title}
              {read[b.id] ? " ✓" : ""}
            </strong>
            <span>
              {b.author} · {b.year} · {BOOK_AREA_LABELS[b.area]}
            </span>
          </span>
          <span className="feed-entry-cta" aria-hidden="true">→</span>
        </button>
      ))}

      {/* Book duels */}
      <div className="lattice-domain-head" style={{ marginTop: 18 }}>
        <h3>Book duels</h3>
        <span className="lattice-domain-count">books that disagree</span>
      </div>
      <DuelsSection />

      {/* Commonplace capture */}
      <button type="button" className="btn btn-soft btn-block" style={{ marginTop: 14 }} onClick={() => setCaptureOpen(true)}>
        <PencilIcon /> Capture a passage from your own reading
      </button>
      <p className="signal-meta" style={{ textAlign: "center", marginTop: 8 }}>
        Your commonplace book — captured passages live in Notes and resurface
        in the daily deck.
      </p>

      {serialOpen && (
        <SerialReader
          idx={currentIdx}
          maxIdx={currentIdx}
          onDone={() => {
            setSerial(advanceSerial(loadSerial(), dateKey));
            setSerialOpen(false);
          }}
          onClose={() => setSerialOpen(false)}
        />
      )}
      {openBook && <BookReader book={openBook} onClose={() => setOpenBook(null)} />}
      {captureOpen && <CaptureSheet onClose={() => setCaptureOpen(false)} />}
    </div>
  );
}

/* --------------------------- serial reader -------------------------- */

function SerialReader(props: {
  idx: number;
  maxIdx: number;
  onDone: () => void;
  onClose: () => void;
}) {
  const trapRef = useFocusTrap<HTMLDivElement>();
  const [idx, setIdx] = useState(props.idx);
  const inst = MEDITATIONS_SERIAL[idx];
  const isCurrent = idx === props.maxIdx;

  return createPortal(
    <div className="gym-overlay" role="dialog" aria-modal="true" aria-label="Meditations serial">
      <div ref={trapRef} className="gym-frame">
        <header className="gym-head">
          <button type="button" className="gym-close" aria-label="Close" onClick={props.onClose}>
            ✕
          </button>
          <span className="gym-step-label" style={{ flex: 1, textAlign: "right" }}>
            Meditations · Day {idx + 1} of {MEDITATIONS_SERIAL.length} · {inst.ref}
          </span>
        </header>
        <div className="gym-body" key={idx}>
          <p className="gym-kicker">Marcus Aurelius, to himself</p>
          <h2 className="gym-question">{inst.title}</h2>
          <div className="serial-text">{inst.text}</div>
          <div className="quote-ask" style={{ marginBottom: 18 }}>{inst.question}</div>
          {idx > 0 && (
            <button type="button" className="btn btn-small" style={{ marginRight: 8 }} onClick={() => setIdx(idx - 1)}>
              ← Day {idx}
            </button>
          )}
          {isCurrent ? (
            <button type="button" className="btn btn-primary" onClick={props.onDone}>
              Done — continue tomorrow
            </button>
          ) : (
            <button type="button" className="btn btn-small" onClick={() => setIdx(idx + 1)}>
              Day {idx + 2} →
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ---------------------------- book reader --------------------------- */

function BookReader(props: { book: BookDistillation; onClose: () => void }) {
  const trapRef = useFocusTrap<HTMLDivElement>();
  const [modelId, setModelId] = useState<string | null>(null);
  const b = props.book;
  const tint = BOOK_AREA_TINTS[b.area];
  const openModel = modelId ? MODEL_BY_ID.get(modelId) : undefined;

  return createPortal(
    <div className="gym-overlay" role="dialog" aria-modal="true" aria-label={`Book: ${b.title}`}>
      <div ref={trapRef} className="gym-frame" style={{ "--tint": tint } as CSSProperties}>
        <header className="gym-head">
          <button type="button" className="gym-close" aria-label="Close" onClick={props.onClose}>
            ✕
          </button>
          <span className="gym-step-label" style={{ flex: 1, textAlign: "right" }}>
            ~8 min read
          </span>
        </header>
        <div className="gym-body chapter" style={{ "--tint": tint } as CSSProperties}>
          <span className="chapter-domain">{BOOK_AREA_LABELS[b.area]}</span>
          <h2 className="chapter-name">{b.title}</h2>
          <p className="signal-meta" style={{ marginBottom: 14 }}>
            {b.author} · {b.year}
          </p>

          <div className="chapter-section">
            <div className="chapter-label">The whole book in a paragraph</div>
            <p>{b.thesis}</p>
          </div>

          <div className="chapter-section">
            <div className="chapter-label">The load-bearing ideas</div>
            {b.ideas.map((idea, i) => (
              <div key={idea.name} className="book-idea">
                <div className="book-idea-name">
                  {i + 1}. {idea.name}
                </div>
                <p>{idea.text}</p>
              </div>
            ))}
          </div>

          <div className="chapter-section">
            <div className="chapter-label">Worth quoting</div>
            {b.quotes.map((q) => (
              <div key={q.text} className="book-quote">
                <p className="quote-text">“{q.text}”</p>
                <p className="feed-muted">{q.note}</p>
              </div>
            ))}
          </div>

          <div className="chapter-section chapter-failure">
            <div className="chapter-label">What the critics say (steelman)</div>
            <p>{b.critics}</p>
          </div>

          <div className="chapter-section chapter-matters">
            <div className="chapter-label">If you remember one thing</div>
            <p>{b.oneThing}</p>
          </div>

          {b.related.length > 0 && (
            <div className="chapter-section">
              <div className="chapter-label">Lights up on your latticework</div>
              <div className="chip-row">
                {b.related.map((id) => {
                  const m = MODEL_BY_ID.get(id);
                  return m ? (
                    <button key={id} type="button" className="chip chip-link" onClick={() => setModelId(id)}>
                      {m.name}
                    </button>
                  ) : null;
                })}
              </div>
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

/* ------------------------------ duels ------------------------------- */

const DUEL_PICKS_KEY = "duel-picks";

function DuelsSection() {
  const [open, setOpen] = useState<BookDuel | null>(null);
  const [picks, setPicks] = useState<Record<string, "a" | "b">>(
    () => storage.get<Record<string, "a" | "b">>(DUEL_PICKS_KEY) ?? {},
  );

  const pick = (id: string, side: "a" | "b") => {
    const next = { ...picks, [id]: side };
    storage.set(DUEL_PICKS_KEY, next);
    setPicks(next);
  };

  return (
    <>
      {BOOK_DUELS.map((d) => (
        <button
          key={d.id}
          type="button"
          className="book-row"
          style={{ "--tint": "var(--accent-2)" } as CSSProperties}
          onClick={() => setOpen(d)}
        >
          <span className="book-spine" aria-hidden="true" />
          <span className="book-info">
            <strong>
              {d.topic}
              {picks[d.id] ? " ✓" : ""}
            </strong>
            <span>
              {d.a.book} vs {d.b.book}
            </span>
          </span>
          <span className="feed-entry-cta" aria-hidden="true">⚔</span>
        </button>
      ))}
      {open && (
        <Sheet onClose={() => setOpen(null)} label={`Duel: ${open.topic}`}>
          <h3>{open.topic}</h3>
          <div className="duel-side">
            <div className="chapter-label">
              {open.a.book} — {open.a.author}
            </div>
            <p>{open.a.thesis}</p>
          </div>
          <div className="duel-side duel-side-b">
            <div className="chapter-label">
              {open.b.book} — {open.b.author}
            </div>
            <p>{open.b.thesis}</p>
          </div>
          <p className="quote-ask">{open.question}</p>
          {!picks[open.id] ? (
            <div className="grade-row grade-row-2" style={{ marginTop: 12 }}>
              <button type="button" className="btn grade-fuzzy" onClick={() => pick(open.id, "a")}>
                {open.a.book}
              </button>
              <button type="button" className="btn grade-got" onClick={() => pick(open.id, "b")}>
                {open.b.book}
              </button>
            </div>
          ) : (
            <div className="sheet-section" style={{ marginTop: 12 }}>
              <div className="chapter-label">
                The synthesis (you picked {picks[open.id] === "a" ? open.a.book : open.b.book})
              </div>
              <p className="card-muted" style={{ color: "var(--text)" }}>{open.synthesis}</p>
            </div>
          )}
        </Sheet>
      )}
    </>
  );
}

/* ------------------------- commonplace capture ---------------------- */

function CaptureSheet(props: { onClose: () => void }) {
  const [passage, setPassage] = useState("");
  const [source, setSource] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (passage.trim().length === 0) return;
    const item: LearningItem = {
      id: newId(),
      createdAt: new Date().toISOString(),
      title: source.trim() || "Commonplace passage",
      category: "career",
      note: passage.trim(),
      keyTakeaway: passage.trim().slice(0, 180),
      tags: ["commonplace"],
    };
    upsertItem(STORE_KEYS.learningItems, item);
    setSaved(true);
    setTimeout(props.onClose, 700);
  };

  return (
    <Sheet onClose={props.onClose} label="Capture a passage">
      <h3>Capture a passage</h3>
      <p className="card-muted" style={{ marginBottom: 10 }}>
        The commonplace book: when a line in your reading stops you, keep it.
        It lands in Notes (tagged “commonplace”) and can resurface in your
        daily deck months from now.
      </p>
      <label className="field">
        <span className="field-label">The passage</span>
        <textarea
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          rows={4}
          placeholder="Copy or type the line that stopped you…"
        />
      </label>
      <label className="field">
        <span className="field-label">Book / source</span>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="e.g. Chip War, ch. 4"
        />
      </label>
      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={passage.trim().length === 0} onClick={save}>
          {saved ? "Kept ✓" : "Keep it"}
        </button>
      </div>
    </Sheet>
  );
}
