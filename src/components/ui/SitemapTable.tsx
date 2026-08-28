import { Trans } from '@lingui/react/macro';

import { DEFAULT_LOCALE, intlLocale, type Locale } from '@/lib/i18n/locales';

export interface SitemapUrl {
  /** Absolute URL as written in the sitemap XML. */
  loc: string;
  /** ISO timestamp. Rendered in the reader's language. */
  lastmod?: string;
  changefreq?: string;
  priority?: string | number;
}

export interface SitemapTableProps {
  urls: SitemapUrl[];
  /** Language the dates are formatted in. Defaults to English. */
  locale?: Locale;
}

/**
 * The `lastmod` cell.
 *
 * UTC, not the build machine's zone: sitemaps carry a UTC timestamp, and
 * rendering it locally moves a midnight date to the previous day anywhere west
 * of Greenwich. The same trap `formatDate` and `pressDate` document.
 */
function formatLastmod(lastmod: string, locale: Locale): string {
  return new Date(lastmod).toLocaleDateString(intlLocale(locale), { timeZone: 'UTC' });
}

/**
 * Highest priority first, then alphabetical, so the table opens on the pages
 * that matter most rather than on whatever the generator emitted first.
 */
function sortUrls(urls: SitemapUrl[]): SitemapUrl[] {
  return [...urls].sort((a, b) => {
    const priorityDiff = Number(b.priority ?? 0) - Number(a.priority ?? 0);
    return priorityDiff !== 0 ? priorityDiff : a.loc.localeCompare(b.loc);
  });
}

/**
 * Renders one sitemap as a table of routes with their crawl hints.
 *
 * The site publishes four sitemaps and /sitemap shows each as its own table.
 * Addresses are displayed as paths, since the origin is the same on every row
 * and repeating it would push the useful part off screen. The table scrolls
 * inside its own container so a long URL never makes the page scroll sideways.
 */
export function SitemapTable({ urls, locale = DEFAULT_LOCALE }: SitemapTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted text-left">
            <th className="border p-2 font-semibold">
              <Trans>URL</Trans>
            </th>
            <th className="w-1/6 border p-2 font-semibold">
              <Trans>Frequency</Trans>
            </th>
            <th className="w-1/6 border p-2 font-semibold">
              <Trans>Priority</Trans>
            </th>
            <th className="w-1/5 border p-2 font-semibold">
              <Trans>Last Modified</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortUrls(urls).map((url) => (
            <tr key={url.loc} className="hover:bg-muted/50">
              <td className="border p-2">
                <a
                  href={url.loc}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.loc.replace('https://tiagodanin.com', '') || '/'}
                </a>
              </td>
              <td className="border p-2 text-muted-foreground">{url.changefreq ?? '-'}</td>
              <td className="border p-2 text-muted-foreground">{url.priority ?? '-'}</td>
              <td className="border p-2 text-muted-foreground">
                {url.lastmod ? formatLastmod(url.lastmod, locale) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
