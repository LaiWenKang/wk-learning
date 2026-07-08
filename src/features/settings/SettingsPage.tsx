import { useEffect, useState } from "react";
import {
  clearAllData,
  exportAllData,
  importAllData,
} from "../../lib/storage";
import { downloadJson, readJsonFile } from "../../lib/export";
import { todayKey } from "../../lib/date";
import { Card } from "../../components/ui";

const APP_VERSION = "0.9.0";

type SourceConfig = {
  id: string;
  name: string;
  type: string;
  url: string;
  enabled: boolean;
};

export function SettingsPage(props: { onReplayIntro?: () => void }) {
  const [message, setMessage] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [sources, setSources] = useState<SourceConfig[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/sources.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("unavailable"))))
      .then((json: { sources?: SourceConfig[] }) => {
        if (!cancelled) setSources(json.sources ?? []);
      })
      .catch(() => {
        if (!cancelled) setSources([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const exportAll = () => {
    downloadJson(`wk-learning-backup-${todayKey()}.json`, exportAllData());
    setMessage("Backup downloaded.");
  };

  const importBackup = async (file: File) => {
    try {
      const parsed = await readJsonFile(file);
      const count = importAllData(parsed);
      setMessage(`Imported ${count} data collections. Reloading…`);
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Import failed.");
    }
  };

  const clearAll = () => {
    clearAllData();
    setConfirmClear(false);
    setMessage("All local data cleared. Reloading…");
    setTimeout(() => window.location.reload(), 900);
  };

  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">WK Learning v{APP_VERSION}</p>

      {message && <div className="notice notice-info">{message}</div>}

      <h2 className="section-title">Local Data &amp; Privacy</h2>
      <Card>
        <p className="card-muted" style={{ marginBottom: 12 }}>
          WK Learning stores your personal notes locally in this browser. Public
          web signals are generated from public sources only. Nothing you type
          here is uploaded anywhere — export a backup before clearing your
          browser data or switching devices.
        </p>
        <div className="btn-row" style={{ marginTop: 0 }}>
          <button type="button" className="btn btn-primary" onClick={exportAll}>
            Export All Data
          </button>
          <label className="btn" style={{ cursor: "pointer" }}>
            Import Backup
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void importBackup(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <hr className="divider" />
        {confirmClear ? (
          <div>
            <p className="card-muted" style={{ marginBottom: 8 }}>
              This permanently deletes all notes, flashcards, reflections and
              scenarios stored in this browser. Export a backup first?
            </p>
            <div className="btn-row" style={{ marginTop: 0 }}>
              <button type="button" className="btn btn-danger" onClick={clearAll}>
                Yes, delete everything
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setConfirmClear(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setConfirmClear(true)}
          >
            Clear Local Data…
          </button>
        )}
      </Card>

      <h2 className="section-title">Pulse Sources</h2>
      <Card>
        <p className="card-muted" style={{ marginBottom: 10 }}>
          Public feeds fetched by the scheduled GitHub Actions job. Edit{" "}
          <code>public/data/sources.json</code> in the repository to add or
          remove sources.
        </p>
        {sources === null ? (
          <p className="card-muted">Loading…</p>
        ) : sources.length === 0 ? (
          <p className="card-muted">No source list found.</p>
        ) : (
          <ul className="list-plain">
            {sources.map((s) => (
              <li
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 14 }}>{s.name}</span>
                <span className={`chip ${s.enabled ? "chip-positive" : "chip-neutral"}`}>
                  {s.enabled ? s.type : "disabled"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <h2 className="section-title">About</h2>
      <Card>
        <p className="card-muted" style={{ marginBottom: 12 }}>
          WK Learning is a personal, local-first learning companion: daily
          public signals, flashcards, structured thinking tools, scenario
          modelling and daily reflection. Built with Vite + React + TypeScript,
          hosted on GitHub Pages.
        </p>
        {props.onReplayIntro && (
          <button type="button" className="btn btn-small" onClick={props.onReplayIntro}>
            Replay introduction
          </button>
        )}
      </Card>
    </div>
  );
}
