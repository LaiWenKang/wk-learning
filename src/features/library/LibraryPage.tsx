import { useMemo, useState } from "react";
import { Segmented, Sheet } from "../../components/ui";
import { ModelsView } from "../learn/ModelsView";
import { BooksView } from "../learn/BooksView";
import { PracticeView } from "../think/ThinkPage";
import { QueueView } from "../learn/QueueView";
import { FlashcardsView } from "../learn/FlashcardsView";
import { NotesView } from "../learn/NotesView";
import {
  searchLibrary,
  SEARCH_TYPE_LABELS,
  type SearchResult,
} from "../../lib/librarySearch";
import { MODEL_BY_ID } from "../../content/models";
import { BOOK_BY_ID, BOOK_AREA_LABELS } from "../../content/books";
import { FIELD_BRIEF_BY_ID, FIELD_AREA_LABELS } from "../../content/fieldGuide";
import { PLAYBOOK_BY_ID } from "../../content/playbooks";
import { CASE_BY_ID } from "../../content/cases";
import { QUOTE_BY_ID } from "../../content/quotes";
import { MEDITATIONS_SERIAL } from "../../content/meditations";
import { ModelChapter } from "../gym/ModelChapter";

type LibraryView = "models" | "books" | "practice" | "vault";
type VaultView = "queue" | "cards" | "notes";

/**
 * The Library — one searchable body of knowledge: mental models, books,
 * field briefs, practice (tools, cases, playbooks) and your own vault
 * (queue, flashcards, notes).
 */
export function LibraryPage() {
  const [view, setView] = useState<LibraryView>("models");
  const [vault, setVault] = useState<VaultView>("queue");
  const [query, setQuery] = useState("");
  const [openResult, setOpenResult] = useState<SearchResult | null>(null);

  const results = useMemo(() => searchLibrary(query), [query]);
  const searching = query.trim().length >= 2;

  return (
    <div>
      <h1 className="page-title">Library</h1>
      <p className="page-subtitle">
        Everything you're learning, one search away. All local.
      </p>

      <input
        type="search"
        className="library-search"
        placeholder="Search models, books, briefs, cases, quotes…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search the library"
      />

      {searching ? (
        <div>
          <p className="signal-meta" style={{ margin: "4px 0 10px" }}>
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          {results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              type="button"
              className="book-row"
              onClick={() => setOpenResult(r)}
            >
              <span className="book-spine" aria-hidden="true" />
              <span className="book-info">
                <strong>{r.title}</strong>
                <span>
                  {SEARCH_TYPE_LABELS[r.type]} · {r.snippet}
                </span>
              </span>
              <span className="feed-entry-cta" aria-hidden="true">→</span>
            </button>
          ))}
          {results.length === 0 && (
            <p className="empty-state">Nothing matches “{query.trim()}” yet.</p>
          )}
        </div>
      ) : (
        <>
          <Segmented<LibraryView>
            value={view}
            onChange={setView}
            options={[
              { value: "models", label: "Models" },
              { value: "books", label: "Books" },
              { value: "practice", label: "Practice" },
              { value: "vault", label: "Vault" },
            ]}
          />
          {view === "models" && <ModelsView />}
          {view === "books" && <BooksView />}
          {view === "practice" && <PracticeView />}
          {view === "vault" && (
            <>
              <Segmented<VaultView>
                value={vault}
                onChange={setVault}
                options={[
                  { value: "queue", label: "Queue" },
                  { value: "cards", label: "Cards" },
                  { value: "notes", label: "Notes" },
                ]}
              />
              {vault === "queue" && <QueueView />}
              {vault === "cards" && <FlashcardsView />}
              {vault === "notes" && <NotesView />}
            </>
          )}
        </>
      )}

      {openResult && (
        <SearchResultSheet result={openResult} onClose={() => setOpenResult(null)} />
      )}
    </div>
  );
}

