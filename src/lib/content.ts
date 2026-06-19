import type { Card } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// THE STORY
//
// This array IS the app. Each entry is one full-screen card, shown in order.
// Edit the copy freely. Add a `photo` path (relative to /public) to any card
// that supports it — until the file exists, a styled placeholder shows.
//
// Photo paths live under /public/photos/... (see public/photos/README.md).
// ─────────────────────────────────────────────────────────────────────────

export const STORY: Card[] = [
  {
    kind: "cover",
    theme: "berry",
    title: "Hannah + James",
    subtitle: "Wrapped · 2.5 Years",
    photo: "/photos/cover/cover.jpg",
  },
  {
    kind: "text",
    theme: "night",
    eyebrow: "Before we begin",
    title: "Two and a half years. Our amazing story.",
    body: "Here are some highlights. Tap to keep going.",
  },
  {
    kind: "text",
    theme: "plum",
    eyebrow: "December 21, 2023",
    title: "The start of something new.",
    body: "It feels so right, to be here with you",
  },
  {
    kind: "bigNumber",
    theme: "rose",
    pre: "Since that night, that's",
    value: "daysTogether",
    label: "days together",
    sub: "…not that anyone's counting.",
  },
  {
    kind: "photo",
    theme: "berry",
    eyebrow: "Us, lately",
    photo: "/photos/moments/us.jpg",
    caption:
      "Even from across the world, you're still the best part of every day.",
  },
  {
    kind: "statList",
    theme: "night",
    title: "By the numbers",
    items: [
      { label: "Vacations taken", value: "6(+)" },
      { label: "Trips to Disney", value: "2 🏰" },
      { label: "Hugs", value: "Infinite" },
      { label: "Rings acquired", value: "1 💍" },
    ],
  },
  {
    kind: "vacationIntro",
    theme: "sunset",
    count: 6,
  },
  {
    kind: "vacation",
    theme: "gold",
    number: 1,
    place: "Las Vegas",
    emoji: "🎰",
    blurb: "What happens in Vegas… became one of our favorite stories.",
    photo: "/photos/vacations/vegas/1.jpg",
  },
  {
    kind: "vacation",
    theme: "night",
    number: 2,
    place: "Washington, D.C.",
    emoji: "🏛️",
    blurb: "Monuments, museums, and a lot of walking. Worth every step.",
    photo: "/photos/vacations/dc/1.jpg",
  },
  {
    kind: "vacation",
    theme: "berry",
    number: 3,
    place: "Disney World",
    emoji: "🏰",
    blurb: "The happiest place on earth. Round one.",
    photo: "/photos/vacations/disney-1/1.jpg",
  },
  {
    kind: "vacation",
    theme: "sunset",
    number: 4,
    place: "Santa Barbara",
    emoji: "🌅",
    blurb: "Even rain can't stop us from having a great time.",
    photo: "/photos/vacations/santa-barbara/1.jpg",
  },
  {
    kind: "vacation",
    theme: "plum",
    number: 5,
    place: "Chicago",
    emoji: "🌆",
    blurb: "Deep dish, the skyline, and the cold for our two-year anniversary!",
    photo: "/photos/vacations/chicago/1.jpg",
  },
  {
    kind: "vacation",
    theme: "rose",
    number: 6,
    place: "Disney World",
    emoji: "🏰",
    blurb: "Round two, and many more to come",
    photo: "/photos/vacations/disney-2/1.jpg",
  },
  {
    kind: "text",
    theme: "night",
    eyebrow: "Then, this year…",
    title: "Best. Surprise. Ever.",
    body: "March 7, 2026.",
  },
  {
    kind: "proposal",
    theme: "rose",
    date: "March 7, 2026",
    photo: "/photos/proposal/1.jpg",
  },
  {
    kind: "text",
    theme: "berry",
    eyebrow: "From a first date…",
    title: "…to a forever date.",
  },
  {
    kind: "countdown",
    theme: "gold",
    eyebrow: "Coming soon",
    title: "The Wedding",
    target: "2027-07-04T00:00:00",
    footnote: "Fireworks for our future.",
  },
  {
    kind: "outro",
    theme: "berry",
    title: "To be continued…",
    body: "Here's to every hug, every Disney run, and every day still to come. I love you, I miss you, and I can't wait to see you soon! — James",
  },
];
