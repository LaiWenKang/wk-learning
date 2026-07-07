import { useMemo, useState } from "react";
import type { Flashcard, Rating, SignalCategory } from "../../types";
import { CATEGORY_LABELS, SIGNAL_CATEGORIES } from "../../types";
import { STORE_KEYS, loadList, newId, removeItem, upsertItem } from "../../lib/storage";
import { addDays, todayKey } from "../../lib/date";
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
    if (due.length <= 1) setReviewing(false);
  };

  const startReview = () => {
    setReviewing(true);
    setRevealed(false);
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
        <Card>
          <CategoryChip category={card.category} />
          <p style={{ fontSize: 18, fontWeight: 650, margin: "10px 0 8px" }}>{card.front}</p>
          {revealed ? (
            <>
              <hr className="divider" />
              <p style={{ fontSize: 16, whiteSpace: "pre-wrap" }}>{card.back}</p>
              <p className="field-label" style={{ marginTop: 12 }}>
                How confident are you? (1 = review tomorrow, 5 = in two weeks)
              </p>
              <RatingInput value={card.confidence} onChange={rateCurrent} />
            </>
          ) : (
            <div className="btn-row">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setRevealed(true)}
              >
                Show Answer
              </button>
            </div>
          )}
        </Card>
        <button type="button" className="btn btn-small" onClick={() => setReviewing(false)}>
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

      {filtered.length === 0 ? (
        <EmptyState>
          No flashcards yet. Create one, or convert a learning queue item.
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
