import { useEffect, useMemo, useState } from "react";
import type { PulseLatest, PulseSignal, LearningItem } from "../../types";
import { CATEGORY_LABELS } from "../../types";
import { loadLatestPulse, topSignals } from "../../lib/pulse";
import { formatDateLong, greetingForHour, relativeTime, todayKey } from "../../lib/date";
import {
  MINDSET_PROMPTS,
  THINKING_CHALLENGES,
  LEARNING_ACTIONS,
  dailyPick,
} from "../../data/prompts";
import { STORE_KEYS, loadList, newId, upsertItem } from "../../lib/storage";
import { Card, SectionTitle } from "../../components/ui";
import type { TabId } from "../../app/App";

export function TodayPage(props: { onNavigate: (tab: TabId) => void }) {
  const [pulse, setPulse] = useState<PulseLatest | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    return new Set(
      loadList<LearningItem>(STORE_KEYS.learningItems)
        .map((i) => i.sourceUrl ?? "")
        .filter(Boolean),
    );
  });

  useEffect(() => {
    let cancelled = false;
    loadLatestPulse().then(({ data, isSample }) => {
      if (cancelled) return;
      setPulse(data);
      setIsSample(isSample);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dateKey = todayKey();
  const mindset = dailyPick(MINDSET_PROMPTS, dateKey, 1);
  const challenge = dailyPick(THINKING_CHALLENGES, dateKey, 2);
  const action = dailyPick(LEARNING_ACTIONS, dateKey, 3);

  const top = useMemo(() => (pulse ? topSignals(pulse, 5) : []), [pulse]);

  const saveToQueue = (s: PulseSignal) => {
    const item: LearningItem = {
      id: newId(),
      createdAt: new Date().toISOString(),
      title: s.title,
      sourceUrl: s.url,
      category: s.category,
      note: s.summary ?? "",
      keyTakeaway: "",
      action: "Read and capture one takeaway",
      tags: s.tags.slice(0, 5),
    };
    upsertItem(STORE_KEYS.learningItems, item);
    setSavedIds((prev) => new Set(prev).add(s.url));
  };

  const hour = new Date().getHours();

  return (
    <div>
      <h1 className="page-title">{greetingForHour(hour)}, WK</h1>
      <p className="page-subtitle">{formatDateLong()}</p>

      <SectionTitle>Today’s Pulse</SectionTitle>
      {isSample && (
        <div className="notice notice-info">
          Showing demo signals — live pulse data will appear once the scheduled
          fetch has run.
        </div>
      )}
      {pulse && (
        <p className="signal-meta" style={{ marginBottom: 8 }}>
          Last updated {relativeTime(pulse.generatedAt)}
        </p>
      )}
      {top.map((s) => (
        <Card key={s.id}>
          <a href={s.url} target="_blank" rel="noreferrer" className="signal-title">
            {s.title}
          </a>
          <div className="signal-meta">
            {s.source} · {CATEGORY_LABELS[s.category]}
            {s.publishedAt ? ` · ${relativeTime(s.publishedAt)}` : ""}
          </div>
          {s.whyItMatters && (
            <p className="card-muted" style={{ marginTop: 6 }}>
              {s.whyItMatters}
            </p>
          )}
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-soft btn-small"
              disabled={savedIds.has(s.url)}
              onClick={() => saveToQueue(s)}
            >
              {savedIds.has(s.url) ? "Saved ✓" : "Save to Learning Queue"}
            </button>
          </div>
        </Card>
      ))}
      {!pulse && <div className="empty-state">Loading pulse…</div>}

      <SectionTitle>Professional Mindset</SectionTitle>
      <Card>
        <p className="card-muted" style={{ color: "var(--text)", fontSize: 15 }}>
          {mindset}
        </p>
      </Card>

      <SectionTitle>Thinking Challenge</SectionTitle>
      <Card>
        <p className="card-muted" style={{ color: "var(--text)", fontSize: 15 }}>
          {challenge}
        </p>
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-soft btn-small"
            onClick={() => props.onNavigate("think")}
          >
            Open Thinking Gym
          </button>
        </div>
      </Card>

      <SectionTitle>Suggested Learning Action</SectionTitle>
      <Card>
        <p className="card-muted" style={{ color: "var(--text)", fontSize: 15 }}>
          {action}
        </p>
      </Card>

      <SectionTitle>Quick Actions</SectionTitle>
      <div className="btn-row" style={{ marginTop: 0 }}>
        <button type="button" className="btn" onClick={() => props.onNavigate("learn")}>
          Learning Queue
        </button>
        <button type="button" className="btn" onClick={() => props.onNavigate("learn")}>
          Create Flashcard
        </button>
        <button type="button" className="btn" onClick={() => props.onNavigate("reflect")}>
          Add Reflection
        </button>
        <button type="button" className="btn" onClick={() => props.onNavigate("think")}>
          RCA Builder
        </button>
      </div>
    </div>
  );
}
