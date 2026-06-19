"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { Card } from "@/lib/types";
import { countdownTo, daysTogether } from "@/lib/dates";
import { useCountUp } from "@/lib/useCountUp";
import CardShell from "./CardShell";
import PhotoFrame from "./PhotoFrame";

// Shared stagger animation for a card's contents.
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    variants={item}
    className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70"
  >
    {children}
  </motion.p>
);

export default function CardRenderer({
  card,
  runKey,
}: {
  card: Card;
  runKey: number;
}) {
  return (
    <CardShell
      theme={card.theme}
      bleed={card.kind === "cover" ? <CoverBleed photo={card.photo} /> : null}
    >
      <motion.div
        key={runKey}
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-md flex-col items-center"
      >
        <Inner card={card} runKey={runKey} />
      </motion.div>
    </CardShell>
  );
}

function CoverBleed({ photo }: { photo?: string }) {
  return (
    <div className="absolute inset-0 z-0">
      <PhotoFrame
        src={photo}
        rounded="rounded-none"
        className="h-full w-full opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
    </div>
  );
}

function Inner({ card, runKey }: { card: Card; runKey: number }) {
  switch (card.kind) {
    case "cover":
      return (
        <>
          <motion.p
            variants={item}
            className="mb-3 text-sm font-medium uppercase tracking-[0.4em] text-white/80"
          >
            {card.subtitle}
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-6xl font-black leading-[0.95] drop-shadow-lg sm:text-7xl"
          >
            {card.title}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-8 animate-pulse text-sm uppercase tracking-widest text-white/70"
          >
            tap to begin →
          </motion.p>
        </>
      );

    case "text":
      return (
        <>
          {card.eyebrow && <Eyebrow>{card.eyebrow}</Eyebrow>}
          <motion.h2
            variants={item}
            className="font-display text-4xl font-bold leading-tight sm:text-5xl"
          >
            {card.title}
          </motion.h2>
          {card.body && (
            <motion.p
              variants={item}
              className="mt-6 text-lg text-white/80"
            >
              {card.body}
            </motion.p>
          )}
        </>
      );

    case "bigNumber": {
      const target =
        card.value === "daysTogether" ? daysTogether() : card.value;
      return <BigNumber card={card} target={target} runKey={runKey} />;
    }

    case "photo":
      return (
        <>
          {card.eyebrow && <Eyebrow>{card.eyebrow}</Eyebrow>}
          <motion.div variants={item} className="w-full">
            <PhotoFrame
              src={card.photo}
              className="mx-auto aspect-[4/5] w-full max-w-xs shadow-2xl"
            />
          </motion.div>
          {card.caption && (
            <motion.p
              variants={item}
              className="mt-5 font-display text-xl italic text-white/90"
            >
              {card.caption}
            </motion.p>
          )}
        </>
      );

    case "statList":
      return (
        <>
          <motion.h2
            variants={item}
            className="mb-8 font-display text-4xl font-bold"
          >
            {card.title}
          </motion.h2>
          <div className="w-full space-y-3">
            {card.items.map((s) => (
              <motion.div
                key={s.label}
                variants={item}
                className="flex items-center justify-between border-b border-white/15 pb-3 text-left"
              >
                <span className="text-base text-white/80">{s.label}</span>
                <span className="font-display text-2xl font-bold">
                  {s.value}
                </span>
              </motion.div>
            ))}
          </div>
        </>
      );

    case "vacationIntro":
      return <VacationIntro count={card.count} runKey={runKey} />;

    case "vacation":
      return (
        <>
          <motion.div
            variants={item}
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 font-display text-xl font-bold"
          >
            {card.number}
          </motion.div>
          <motion.div variants={item} className="text-6xl">
            {card.emoji}
          </motion.div>
          <motion.h2
            variants={item}
            className="mt-3 font-display text-4xl font-bold sm:text-5xl"
          >
            {card.place}
          </motion.h2>
          {card.dates && (
            <motion.p
              variants={item}
              className="mt-1 text-sm uppercase tracking-widest text-white/70"
            >
              {card.dates}
            </motion.p>
          )}
          <motion.div variants={item} className="mt-6 w-full">
            <PhotoFrame
              src={card.photo}
              className="mx-auto aspect-[4/3] w-full max-w-sm shadow-2xl"
            />
          </motion.div>
          <motion.p variants={item} className="mt-5 text-base text-white/85">
            {card.blurb}
          </motion.p>
        </>
      );

    case "proposal":
      return (
        <>
          <motion.div variants={item} className="text-6xl">
            💍
          </motion.div>
          <Eyebrow>{card.date}</Eyebrow>
          <motion.h2
            variants={item}
            className="font-display text-5xl font-black sm:text-6xl"
          >
            She said yes.
          </motion.h2>
          <motion.div variants={item} className="mt-7 w-full">
            <PhotoFrame
              src={card.photo}
              className="mx-auto aspect-[4/5] w-full max-w-xs shadow-2xl"
            />
          </motion.div>
        </>
      );

    case "countdown":
      return <Countdown card={card} />;

    case "outro":
      return (
        <>
          <motion.h2
            variants={item}
            className="font-display text-5xl font-black italic"
          >
            {card.title}
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-6 text-lg leading-relaxed text-white/85"
          >
            {card.body}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-10 text-xs uppercase tracking-widest text-white/60"
          >
            tap to start over ↺
          </motion.p>
        </>
      );
  }
}