/** Renders any search result's full content in a sheet, by type. */
function SearchResultSheet(props: { result: SearchResult; onClose: () => void }) {
  const { result } = props;
  const [modelId, setModelId] = useState<string | null>(
    result.type === "model" ? result.id : null,
  );

  if (result.type === "model") {
    const m = modelId ? MODEL_BY_ID.get(modelId) : undefined;
    if (!m) return null;
    return (
      <Sheet onClose={props.onClose} label={`Model: ${m.name}`}>
        <ModelChapter model={m} showRelated onOpenRelated={(id) => setModelId(id)} />
      </Sheet>
    );
  }

  return (
    <Sheet onClose={props.onClose} label={result.title}>
      <ResultBody result={result} />
    </Sheet>
  );
}

function ResultBody({ result }: { result: SearchResult }) {
  switch (result.type) {
    case "book": {
      const b = BOOK_BY_ID.get(result.id);
      if (!b) return null;
      return (
        <div className="chapter">
          <span className="chapter-domain">{BOOK_AREA_LABELS[b.area]}</span>
          <h2 className="chapter-name">{b.title}</h2>
          <p className="signal-meta" style={{ marginBottom: 12 }}>{b.author} · {b.year}</p>
          <div className="chapter-section">
            <div className="chapter-label">Thesis</div>
            <p>{b.thesis}</p>
          </div>
          {b.ideas.map((i) => (
            <div key={i.name} className="book-idea">
              <div className="book-idea-name">{i.name}</div>
              <p>{i.text}</p>
            </div>
          ))}
          <div className="chapter-section chapter-matters">
            <div className="chapter-label">If you remember one thing</div>
            <p>{b.oneThing}</p>
          </div>
          <p className="signal-meta">Full distillation with quotes and critics: Library → Books.</p>
        </div>
      );
    }
    case "brief": {
      const f = FIELD_BRIEF_BY_ID.get(result.id);
      if (!f) return null;
      return (
        <div className="chapter">
          <span className="chapter-domain">{FIELD_AREA_LABELS[f.area]}</span>
          <h2 className="chapter-name">{f.title}</h2>
          <div className="chapter-section"><div className="chapter-label">State of play</div><p>{f.what}</p></div>
          <div className="chapter-section"><div className="chapter-label">What changed</div><p>{f.changed}</p></div>
          <div className="chapter-section chapter-matters"><div className="chapter-label">Why it matters to your work</div><p>{f.matters}</p></div>
        </div>
      );
    }
    case "playbook": {
      const p = PLAYBOOK_BY_ID.get(result.id);
      if (!p) return null;
      return (
        <div>
          <h3>{p.title}</h3>
          <p className="card-muted" style={{ marginBottom: 10 }}>{p.when}</p>
          {p.steps.map((s, i) => (
            <div key={i} className="playbook-step">
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>{i + 1}.</span>
              <span>
                <strong>{s.do}</strong>
                {s.why && <em>{s.why}</em>}
              </span>
            </div>
          ))}
        </div>
      );
    }
    case "case": {
      const c = CASE_BY_ID.get(result.id);
      if (!c) return null;
      return (
        <div>
          <h3>{c.title}</h3>
          <p className="card-muted" style={{ marginBottom: 10 }}>{c.setting}</p>
          <p className="signal-meta">
            An interactive case with {c.steps.length} decisions — run it from
            Library → Practice → Case Files.
          </p>
        </div>
      );
    }
    case "quote": {
      const u = QUOTE_BY_ID.get(result.id);
      if (!u) return null;
      return (
        <div>
          <p className="quote-text">“{u.text}”</p>
          <p className="quote-who">— {u.who}</p>
          <div className="chapter-section"><div className="chapter-label">The context</div><p>{u.context}</p></div>
          <div className="chapter-section"><div className="chapter-label">What it really means</div><p>{u.meaning}</p></div>
          <div className="chapter-section chapter-failure"><div className="chapter-label">Where it fails</div><p>{u.failure}</p></div>
          <p className="quote-ask">{u.ask}</p>
        </div>
      );
    }
    case "meditation": {
      const m = MEDITATIONS_SERIAL[Number(result.id)];
      if (!m) return null;
      return (
        <div>
          <h3>{m.title}</h3>
          <p className="signal-meta" style={{ marginBottom: 10 }}>Meditations, {m.ref}</p>
          <div className="serial-text">{m.text}</div>
          <p className="quote-ask">{m.question}</p>
        </div>
      );
    }
    default:
      return null;
  }
}
