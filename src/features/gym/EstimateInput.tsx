import { useMemo, useState } from "react";

/**
 * Numeric estimate input with magnitude chips, so "24 billion km" is
 * typed as 24 + [billion] instead of counting zeros on a phone keyboard.
 */
const SCALES = [
  { label: "×1", value: 1 },
  { label: "thousand", value: 1e3 },
  { label: "million", value: 1e6 },
  { label: "billion", value: 1e9 },
  { label: "trillion", value: 1e12 },
] as const;

export function EstimateInput(props: {
  unit: string;
  disabled?: boolean;
  onSubmit: (value: number) => void;
  submitLabel: string;
}) {
  const [raw, setRaw] = useState("");
  const [scaleIdx, setScaleIdx] = useState(0);

  const value = useMemo(() => {
    const n = Number.parseFloat(raw.replace(/,/g, ""));
    if (!Number.isFinite(n) || n <= 0) return null;
    return n * SCALES[scaleIdx].value;
  }, [raw, scaleIdx]);

  return (
    <div className="estimate">
      <div className="estimate-row">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className="estimate-field"
          placeholder="Your estimate"
          aria-label={`Your estimate in ${props.unit}`}
          value={raw}
          disabled={props.disabled}
          onChange={(e) => setRaw(e.target.value)}
        />
        <span className="estimate-unit">{props.unit}</span>
      </div>
      <div className="scale-chips" role="radiogroup" aria-label="Magnitude">
        {SCALES.map((s, i) => (
          <button
            key={s.label}
            type="button"
            role="radio"
            aria-checked={scaleIdx === i}
            className={`scale-chip ${scaleIdx === i ? "active" : ""}`}
            disabled={props.disabled}
            onClick={() => setScaleIdx(i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary btn-block"
        disabled={props.disabled || value === null}
        onClick={() => value !== null && props.onSubmit(value)}
      >
        {props.submitLabel}
      </button>
    </div>
  );
}
