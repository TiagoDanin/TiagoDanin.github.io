import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { splitLocale } from '../src/lib/i18n/locales.js';

/**
 * Adds the Markdown mirror to every sitemap entry that has one.
 *
 * Each URL ends up announcing four alternates: the two languages, x-default,
 * and the plain-text face of the page that `scripts/generateLlms.ts` writes.
 *
 * A separate pass because next-sitemap builds `sitemap-site.xml` itself and its
 * `alternateRefs` only carry an `hreflang`, with no way to express a `type`.
 *
 * Posts and talks are mirrored in both languages; every other page only in
 * English. So each URL tries its own path first and falls back to the
 * English one. Existence is checked on disk rather than derived from a route
 * list: announcing a mirror that was never written promises a 404 to whoever
 * follows it, and the file is the only thing that cannot be wrong about that.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const siteUrl = 'https://tiagodanin.com';

const SITEMAPS = ['sitemap-site.xml', 'sitemap-site-br.xml'];
const XHTML_NS = 'xmlns:xhtml="http://www.w3.org/1999/xhtml"';

function mirrorPath(routePath: string): string {
  const clean = routePath.replace(/\/+$/, '');
  return clean === '' ? '/index.md' : `${clean}.md`;
}

/** Path of the Markdown mirror for a page URL, or null when there is no file. */
function markdownFor(loc: string): string | null {
  if (!loc.startsWith(siteUrl)) return null;

  const routePath = loc.slice(siteUrl.length) || '/';
  // Its own language first, the English mirror second. /br/post/x/ has a
  // Portuguese .md; /br/about/ resolves to the same file /about/ does.
  const candidates = [mirrorPath(routePath), mirrorPath(splitLocale(routePath).base)];

  for (const relative of candidates) {
    if (fs.existsSync(path.join(publicDir, relative))) return `${siteUrl}${relative}`;
  }
  return null;
}

function annotate(fileName: string): void {
  const target = path.join(publicDir, fileName);
  if (!fs.existsSync(target)) {
    throw new Error(`Expected ${fileName} in public/. Run the sitemap generators first.`);
  }

  let xml = fs.readFileSync(target, 'utf8');
  let added = 0;

  xml = xml.replace(/<url>([\s\S]*?)<\/url>/g, (block, inner: string) => {
    if (inner.includes('type="text/markdown"')) return block;

    const loc = /<loc>([^<]+)<\/loc>/.exec(inner)?.[1];
    const href = loc ? markdownFor(loc) : null;
    if (!href) return block;

    added += 1;
    const link = `<xhtml:link rel="alternate" type="text/markdown" href="${href}"/>`;

    // Placed with the other alternates rather than at the end: the sitemap
    // schema sequences lastmod, changefreq and priority, and a link dropped
    // after them reads as out of order.
    const lastAlternate = inner.lastIndexOf('<xhtml:link');
    if (lastAlternate >= 0) {
      const insertAt = inner.indexOf('>', inner.indexOf('/>', lastAlternate)) + 1;
      return `<url>${inner.slice(0, insertAt)}${link}${inner.slice(insertAt)}</url>`;
    }

    const afterLoc = inner.indexOf('</loc>') + '</loc>'.length;
    return `<url>${inner.slice(0, afterLoc)}${link}${inner.slice(afterLoc)}</url>`;
  });

  if (added > 0 && !xml.includes(XHTML_NS)) {
    xml = xml.replace('<urlset ', `<urlset ${XHTML_NS} `);
  }

  fs.writeFileSync(target, xml);
  console.log(`  ${fileName}: ${added} markdown alternates`);
}

console.log('Annotating sitemaps with Markdown mirrors...');
for (const fileName of SITEMAPS) annotate(fileName);
console.log('Done');
