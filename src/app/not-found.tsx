import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LinguiClientProvider } from "@/components/layout/LinguiClientProvider";
import { NotFoundPage } from "@/components/sections/NotFoundPage";
import type { SocialLink } from "@/components/ui/SocialLinks";
import { queryCollection } from 'nextjs-studio/server';
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { initI18n } from "@/lib/i18n/server";
import "./globals.css";

export const metadata = {
  robots: { index: false, follow: true },
};

/**
 * The site-wide 404: the file Next builds `dist/404.html` from, which GitHub
 * Pages serves for every URL matching no route, in either language.
 *
 * Next renders the root not-found outside every layout, so this brings its own
 * frame: the stylesheet is imported here and the shell is composed here rather
 * than inherited. It must not render `<html>` or `<body>`, which Next supplies.
 */
export default function RootNotFound() {
  const i18n = initI18n(DEFAULT_LOCALE);

  const socialLinksData = [...queryCollection('sociallinks')] as unknown as SocialLink[];
  const menuData = queryCollection('menu').locale(DEFAULT_LOCALE);

  return (
    <LinguiClientProvider locale={DEFAULT_LOCALE} messages={i18n.messages}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar menu={[...menuData]} locale={DEFAULT_LOCALE} />
        <main className="flex-1">
          <NotFoundPage />
        </main>
        <Footer socialLinks={socialLinksData} menu={[...menuData]} locale={DEFAULT_LOCALE} />
      </div>
    </LinguiClientProvider>
  );
}
