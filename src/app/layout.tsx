import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import NextTopLoader from 'nextjs-toploader';

import { DEFAULT_LOCALE, HTML_LANG } from "@/lib/i18n/locales";
import "./globals.css";

/**
 * The application's root layout: the `<html>` and `<body>` shell, the analytics
 * tags, and the stylesheet.
 *
 * It exists so `app/not-found.tsx` has a root layout to render into. Next
 * builds `dist/404.html` from the root not-found and from nothing else, and a
 * root not-found without a root layout is refused outright.
 *
 * `lang` is the default locale, because a root layout sits above `[lang]` and
 * receives no params. `[lang]/layout.tsx` corrects it per locale.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={HTML_LANG[DEFAULT_LOCALE]}>
      <body>
        <GoogleTagManager gtmId="GTM-WT3T53NB" />
        <NextTopLoader color="#1e56f0" speed={340} />
        {children}
      </body>
      <GoogleAnalytics gaId="G-4M6BE19CKV" />
    </html>
  );
}