function BigNumber({
  card,
  target,
  runKey,
}: {
  card: Extract<Card, { kind: "bigNumber" }>;
  target: number;
  runKey: number;
}) {
  const value = useCountUp(target, 1500, runKey);
  return (
    <>
      {card.pre && (
        <motion.p variants={item} className="mb-4 text-lg text-white/80">
          {card.pre}
        </motion.p>
      )}
      <motion.div
        variants={item}
        className="font-display text-8xl font-black leading-none sm:text-9xl"
      >
        {value.toLocaleString()}
        {card.suffix}
      </motion.div>
      <motion.p
        variants={item}
        className="mt-3 text-2xl font-semibold uppercase tracking-wide"
      >
        {card.label}
      </motion.p>
      {card.sub && (
        <motion.p variants={item} className="mt-4 text-base italic text-white/70">
          {card.sub}
        </motion.p>
      )}
    </>
  );
}

function VacationIntro({ count, runKey }: { count: number; runKey: number }) {
  const value = useCountUp(count, 1000, runKey);
  return (
    <>
      <motion.p variants={item} className="mb-2 text-lg text-white/80">
        We went a lot of places.
      </motion.p>
      <motion.div
        variants={item}
        className="font-display text-9xl font-black leading-none"
      >
        {value}
      </motion.div>
      <motion.p
        variants={item}
        className="mt-3 text-2xl font-semibold uppercase tracking-wide"
      >
        trips together
      </motion.p>
      <motion.p variants={item} className="mt-4 text-base italic text-white/70">
        Let&apos;s relive them.
      </motion.p>
    </>
  );
}

function Countdown({ card }: { card: Extract<Card, { kind: "countdown" }> }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(card.target);
  const c = now ? countdownTo(target, now) : null;
  const cells: { v: number; l: string }[] = c
    ? [
        { v: c.days, l: "days" },
        { v: c.hours, l: "hrs" },
        { v: c.minutes, l: "min" },
        { v: c.seconds, l: "sec" },
      ]
    : [];

  return (
    <>
      <Eyebrow>{card.eyebrow}</Eyebrow>
      <motion.h2
        variants={item}
        className="font-display text-5xl font-black sm:text-6xl"
      >
        {card.title}
      </motion.h2>
      <motion.div variants={item} className="mt-8 flex gap-3">
        {cells.length === 0
          ? // placeholder skeleton before client mount (avoids hydration drift)
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex h-20 w-16 items-center justify-center rounded-2xl bg-white/10"
              />
            ))
          : cells.map((cell) => (
              <div
                key={cell.l}
                className="flex h-20 w-16 flex-col items-center justify-center rounded-2xl bg-white/15 backdrop-blur"
              >
                <span className="font-display text-3xl font-bold tabular-nums">
                  {String(cell.v).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/70">
                  {cell.l}
                </span>
              </div>
            ))}
      </motion.div>
      {card.footnote && (
        <motion.p variants={item} className="mt-8 text-base italic text-white/80">
          {card.footnote}
        </motion.p>
      )}
    </>
  );
}
