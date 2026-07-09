/**
 * Bookshelf state: serialized-classic progress and distillation
 * read-tracking. The serial unlocks sequentially — one new instalment
 * per day, and missing days never punishes you: you resume where you
 * stopped, not where the calendar says you "should" be.
 */

import { storage } from "./storage";
import { MEDITATIONS_SERIAL } from "../content/meditations";

const SERIAL_KEY = "serial-meditations";
const BOOKS_READ_KEY = "books-read";

export type SerialState = {
  /** Index of the current (next unread) instalment. */
  idx: number;
  /** Date the serial last advanced — one advance per day. */
  lastAt: string | null;
};

export function loadSerial(): SerialState {
  const raw = storage.get<SerialState>(SERIAL_KEY);
  if (!raw || typeof raw !== "object" || typeof raw.idx !== "number") {
    return { idx: 0, lastAt: null };
  }
  return {
    idx: Math.max(0, Math.min(raw.idx, MEDITATIONS_SERIAL.length)),
    lastAt: raw.lastAt ?? null,
  };
}

export function serialDone(state: SerialState): boolean {
  return state.idx >= MEDITATIONS_SERIAL.length;
}

/**
 * Mark today's instalment read. Advances at most once per day so the
 * serial keeps its daily-ritual meaning (re-reading is always free).
 */
export function advanceSerial(state: SerialState, dateKey: string): SerialState {
  if (serialDone(state)) return state;
  if (state.lastAt === dateKey) return state;
  const next = { idx: state.idx + 1, lastAt: dateKey };
  storage.set(SERIAL_KEY, next);
  return next;
}

export function loadBooksRead(): Record<string, string> {
  const raw = storage.get<Record<string, string>>(BOOKS_READ_KEY);
  return raw && typeof raw === "object" ? raw : {};
}

export function markBookRead(id: string, dateKey: string): Record<string, string> {
  const read = loadBooksRead();
  if (read[id]) return read;
  const next = { ...read, [id]: dateKey };
  storage.set(BOOKS_READ_KEY, next);
  return next;
}
