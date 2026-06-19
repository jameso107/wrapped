"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates from 0 up to `target` over `duration` ms with an ease-out curve.
 * Restarts whenever `runKey` changes (used to replay when a card re-enters).
 */
export function useCountUp(target: number, duration = 1400, runKey?: unknown) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    let start: number | null = null;
    setValue(0);

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration, runKey]);

  return value;
}
