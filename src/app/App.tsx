import { useEffect, useRef, useState } from "react";
import {
  SunIcon,
  BookIcon,
  JournalIcon,
  GearIcon,
} from "../components/icons";
import { TodayPage } from "../features/today/TodayPage";
import { LibraryPage } from "../features/library/LibraryPage";
import { YouPage } from "../features/you/YouPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { Onboarding, hasOnboarded } from "../features/onboarding/Onboarding";

export type TabId = "daily" | "library" | "you" | "settings";

type TabDef = {
  id: TabId;
  label: string;
  icon: (p: { className?: string }) => JSX.Element;
};

/* Three places, deeper places: Daily (the ritual) in the anchor center,
   Library (all knowledge) left, You (the mirror) right. Settings lives
   in the floating header gear. */
const LEFT_TABS: TabDef[] = [{ id: "library", label: "Library", icon: BookIcon }];
const CENTER_TAB: TabDef = { id: "daily", label: "Daily", icon: SunIcon };
const RIGHT_TABS: TabDef[] = [{ id: "you", label: "You", icon: JournalIcon }];

/* Left-to-right order for swipe navigation, matching the tab bar layout.
   Settings is reachable only via the gear, so it's excluded from swipes. */
const SWIPE_ORDER: TabId[] = ["library", "daily", "you"];
const ALL_TABS: TabId[] = ["daily", "library", "you", "settings"];

/* Old bookmarks and habits keep working. */
const LEGACY_ROUTES: Record<string, TabId> = {
  today: "daily",
  learn: "library",
  think: "library",
  finance: "you",
  reflect: "you",
};

function tabFromHash(): TabId {
  const raw = window.location.hash.replace(/^#\/?/, "").split("/")[0];
  if (ALL_TABS.includes(raw as TabId)) return raw as TabId;
  return LEGACY_ROUTES[raw] ?? "daily";
}

/** Elements whose own horizontal scroll/drag must win over tab swiping. */
const SWIPE_GUARD_SELECTOR =
  ".table-wrap, .segmented, svg, .composition, input[type='range'], .chart-tip";

export function App() {
  const [tab, setTab] = useState<TabId>(tabFromHash);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasOnboarded());
  const [enterDir, setEnterDir] = useState<"left" | "right" | null>(null);
  const touch = useRef<{ x: number; y: number; guarded: boolean } | null>(null);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (id: TabId, dir: "left" | "right" | null = null) => {
    setEnterDir(dir);
    window.location.hash = `/${id}`;
    window.scrollTo({ top: 0 });
  };

  const swipeIndex = SWIPE_ORDER.indexOf(tab);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || swipeIndex < 0) {
      touch.current = null;
      return;
    }
    const t = e.touches[0];
    const guarded = !!(e.target as Element).closest?.(SWIPE_GUARD_SELECTOR);
    touch.current = { x: t.clientX, y: t.clientY, guarded };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start || start.guarded) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Deliberate, mostly-horizontal swipe only.
    if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
    if (dx < 0 && swipeIndex < SWIPE_ORDER.length - 1) {
      navigate(SWIPE_ORDER[swipeIndex + 1], "right");
    } else if (dx > 0 && swipeIndex > 0) {
      navigate(SWIPE_ORDER[swipeIndex - 1], "left");
    }
  };

  const pageClass =
    enterDir === "right"
      ? "page page-from-right"
      : enterDir === "left"
        ? "page page-from-left"
        : "page";

  if (showOnboarding) {
    return <Onboarding onDone={() => setShowOnboarding(false)} />;
  }

  const renderTab = (t: TabDef) => {
    const Icon = t.icon;
    return (
      <button
        key={t.id}
        type="button"
        className={`tab-button ${tab === t.id ? "active" : ""}`}
        aria-current={tab === t.id ? "page" : undefined}
        aria-label={t.label}
        onClick={() => navigate(t.id)}
      >
        <Icon />
        <span>{t.label}</span>
      </button>
    );
  };

  return (
    <div className="app-shell">
      <button
        type="button"
        className={`header-gear ${tab === "settings" ? "active" : ""}`}
        aria-label="Settings"
        onClick={() => navigate("settings")}
      >
        <GearIcon />
      </button>

      <main className="app-main" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* key remounts the page so the enter animation plays per tab */}
        <div className={pageClass} key={tab}>
          {tab === "daily" && <TodayPage onNavigate={navigate} />}
          {tab === "library" && <LibraryPage />}
          {tab === "you" && <YouPage />}
          {tab === "settings" && <SettingsPage onReplayIntro={() => setShowOnboarding(true)} />}
        </div>

        {/* Page dots — orientation cue for swipe navigation */}
        {swipeIndex >= 0 && (
          <div className="page-dots" aria-hidden="true">
            {SWIPE_ORDER.map((id) => (
              <span key={id} className={`page-dot ${id === tab ? "active" : ""}`} />
            ))}
          </div>
        )}
      </main>

      <nav className="tabbar" aria-label="Main navigation">
        <div className="tabbar-inner">
          {LEFT_TABS.map(renderTab)}
          <button
            type="button"
            className={`tab-button tab-button-primary ${tab === CENTER_TAB.id ? "active" : ""}`}
            aria-current={tab === CENTER_TAB.id ? "page" : undefined}
            aria-label={CENTER_TAB.label}
            onClick={() => navigate(CENTER_TAB.id)}
          >
            <span className="tab-primary-circle">
              <SunIcon />
            </span>
            <span className="tab-primary-label">{CENTER_TAB.label}</span>
          </button>
          {RIGHT_TABS.map(renderTab)}
        </div>
      </nav>
    </div>
  );
}
