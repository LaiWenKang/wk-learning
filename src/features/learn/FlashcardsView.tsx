import { useMemo, useState } from "react";
import type { Flashcard, Rating, SignalCategory } from "../../types";
import { CATEGORY_LABELS, SIGNAL_CATEGORIES } from "../../types";
import {
  STORE_KEYS,
  loadList,
  newId,
  removeItem,
  saveList,
  upsertItem,
} from "../../lib/storage";
import { addDays, todayKey } from "../../lib/date";
import { STARTER_DECK } from "../../data/starterDeck";
import { Card, CategoryChip, EmptyState, Field, RatingInput } from "../../components/ui";

/** Confidence drives the next review interval (simple spaced repetition). */
const REVIEW_INTERVAL_DAYS: Record<Rating, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

type CardDraft = {
  front: string;
  back: string;
  category: SignalCategory;
  tags: string;
};

const EMPTY_DRAFT: CardDraft = { front: "", back: "", category: "ai", tags: "" };

export function FlashcardsView() {
  const [cards, setCards] = useState<Flashcard[]>(() =>
    loadList<Flashcard>(STORE_KEYS.flashcards),
  );
  const [filter, setFilter] = useState<SignalCategory | "all">("all");
  const [draft, setDraft] = useState<CardDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Review mode: always shows due[0]; rating a card moves it out of the
  // due list, so the next card slides into place automatically.
  const [reviewing, setReviewing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [lastSession, setLastSession] = useState(0);

  const filtered = useMemo(
    () => (filter === "all" ? cards : cards.filter((c) => c.category === filter)),
    [cards, filter],
  );

  const due = useMemo(() => {
    const today = todayKey();
    return filtered.filter((c) => !c.nextReviewAt || c.nextReviewAt <= today);
  }, [filtered]);

  const saveDraft = () => {
    if (!draft.front.trim() || !draft.back.trim()) return;
    const existing = editingId ? cards.find((c) => c.id === editingId) : undefined;
    const card: Flashcard = {
      id: existing?.id ?? newId(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      front: draft.front.trim(),
      back: draft.back.trim(),
      category: draft.category,
      confidence: existing?.confidence ?? 2,
      nextReviewAt: existing?.nextReviewAt,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    setCards(upsertItem(STORE_KEYS.flashcards, card));
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setShowForm(false);
  };

  const edit = (card: Flashcard) => {
    setDraft({
      front: card.front,
      back: card.back,
      category: card.category,
      tags: card.tags.join(", "),
    });
    setEditingId(card.id);
    setShowForm(true);
  };

  const remove = (id: string) => {
    setCards(removeItem<Flashcard>(STORE_KEYS.flashcards, id));
    if (editingId === id) {
      setEditingId(null);
      setDraft(EMPTY_DRAFT);
      setShowForm(false);
    }
  };

  const rateCurrent = (confidence: Rating) => {
    const card = due[0];
    if (!card) return;
    const updated: Flashcard = {
      ...card,
      confidence,
      nextReviewAt: addDays(todayKey(), REVIEW_INTERVAL_DAYS[confidence]),
    };
    setCards(upsertItem(STORE_KEYS.flashcards, updated));
    setRevealed(false);
    setSessionCount((n) => n + 1);
    if (due.length <= 1) {
      setReviewing(false);
      setLastSession(sessionCount + 1);
    }
  };

  const startReview = () => {
    setReviewing(true);
    setRevealed(false);
    setSessionCount(0);
    setLastSession(0);
  };

  const addStarterDeck = () => {
    const now = new Date().toISOString();
    const starters: Flashcard[] = STARTER_DECK.map((c) => ({
      id: newId(),
      createdAt: now,
      front: c.front,
      back: c.back,
      category: c.category,
      confidence: 2,
      tags: c.tags,
    }));
    const next = [...starters, ...cards];
    saveList(STORE_KEYS.flashcards, next);
    setCards(next);
  };

  if (reviewing) {
    const card = due[0];
    if (!card) {
      setReviewing(false);
      return null;
    }
    return (
      <div>
        <p className="signal-meta" style={{ marginBottom: 8 }}>
          Reviewing · {due.length} card{due.length === 1 ? "" : "s"} due
        </p>
        <div className="flip-scene">
          <div className={`flip-inner ${revealed ? "flipped" : ""}`}>
            <div className="flip-face flip-front">
              <Card style={{ minHeight: 300, marginBottom: 0 }}>
                <CategoryChip category={card.category} />
                <p style={{ fontSize: 18, fontWeight: 650, margin: "12px 0 10px" }}>
                  {card.front}
                </p>
                <div className="btn-row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setRevealed(true)}
                  >
                    Show Answer
                  </button>
                </div>
              </Card>
            </div>
            <div className="flip-face flip-back">
              <Card style={{ minHeight: 300, height: "100%", marginBottom: 0 }}>
                <span className="chip chip-neutral">Answer</span>
                <p style={{ fontSize: 16, whiteSpace: "pre-wrap", margin: "12px 0 8px" }}>
                  {card.back}
                </p>
                <p className="field-label" style={{ marginTop: 10 }}>
                  How confident are you? (1 = review tomorrow, 5 = in two weeks)
                </p>
                <RatingInput value={card.confidence} onChange={rateCurrent} />
              </Card>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-small"
          style={{ marginTop: 12 }}
          onClick={() => setReviewing(false)}
        >
          Exit review
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="btn-row" style={{ marginTop: 0, marginBottom: 12 }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setDraft(EMPTY_DRAFT);
          }}
        >
          {showForm ? "Close" : "New Flashcard"}
        </button>
        <button
          type="button"
          className="btn btn-soft"
          disabled={due.length === 0}
          onClick={startReview}
        >
          Review ({due.length} due)
        </button>
      </div>

      {due.length === 0 && filtered.length > 0 && (
        <div className="notice notice-info">
          {(() => {
            const upcoming = filtered
              .map((c) => c.nextReviewAt)
              .filter((d): d is string => !!d)
              .sort()[0];
            return upcoming
              ? `All caught up — next review lands on ${upcoming}. Come back then, or add a new card now.`
              : "All caught up.";
          })()}
        </div>
      )}

      {showForm && (
        <Card title={editingId ? "Edit Flashcard" : "New Flashcard"}>
          <Field label="Front (question)">
            <textarea
              value={draft.front}
              onChange={(e) => setDraft({ ...draft, front: e.target.value })}
              placeholder="What does X mean? How does Y work?"
            />
          </Field>
          <Field label="Back (answer)">
            <textarea
              value={draft.back}
              onChange={(e) => setDraft({ ...draft, back: e.target.value })}
              placeholder="The crisp answer."
            />
          </Field>
          <Field label="Category">
            <select
              value={draft.category}
              onChange={(e) =>
                setDraft({ ...draft, category: e.target.value as SignalCategory })
              }
            >
              {SIGNAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tags" hint="Comma separated">
            <input
              type="text"
              value={draft.tags}
              onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
              placeholder="typescript, basics"
            />
          </Field>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!draft.front.trim() || !draft.back.trim()}
              onClick={saveDraft}
            >
              {editingId ? "Save Changes" : "Add Card"}
            </button>
          </div>
        </Card>
      )}

      {cards.length > 0 && (
        <Card title="Deck Insights">
          {(() => {
            const counts = [1, 2, 3, 4, 5].map(
              (c) => cards.filter((card) => card.confidence === c).length,
            );
            const max = Math.max(...counts, 1);
            return (
              <>
                {counts.map((count, i) => (
                  <div key={i} className="meter-row" style={{ marginBottom: 5 }}>
                    <span className="meter-name" style={{ fontWeight: 600 }}>
                      Confidence {i + 1}
                    </span>
                    <div className="meter" style={{ height: 18 }}>
                      <div
                        className="meter-fill"
                        style={{
                          width: `${(count / max) * 100}%`,
                          opacity: 0.45 + 0.55 * ((i + 1) / 5),
                        }}
                      />
                    </div>
                    <span className="meter-value">{count}</span>
                  </div>
                ))}
                <p className="signal-meta" style={{ marginTop: 6 }}>
                  {cards.length} card{cards.length === 1 ? "" : "s"} total —
                  low-confidence cards come back sooner in review.
                </p>
              </>
            );
          })()}
        </Card>
      )}

      <Field label="Filter by category">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as SignalCategory | "all")}
        >
          <option value="all">All categories</option>
          {SIGNAL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </Field>

      {lastSession > 0 && (
        <div className="notice notice-info">
          Session complete — {lastSession} card{lastSession === 1 ? "" : "s"}{" "}
          reviewed. Consistency beats intensity.
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState>
          <p style={{ marginTop: 0 }}>
            No flashcards yet. Create one, convert a learning queue item, or
            start with a small set of fundamentals.
          </p>
          {cards.length === 0 && (
            <button type="button" className="btn btn-soft" onClick={addStarterDeck}>
              Add starter deck ({STARTER_DECK.length} cards)
            </button>
          )}
        </EmptyState>
      ) : (
        filtered.map((card) => (
          <Card key={card.id}>
            <p className="signal-title">{card.front}</p>
            <p className="card-muted" style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>
              {card.back}
            </p>
            <div
              className="signal-meta"
              style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 8 }}
            >
              <CategoryChip category={card.category} />
              <span>
                confidence {card.confidence}/5
                {card.nextReviewAt ? ` · next review ${card.nextReviewAt}` : " · due now"}
              </span>
            </div>
            <div className="btn-row">
              <button type="button" className="btn btn-small" onClick={() => edit(card)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger btn-small"
                onClick={() => remove(card.id)}
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
