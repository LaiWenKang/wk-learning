import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../lib/useFocusTrap";
import { buildFeed, type FeedCard } from "../../lib/feed";
import { formatBig, gradeEstimate, describeMiss, loadGymStats, loadRetired, retireContent, currentStreak, masteryCounts } from "../../lib/gym";
import { loadLatestPulse, topSignals } from "../../lib/pulse";
import { STORE_KEYS, loadList, newId, storage, upsertItem } from "../../lib/storage";
import { todayKey, relativeTime } from "../../lib/date";
import { MODEL_DOMAIN_LABELS, MODEL_DOMAIN_TINTS } from "../../content/models";
import { FIELD_AREA_LABELS, FIELD_AREA_TINTS } from "../../content/fieldGuide";
import { CALIBRATION_CATEGORY_LABELS } from "../../content/calibration";
import type { PulseSignal, ReflectionEntry, LearningItem } from "../../types";
import { CALIBRATION_QUESTIONS } from "../../content/calibration";
import type { CSSProperties } from "react";

export const FEED_VIEWED_KEY = "feed-viewed";
const FEED_POS_KEY = "feed-pos";

/**
 * The Feed That Ends — full-screen, scroll-snap card deck. Finite by
 * design: the last card tells you you're caught up. Reaching the end
 * marks the deck viewed for the day.
 */
