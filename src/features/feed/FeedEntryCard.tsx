import { useState } from "react";
import { todayKey } from "../../lib/date";
import { storage } from "../../lib/storage";
import { FeedDeck, FEED_VIEWED_KEY } from "./FeedDeck";
import { StackIcon } from "../../components/icons";

/** Slim Today entry point for the daily deck. */
export function FeedEntryCard() {
  const [open, setOpen] = useState(false);
  const [, setRefresh] = useState(0);
  const caughtUp = storage.get<string>(FEED_VIEWED_KEY) === todayKey();
  const pos = storage.get<{ date: string; idx: number }>("feed-pos");
  const midway = !caughtUp && pos?.date === todayKey() && pos.idx > 0;

  return (
    <>
      <button
        type="button"
        className={`feed-entry ${caughtUp ? "feed-entry-done" : ""}`}
        onClick={() => setOpen(true)}
      >
        <span className="feed-entry-icon">
          <StackIcon />
        </span>
        <span className="feed-entry-text">
          <strong>
            {caughtUp
              ? "Deck done — browse again?"
              : midway
                ? `Continue the deck · card ${pos!.idx + 1}`
                : "Today’s deck"}
          </strong>
          <span>
            {caughtUp
              ? "You're caught up. New cards tomorrow."
              : midway
                ? "Picks up right where you left off."
                : "Facts, ideas, memories, signals — swipe until it ends. ~3 min"}
          </span>
        </span>
        <span className="feed-entry-cta" aria-hidden="true">
          {caughtUp ? "✓" : "→"}
        </span>
      </button>
      {open && (
        <FeedDeck
          onClose={() => {
            setOpen(false);
            setRefresh((n) => n + 1);
          }}
        />
      )}
    </>
  );
}
