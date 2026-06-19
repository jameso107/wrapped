"use client";

/**
 * Instagram/Spotify-style segmented progress bar across the top. The active
 * segment animates from 0→100% over `duration`; completed segments are full.
 * Keyed by `current` so the CSS animation restarts on each advance.
 */
export default function ProgressBars({
  count,
  current,
  duration,
  paused,
}: {
  count: number;
  current: number;
  duration: number;
  paused: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex gap-1.5 p-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
        >
          <div
            key={`${i}-${current}`}
            className="h-full rounded-full bg-white"
            style={{
              width: i < current ? "100%" : i === current ? undefined : "0%",
              animation:
                i === current
                  ? `fillbar ${duration}ms linear forwards`
                  : undefined,
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes fillbar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
