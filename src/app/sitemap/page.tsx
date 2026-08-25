import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import type { Metadata } from 'next';
import { queryCollection } from 'nextjs-studio/server';
import { withMarkdown } from '@/lib/markdown-alternate';
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

function getContent(): SitemapContent {
  return queryCollection('sitemap').one() as unknown as SitemapContent;
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



export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = getContent();

  return {
    title,
    description,
    keywords: ['sitemap', 'site navigation', 'all pages', 'website structure'],
    alternates: withMarkdown('https://tiagodanin.com/sitemap/'),
    openGraph: {
      title: `${title} - Tiago Danin`,
      description,
      url: 'https://tiagodanin.com/sitemap/',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${title} - Tiago Danin`,
      description,
    },
  };
}



export default function SitemapPage() {
  const { title, description, sections } = getContent();
  const lists = sections.map((section) => ({
    ...section,
    urls: readSitemapUrls(section.file),
  }));

  return (
    <div className="container mx-auto py-20">
      <h1 className="mb-3 text-3xl font-bold">{title}</h1>
      <p className="mb-10 text-lg text-muted-foreground">{description}</p>

      <div className="space-y-8">
        {lists.map((list) => (
          <section key={list.file} className="rounded-lg border p-6 shadow-sm">
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
                {list.urls.length} URLs, view XML
              </a>
            </div>

            {list.urls.length === 0 ? (
              <p className="text-muted-foreground">
                No URLs found. Run <code>yarn sitemap</code> to generate {list.file}.
              </p>
            ) : (
              <SitemapTable urls={list.urls} />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
