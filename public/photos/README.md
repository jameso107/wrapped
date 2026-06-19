# Photos

Drop image files into these folders. The app references them by the exact
paths below (configured in `src/lib/content.ts`). Until a file exists, that
card shows a tasteful "photo coming soon" placeholder — so the app always
works, even with zero photos.

```
public/photos/
├── cover/
│   └── cover.jpg              ← full-screen cover background
├── moments/
│   └── us.jpg                 ← the "Us, lately" card
├── proposal/
│   └── 1.jpg                  ← the engagement card
└── vacations/
    ├── vegas/1.jpg
    ├── dc/1.jpg
    ├── disney-1/1.jpg
    ├── santa-barbara/1.jpg
    ├── chicago/1.jpg
    └── disney-2/1.jpg
```

## Tips
- **Filenames are case-sensitive** on the deployed server (Vercel/Linux).
  `cover.jpg` ≠ `Cover.JPG`. Match the paths above exactly, or update the
  paths in `src/lib/content.ts`.
- `.jpg`, `.png`, `.webp`, and `.heic`→convert-to-jpg all work as long as the
  path in `content.ts` matches.
- **Orientation:** cover and proposal cards look best with portrait photos;
  vacation cards use a 4:3 frame.
- Want more than one photo per place, or a photo on a different card? Tell me
  and I'll add a multi-photo / carousel card type — the engine is set up for it.
- Compress large phone photos before committing (a 12 MP photo is ~5 MB; that
  adds up fast in git). Something like 2000px on the long edge is plenty.
