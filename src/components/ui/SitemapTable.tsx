export interface SitemapUrl {
  /** Absolute URL as written in the sitemap XML. */
  loc: string;
  /** ISO timestamp. Rendered as a US-format date. */
  lastmod?: string;
  changefreq?: string;
  priority?: string | number;
}

export interface SitemapTableProps {
  urls: SitemapUrl[];
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
export function SitemapTable({ urls }: SitemapTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted text-left">
            <th className="border p-2 font-semibold">URL</th>
            <th className="w-1/6 border p-2 font-semibold">Frequency</th>
            <th className="w-1/6 border p-2 font-semibold">Priority</th>
            <th className="w-1/5 border p-2 font-semibold">Last Modified</th>
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
                {url.lastmod ? new Date(url.lastmod).toLocaleDateString('en-US') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
