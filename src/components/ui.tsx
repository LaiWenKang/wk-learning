import type { ReactNode } from "react";
import type { Rating } from "../types";

export function Card(props: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card ${props.className ?? ""}`}>
      {props.title && <h3 className="card-title">{props.title}</h3>}
      {props.children}
    </div>
  );
}

export function SectionTitle(props: { children: ReactNode }) {
  return <h2 className="section-title">{props.children}</h2>;
}

export function Field(props: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span className="field-label">{props.label}</span>
      {props.children}
      {props.hint && <span className="field-hint">{props.hint}</span>}
    </label>
  );
}

export function RatingInput(props: {
  value: Rating;
  onChange: (v: Rating) => void;
}) {
  return (
    <div className="rating-row" role="radiogroup">
      {([1, 2, 3, 4, 5] as Rating[]).map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={props.value === n}
          className={`rating-dot ${props.value === n ? "selected" : ""}`}
          onClick={() => props.onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export function Segmented<T extends string>(props: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="segmented">
      {props.options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={props.value === o.value ? "active" : ""}
          onClick={() => props.onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState(props: { children: ReactNode }) {
  return <div className="empty-state">{props.children}</div>;
}

export function TagRow(props: { tags: string[] }) {
  if (props.tags.length === 0) return null;
  return (
    <div className="chip-row">
      {props.tags.map((t) => (
        <span key={t} className="chip chip-neutral">
          {t}
        </span>
      ))}
    </div>
  );
}
