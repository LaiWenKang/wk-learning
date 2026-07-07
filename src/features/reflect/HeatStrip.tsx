import { useState } from "react";
import type { ReflectionEntry } from "../../types";
import { addDays, todayKey } from "../../lib/date";

/**
 * 8-week consistency heatmap. One cell per day, columns are weeks, rows
 * Monday→Sunday. Cell brightness encodes the day's average score
 * (sequential single-hue ramp, brighter = higher — dark-surface variant
 * of the validated blue ramp). Empty days stay sunken.
 */

const WEEKS = 8;

// Blue ramp steps 600→250 (monotonic lightness; brighter = higher score).
const RAMP = ["#184f95", "#1c5cab", "#256abf", "#3987e5", "#86b6ef"];

export function HeatStrip(props: { entries: ReflectionEntry[] }) {
  const byDate = new Map(props.entries.map((e) => [e.date, e]));
  const today = todayKey();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedEntry = selected ? byDate.get(selected) : undefined;

  // Find the Monday of the current week, then go back WEEKS-1 more weeks.
  const dow = (new Date(today + "T00:00:00").getDay() + 6) % 7; // 0 = Monday
  const thisMonday = addDays(today, -dow);
  const start = addDays(thisMonday, -(WEEKS - 1) * 7);

  const columns: { date: string; value: number | null; future: boolean }[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: { date: string; value: number | null; future: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d);
      const e = byDate.get(date);
      col.push({
        date,
        value: e ? (e.energy + e.maturityScore + e.reliabilityScore) / 3 : null,
        future: date > today,
      });
    }
    columns.push(col);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 4 }}>
        {columns.map((col, w) => (
          <div key={w} style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {col.map((cell) => (
              <button
                key={cell.date}
                type="button"
                aria-label={
                  cell.value !== null
                    ? `${cell.date}, average ${cell.value.toFixed(1)} out of 5`
                    : `${cell.date}, no entry`
                }
                disabled={cell.future}
                onClick={() =>
                  setSelected((cur) => (cur === cell.date ? null : cell.date))
                }
                style={{
                  aspectRatio: "1",
                  width: "100%",
                  padding: 0,
                  cursor: cell.future ? "default" : "pointer",
                  borderRadius: 4,
                  background:
                    cell.value !== null
                      ? RAMP[Math.min(4, Math.max(0, Math.round(cell.value) - 1))]
                      : "var(--bg-sunken)",
                  opacity: cell.future ? 0.25 : 1,
                  border:
                    selected === cell.date
                      ? "2px solid var(--text)"
                      : "1px solid var(--border)",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="signal-meta" style={{ marginTop: 8 }}>
        Last {WEEKS} weeks, Monday to Sunday per column — brighter blue means a
        higher average score. Tap a day to inspect it.
      </p>
      {selected && (
        <div
          style={{
            marginTop: 8,
            padding: "9px 12px",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-sunken)",
            fontSize: 13,
          }}
        >
          <strong>{selected}</strong>
          {selectedEntry ? (
            <>
              {" "}
              · energy {selectedEntry.energy} · maturity{" "}
              {selectedEntry.maturityScore} · reliability{" "}
              {selectedEntry.reliabilityScore}
              {selectedEntry.learnedToday.trim() && (
                <div style={{ color: "var(--text-secondary)", marginTop: 3 }}>
                  Learned: {selectedEntry.learnedToday}
                </div>
              )}
            </>
          ) : (
            <span style={{ color: "var(--text-tertiary)" }}> · no entry this day</span>
          )}
        </div>
      )}
    </div>
  );
}
