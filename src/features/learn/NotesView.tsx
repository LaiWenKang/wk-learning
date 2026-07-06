import { useState } from "react";
import type { LearningItem, SignalCategory } from "../../types";
import { CATEGORY_LABELS, SIGNAL_CATEGORIES } from "../../types";
import {
  STORE_KEYS,
  loadList,
  newId,
  removeItem,
  saveList,
  upsertItem,
} from "../../lib/storage";
import { downloadJson, readJsonFile } from "../../lib/export";
import { relativeTime, todayKey } from "../../lib/date";
import { Card, EmptyState, Field, TagRow } from "../../components/ui";

type NoteDraft = {
  title: string;
  sourceUrl: string;
  category: SignalCategory;
  note: string;
  keyTakeaway: string;
  action: string;
  tags: string;
};

const EMPTY_DRAFT: NoteDraft = {
  title: "",
  sourceUrl: "",
  category: "programming",
  note: "",
  keyTakeaway: "",
  action: "",
  tags: "",
};

export function NotesView() {
  const [items, setItems] = useState<LearningItem[]>(() =>
    loadList<LearningItem>(STORE_KEYS.learningItems),
  );
  const [draft, setDraft] = useState<NoteDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const visible = showArchived ? items : items.filter((i) => !i.archived);

  const save = () => {
    if (!draft.title.trim()) return;
    const existing = editingId ? items.find((i) => i.id === editingId) : undefined;
    const item: LearningItem = {
      id: existing?.id ?? newId(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      title: draft.title.trim(),
      sourceUrl: draft.sourceUrl.trim() || undefined,
      category: draft.category,
      note: draft.note.trim(),
      keyTakeaway: draft.keyTakeaway.trim(),
      action: draft.action.trim() || undefined,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      archived: existing?.archived,
    };
    setItems(upsertItem(STORE_KEYS.learningItems, item));
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setShowForm(false);
  };

  const edit = (item: LearningItem) => {
    setDraft({
      title: item.title,
      sourceUrl: item.sourceUrl ?? "",
      category: item.category,
      note: item.note,
      keyTakeaway: item.keyTakeaway,
      action: item.action ?? "",
      tags: item.tags.join(", "),
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const remove = (id: string) => {
    setItems(removeItem<LearningItem>(STORE_KEYS.learningItems, id));
  };

  const toggleArchived = (item: LearningItem) => {
    setItems(
      upsertItem(STORE_KEYS.learningItems, { ...item, archived: !item.archived }),
    );
  };

  const exportNotes = () => {
    downloadJson(`wk-learning-notes-${todayKey()}.json`, {
      app: "wk-learning",
      kind: "learning-items",
      exportedAt: new Date().toISOString(),
      items,
    });
  };

  const importNotes = async (file: File) => {
    try {
      const parsed = (await readJsonFile(file)) as {
        kind?: string;
        items?: LearningItem[];
      };
      if (parsed?.kind !== "learning-items" || !Array.isArray(parsed.items)) {
        throw new Error("Not a WK Learning notes export.");
      }
      // Merge by id, imported items win.
      const byId = new Map(items.map((i) => [i.id, i]));
      for (const item of parsed.items) byId.set(item.id, item);
      const merged = [...byId.values()];
      merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setItems(merged);
      saveList(STORE_KEYS.learningItems, merged);
      setImportMsg(`Imported ${parsed.items.length} notes.`);
    } catch (err) {
      setImportMsg(err instanceof Error ? err.message : "Import failed.");
    }
  };

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
          {showForm ? "Close" : "New Note"}
        </button>
        <button type="button" className="btn" onClick={exportNotes}>
          Export JSON
        </button>
        <label className="btn" style={{ cursor: "pointer" }}>
          Import JSON
          <input
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importNotes(f);
              e.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          className="btn btn-small"
          onClick={() => setShowArchived(!showArchived)}
        >
          {showArchived ? "Hide archived" : "Show archived"}
        </button>
      </div>

      {importMsg && <div className="notice notice-info">{importMsg}</div>}

      {showForm && (
        <Card title={editingId ? "Edit Note" : "New Concept Note"}>
          <Field label="Title">
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Concept, idea or article name"
            />
          </Field>
          <Field label="Source URL (optional)">
            <input
              type="url"
              value={draft.sourceUrl}
              onChange={(e) => setDraft({ ...draft, sourceUrl: e.target.value })}
              placeholder="https://…"
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
          <Field label="Note">
            <textarea
              value={draft.note}
              onChange={(e) => setDraft({ ...draft, note: e.target.value })}
              placeholder="Short note in your own words."
            />
          </Field>
          <Field label="Key takeaway">
            <input
              type="text"
              value={draft.keyTakeaway}
              onChange={(e) => setDraft({ ...draft, keyTakeaway: e.target.value })}
              placeholder="The one thing to remember."
            />
          </Field>
          <Field label="Action item (optional)">
            <input
              type="text"
              value={draft.action}
              onChange={(e) => setDraft({ ...draft, action: e.target.value })}
              placeholder="Something concrete to try."
            />
          </Field>
          <Field label="Tags" hint="Comma separated">
            <input
              type="text"
              value={draft.tags}
              onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
            />
          </Field>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!draft.title.trim()}
              onClick={save}
            >
              {editingId ? "Save Changes" : "Add Note"}
            </button>
          </div>
        </Card>
      )}

      {visible.length === 0 ? (
        <EmptyState>No notes yet. Capture your first concept note.</EmptyState>
      ) : (
        visible.map((item) => (
          <Card key={item.id}>
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
            <div className="signal-meta">
              {CATEGORY_LABELS[item.category]} · {relativeTime(item.createdAt)}
              {item.archived ? " · archived" : ""}
            </div>
            {item.note && (
              <p className="card-muted" style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                {item.note}
              </p>
            )}
            {item.keyTakeaway && (
              <p className="card-muted" style={{ marginTop: 6 }}>
                <strong>Takeaway:</strong> {item.keyTakeaway}
              </p>
            )}
            {item.action && (
              <p className="card-muted" style={{ marginTop: 6 }}>
                <strong>Action:</strong> {item.action}
              </p>
            )}
            <TagRow tags={item.tags} />
            <div className="btn-row">
              <button type="button" className="btn btn-small" onClick={() => edit(item)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn-small"
                onClick={() => toggleArchived(item)}
              >
                {item.archived ? "Unarchive" : "Archive"}
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
        ))
      )}
    </div>
  );
}
