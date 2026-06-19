// All the important dates in one place. Months are 0-indexed in JS Date.
export const KEY_DATES = {
  firstDate: new Date(2023, 11, 21), // Dec 21, 2023
  engagement: new Date(2026, 2, 7), // Mar 7, 2026
  anniversary: new Date(2026, 5, 21), // Jun 21, 2026 (the 2.5 year reveal)
  wedding: new Date(2027, 6, 4), // Jul 4, 2027
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Whole days between two dates (b - a). */
export function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/** Days from the first date until `to` (defaults to today). */
export function daysTogether(to: Date = new Date()): number {
  return daysBetween(KEY_DATES.firstDate, to);
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

/** Live countdown breakdown from now until `target`. */
export function countdownTo(target: Date, now: Date = new Date()): Countdown {
  let diff = target.getTime() - now.getTime();
  const isPast = diff <= 0;
  if (isPast) diff = 0;
  const days = Math.floor(diff / MS_PER_DAY);
  const hours = Math.floor((diff % MS_PER_DAY) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, isPast };
}
