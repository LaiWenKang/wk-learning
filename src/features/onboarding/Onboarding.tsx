import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BookIcon,
  ChartIcon,
  CompassIcon,
  SparkleIcon,
  SunIcon,
} from "../../components/icons";
import { STORE_KEYS, loadList, newId, saveList, storage } from "../../lib/storage";
import { STARTER_DECK } from "../../data/starterDeck";
import { useFocusTrap } from "../../lib/useFocusTrap";
import type { Flashcard } from "../../types";

const ONBOARDED_KEY = "onboarded";

export function hasOnboarded(): boolean {
  return storage.get<boolean>(ONBOARDED_KEY) === true;
}

export function markOnboarded(): void {
  storage.set(ONBOARDED_KEY, true);
}

export function resetOnboarding(): void {
  storage.remove(ONBOARDED_KEY);
}

type Slide = {
  icon: ReactNode;
  tint: string;
  title: string;
  body: ReactNode;
};

const SLIDES: Slide[] = [
  {
    icon: <SparkleIcon />,
    tint: "var(--cat-ai)",
    title: "Welcome to WK Learning",
    body: (
      <>
        A calm, private space to get a little sharper every day — learning,
        thinking, finance and reflection in one place. Built for quick, honest
        daily use.
      </>
    ),
  },
  {
    icon: <SunIcon />,
    tint: "var(--cat-semiconductor)",
    title: "Start on Today",
    body: (
      <>
        Each day opens with a fresh public-signal brief, a professional mindset
        prompt, a thinking challenge and a learning action — none of which
        repeat until you’ve seen the whole set.
      </>
    ),
  },
  {
    icon: <BookIcon />,
    tint: "var(--cat-programming)",
    title: "Learn & Think",
    body: (
      <>
        Save signals to a queue, turn them into flashcards with spaced review,
        and keep concept notes. In the Thinking Gym, work through RCA, 5 Whys,
        decision matrices, assumptions and risk scans.
      </>
    ),
  },
  {
    icon: <ChartIcon />,
    tint: "var(--cat-finance)",
    title: "Simulate & Reflect",
    body: (
      <>
        Model net worth with uncertainty bands, compare career paths, then close
        the day with a short reflection that builds a streak and an 8-week
        consistency map.
      </>
    ),
  },
  {
    icon: <CompassIcon />,
    tint: "var(--cat-systems)",
    title: "Everything stays on this device",
    body: (
      <>
        Your notes, cards, reflections and finance inputs live only in this
        browser — never uploaded. Export a backup any time from Settings. Public
        web signals come from public sources only.
      </>
    ),
  },
];

export function Onboarding(props: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [seedCards, setSeedCards] = useState(true);
  const trapRef = useFocusTrap<HTMLDivElement>();
  const last = index === SLIDES.length - 1;

  const finish = () => {
    if (seedCards && loadList<Flashcard>(STORE_KEYS.flashcards).length === 0) {
      const now = new Date().toISOString();
      const cards: Flashcard[] = STARTER_DECK.map((c) => ({
        id: newId(),
        createdAt: now,
        front: c.front,
        back: c.back,
        category: c.category,
        confidence: 2,
        tags: c.tags,
      }));
      saveList(STORE_KEYS.flashcards, cards);
    }
    markOnboarded();
    props.onDone();
  };

  const slide = SLIDES[index];

  return (
    <div className="onboard-overlay" role="dialog" aria-modal="true" aria-label="Welcome">
      <div ref={trapRef} className="onboard-card">
        <button
          type="button"
          className="onboard-skip"
          onClick={finish}
          aria-label="Skip introduction"
        >
          Skip
        </button>

        <div
          className="onboard-illus"
          style={{ "--tint": slide.tint } as CSSProperties}
          key={index}
        >
          {slide.icon}
        </div>

        <h1 className="onboard-title">{slide.title}</h1>
        <p className="onboard-body">{slide.body}</p>

        {last && (
          <label className="onboard-check">
            <input
              type="checkbox"
              checked={seedCards}
              onChange={(e) => setSeedCards(e.target.checked)}
            />
            <span>
              Add {STARTER_DECK.length} starter flashcards on fundamentals
            </span>
          </label>
        )}

        <div className="onboard-dots" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span key={i} className={`onboard-dot ${i === index ? "active" : ""}`} />
          ))}
        </div>

        <div className="onboard-actions">
          {index > 0 && (
            <button
              type="button"
              className="btn"
              onClick={() => setIndex((i) => i - 1)}
            >
              Back
            </button>
          )}
          {last ? (
            <button type="button" className="btn btn-primary" onClick={finish}>
              Get started
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIndex((i) => i + 1)}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
