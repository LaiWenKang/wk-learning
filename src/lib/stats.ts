import type { Flashcard, LearningItem, ReflectionEntry } from "../types";
import { STORE_KEYS, loadList } from "./storage";
import { addDays, todayKey } from "./date";

/** Consecutive reflection days ending today or yesterday. */
export function computeStreak(entries: ReflectionEntry[]): number {
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  let cursor = todayKey();
  if (!dates.has(cursor)) cursor = addDays(cursor, -1);
  while (dates.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export type GlanceStats = {
  streak: number;
  cardsDue: number;
  queueCount: number;
  reflectedToday: boolean;
};

/** The numbers the Today screen shows at first glance. */
export function loadGlanceStats(): GlanceStats {
  const reflections = loadList<ReflectionEntry>(STORE_KEYS.reflections);
  const cards = loadList<Flashcard>(STORE_KEYS.flashcards);
  const items = loadList<LearningItem>(STORE_KEYS.learningItems);
  const today = todayKey();
  return {
    streak: computeStreak(reflections),
    cardsDue: cards.filter((c) => !c.nextReviewAt || c.nextReviewAt <= today).length,
    queueCount: items.filter((i) => !i.archived).length,
    reflectedToday: reflections.some((e) => e.date === today),
  };
}
