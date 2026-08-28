import type { Metadata } from "next";
import { t } from "@lingui/core/macro";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import NextTopLoader from 'nextjs-toploader';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LinguiClientProvider } from "@/components/layout/LinguiClientProvider";
import { ToasterProvider } from "@/components/ui/toaster-provider";
import type { SocialLink } from "@/components/ui/SocialLinks";
import { queryCollection } from 'nextjs-studio/server';
import { LOCALES, HTML_LANG } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, OG_IMAGE, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from "@/lib/i18n/seo";
import "../globals.css";

/**
 * Root layout for every locale.
 *
 * There is no `app/layout.tsx`: this file and `(legacy)/layout.tsx` are two
 * root layouts, which is the only way for `<html lang>` to differ per locale in
 * a static export. `(legacy)` is scaffolding for the routes that have not been
 * migrated yet and disappears when they have.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const PERSON_ID = `${ORIGIN}/#person`;
const WEBSITE_ID = `${ORIGIN}/#website`;

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  const title = t(i18n)`Tiago Danin - Mobile Developer & Software Engineer`;
  const description = t(
    i18n
  )`Mobile Developer with 250+ projects. Flutter, React Native, iOS & Android specialist. Open source contributor with 70+ npm packages. Bug hunter on HackerOne.`;

  return {
    metadataBase: new URL(ORIGIN),
    title: { default: title, template: "%s | Tiago Danin" },
    description,
    authors: [{ name: "Tiago Danin", url: `${ORIGIN}/` }],
    creator: "Tiago Danin",
    publisher: "Tiago Danin",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      ...openGraphDefaults(locale),
      url: pageUrl(locale, '/'),
      title,
      description,
    },
    twitter: {
      ...twitterDefaults(),
      title,
      description,
    },
    alternates: localeAlternates(locale, '/'),
  };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const socialLinksData = [...queryCollection('sociallinks')] as unknown as SocialLink[];
  // Navbar and Footer are client components, so the menu is read here and
  // passed down: queryCollection only runs on the server.
  const menuData = queryCollection('menu').locale(locale);

  const siteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Tiago Danin',
        url: `${ORIGIN}/`,
        image: OG_IMAGE.url,
        jobTitle: 'Mobile Developer & Security Researcher',
        description: 'Mobile Developer specializing in Flutter, React Native, iOS & Android. Open source contributor and bug hunter on HackerOne.',
        knowsAbout: [
          'Flutter', 'React Native', 'iOS Development', 'Android Development',
          'Swift', 'Kotlin', 'TypeScript', 'JavaScript',
          'Cybersecurity', 'Bug Bounty', 'Open Source', 'DevOps',
        ],
        sameAs: [
          'https://github.com/TiagoDanin',
          'https://www.linkedin.com/in/tiagodanin',
          'https://twitter.com/tiagodanin',
          'https://hackerone.com/tiago-danin',
          'https://www.npmjs.com/~tiagodanin',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: pageUrl(locale, '/'),
        name: 'Tiago Danin',
        description: 'Mobile Developer with 250+ projects. Flutter, React Native, iOS & Android specialist. Open source contributor with 70+ npm packages. Bug hunter on HackerOne.',
        inLanguage: HTML_LANG[locale],
        publisher: { '@id': PERSON_ID },
        author: { '@id': PERSON_ID },
      },
    ],
  };

  return (
    <html lang={HTML_LANG[locale]}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body>
        <GoogleTagManager gtmId="GTM-WT3T53NB" />
        <NextTopLoader color="#1e56f0" speed={340} />
        <LinguiClientProvider locale={locale} messages={i18n.messages}>
          <div className="min-h-screen flex flex-col bg-background">
            <Navbar menu={[...menuData]} locale={locale} />
            <main className="flex-1">
              {children}
            </main>
            <Footer socialLinks={socialLinksData} menu={[...menuData]} locale={locale} />
          </div>
          <ToasterProvider />
        </LinguiClientProvider>
      </body>
      <GoogleAnalytics gaId="G-4M6BE19CKV" />
    </html>
  );
}
