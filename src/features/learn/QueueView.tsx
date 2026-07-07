import { useState } from "react";
import type { CSSProperties } from "react";
import type { Flashcard, LearningItem } from "../../types";
import { STORE_KEYS, loadList, newId, saveList, upsertItem } from "../../lib/storage";
import { relativeTime } from "../../lib/date";
import {
  Card,
  CategoryChip,
  EmptyState,
  TagRow,
  categoryColor,
} from "../../components/ui";

/**
 * The Learning Queue: saved pulse signals and notes waiting to be
 * processed. Items are shared with Concept Notes (same store); the queue
 * shows the unarchived ones.
 */
export function QueueView() {
  const [items, setItems] = useState<LearningItem[]>(() =>
    loadList<LearningItem>(STORE_KEYS.learningItems),
  );
  const [madeCardFor, setMadeCardFor] = useState<string | null>(null);

  const active = items.filter((i) => !i.archived);

  const archive = (item: LearningItem) => {
    setItems(upsertItem(STORE_KEYS.learningItems, { ...item, archived: true }));
  };

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    saveList(STORE_KEYS.learningItems, next);
    setItems(next);
  };

  const toFlashcard = (item: LearningItem) => {
    const card: Flashcard = {
      id: newId(),
      createdAt: new Date().toISOString(),
      front: item.title,
      back: item.keyTakeaway || item.note || "(fill in the answer)",
      category: item.category,
      confidence: 2,
      tags: item.tags,
    };
    upsertItem(STORE_KEYS.flashcards, card);
    setMadeCardFor(item.id);
  };

  if (active.length === 0) {
    return (
      <EmptyState>
        Your queue is empty. Save signals from the Today tab, or add a concept
        note — items you haven’t archived show up here.
      </EmptyState>
    );
  }

  return (
    <div>
      {active.map((item) => (
        <Card
          key={item.id}
          className="signal-card"
          style={{ "--cat": categoryColor(item.category) } as CSSProperties}
        >
          {item.sourceUrl ? (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="signal-title"
            >
              {item.title}
            </a>
          ) : (
            <p className="signal-title">{item.title}</p>
          )}
          <div
            className="signal-meta"
            style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 7 }}
          >
            <CategoryChip category={item.category} />
            <span>added {relativeTime(item.createdAt)}</span>
          </div>
          {item.note && (
            <p className="card-muted" style={{ marginTop: 6 }}>
              {item.note}
            </p>
          )}
          {item.keyTakeaway && (
            <p className="card-muted" style={{ marginTop: 6 }}>
              <strong>Takeaway:</strong> {item.keyTakeaway}
            </p>
          )}
          <TagRow tags={item.tags} />
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-soft btn-small"
              disabled={madeCardFor === item.id}
              onClick={() => toFlashcard(item)}
            >
              {madeCardFor === item.id ? "Card created ✓" : "Make Flashcard"}
            </button>
            <button
              type="button"
              className="btn btn-small"
              onClick={() => archive(item)}
            >
              Archive
            </button>
            <button
              type="button"
              className="btn btn-danger btn-small"
              onClick={() => remove(item.id)}
            >
              Delete
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
