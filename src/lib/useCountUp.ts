import { useEffect, useRef, useState } from "react";

/** Animate an integer from 0 to `target` on mount (~600ms, eased).
 *  Renders the final value immediately when reduced motion is set. */
export function useCountUp(target: number): number {
  const [value, setValue] = useState(() =>
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
      ? target
      : 0,
  );
  const raf = useRef(0);

  useEffect(() => {
    if (value === target) return;
    const start = performance.now();
    const dur = 600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}
