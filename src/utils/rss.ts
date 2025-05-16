export interface ItemOptions {
  title: string;
  link: string;
  guid?: string;
  description?: string;
  pubDate?: string | Date;
}

export interface FeedOptions {
  title: string;
  description: string;
  siteUrl: string;
  items: ItemOptions[];
  language?: string;
  feedUrl?: string;
  copyright?: string;
} 

export function buildRssFeed({
  title,
  description,
  siteUrl,
  items,
  language = 'en',
  feedUrl,
  copyright,
}: FeedOptions): string {
  const pubDate = new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    ${feedUrl ? `<atom:link href=\"${feedUrl}\" rel=\"self\" type=\"application/rss+xml\" />` : ''}
    ${copyright ? `<copyright>${escapeXml(copyright)}</copyright>` : ''}
    ${items.map(itemToRssItem).join('\n    ')}
  </channel>
</rss>`;
}

function itemToRssItem(item: ItemOptions): string {
  return `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid>${item.guid || item.link}</guid>
      <description>${escapeXml(item.description || '')}</description>
      ${item.pubDate ? `<pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>` : ''}
    </item>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
} 