export function FeedDeck(props: { onClose: () => void }) {
  const trapRef = useFocusTrap<HTMLDivElement>();
  const dateKey = todayKey();
  const [signals, setSignals] = useState<PulseSignal[] | null>(null);
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadLatestPulse().then(({ data }) => {
      if (!cancelled) setSignals(topSignals(data, 3));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [props]);

  if (signals === null) {
    return createPortal(
      <div className="gym-overlay feed-overlay" role="dialog" aria-modal="true" aria-label="Daily deck">
        <div className="feed-loading">Shuffling today’s deck…</div>
      </div>,
      document.body,
    );
  }

  const stats = loadGymStats();
  const deck = buildFeed(dateKey, {
    signals,
    reflections: loadList<ReflectionEntry>(STORE_KEYS.reflections),
    notes: loadList<LearningItem>(STORE_KEYS.learningItems),
    calibrationLog: stats.calibrationLog,
    streak: currentStreak(stats, dateKey),
    retired: loadRetired(dateKey),
  });

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollTop / el.clientHeight);
    if (i !== idx) {
      setIdx(i);
      // Resume point: closing mid-deck reopens on the same card today.
      storage.set(FEED_POS_KEY, { date: dateKey, idx: i });
      if (i >= deck.length - 1) storage.set(FEED_VIEWED_KEY, dateKey);
    }
  };

  // Restore today's position when the deck reopens mid-way.
  const restoreScroll = (el: HTMLDivElement | null) => {
    (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (!el) return;
    const pos = storage.get<{ date: string; idx: number }>(FEED_POS_KEY);
    if (pos && pos.date === dateKey && pos.idx > 0 && pos.idx < deck.length) {
      el.scrollTop = pos.idx * el.clientHeight;
      setIdx(pos.idx);
    }
  };

  return createPortal(
    <div className="gym-overlay feed-overlay" role="dialog" aria-modal="true" aria-label="Daily deck">
      <div ref={trapRef} className="feed-frame">
        <header className="feed-head">
          <button type="button" className="gym-close" aria-label="Close deck" onClick={props.onClose}>
            ✕
          </button>
          <span className="feed-counter">
            {Math.min(idx + 1, deck.length)} / {deck.length}
          </span>
        </header>
        <div className="feed-scroll" ref={restoreScroll} onScroll={onScroll}>
          {deck.map((card, i) => (
            <section className="feed-card" key={i}>
              <CardView card={card} index={i} total={deck.length} dateKey={dateKey} onClose={props.onClose} />
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* --------------------------- card renderers ------------------------- */

function CardView(props: {
  card: FeedCard;
  index: number;
  total: number;
  dateKey: string;
  onClose: () => void;
}) {
  const c = props.card;
  switch (c.kind) {
    case "intro":
      return (
        <div className="feed-inner feed-center">
          <p className="feed-kicker">Today’s deck</p>
          <h2 className="feed-big">{c.total} cards.</h2>
          <p className="feed-muted">
            Facts, ideas, memories and signals — then it ends. Swipe up.
          </p>
          <IntroBreakdown />
          <div className="feed-swipe-hint" aria-hidden="true">↑</div>
        </div>
      );
    case "fact":
      return (
        <div className="feed-inner feed-center">
          <p className="feed-kicker">{CALIBRATION_CATEGORY_LABELS[c.q.category]}</p>
          <h2 className="feed-title">{c.q.q.replace(/\?$/, "")}?</h2>
          <p className="feed-answer">
            {formatBig(c.q.answer)} <span className="feed-unit">{c.q.unit}</span>
          </p>
          <p className="feed-muted feed-explain">{c.q.explain}</p>
          <FactFoot id={c.q.id} dateKey={props.dateKey} />
        </div>
      );
    case "hook":
      return (
        <FlipCard
          kicker={MODEL_DOMAIN_LABELS[c.model.domain]}
          tint={MODEL_DOMAIN_TINTS[c.model.domain]}
          front={
            <>
              <h2 className="feed-title">“{c.model.hook}”</h2>
              <p className="feed-muted">— {c.model.name} · tap to unpack</p>
            </>
          }
          back={
            <>
              <h3 className="feed-subtitle">{c.model.name}</h3>
              <p className="feed-body">{c.model.mechanism}</p>
            </>
          }
        />
      );
    case "paradox":
      return (
        <FlipCard
          kicker="Paradox · commit first"
          tint="var(--accent-2)"
          front={
            <>
              <h2 className="feed-subtitle">{c.paradox.name}</h2>
              <p className="feed-body">{c.paradox.setup}</p>
              <p className="feed-muted" style={{ marginTop: 10 }}>
                {c.paradox.prompt} · tap when committed
              </p>
            </>
          }
          back={<p className="feed-body">{c.paradox.resolution}</p>}
        />
      );
    case "brief":
      return (
        <FlipCard
          kicker={`Storage Field Desk · ${FIELD_AREA_LABELS[c.brief.area]}`}
          tint={FIELD_AREA_TINTS[c.brief.area]}
          front={
            <>
              <h2 className="feed-subtitle">{c.brief.title}</h2>
              <p className="feed-body">{c.brief.changed.split(". ").slice(0, 2).join(". ")}.</p>
              <p className="feed-muted" style={{ marginTop: 10 }}>tap for why it matters to you</p>
            </>
          }
          back={<p className="feed-body">{c.brief.matters}</p>}
        />
      );
    case "quote":
      return (
        <FlipCard
          kicker="Unpacked quote"
          tint="var(--cat-career)"
          front={
            <>
              <h2 className="feed-title">“{c.quote.text}”</h2>
              <p className="feed-muted">— {c.quote.who} · tap to unpack</p>
            </>
          }
          back={
            <>
              <p className="feed-body">{c.quote.meaning}</p>
              <p className="feed-muted" style={{ marginTop: 10 }}>
                Where it fails: {c.quote.failure}
              </p>
            </>
          }
        />
      );
    case "guess":
      return <GuessCard card={c} />;
    case "pulse":
      return <PulseCard signal={c.signal} />;
    case "memory":
      return (
        <div className="feed-inner feed-center feed-memory">
          <p className="feed-kicker">On this day-ish · {c.daysAgo} days ago</p>
          <h2 className="feed-title">“{c.text}”</h2>
          <p className="feed-muted">{c.source}. Still true?</p>
        </div>
      );
    case "rematch":
      return <RematchCard card={c} />;
    case "outro":
      return (
        <div className="feed-inner feed-center">
          <p className="feed-kicker">That’s all</p>
          <h2 className="feed-big">You’re caught up.</h2>
          <p className="feed-muted">No infinite scroll here — the deck refreshes tomorrow.</p>
          <OutroStats streak={c.streak} />
          <button type="button" className="btn btn-primary" onClick={props.onClose}>
            Back to today
          </button>
        </div>
      );
  }
}

function FlipCard(props: {
  kicker: string;
  tint: string;
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className="feed-inner feed-center feed-flip"
      style={{ "--tint": props.tint } as CSSProperties}
      onClick={() => setFlipped((f) => !f)}
    >
      <p className="feed-kicker">{props.kicker}</p>
      {flipped ? props.back : props.front}
    </button>
  );
}

function GuessCard(props: { card: Extract<FeedCard, { kind: "guess" }> }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const c = props.card;
  return (
    <div className="feed-inner feed-center">
      <p className="feed-kicker">One tap · {CALIBRATION_CATEGORY_LABELS[c.q.category]}</p>
      <h2 className="feed-title">{c.q.q}</h2>
      <div className="feed-guess-options">
        {c.options.map((o, i) => {
          let cls = "gym-option";
          if (chosen !== null) {
            if (i === c.answerIdx) cls += " correct";
            else if (i === chosen) cls += " wrong";
            else cls += " dim";
          }
          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={chosen !== null}
              onClick={() => setChosen(i)}
            >
              {formatBig(o)} {c.q.unit}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <p className="feed-muted">
          {chosen === c.answerIdx ? "Yes. " : ""}
          {c.q.explain}
        </p>
      )}
    </div>
  );
}

function RematchCard(props: { card: Extract<FeedCard, { kind: "rematch" }> }) {
  const [revealed, setRevealed] = useState(false);
  const c = props.card;
  const grade = gradeEstimate(c.previousEstimate, c.q.answer);
  return (
    <div className="feed-inner feed-center feed-memory">
      <p className="feed-kicker">Rematch · you missed this {c.daysAgo} days ago</p>
      <h2 className="feed-title">{c.q.q}</h2>
      {!revealed ? (
        <button type="button" className="btn btn-soft" onClick={() => setRevealed(true)}>
          Answer in your head, then reveal
        </button>
      ) : (
        <>
          <p className="feed-answer">
            {formatBig(c.q.answer)} <span className="feed-unit">{c.q.unit}</span>
          </p>
          <p className="feed-muted">
            Last time you said {formatBig(c.previousEstimate)} ({describeMiss(grade)}).{" "}
            {c.q.explain}
          </p>
        </>
      )}
    </div>
  );
}

/** What's inside today — makes the intro card earn its space. */
function IntroBreakdown() {
  return (
    <div className="feed-breakdown">
      <span>4 facts</span>
      <span>3 model sparks</span>
      <span>2 paradoxes</span>
      <span>1 quote</span>
      <span>1 guess</span>
      <span>live signals</span>
      <span>your memories</span>
    </div>
  );
}

/** Fact footer: source count + personal curation. */
function FactFoot(props: { id: string; dateKey: string }) {
  const [retired, setRetired] = useState(false);
  return (
    <div className="feed-foot">
      {retired ? (
        <span className="retire-done">Retired — gone after today.</span>
      ) : (
        <button
          type="button"
          className="retire-link"
          onClick={() => {
            retireContent(props.id, props.dateKey);
            setRetired(true);
          }}
        >
          ✕ Not for me
        </button>
      )}
    </div>
  );
}

/** Pulse card with save-to-queue so signals can be kept without leaving. */
function PulseCard(props: { signal: PulseSignal }) {
  const [saved, setSaved] = useState(false);
  const s = props.signal;
  const save = () => {
    if (saved) return;
    upsertItem(STORE_KEYS.learningItems, {
      id: newId(),
      createdAt: new Date().toISOString(),
      title: s.title,
      sourceUrl: s.url,
      category: s.category,
      note: s.summary ?? "",
      keyTakeaway: "",
      action: "Read and capture one takeaway",
      tags: s.tags.slice(0, 5),
    } as LearningItem);
    setSaved(true);
  };
  return (
    <div className="feed-inner feed-center">
      <p className="feed-kicker">
        Live signal · {s.source}
        {s.publishedAt ? ` · ${relativeTime(s.publishedAt)}` : ""}
      </p>
      <h2 className="feed-title">{s.title}</h2>
      {s.whyItMatters && <p className="feed-muted feed-explain">{s.whyItMatters}</p>}
      <div className="btn-row" style={{ justifyContent: "center" }}>
        <a className="btn btn-soft btn-small" href={s.url} target="_blank" rel="noreferrer">
          Open source ↗
        </a>
        <button type="button" className="btn btn-small" disabled={saved} onClick={save}>
          {saved ? "Saved ✓" : "Save to queue"}
        </button>
      </div>
    </div>
  );
}

/** Outro card stats: the day's accumulation at a glance. */
function OutroStats(props: { streak: number }) {
  const stats = loadGymStats();
  const mastery = masteryCounts(stats);
  const cells: Array<[string, string]> = [
    ["🔥", `${props.streak}-day streak`],
    ["🧠", `${mastery.trained}/${mastery.total} models trained`],
    ["🎯", `${stats.calibrationLog.length} estimates logged`],
    ["📚", `${CALIBRATION_QUESTIONS.length}+ facts in rotation`],
  ];
  return (
    <div className="feed-breakdown feed-outro-stats">
      {cells.map(([icon, label]) => (
        <span key={label}>
          {icon} {label}
        </span>
      ))}
    </div>
  );
}
