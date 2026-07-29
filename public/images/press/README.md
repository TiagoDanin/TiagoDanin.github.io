# Press photos

Files here are published on `/press-kit`. The page lists this folder at build time
(`readPressPhotos` in `src/app/press-kit/page.tsx`).

## Captions and order

Captions live in the CMS, not in the filename: `contents/presskit/index.json`,
editable in the studio as "Press Kit Photos". Each entry is:

```json
{ "file": "01-retrato-camisa-preta.jpg", "caption": "Portrait, black shirt" }
```

The order of that array is the order on the page. A file dropped in here without an
entry still shows up, at the end, with a caption derived from its filename
(numeric prefix stripped, dashes turned into spaces).

## Rules

- Accepted extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- `profile.jpg` is special: it fills the "Profile photo" card and enables the
  download button there. It is not repeated in the gallery grid.
- Rotate before saving. The originals from a phone often carry an EXIF orientation
  flag instead of rotated pixels, which is fragile. The current files were baked
  upright and stripped of that flag.
- Keep the long side at 2000px and JPEG quality around 85. This is a static site on
  GitHub Pages, so every byte here is shipped to the visitor.
- Keep transparency as PNG. `02-terno-sem-fundo.png` and `03-programando-sem-fundo.png`
  have alpha channels and are the most useful files for someone building an event banner.
- Cards use a 4:5 crop with `object-cover object-[50%_10%]`. The crop sits just below
  the top edge, not at the centre, so a tall portrait keeps the head instead of losing
  it while still leaving a little headroom. Frame the subject near the top of the image.
