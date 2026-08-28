/**
 * The root layout, and deliberately a passthrough: no `<html>`, no `<body>`.
 *
 * It exists for one reason. Next builds `dist/404.html` from `app/not-found.tsx`
 * and from nothing else, and it refuses a root not-found when no root layout
 * exists at all. Without this file the site ships Next's bare "This page could
 * not be found" for every miss, which is what shipped on 2026-08-28.
 *
 * What it must not do is open the document. A root layout sits above `[lang]`
 * and receives no params, so a `lang` written here would freeze at one value and
 * every Portuguese page would claim to be English. `next/root-params` does not
 * help either: it exposes the dynamic segments *above* the root layout, and
 * `[lang]` is below this file. Reading the URL is out too, since `headers()`
 * forces dynamic rendering and `output: "export"` forbids it.
 *
 * So each branch opens its own document, with the language it actually knows:
 * `[lang]/layout.tsx` from the segment it was routed for, and `not-found.tsx` in
 * English, because a URL that matched nothing carries no locale to read.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
