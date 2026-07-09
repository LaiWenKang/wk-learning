import { useState } from "react";
import { Segmented } from "../../components/ui";
import { QueueView } from "./QueueView";
import { FlashcardsView } from "./FlashcardsView";
import { NotesView } from "./NotesView";
import { ModelsView } from "./ModelsView";

type LearnView = "models" | "queue" | "cards" | "notes";

export function LearnPage() {
  const [view, setView] = useState<LearnView>("models");

  return (
    <div>
      <h1 className="page-title">Learn</h1>
      <p className="page-subtitle">
        Mental models, queue, flashcards and notes — stored locally.
      </p>
      <Segmented<LearnView>
        value={view}
        onChange={setView}
        options={[
          { value: "models", label: "Models" },
          { value: "queue", label: "Queue" },
          { value: "cards", label: "Cards" },
          { value: "notes", label: "Notes" },
        ]}
      />
      {view === "models" && <ModelsView />}
      {view === "queue" && <QueueView />}
      {view === "cards" && <FlashcardsView />}
      {view === "notes" && <NotesView />}
    </div>
  );
}
