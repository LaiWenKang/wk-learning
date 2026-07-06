/**
 * Storage abstraction for WK Learning.
 *
 * All personal data stays in the browser. The default adapter is
 * localStorage; the interface is async-friendly so an IndexedDB adapter
 * can be dropped in later without touching feature code.
 */

const PREFIX = "wk-learning:";

export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  keys(): string[];
}

class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.error("storage write failed", err);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  }

  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) result.push(k.slice(PREFIX.length));
    }
    return result;
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();

/** Well-known collection keys. */
export const STORE_KEYS = {
  learningItems: "learning-items",
  flashcards: "flashcards",
  reflections: "reflections",
  financeScenarios: "finance-scenarios",
  rcaDrafts: "rca-drafts",
  savedSignals: "saved-signals",
} as const;

export type StoreKey = (typeof STORE_KEYS)[keyof typeof STORE_KEYS];

/** Typed list helpers used by every feature. */
export function loadList<T>(key: StoreKey): T[] {
  return storage.get<T[]>(key) ?? [];
}

export function saveList<T>(key: StoreKey, items: T[]): void {
  storage.set(key, items);
}

export function upsertItem<T extends { id: string }>(key: StoreKey, item: T): T[] {
  const items = loadList<T>(key);
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) items[idx] = item;
  else items.unshift(item);
  saveList(key, items);
  return items;
}

export function removeItem<T extends { id: string }>(key: StoreKey, id: string): T[] {
  const items = loadList<T>(key).filter((i) => i.id !== id);
  saveList(key, items);
  return items;
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Export every wk-learning key as one backup object. */
export function exportAllData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const key of storage.keys()) {
    data[key] = storage.get(key);
  }
  return {
    app: "wk-learning",
    exportedAt: new Date().toISOString(),
    version: 1,
    data,
  };
}

/** Import a backup produced by exportAllData. Returns imported key count. */
export function importAllData(backup: unknown): number {
  if (
    typeof backup !== "object" ||
    backup === null ||
    (backup as { app?: string }).app !== "wk-learning" ||
    typeof (backup as { data?: unknown }).data !== "object"
  ) {
    throw new Error("Not a valid WK Learning backup file.");
  }
  const data = (backup as { data: Record<string, unknown> }).data;
  let count = 0;
  for (const [key, value] of Object.entries(data)) {
    storage.set(key, value);
    count++;
  }
  return count;
}

export function clearAllData(): void {
  for (const key of storage.keys()) {
    storage.remove(key);
  }
}
