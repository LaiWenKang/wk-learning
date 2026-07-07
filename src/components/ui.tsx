import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, ReactNode } from "react";
import type { Rating, SignalCategory } from "../types";
import { CATEGORY_LABELS } from "../types";

export function Card(props: {
  title?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`card ${props.className ?? ""}`} style={props.style}>
      {props.title && <h3 className="card-title">{props.title}</h3>}
      {props.children}
    </div>
  );
}

/** Tinted card for daily prompt content — pass any CSS color as tint. */
export function TintCard(props: {
  tint: string;
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="card card-tint" style={{ "--tint": props.tint } as CSSProperties}>
      {props.icon && <span className="tint-icon">{props.icon}</span>}
      {props.title && <h3 className="card-title">{props.title}</h3>}
      {props.children}
    </div>
  );
}

export function SectionTitle(props: { icon?: ReactNode; children: ReactNode }) {
  return (
    <h2 className="section-title">
      {props.icon}
      {props.children}
    </h2>
  );
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

/** CSS variable name for a category's hue (defined in global.css). */
export function categoryColor(cat: SignalCategory): string {
  return `var(--cat-${cat})`;
}

/** Colored dot + label chip. Identity is never color-alone: label included. */
export function CategoryChip(props: { category: SignalCategory }) {
  return (
    <span
      className="chip chip-cat"
      style={{ "--cat": categoryColor(props.category) } as CSSProperties}
    >
      {CATEGORY_LABELS[props.category]}
    </span>
  );
}

/** iOS-style disclosure drawer built on <details>. */
export function Drawer(props: { summary: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details className="drawer" open={props.open}>
      <summary>{props.summary}</summary>
      <div className="drawer-body">{props.children}</div>
    </details>
  );
}

/** Bottom-sheet modal. Tap backdrop or Escape to dismiss. */
export function Sheet(props: { onClose: () => void; children: ReactNode; label?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKey);
    // Lock background scroll while the sheet is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [props]);

  // Portal to <body> so a transformed/animated ancestor (e.g. .page) can't
  // trap the fixed-position backdrop in its containing block.
  return createPortal(
    <div
      className="sheet-backdrop"
      onClick={props.onClose}
      role="dialog"
      aria-modal="true"
      aria-label={props.label}
    >
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        {props.children}
      </div>
    </div>,
    document.body,
  );
}
