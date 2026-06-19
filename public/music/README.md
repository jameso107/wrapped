# Music

Drop the background song here as:

```
public/music/my-girl.mp3
```

That exact filename is what the app loads (see `MUSIC_SRC` in
`src/components/Story.tsx`). To use a different file, change that constant.

Notes:
- The song starts when the visitor taps **"tap to begin"** on the cover —
  browsers block autoplaying audio until the first interaction, so this is by
  design. There's a 🔊 / 🔇 mute toggle in the top-right.
- The track loops automatically.
- Use an actual `.mp3` (most reliable across browsers). Keep it a reasonable
  size (a few MB) so it loads quickly.
