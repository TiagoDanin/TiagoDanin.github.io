import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LinguiClientProvider } from "@/components/layout/LinguiClientProvider";
import { NotFoundPage } from "@/components/sections/NotFoundPage";
import type { SocialLink } from "@/components/ui/SocialLinks";
import { queryCollection } from 'nextjs-studio/server';
import { DEFAULT_LOCALE, HTML_LANG } from "@/lib/i18n/locales";
import { initI18n } from "@/lib/i18n/server";
import "./globals.css";

export const metadata = {
  robots: { index: false, follow: true },
};

/**
 * The site-wide 404: the file Next builds `dist/404.html` from, which is what
 * GitHub Pages serves for every URL matching no route, in either language.
 *
 * It opens its own document because the root layout is a passthrough, for the
 * reason spelled out there. English, since a URL that matched nothing carries
 * no locale to read.
 */
export default function RootNotFound() {
  const i18n = initI18n(DEFAULT_LOCALE);

  const socialLinksData = [...queryCollection('sociallinks')] as unknown as SocialLink[];
  const menuData = queryCollection('menu').locale(DEFAULT_LOCALE);

  return (
    <html lang={HTML_LANG[DEFAULT_LOCALE]}>
      <body>
        <GoogleTagManager gtmId="GTM-WT3T53NB" />
        <LinguiClientProvider locale={DEFAULT_LOCALE} messages={i18n.messages}>
          <div className="min-h-screen flex flex-col bg-background">
            <Navbar menu={[...menuData]} locale={DEFAULT_LOCALE} />
            <main className="flex-1">
              <NotFoundPage />
            </main>
            <Footer socialLinks={socialLinksData} menu={[...menuData]} locale={DEFAULT_LOCALE} />
          </div>
        </LinguiClientProvider>
      </body>
      <GoogleAnalytics gaId="G-4M6BE19CKV" />
    </html>
  );
}
