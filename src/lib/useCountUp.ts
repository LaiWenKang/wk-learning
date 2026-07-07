import { useEffect, useRef, useState } from "react";

/** Animate an integer toward `target` (~600ms, eased) — from 0 on mount,
 *  from the currently shown value on later changes. Renders the final
 *  value immediately when reduced motion is set. */
export function useCountUp(target: number): number {
  const [value, setValue] = useState(() =>
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
      ? target
      : 0,
  );
  const shown = useRef(value);
  shown.current = value;
  const raf = useRef(0);

  useEffect(() => {
    if (shown.current === target) return;
    const from = shown.current;
    const start = performance.now();
    const dur = 600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}
