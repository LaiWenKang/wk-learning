import { useState } from "react";
import { Segmented } from "../../components/ui";
import { QueueView } from "./QueueView";
import { FlashcardsView } from "./FlashcardsView";
import { NotesView } from "./NotesView";
import { ModelsView } from "./ModelsView";
import { BooksView } from "./BooksView";

type LearnView = "models" | "books" | "queue" | "cards" | "notes";

export function LearnPage() {
  const [view, setView] = useState<LearnView>("models");

  return (
    <div>
      <h1 className="page-title">Learn</h1>
      <p className="page-subtitle">
        Mental models, books, queue, flashcards and notes — stored locally.
      </p>
      <Segmented<LearnView>
        value={view}
        onChange={setView}
        options={[
          { value: "models", label: "Models" },
          { value: "books", label: "Books" },
          { value: "queue", label: "Queue" },
          { value: "cards", label: "Cards" },
          { value: "notes", label: "Notes" },
        ]}
      />
      {view === "models" && <ModelsView />}
      {view === "books" && <BooksView />}
      {view === "queue" && <QueueView />}
      {view === "cards" && <FlashcardsView />}
      {view === "notes" && <NotesView />}
    </div>
  );
}
