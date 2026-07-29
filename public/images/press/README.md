# Press photos

Drop image files here and they show up automatically on `/press-kit`.
The page reads this folder at build time (`readPressPhotos` in
`src/app/press-kit/page.tsx`), so no code change is needed to add or remove a photo.

## Rules

- Accepted extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- Files are listed in alphabetical order. Prefix with `01-`, `02-`, ... to control the order.
- The filename becomes the caption: the numeric prefix is stripped and dashes turn
  into spaces, so `03-portrait-neon.jpg` is shown as "Portrait neon".
- A file named `profile.*` is special: it replaces the GitHub avatar in the
  "Profile photo" card and enables the real download button there. It is not
  repeated in the gallery grid.
- Rotate photos before saving. The page renders them as they are, and phone photos
  that rely on EXIF orientation will show up sideways.
- Cards use a 4:5 crop with `object-cover`, so keep the subject near the center.

## Current naming

```
profile.jpg          Profile photo, square, replaces the GitHub avatar
01-<name>.jpg        Gallery photo
02-<name>.jpg        Gallery photo
...
```
