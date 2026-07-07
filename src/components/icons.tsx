/** Minimal inline stroke icons (SF-Symbols-flavoured, no icon library). */

type IconProps = { className?: string };

const base = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function SunIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
    </svg>
  );
}

export function BookIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </svg>
  );
}

export function BrainIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M12 3v18" />
      <path d="M12 7a3.5 3.5 0 1 0-3.5 3.5A3.5 3.5 0 1 0 12 17" />
      <path d="M12 7a3.5 3.5 0 1 1 3.5 3.5A3.5 3.5 0 1 1 12 17" />
    </svg>
  );
}

export function ChartIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M3 21h18" />
      <path d="M6 21v-8m5 8V6m5 15v-11" />
    </svg>
  );
}

export function JournalIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6m-6 4h6m-6 4h3" />
    </svg>
  );
}

export function GearIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
    </svg>
  );
}

export function FlameIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M12 22c4.4 0 7-2.8 7-6.5 0-3-1.8-4.9-3.2-6.4C14.6 7.8 13.5 6.5 13.5 4c-2.8 1.4-4 3.6-4 5.5 0 .6.1 1.1.2 1.6-1-.4-1.8-1.2-2.2-2.3C6.1 10.2 5 12.3 5 15.5 5 19.2 7.6 22 12 22z" />
    </svg>
  );
}

export function StackIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <rect x="4" y="4" width="13" height="13" rx="2" />
      <path d="M9 20.5h8.5A2.5 2.5 0 0 0 20 18V9" />
    </svg>
  );
}

export function InboxIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M4 13h4l2 3h4l2-3h4" />
      <path d="M4 13V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7" />
      <path d="M4 13v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    </svg>
  );
}

export function SparkleIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
    </svg>
  );
}

export function TargetIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BoltIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H13L13 2z" />
    </svg>
  );
}

export function PencilIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M17 3.5a2.1 2.1 0 0 1 3 3L8.5 18 4 19.5 5.5 15 17 3.5z" />
    </svg>
  );
}

export function WrenchIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6a2 2 0 1 0 2.8 2.8l5.7-5.7a4.5 4.5 0 0 0 5.6-6L14 12l-2-2 2.7-3.7z" />
    </svg>
  );
}

export function CompassIcon(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 13.8 13.8 8.5 15.5l1.7-5.3 5.3-1.7z" />
    </svg>
  );
}
