import { useEffect, useMemo, useState } from "react";
import type { PulseLatest, PulseSignal, LearningItem } from "../../types";
import { loadLatestPulse, topSignals } from "../../lib/pulse";
import { formatDateLong, greetingForHour, relativeTime, todayKey } from "../../lib/date";
import { loadGlanceStats } from "../../lib/stats";
import { useCountUp } from "../../lib/useCountUp";
import {
  MINDSET_PROMPTS,
  THINKING_CHALLENGES,
  LEARNING_ACTIONS,
  dailyRotation,
} from "../../data/prompts";
import { STORE_KEYS, loadList, newId, upsertItem } from "../../lib/storage";
import {
  Card,
  CategoryChip,
  SectionTitle,
  TintCard,
  categoryColor,
} from "../../components/ui";
import {
  BoltIcon,
  BrainIcon,
  CompassIcon,
  FlameIcon,
  InboxIcon,
  JournalIcon,
  PencilIcon,
  SparkleIcon,
  StackIcon,
  TargetIcon,
  WrenchIcon,
} from "../../components/icons";
import type { TabId } from "../../app/App";
import type { CSSProperties } from "react";

export function TodayPage(props: { onNavigate: (tab: TabId) => void }) {
  const [pulse, setPulse] = useState<PulseLatest | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [stats] = useState(loadGlanceStats);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    return new Set(
      loadList<LearningItem>(STORE_KEYS.learningItems)
        .map((i) => i.sourceUrl ?? "")
        .filter(Boolean),
    );
  });
  // Snapshot at mount: signals already in the queue are excluded from
  // today's top five (no re-showing processed content), but a card saved
  // mid-session stays visible until the next visit.
  const [excludeUrls] = useState<Set<string>>(() => new Set(savedIds));

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
  const mindset = dailyRotation(MINDSET_PROMPTS, dateKey, 1);
  const challenge = dailyRotation(THINKING_CHALLENGES, dateKey, 2);
  const action = dailyRotation(LEARNING_ACTIONS, dateKey, 3);

  const top = useMemo(() => {
    if (!pulse) return [];
    const fresh = {
      ...pulse,
      signals: pulse.signals.filter((s) => !excludeUrls.has(s.url)),
    };
    // If everything fresh was already saved, fall back to the full list.
    return topSignals(fresh.signals.length > 0 ? fresh : pulse, 5);
  }, [pulse, excludeUrls]);

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
  const streakShown = useCountUp(stats.streak);
  const dueShown = useCountUp(stats.cardsDue);
  const queueShown = useCountUp(stats.queueCount);

  return (
    <div>
      <h1 className="page-title">{greetingForHour(hour)}, WK</h1>
      <p className="page-subtitle">{formatDateLong()}</p>

      {/* At-a-glance numbers (three chunks, one tap each) */}
      <div className="stat-strip">
        <button
          type="button"
          className="stat-pill"
          style={{ "--tint": "var(--cat-semiconductor)" } as CSSProperties}
          onClick={() => props.onNavigate("reflect")}
        >
          <span className="stat-value">
            <FlameIcon />
            {streakShown}
          </span>
          <span className="stat-label">Day streak</span>
        </button>
        <button
          type="button"
          className="stat-pill"
          style={{ "--tint": "var(--cat-ai)" } as CSSProperties}
          onClick={() => props.onNavigate("learn")}
        >
          <span className="stat-value">
            <StackIcon />
            {dueShown}
          </span>
          <span className="stat-label">Cards due</span>
        </button>
        <button
          type="button"
          className="stat-pill"
          style={{ "--tint": "var(--cat-systems)" } as CSSProperties}
          onClick={() => props.onNavigate("learn")}
        >
          <span className="stat-value">
            <InboxIcon />
            {queueShown}
          </span>
          <span className="stat-label">In queue</span>
        </button>
      </div>

      <SectionTitle icon={<BoltIcon />}>Today’s Pulse</SectionTitle>
      {isSample && (
        <div className="notice notice-info">
          Showing demo signals — live pulse data will appear once the scheduled
          fetch has run.
        </div>
      )}
      {pulse && (
        <p className="signal-meta" style={{ marginBottom: 10 }}>
          Updated {relativeTime(pulse.generatedAt)}
        </p>
      )}
      {top.map((s) => (
        <Card
          key={s.id}
          className="signal-card"
          style={{ "--cat": categoryColor(s.category) } as CSSProperties}
        >
          <a href={s.url} target="_blank" rel="noreferrer" className="signal-title">
            {s.title}
          </a>
          <div className="signal-meta" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 7 }}>
            <CategoryChip category={s.category} />
            <span>
              {s.source}
              {s.publishedAt ? ` · ${relativeTime(s.publishedAt)}` : ""}
            </span>
          </div>
          {s.whyItMatters && (
            <p className="card-muted" style={{ marginTop: 8 }}>
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

      <SectionTitle icon={<SparkleIcon />}>Daily Focus</SectionTitle>
      <TintCard tint="var(--cat-ai)" icon={<CompassIcon />} title="Professional Mindset">
        <p className="card-muted" style={{ color: "var(--text)", fontSize: 15 }}>
          {mindset}
        </p>
      </TintCard>
      <TintCard tint="var(--cat-programming)" icon={<BrainIcon />} title="Thinking Challenge">
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
      </TintCard>
      <TintCard tint="var(--cat-finance)" icon={<TargetIcon />} title="Learning Action">
        <p className="card-muted" style={{ color: "var(--text)", fontSize: 15 }}>
          {action}
        </p>
      </TintCard>

      <SectionTitle icon={<BoltIcon />}>Quick Actions</SectionTitle>
      <div className="action-grid">
        <button
          type="button"
          className="action-tile"
          style={{ "--tint": "var(--cat-systems)" } as CSSProperties}
          onClick={() => props.onNavigate("learn")}
        >
          <span className="action-icon">
            <InboxIcon />
          </span>
          Learning Queue
        </button>
        <button
          type="button"
          className="action-tile"
          style={{ "--tint": "var(--cat-ai)" } as CSSProperties}
          onClick={() => props.onNavigate("learn")}
        >
          <span className="action-icon">
            <StackIcon />
          </span>
          Create Flashcard
        </button>
        <button
          type="button"
          className="action-tile"
          style={{ "--tint": "var(--cat-finance)" } as CSSProperties}
          onClick={() => props.onNavigate("reflect")}
        >
          <span className="action-icon">
            <JournalIcon />
          </span>
          {stats.reflectedToday ? "Edit Reflection" : "Add Reflection"}
        </button>
        <button
          type="button"
          className="action-tile"
          style={{ "--tint": "var(--cat-semiconductor)" } as CSSProperties}
          onClick={() => props.onNavigate("think")}
        >
          <span className="action-icon">
            <WrenchIcon />
          </span>
          RCA Builder
        </button>
      </div>
      <p
        className="signal-meta"
        style={{ textAlign: "center", marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
      >
        <PencilIcon className="inline-icon" /> Everything you write stays on this device.
      </p>
    </div>
  );
}
