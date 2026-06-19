"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Card } from "@/lib/types";
import CardRenderer from "./CardRenderer";
import ProgressBars from "./ProgressBars";

// Path to the background song. Drop the file at public/music/my-girl.mp3.
const MUSIC_SRC = "/music/my-girl.mp3";

// How long each card stays on screen before auto-advancing (ms).
function durationFor(card: Card): number {
  switch (card.kind) {
    case "bigNumber":
      return 5200;
    case "vacationIntro":
      return 4500;
    case "statList":
      return 6500;
    case "countdown":
      return 8000;
    default:
      return 5500;
  }
}

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -50 : 50,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

export default function Story({ cards }: { cards: Card[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const count = cards.length;
  const card = cards[index];
  const isLast = index >= count - 1;
  const duration = durationFor(card);

  const begin = useCallback(() => {
    setStarted(true);
    setDir(1);
    setIndex((i) => (i === 0 ? 1 : i));
  }, []);

  const next = useCallback(() => {
    if (!started) {
      begin();
      return;
    }
    if (isLast) {
      // loop back to the cover
      setDir(1);
      setStarted(false);
      setIndex(0);
      return;
    }
    setDir(1);
    setIndex((i) => Math.min(count - 1, i + 1));
  }, [started, isLast, count, begin]);

  const prev = useCallback(() => {
    if (!started || index === 0) return;
    setDir(-1);
    setIndex((i) => Math.max(0, i - 1));
  }, [started, index]);

  // Auto-advance.
  useEffect(() => {
    if (!started || paused || isLast) return;
    const id = setTimeout(() => {
      setDir(1);
      setIndex((i) => Math.min(count - 1, i + 1));
    }, duration);
    return () => clearTimeout(id);
  }, [index, started, paused, isLast, duration, count]);

  // Keyboard controls.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key.toLowerCase() === "m") {
        setMuted((m) => !m);
      } else if (e.key.toLowerCase() === "p") {
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Keep the <audio> element's muted state in sync.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  // Start the music as early as the browser allows: attempt autoplay on load,
  // and otherwise kick it off on the very first interaction anywhere (browsers
  // block audible autoplay until a user gesture, so this is the earliest
  // possible moment). The mute button still works because we never re-unmute.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const events = ["pointerdown", "touchstart", "keydown", "click"];
    const onFirst = () => {
      a.play().catch(() => {});
      events.forEach((e) => window.removeEventListener(e, onFirst, true));
    };
    a.play().catch(() => {}); // best-effort autoplay on load
    events.forEach((e) => window.addEventListener(e, onFirst, true));
    return () =>
      events.forEach((e) => window.removeEventListener(e, onFirst, true));
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black shadow-2xl sm:h-[92vh] sm:max-w-[440px] sm:rounded-[2.25rem]">
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      <ProgressBars
        count={count}
        current={index}
        duration={duration}
        paused={paused || !started}
      />

      {/* Card stage */}
      <AnimatePresence custom={dir} mode="popLayout" initial={false}>
        <motion.div
          key={index}
          custom={dir}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <CardRenderer card={card} runKey={index} />
        </motion.div>
      </AnimatePresence>

      {/* Tap zones: left third = back, right two-thirds = forward */}
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute inset-y-0 left-0 z-20 w-1/3 cursor-default"
      />
      <button
        aria-label="Next"
        onClick={next}
        className="absolute inset-y-0 right-0 z-20 w-2/3 cursor-default"
      />

      {/* Controls */}
      <div className="absolute right-3 top-7 z-40 flex gap-2">
        <button
          aria-label={paused ? "Play" : "Pause"}
          onClick={() => setPaused((p) => !p)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-sm backdrop-blur transition hover:bg-black/50"
        >
          {paused ? "▶" : "⏸"}
        </button>
        <button
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={() => setMuted((m) => !m)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-sm backdrop-blur transition hover:bg-black/50"
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}
