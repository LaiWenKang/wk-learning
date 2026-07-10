import { useState } from "react";
import { storage } from "../../lib/storage";
import { formatMoneyFull } from "../../lib/scoring";
import { Card } from "../../components/ui";
import { ChartIcon } from "../../components/icons";
import type { FinanceScenario } from "../../types";

const LOG_KEY = "networth-log";

type NetWorthEntry = { month: string; amount: number };

function loadLog(): NetWorthEntry[] {
  const raw = storage.get<NetWorthEntry[]>(LOG_KEY);
  return Array.isArray(raw) ? raw : [];
}

function thisMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * The monthly mirror: log your real net worth once a month (30 seconds)
 * and the app accumulates your actual trajectory — the one number the
 * simulators can only guess at. All local, like everything else.
 */
export function NetWorthLog(props: { currency: FinanceScenario["currency"] }) {
  const [log, setLog] = useState<NetWorthEntry[]>(loadLog);
  const [input, setInput] = useState("");
  const month = thisMonth();
  const current = log.find((e) => e.month === month);
  const sorted = [...log].sort((a, b) => a.month.localeCompare(b.month));
  const prev = sorted.filter((e) => e.month < month).at(-1);
  const yearAgoKey = `${Number(month.slice(0, 4)) - 1}${month.slice(4)}`;
  const yearAgo = sorted.find((e) => e.month === yearAgoKey);

  const save = () => {
    const n = Number.parseFloat(input.replace(/,/g, ""));
    if (!Number.isFinite(n)) return;
    const next = [...log.filter((e) => e.month !== month), { month, amount: n }];
    storage.set(LOG_KEY, next);
    setLog(next);
    setInput("");
  };

  const delta = current && prev ? current.amount - prev.amount : null;
  const yearDelta = current && yearAgo ? current.amount - yearAgo.amount : null;

  // Mini bar trend: last 12 logged months.
  const recent = sorted.slice(-12);
  const maxAmt = Math.max(...recent.map((e) => e.amount), 1);

  return (
    <Card>
      <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <ChartIcon /> Monthly check-in
      </h3>
      {current ? (
        <>
          <p className="networth-current">
            {formatMoneyFull(current.amount, props.currency)}
            <span className="networth-month"> · {month}</span>
          </p>
          <p className="card-muted" style={{ marginBottom: 10 }}>
            {delta !== null && (
              <>
                {delta >= 0 ? "▲" : "▼"} {formatMoneyFull(Math.abs(delta), props.currency)}{" "}
                vs last check-in.{" "}
              </>
            )}
            {yearDelta !== null && (
              <>
                {yearDelta >= 0 ? "+" : "−"}
                {formatMoneyFull(Math.abs(yearDelta), props.currency)} over the year.{" "}
              </>
            )}
            {delta === null && "First entry logged — the trajectory starts here."}
          </p>
        </>
      ) : (
        <p className="card-muted" style={{ marginBottom: 10 }}>
          Thirty seconds, once a month: log your actual net worth and build the
          real trajectory the projections below can only guess at.
          {prev && ` Last logged: ${formatMoneyFull(prev.amount, props.currency)} (${prev.month}).`}
        </p>
      )}

      {recent.length >= 2 && (
        <div className="networth-bars" aria-hidden="true">
          {recent.map((e) => (
            <div
              key={e.month}
              className={`networth-bar ${e.month === month ? "current" : ""}`}
              style={{ height: `${Math.max(8, (e.amount / maxAmt) * 100)}%` }}
              title={`${e.month}: ${formatMoneyFull(e.amount, props.currency)}`}
            />
          ))}
        </div>
      )}

      <div className="estimate-row" style={{ marginTop: 8 }}>
        <input
          type="text"
          inputMode="decimal"
          className="estimate-field"
          style={{ fontSize: 16, padding: "10px 14px" }}
          placeholder={current ? "Update this month" : `Net worth now (${props.currency})`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary btn-small"
          disabled={!Number.isFinite(Number.parseFloat(input.replace(/,/g, "")))}
          onClick={save}
        >
          {current ? "Update" : "Log it"}
        </button>
      </div>
      <p className="signal-meta" style={{ marginTop: 8 }}>
        {log.length} check-in{log.length === 1 ? "" : "s"} logged · stays on this
        device, included in backups.
      </p>
    </Card>
  );
}
