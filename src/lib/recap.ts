/**
 * The weekly recap — your Sunday "Wrapped": one screen tying the week's
 * data into a small reward. Pure function of its inputs for testability.
 */

import { addDays, daysBetween } from "./date";
import type { CalibrationRecord, GymStats } from "./gym";
import type { ReflectionEntry } from "../types";
import { MODEL_BY_ID } from "../content/models";

export type WeeklyRecap = {
  from: string;
  to: string;
  streak: number;
  calibration: { n: number; rate: number; prevRate: number | null };
  modelsTrained: string[];
  briefsRead: number;
  reflections: number;
  bestLine: string | null;
  memory: { text: string; daysAgo: number } | null;
};

function inWindow(date: string, from: string, to: string): boolean {
  return date >= from && date <= to;
}

function weekRate(log: CalibrationRecord[], from: string, to: string) {
  const sub = log.filter((r) => inWindow(r.date, from, to));
  const hits = sub.filter((r) => r.within2x).length;
  return { n: sub.length, rate: sub.length > 0 ? hits / sub.length : 0 };
}

export function buildWeeklyRecap(
  dateKey: string,
  stats: GymStats,
  reflections: ReflectionEntry[],
  briefsReadDates: string[],
): WeeklyRecap {
  const from = addDays(dateKey, -6);
  const prevFrom = addDays(dateKey, -13);
  const prevTo = addDays(dateKey, -7);

  const thisWeek = weekRate(stats.calibrationLog, from, dateKey);
  const prevWeek = weekRate(stats.calibrationLog, prevFrom, prevTo);

  const modelsTrained = Object.entries(stats.mastery)
    .filter(([, m]) => inWindow(m.seenAt, from, dateKey))
    .map(([id]) => MODEL_BY_ID.get(id)?.name ?? id)
    .slice(0, 4);

  const weekReflections = reflections.filter((r) => inWindow(r.date, from, dateKey));
  const bestLine =
    weekReflections
      .map((r) => r.learnedToday.trim())
      .filter((t) => t.length > 12)
      .sort((a, b) => b.length - a.length)[0] ?? null;

  const oldReflections = reflections
    .filter((r) => daysBetween(r.date, dateKey) >= 30 && r.learnedToday.trim().length > 12)
    .sort((a, b) => a.date.localeCompare(b.date));
  const mem = oldReflections[oldReflections.length - 1];

  return {
    from,
    to: dateKey,
    streak: stats.streak,
    calibration: {
      n: thisWeek.n,
      rate: thisWeek.rate,
      prevRate: prevWeek.n > 0 ? prevWeek.rate : null,
    },
    modelsTrained,
    briefsRead: briefsReadDates.filter((d) => inWindow(d, from, dateKey)).length,
    reflections: weekReflections.length,
    bestLine,
    memory: mem
      ? { text: mem.learnedToday.trim(), daysAgo: daysBetween(mem.date, dateKey) }
      : null,
  };
}
