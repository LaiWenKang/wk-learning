import { useState } from "react";
import { Segmented } from "../../components/ui";
import { QueueView } from "./QueueView";
import { FlashcardsView } from "./FlashcardsView";
import { NotesView } from "./NotesView";

type LearnView = "queue" | "cards" | "notes";

export function LearnPage() {
  const [view, setView] = useState<LearnView>("queue");

  return (
    <div>
      <h1 className="page-title">Learn</h1>
      <p className="page-subtitle">Queue, flashcards and concept notes — stored locally.</p>
      <Segmented<LearnView>
        value={view}
        onChange={setView}
        options={[
          { value: "queue", label: "Learning Queue" },
          { value: "cards", label: "Flashcards" },
          { value: "notes", label: "Concept Notes" },
        ]}
      />
      {view === "queue" && <QueueView />}
      {view === "cards" && <FlashcardsView />}
      {view === "notes" && <NotesView />}
    </div>
  );
}
