import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import type { Metadata } from 'next';
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { queryCollection } from 'nextjs-studio/server';
import { HTML_LANG, type Locale } from "@/lib/i18n/locales";
import { localeAlternates, markdownAlternate, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from "@/lib/i18n/seo";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { SitemapTable, type SitemapUrl } from "@/components/ui/SitemapTable";


interface SitemapSection {
  file: string;
  title: string;
  description: string;
}

interface SitemapContent {
  title: string;
  description: string;
  sections: SitemapSection[];
}

interface ParsedSitemap {
  urlset?: {
    url?: SitemapUrl[];
  };
  sitemapindex?: {
    sitemap?: SitemapUrl[];
  };
}

function getContent(locale: Locale): SitemapContent {
  return queryCollection('sitemap').locale(locale).one() as unknown as SitemapContent;
}

/**
 * Reads a sitemap from public/. The files are written by `yarn sitemap`, which runs
 * after the first build, so an early build can legitimately find them missing.
 */
function readSitemapUrls(fileName: string): SitemapUrl[] {
  const filePath = path.join(process.cwd(), 'public', fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`Sitemap file not found, section will render empty: ${filePath}`);
    return [];
  }

  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      isArray: (name: string) => name === 'url' || name === 'sitemap',
    });
    const parsed = parser.parse(fs.readFileSync(filePath, 'utf8')) as ParsedSitemap;
    // A urlset lists pages, a sitemapindex lists the other sitemaps
    return parsed.urlset?.url ?? parsed.sitemapindex?.sitemap ?? [];
  } catch (error) {
    console.error(`Error parsing sitemap XML at ${filePath}:`, error);
    return [];
  }
}



export async function generateMetadata({ params }: PageProps<'/[lang]/sitemap'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);
  const { title, description } = getContent(locale);

  return {
    title,
    description,
    keywords: ['sitemap', 'site navigation', 'all pages', 'website structure'],
    alternates: {
      ...localeAlternates(locale, '/sitemap'),
      types: markdownAlternate('/sitemap'),
    },
    openGraph: {
      title: t(i18n)`${title} - Tiago Danin`,
      description,
      url: pageUrl(locale, '/sitemap'),
      type: 'website',
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      card: 'summary',
      title: t(i18n)`${title} - Tiago Danin`,
      description,
    },
  };
}



export default async function SitemapPage({ params }: PageProps<'/[lang]/sitemap'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const { title, description, sections } = getContent(locale);
  const lists = sections.map((section) => ({
    ...section,
    urls: readSitemapUrls(section.file),
  }));

  // The page is a directory of the four sitemaps; the counts come from the XML
  // actually read at build time, so the graph cannot overstate what is listed.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": pageUrl(locale, '/sitemap'),
    "inLanguage": HTML_LANG[locale],
    "isPartOf": { "@type": "WebSite", "name": "Tiago Danin", "url": pageUrl(locale, '/') },
    "hasPart": lists.map((l) => ({
      "@type": "WebPageElement",
      "name": l.title,
      "description": l.description,
      "url": `${ORIGIN}/${l.file}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`Sitemap`, "item": pageUrl(locale, '/sitemap') },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="container mx-auto py-20">
      <h1 className="mb-3 text-3xl font-bold">{title}</h1>
      <p className="mb-10 text-lg text-muted-foreground">{description}</p>

      <div className="space-y-8">
        {lists.map((list) => (
          <section key={list.file} className="rounded-lg border p-6 shadow-xs">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">{list.title}</h2>
                <p className="mt-1 text-muted-foreground">{list.description}</p>
              </div>
              <a
                href={`/${list.file}`}
                className="shrink-0 rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Trans>{list.urls.length} URLs, view XML</Trans>
              </a>
            </div>

            {list.urls.length === 0 ? (
              <p className="text-muted-foreground">
                <Trans>No URLs found. Run <code>yarn sitemap</code> to generate {list.file}.</Trans>
              </p>
            ) : (
              <SitemapTable urls={list.urls} locale={locale} />
            )}
          </section>
        ))}
      </div>
    </div>
    </>
  );
}
