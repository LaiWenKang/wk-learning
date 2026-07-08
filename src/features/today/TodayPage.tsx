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
  Sheet,
  TagRow,
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
  RefreshIcon,
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
  const [stats, setStats] = useState(loadGlanceStats);
  const [detail, setDetail] = useState<PulseSignal | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    return new Set(
      loadList<LearningItem>(STORE_KEYS.learningItems)
        .map((i) => i.sourceUrl ?? "")
        .filter(Boolean),
    );
  });
  // Signals already in the queue never re-show. A card saved right now
  // first plays a leave animation (removingUrls), then joins savedIds so
  // the next-ranked signal slides up into the top five.
  const [removingUrls, setRemovingUrls] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

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

  // Re-fetch the newest signals the scheduled job has published (bypasses
  // the browser cache). Doesn't fetch feeds directly — that runs server-side.
  const refreshPulse = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const { data, isSample } = await loadLatestPulse(true);
      setPulse(data);
      setIsSample(isSample);
    } finally {
      // brief minimum spin so the tap registers visually
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const dateKey = todayKey();
  const mindset = dailyRotation(MINDSET_PROMPTS, dateKey, 1);
  const challenge = dailyRotation(THINKING_CHALLENGES, dateKey, 2);
  const action = dailyRotation(LEARNING_ACTIONS, dateKey, 3);

  const top = useMemo(() => {
    if (!pulse) return [];
    // Saved signals leave the brief; cards mid-animation stay to play out.
    const fresh = {
      ...pulse,
      signals: pulse.signals.filter(
        (s) => !savedIds.has(s.url) || removingUrls.has(s.url),
      ),
    };
    return topSignals(fresh.signals.length > 0 ? fresh : pulse, 5);
  }, [pulse, savedIds, removingUrls]);

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
    // Instant feedback: queue count ticks up, card animates out, and the
    // next-ranked signal takes its place.
    setStats((prev) => ({ ...prev, queueCount: prev.queueCount + 1 }));
    setSavedIds((prev) => new Set(prev).add(s.url));
    setRemovingUrls((prev) => new Set(prev).add(s.url));
    window.setTimeout(() => {
      setRemovingUrls((prev) => {
        const next = new Set(prev);
        next.delete(s.url);
        return next;
      });
    }, 380);
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <SectionTitle icon={<BoltIcon />}>Today’s Pulse</SectionTitle>
        <button
          type="button"
          className="pulse-refresh"
          aria-label="Refresh signals"
          onClick={refreshPulse}
          disabled={refreshing}
        >
          <RefreshIcon className={refreshing ? "spinning" : ""} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      {isSample && (
        <div className="notice notice-info">
          Showing starter signals — live public signals appear once the
          scheduled fetch has run. Pull the Refresh button to check for new
          ones.
        </div>
      )}
      {pulse &&
        (() => {
          const ageHours =
            (Date.now() - new Date(pulse.generatedAt).getTime()) / 3600000;
          const stale = Number.isNaN(ageHours) || ageHours > 24;
          return (
            <p className="signal-meta" style={{ marginBottom: 10 }}>
              {stale
                ? `Starter signals — the automatic feed refreshes about every 15 minutes once live`
                : `Updated ${relativeTime(pulse.generatedAt)}`}
            </p>
          );
        })()}
      {top.map((s) => (
        <Card
          key={s.id}
          className={`signal-card signal-card-tappable ${
            removingUrls.has(s.url) ? "signal-card-removing" : ""
          }`}
          style={{ "--cat": categoryColor(s.category) } as CSSProperties}
        >
          {/* Tapping the card body opens details; the title link still
              opens the source directly for those who want it. */}
          <button
            type="button"
            className="signal-tap"
            aria-label={`Details: ${s.title}`}
            onClick={() => setDetail(s)}
          >
            <span className="signal-title">{s.title}</span>
            <div
              className="signal-meta"
              style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 7 }}
            >
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
          </button>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-soft btn-small"
              disabled={savedIds.has(s.url)}
              onClick={() => saveToQueue(s)}
            >
              {savedIds.has(s.url) ? "Saved ✓" : "Save to Learning Queue"}
            </button>
            <button
              type="button"
              className="btn btn-small"
              onClick={() => setDetail(s)}
            >
              Details
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

      {detail && (
        <Sheet onClose={() => setDetail(null)} label="Signal details">
          <div style={{ marginBottom: 4 }}>
            <CategoryChip category={detail.category} />
          </div>
          <h3>{detail.title}</h3>
          <p className="signal-meta">
            {detail.source}
            {detail.publishedAt ? ` · ${relativeTime(detail.publishedAt)}` : ""}
          </p>

          {detail.summary && (
            <div className="sheet-section">
              <div className="sheet-section-label">Summary</div>
              <p className="card-muted" style={{ color: "var(--text)" }}>
                {detail.summary}
              </p>
            </div>
          )}
          {detail.whyItMatters && (
            <div className="sheet-section">
              <div className="sheet-section-label">Why it matters</div>
              <p className="card-muted" style={{ color: "var(--text)" }}>
                {detail.whyItMatters}
              </p>
            </div>
          )}
          {detail.tags.length > 0 && (
            <div className="sheet-section">
              <div className="sheet-section-label">Tags</div>
              <TagRow tags={detail.tags} />
            </div>
          )}

          <div className="btn-row">
            <a
              href={detail.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Open source ↗
            </a>
            <button
              type="button"
              className="btn"
              disabled={savedIds.has(detail.url)}
              onClick={() => {
                saveToQueue(detail);
                setDetail(null);
              }}
            >
              {savedIds.has(detail.url) ? "Saved ✓" : "Save to Queue"}
            </button>
          </div>
        </Sheet>
      )}
    </div>
  );
}
