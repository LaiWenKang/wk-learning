import { useEffect, useState } from "react";
import {
  SunIcon,
  BookIcon,
  BrainIcon,
  ChartIcon,
  JournalIcon,
  GearIcon,
} from "../components/icons";
import { TodayPage } from "../features/today/TodayPage";
import { LearnPage } from "../features/learn/LearnPage";
import { ThinkPage } from "../features/think/ThinkPage";
import { FinancePage } from "../features/finance/FinancePage";
import { ReflectPage } from "../features/reflect/ReflectPage";
import { SettingsPage } from "../features/settings/SettingsPage";

export type TabId = "today" | "learn" | "think" | "finance" | "reflect" | "settings";

type TabDef = {
  id: TabId;
  label: string;
  icon: (p: { className?: string }) => JSX.Element;
};

/* Today sits in the center of the bar as the primary destination
   (serial-position + Von Restorff: the distinct middle item is the anchor).
   Settings lives in the floating header gear, keeping the bar at five items. */
const LEFT_TABS: TabDef[] = [
  { id: "learn", label: "Learn", icon: BookIcon },
  { id: "think", label: "Think", icon: BrainIcon },
];
const CENTER_TAB: TabDef = { id: "today", label: "Today", icon: SunIcon };
const RIGHT_TABS: TabDef[] = [
  { id: "finance", label: "Finance", icon: ChartIcon },
  { id: "reflect", label: "Reflect", icon: JournalIcon },
];

const ALL_TABS: TabId[] = ["today", "learn", "think", "finance", "reflect", "settings"];

function tabFromHash(): TabId {
  const raw = window.location.hash.replace(/^#\/?/, "").split("/")[0];
  return (ALL_TABS.includes(raw as TabId) ? raw : "today") as TabId;
}

export function App() {
  const [tab, setTab] = useState<TabId>(tabFromHash);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (id: TabId) => {
    window.location.hash = `/${id}`;
    window.scrollTo({ top: 0 });
  };

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

      <main className="app-main">
        {/* key remounts the page so the enter animation plays per tab */}
        <div className="page" key={tab}>
          {tab === "today" && <TodayPage onNavigate={navigate} />}
          {tab === "learn" && <LearnPage />}
          {tab === "think" && <ThinkPage />}
          {tab === "finance" && <FinancePage />}
          {tab === "reflect" && <ReflectPage />}
          {tab === "settings" && <SettingsPage />}
        </div>
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
