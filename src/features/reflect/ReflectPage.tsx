import { useMemo, useState } from "react";
import type { Rating, ReflectionEntry } from "../../types";
import { STORE_KEYS, loadList, newId, saveList } from "../../lib/storage";
import { addDays, daysBetween, todayKey } from "../../lib/date";
import { computeStreak } from "../../lib/stats";
import { Card, Field, RatingInput, SectionTitle } from "../../components/ui";
import { FlameIcon, JournalIcon, SparkleIcon } from "../../components/icons";
import { TrendTile } from "./TrendTile";

type ReflectDraft = {
  energy: Rating;
  maturityScore: Rating;
  reliabilityScore: Rating;
  learnedToday: string;
  improvedToday: string;
  oneThingToDoBetter: string;
  openLoops: string;
};

const EMPTY_DRAFT: ReflectDraft = {
  energy: 3,
  maturityScore: 3,
  reliabilityScore: 3,
  learnedToday: "",
  improvedToday: "",
  oneThingToDoBetter: "",
  openLoops: "",
};

function weeklySummary(entries: ReflectionEntry[]): string {
  const today = todayKey();
  const week = entries
    .filter((e) => daysBetween(e.date, today) < 7 && daysBetween(e.date, today) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (week.length === 0) return "No entries in the last 7 days yet.";

  const avg = (get: (e: ReflectionEntry) => number) =>
    (week.reduce((s, e) => s + get(e), 0) / week.length).toFixed(1);

  const learned = week
    .map((e) => e.learnedToday.trim())
    .filter(Boolean)
    .slice(-3);
  const improvements = week
    .map((e) => e.improvedToday.trim())
    .filter(Boolean)
    .slice(-3);
  const loops = week
    .map((e) => e.openLoops.trim())
    .filter(Boolean)
    .slice(-3);

  const lines = [
    `This week you reflected on ${week.length} day${week.length === 1 ? "" : "s"}.`,
    `Average energy ${avg((e) => e.energy)}/5, maturity ${avg((e) => e.maturityScore)}/5, reliability ${avg((e) => e.reliabilityScore)}/5.`,
  ];
  if (learned.length > 0) lines.push(`Recent learning: ${learned.join(" · ")}`);
  if (improvements.length > 0) lines.push(`Improvements: ${improvements.join(" · ")}`);
  if (loops.length > 0) lines.push(`Open loops to close: ${loops.join(" · ")}`);
  return lines.join("\n");
}

export function ReflectPage() {
  const [entries, setEntries] = useState<ReflectionEntry[]>(() =>
    loadList<ReflectionEntry>(STORE_KEYS.reflections),
  );
  const today = todayKey();
  const existingToday = entries.find((e) => e.date === today);

  const [draft, setDraft] = useState<ReflectDraft>(() =>
    existingToday
      ? {
          energy: existingToday.energy,
          maturityScore: existingToday.maturityScore,
          reliabilityScore: existingToday.reliabilityScore,
          learnedToday: existingToday.learnedToday,
          improvedToday: existingToday.improvedToday,
          oneThingToDoBetter: existingToday.oneThingToDoBetter,
          openLoops: existingToday.openLoops,
        }
      : EMPTY_DRAFT,
  );
  const [savedFlash, setSavedFlash] = useState(false);

  const save = () => {
    const entry: ReflectionEntry = {
      id: existingToday?.id ?? newId(),
      date: today,
      ...draft,
    };
    const next = [entry, ...entries.filter((e) => e.date !== today)];
    next.sort((a, b) => b.date.localeCompare(a.date));
    saveList(STORE_KEYS.reflections, next);
    setEntries(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const last7 = useMemo(
    () =>
      entries
        .filter((e) => daysBetween(e.date, today) < 7 && daysBetween(e.date, today) >= 0)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [entries, today],
  );

  /** Points for the sparklines: last 7 days oldest→newest, null = no entry. */
  const trendPoints = useMemo(() => {
    const byDate = new Map(entries.map((e) => [e.date, e]));
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) days.push(addDays(today, -i));
    const series = (get: (e: ReflectionEntry) => number) =>
      days.map((d) => {
        const e = byDate.get(d);
        return e ? get(e) : null;
      });
    return {
      energy: series((e) => e.energy),
      maturity: series((e) => e.maturityScore),
      reliability: series((e) => e.reliabilityScore),
    };
  }, [entries, today]);

  const avgOf = (get: (e: ReflectionEntry) => number) =>
    last7.length === 0
      ? "—"
      : (last7.reduce((s, e) => s + get(e), 0) / last7.length).toFixed(1);

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const summary = useMemo(() => weeklySummary(entries), [entries]);

  return (
    <div>
      <h1 className="page-title">Daily Reflection</h1>
      <p className="page-subtitle">
        {existingToday ? "Today's entry — edit any time." : "A few minutes of honest review."}
      </p>

      <Card title={`Today · ${today}`}>
        <Field label="Energy">
          <RatingInput value={draft.energy} onChange={(v) => setDraft({ ...draft, energy: v })} />
        </Field>
        <Field label="Maturity — did I respond, not react?">
          <RatingInput
            value={draft.maturityScore}
            onChange={(v) => setDraft({ ...draft, maturityScore: v })}
          />
        </Field>
        <Field label="Reliability — did I do what I said?">
          <RatingInput
            value={draft.reliabilityScore}
            onChange={(v) => setDraft({ ...draft, reliabilityScore: v })}
          />
        </Field>
        <Field label="What did I learn today?">
          <textarea
            value={draft.learnedToday}
            onChange={(e) => setDraft({ ...draft, learnedToday: e.target.value })}
          />
        </Field>
        <Field label="What did I improve today?">
          <textarea
            value={draft.improvedToday}
            onChange={(e) => setDraft({ ...draft, improvedToday: e.target.value })}
          />
        </Field>
        <Field label="One thing to do better">
          <input
            type="text"
            value={draft.oneThingToDoBetter}
            onChange={(e) => setDraft({ ...draft, oneThingToDoBetter: e.target.value })}
          />
        </Field>
        <Field label="Open loops" hint="Unfinished things occupying your head.">
          <textarea
            value={draft.openLoops}
            onChange={(e) => setDraft({ ...draft, openLoops: e.target.value })}
          />
        </Field>
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={save}>
            {savedFlash ? "Saved ✓" : existingToday ? "Update Entry" : "Save Entry"}
          </button>
        </div>
      </Card>

      <SectionTitle icon={<SparkleIcon />}>Last 7 Days</SectionTitle>
      <Card>
        <div
          className="stat-grid"
          style={{ marginBottom: 10, gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          <div className="stat-tile">
            <div
              className="stat-value"
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <FlameIcon className="streak-flame" />
              {streak}
            </div>
            <div className="stat-label">Day streak</div>
          </div>
          <TrendTile
            label="Maturity"
            value={avgOf((e) => e.maturityScore)}
            color="var(--chart-series-1)"
            points={trendPoints.maturity}
          />
          <TrendTile
            label="Reliability"
            value={avgOf((e) => e.reliabilityScore)}
            color="var(--chart-series-2)"
            points={trendPoints.reliability}
          />
          <TrendTile
            label="Energy"
            value={avgOf((e) => e.energy)}
            color="var(--chart-series-3)"
            points={trendPoints.energy}
          />
        </div>
        <p className="signal-meta">
          Sparklines show each score over the last 7 days (1–5 scale).
        </p>
      </Card>

      <SectionTitle icon={<JournalIcon />}>Weekly Summary</SectionTitle>
      <Card>
        <p className="card-muted" style={{ whiteSpace: "pre-wrap", color: "var(--text)" }}>
          {summary}
        </p>
      </Card>

      <SectionTitle icon={<JournalIcon />}>History</SectionTitle>
      {last7.length === 0 ? (
        <div className="empty-state">No entries yet this week.</div>
      ) : (
        last7.map((e) => (
          <Card key={e.id}>
            <p className="signal-title">{e.date}</p>
            <div className="signal-meta">
              energy {e.energy} · maturity {e.maturityScore} · reliability{" "}
              {e.reliabilityScore}
            </div>
            {e.learnedToday && (
              <p className="card-muted" style={{ marginTop: 6 }}>
                <strong>Learned:</strong> {e.learnedToday}
              </p>
            )}
            {e.oneThingToDoBetter && (
              <p className="card-muted" style={{ marginTop: 6 }}>
                <strong>Do better:</strong> {e.oneThingToDoBetter}
              </p>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
