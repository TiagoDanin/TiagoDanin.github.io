import type { Metadata } from 'next';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';
import NPMRankingsClient from '@/components/sections/NPMRankingsClient';
import { HTML_LANG } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, markdownAlternate, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from '@/lib/i18n/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/rankings/npm'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`NPM Rankings - Most Downloaded Packages`,
    description: t(
      i18n
    )`Rankings of the most downloaded NPM packages with real-time statistics. Compare downloads, versions & dependencies across top JavaScript and Node.js packages.`,
    keywords: [
      "NPM rankings",
      "most downloaded NPM packages",
      "NPM package downloads",
      "JavaScript packages ranking",
      "Node.js packages",
      "npm statistics",
      "npm package downloads",
      "popular npm packages",
      "locale-codes npm",
      "telegraf npm",
      "npm package comparison",
      "total packages npm registry"
    ],
    alternates: {
      ...localeAlternates(locale, '/rankings/npm'),
      types: markdownAlternate('/rankings/npm'),
    },
    openGraph: {
      title: t(i18n)`Most Downloaded NPM Packages - Rankings & Statistics`,
      description: t(
        i18n
      )`Compare the most downloaded NPM packages with real-time stats. Downloads, versions & dependency insights for JavaScript developers.`,
      url: pageUrl(locale, '/rankings/npm'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`NPM Package Rankings - Downloads & Statistics`,
      description: t(i18n)`Rankings of the most downloaded NPM packages. Real-time stats, versions & dependency insights.`,
      site: "@tiagodanin",
    },
  };
}

interface NpmPackageEntry {
  name: string;
  description?: string;
  downloads: number;
  links?: { npm?: string };
}

export default async function NPMRankingsPage({ params }: PageProps<'/[lang]/rankings/npm'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const npmData = queryCollection('npm');
  const packages = [...npmData] as unknown as NpmPackageEntry[];

  // Same ordering the client renders, so the structured data describes the
  // list a crawler actually sees on the page.
  const topPackages = [...packages]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 10);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t(i18n)`Most downloaded NPM packages by Tiago Danin`,
    "description": t(i18n)`NPM packages published by Tiago Danin, ranked by total downloads.`,
    "numberOfItems": topPackages.length,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "itemListElement": topPackages.map((pkg, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": pkg.name,
      "url": pkg.links?.npm ?? `https://www.npmjs.com/package/${pkg.name}`,
      "item": {
        "@type": "SoftwareApplication",
        "name": pkg.name,
        "description": pkg.description ?? '',
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Node.js",
        "url": pkg.links?.npm ?? `https://www.npmjs.com/package/${pkg.name}`,
        "author": { "@type": "Person", "name": "Tiago Danin", "url": pageUrl(locale, '/') },
        // Google will not validate a SoftwareApplication that offers no price,
        // rating or review, and this page had none of the three. The packages
        // are free on the public registry, so the free offer is the honest one
        // of the three to state; the GitHub ranking needs no equivalent because
        // SoftwareSourceCode is not a rich result type.
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": pkg.links?.npm ?? `https://www.npmjs.com/package/${pkg.name}`,
        },
      },
    })),
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t(i18n)`NPM Rankings`,
    "description": t(i18n)`Rankings of NPM packages published by Tiago Danin, by total downloads.`,
    "url": pageUrl(locale, '/rankings/npm'),
    "inLanguage": HTML_LANG[locale],
    "isPartOf": { "@type": "WebSite", "name": "Tiago Danin", "url": ORIGIN + '/' },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`NPM Rankings`, "item": pageUrl(locale, '/rankings/npm') },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <NPMRankingsClient npmData={[...npmData]} locale={locale} />
    </>
  );
}
