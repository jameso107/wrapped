# Photos

These are the photos used by the story (paths configured in
`src/lib/content.ts`). Missing files fall back to a "photo coming soon"
placeholder, so the app never breaks.

```
public/photos/
├── cover/cover.jpg            ← title-screen background
├── moments/1.jpg … 6.jpg      ← "favorite moments" collage
├── caterpillar/1.jpg, 2.jpg   ← the cat ("Caterpillar")
├── mush/01.jpg … 10.jpg       ← "Mush Around the World" gallery (Disney/EPCOT)
├── michigan/1.jpg, 2.jpg      ← Michigan gallery
├── proposal/1.jpg             ← engagement card
└── highlights/                ← single-photo highlight cards
    ├── first-date.jpg
    ├── vegas.jpg
    ├── dc.jpg
    ├── frankenmush.jpg         (Frankenmuth / "Christmush" tradition)
    ├── santa-barbara.jpg
    ├── chicago.jpg
    └── disney2.jpg             (Disney, round two)
```

## Notes
- **Filenames are case-sensitive** on Vercel (Linux). Match these paths exactly,
  or update `src/lib/content.ts`.
- iPhone EXIF rotation is honored by browsers, so sideways-looking files display
  upright on the site — no manual rotation needed.
- To add/remove a photo from a gallery, edit that card's `items` array in
  `src/lib/content.ts` and drop the file in the matching folder.
- To swap a single-photo card, just replace the file at the same path.
