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

const TABS: { id: TabId; label: string; icon: (p: { className?: string }) => JSX.Element }[] = [
  { id: "today", label: "Today", icon: SunIcon },
  { id: "learn", label: "Learn", icon: BookIcon },
  { id: "think", label: "Think", icon: BrainIcon },
  { id: "finance", label: "Finance", icon: ChartIcon },
  { id: "reflect", label: "Reflect", icon: JournalIcon },
  { id: "settings", label: "Settings", icon: GearIcon },
];

function tabFromHash(): TabId {
  const raw = window.location.hash.replace(/^#\/?/, "").split("/")[0];
  return (TABS.some((t) => t.id === raw) ? raw : "today") as TabId;
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

  return (
    <div className="app-shell">
      <main className="app-main">
        {tab === "today" && <TodayPage onNavigate={navigate} />}
        {tab === "learn" && <LearnPage />}
        {tab === "think" && <ThinkPage />}
        {tab === "finance" && <FinancePage />}
        {tab === "reflect" && <ReflectPage />}
        {tab === "settings" && <SettingsPage />}
      </main>
      <nav className="tabbar" aria-label="Main navigation">
        <div className="tabbar-inner">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                className={`tab-button ${tab === t.id ? "active" : ""}`}
                aria-current={tab === t.id ? "page" : undefined}
                onClick={() => navigate(t.id)}
              >
                <Icon />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
