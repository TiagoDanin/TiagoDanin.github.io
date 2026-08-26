// Generates the sitemap family for tiagodanin.com:
//   sitemap.xml                  index pointing at the three sitemaps below
//   sitemap-site.xml             English site pages (written by next-sitemap, only referenced here)
//   sitemap-site-br.xml          the /br/** pages, kept in their own file
//   sitemap-project-github.xml   /project/github/[slug] landing pages
//   sitemap-homepage-github.xml  GitHub Pages homepages served under the custom domain

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { HTML_LANG, LOCALIZED_ROUTES, localePath } from '../src/lib/i18n/locales.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = 'https://tiagodanin.com';
const publicDir = path.join(__dirname, '..', 'public');

const SITE_SITEMAP = 'sitemap-site.xml';
const SITE_BR_SITEMAP = 'sitemap-site-br.xml';
const PROJECT_SITEMAP = 'sitemap-project-github.xml';
const HOMEPAGE_SITEMAP = 'sitemap-homepage-github.xml';
const INDEX_SITEMAP = 'sitemap.xml';

type GithubProject = {
  name: string;
  homepage?: string;
};

type AlternateRef = {
  hreflang: string;
  href: string;
};

type SitemapEntry = {
  loc: string;
  changefreq: string;
  priority: string;
  alternates?: AlternateRef[];
};

function titleToSlug(title: string): string {
  const validChars = title.match(/[a-z0-9\s-]+/gi)?.join('') || '';
  return validChars
    .toLowerCase()
    .replace(/\s+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

/**
 * GitHub serves a user's project pages under the custom domain of their user page,
 * so https://tiagodanin.github.io/Repo/ is a 301 to https://tiagodanin.com/Repo/.
 * A sitemap must list the canonical target, never the redirect.
 * Returns null for homepages that are not hosted on the site.
 */
function normalizeHomepage(homepage: string): string | null {
  let url = homepage.trim().replace(/^http:/i, 'https:');
  url = url.replace(/^https:\/\/(www\.)?tiagodanin\.github\.io/i, siteUrl);
  url = url.replace(/^https:\/\/www\.tiagodanin\.com/i, siteUrl);

  if (!url.toLowerCase().startsWith(`${siteUrl.toLowerCase()}/`)) {
    return null;
  }

  if (!url.endsWith('/')) {
    url += '/';
  }

  // The bare domain is the site home, already covered by sitemap-site.xml
  return url === `${siteUrl}/` ? null : url;
}

function buildUrlset(entries: SitemapEntry[]): string {
  const urls = entries
    .map(entry => {
      // xhtml:link is what tells a crawler these URLs are one page in two
      // languages rather than two competing pages.
      const alternates = (entry.alternates ?? [])
        .map(
          alt =>
            `\n    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`
        )
        .join('');

      return `\n  <url>\n    <loc>${entry.loc}</loc>${alternates}\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`;
    })
    .join('');

  const hasAlternates = entries.some(entry => entry.alternates?.length);
  const xhtmlNs = hasAlternates ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : '';

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${xhtmlNs}>${urls}\n</urlset>`;
}

/**
 * The Portuguese pages, in a file of their own.
 *
 * Kept out of sitemap-site.xml so the two languages can be submitted and
 * diagnosed separately in Search Console, and so the English sitemap stays what
 * it has always been. Each entry carries the full hreflang set, English
 * included, which is what keeps `/` and `/br/` from reading as duplicates.
 */
function buildLocalizedEntries(): SitemapEntry[] {
  return LOCALIZED_ROUTES.map(route => {
    const alternates: AlternateRef[] = [
      { hreflang: HTML_LANG.en, href: `${siteUrl}${withSlash(localePath('en', route))}` },
      { hreflang: HTML_LANG.br, href: `${siteUrl}${withSlash(localePath('br', route))}` },
      { hreflang: 'x-default', href: `${siteUrl}${withSlash(localePath('en', route))}` },
    ];

    return {
      loc: `${siteUrl}${withSlash(localePath('br', route))}`,
      changefreq: 'weekly',
      priority: route === '/' ? '1.0' : '0.5',
      alternates,
    };
  });
}

function withSlash(route: string): string {
  return route.endsWith('/') ? route : `${route}/`;
}

function buildSitemapIndex(fileNames: string[]): string {
  const sitemaps = fileNames
    .map(fileName => `\n  <sitemap>\n    <loc>${siteUrl}/${fileName}</loc>\n  </sitemap>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}\n</sitemapindex>`;
}

function writeSitemap(fileName: string, xml: string, count: number): void {
  const target = path.join(publicDir, fileName);
  fs.writeFileSync(target, xml);
  console.log(`  ${fileName}: ${count} entries`);
}

function generateSitemaps(): void {
  console.log('Generating sitemaps...');

  const projectsPath = path.join(__dirname, '..', 'contents', 'github', 'index.json');
  const projectsData: GithubProject[] = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

  if (!projectsData || projectsData.length === 0) {
    throw new Error(`No GitHub projects found in ${projectsPath}`);
  }

  // Every repo in contents/github has a landing page at /project/github/[slug]
  // (see generateStaticParams in src/app/project/[type]/[slug]/page.tsx)
  const projectEntries: SitemapEntry[] = [
    ...new Set(projectsData.map(project => titleToSlug(project.name)).filter(Boolean)),
  ].map(slug => ({
    loc: `${siteUrl}/project/github/${slug}/`,
    changefreq: 'monthly',
    priority: '0.5',
  }));

  const homepageEntries: SitemapEntry[] = [
    ...new Set(
      projectsData
        .map(project => (project.homepage ? normalizeHomepage(project.homepage) : null))
        .filter((url): url is string => Boolean(url))
    ),
  ].map(loc => ({ loc, changefreq: 'monthly', priority: '0.3' }));

  const brEntries = buildLocalizedEntries();
  writeSitemap(SITE_BR_SITEMAP, buildUrlset(brEntries), brEntries.length);
  writeSitemap(PROJECT_SITEMAP, buildUrlset(projectEntries), projectEntries.length);
  writeSitemap(HOMEPAGE_SITEMAP, buildUrlset(homepageEntries), homepageEntries.length);

  // next-sitemap writes SITE_SITEMAP after this script, the index only needs its name
  const indexFiles = [SITE_SITEMAP, SITE_BR_SITEMAP, PROJECT_SITEMAP, HOMEPAGE_SITEMAP];
  writeSitemap(INDEX_SITEMAP, buildSitemapIndex(indexFiles), indexFiles.length);

  console.log('Sitemaps generated successfully');
}

generateSitemaps();
