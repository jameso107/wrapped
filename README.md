# Hannah + James · Wrapped 💜

A Spotify-Wrapped-style web app for our 2.5-year anniversary (celebrated
6/21/26). Tap-through story cards, animated stats, our vacations, the proposal,
a live countdown to the wedding, and "My Girl" playing underneath.

Built with **Next.js + Tailwind + Framer Motion**, deployed on **Vercel**.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. On desktop it renders as a phone-shaped
frame; on a phone it's full screen.

## How it works (the parts you'll edit)

- **`src/lib/content.ts`** — the whole story is this one array. Each entry is a
  card. Edit the copy, reorder, add/remove cards. This is the main file to
  tweak.
- **`src/lib/dates.ts`** — the key dates (first date, engagement, wedding). The
  "days together" counter and the wedding countdown compute live from these.
- **`public/photos/`** — drop photos in (see `public/photos/README.md`).
  Missing photos show a placeholder, so nothing breaks.
- **`public/music/my-girl.mp3`** — drop the song in (see
  `public/music/README.md`).

### Controls
- **Tap / click** right side → next, left side → back
- **Arrow keys** ←/→, **Space** → next, **M** → mute, **P** → pause
- Auto-advances on a timer; ⏸ and 🔊 buttons are top-right
- "tap to begin" on the cover starts the music (browser autoplay rule)

## Deploy to Vercel

1. Push to GitHub (`git@github.com:jameso107/wrapped.git`).
2. In Vercel, **Add New → Project → Import** the repo.
3. Framework preset auto-detects **Next.js**. No env vars needed.
4. Deploy. Every push to `main` redeploys.

## Card types available
`cover`, `text`, `bigNumber` (with live `daysTogether`), `photo`, `statList`,
`vacationIntro`, `vacation`, `proposal`, `countdown`, `outro`. Want a new kind
(map of all the cities, photo carousel, music-player-style "top songs", a
quiz)? It's a small addition — just ask.
