// Generates the sitemap family for tiagodanin.com:
//   sitemap.xml                  index pointing at the four sitemaps below
//   sitemap-site.xml             English site pages (written by next-sitemap, only referenced here)
//   sitemap-site-br.xml          the /br/** pages, kept in their own file
//   sitemap-project-github.xml   /project/github/[slug] landing pages, both languages
//   sitemap-homepage-github.xml  GitHub Pages homepages served under the custom domain
//
// The page lists come from `builtRoutes()` in next-sitemap.config.cjs, which
// walks the exported tree, and every entry is weighted by that config's own
// `transform`. Both were duplicated here before, and the copies disagreed: this
// file listed posts, talks, tags and skills for Portuguese and no project, app,
// timeline, social or blog page in either language, while a post was priority
// 0.4 here and 0.7 there.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { queryCollection } from 'nextjs-studio/server';

import sitemapConfig from '../next-sitemap.config.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = 'https://tiagodanin.com';
const publicDir = path.join(__dirname, '..', 'public');

const SITE_SITEMAP = 'sitemap-site.xml';
const SITE_BR_SITEMAP = 'sitemap-site-br.xml';
const PROJECT_SITEMAP = 'sitemap-project-github.xml';
const HOMEPAGE_SITEMAP = 'sitemap-homepage-github.xml';
const INDEX_SITEMAP = 'sitemap.xml';

/** The Portuguese URL prefix. English is served from the root and carries none. */
const BR_PREFIX = '/br';

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

/** The slice of next-sitemap.config.cjs this script uses. */
type SitemapConfig = {
  builtRoutes: (prefix?: string) => string[];
  isGithubProject: (route: string) => boolean;
  transform: (
    config: unknown,
    urlPath: string
  ) => Promise<{
    changefreq: string;
    priority: number;
    alternateRefs: Array<{ hreflang: string; href: string }>;
  }>;
};

const config = sitemapConfig as unknown as SitemapConfig;

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

function withSlash(route: string): string {
  return route.endsWith('/') ? route : `${route}/`;
}

/**
 * The locale-free route, which is what the config's `transform` weights and
 * builds the hreflang set from. `/br/post/x` and `/post/x` are one page.
 */
function unprefixed(route: string): string {
  if (route === BR_PREFIX) return '/';
  return route.startsWith(`${BR_PREFIX}/`) ? route.slice(BR_PREFIX.length) : route;
}

/**
 * One sitemap entry, weighted by next-sitemap's transform.
 *
 * Only `loc` is this script's own: the priority ladder, the changefreq and the
 * three hreflang refs come back identical for `/post/x` and `/br/post/x`, which
 * is the point. Each entry carries the full set, English included, which is
 * what keeps `/` and `/br/` from reading as duplicates.
 */
async function toEntry(route: string): Promise<SitemapEntry> {
  const weighted = await config.transform(sitemapConfig, unprefixed(route));

  return {
    loc: `${siteUrl}${withSlash(route)}`,
    changefreq: weighted.changefreq,
    priority: String(weighted.priority),
    alternates: weighted.alternateRefs.map(ref => ({ hreflang: ref.hreflang, href: ref.href })),
  };
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

async function generateSitemaps(): Promise<void> {
  console.log('Generating sitemaps...');

  const projectsData = [...queryCollection('github')] as unknown as GithubProject[];

  if (projectsData.length === 0) {
    throw new Error('No GitHub projects found. Run `yarn data:github` first.');
  }

  const enRoutes = config.builtRoutes();
  const brRoutes = config.builtRoutes(BR_PREFIX);

  // Both languages of every GitHub landing page live here, so each URL appears
  // in exactly one sitemap. The Portuguese half used to appear in none.
  const projectEntries = await Promise.all(
    [...enRoutes, ...brRoutes].filter(config.isGithubProject).map(toEntry)
  );

  const brEntries = await Promise.all(
    brRoutes.filter(route => !config.isGithubProject(route)).map(toEntry)
  );

  // Not pages of ours, so they carry no alternates: these are the GitHub Pages
  // sites served under the custom domain.
  const homepageEntries: SitemapEntry[] = [
    ...new Set(
      projectsData
        .map(project => (project.homepage ? normalizeHomepage(project.homepage) : null))
        .filter((url): url is string => Boolean(url))
    ),
  ].map(loc => ({ loc, changefreq: 'monthly', priority: '0.3' }));

  writeSitemap(SITE_BR_SITEMAP, buildUrlset(brEntries), brEntries.length);
  writeSitemap(PROJECT_SITEMAP, buildUrlset(projectEntries), projectEntries.length);
  writeSitemap(HOMEPAGE_SITEMAP, buildUrlset(homepageEntries), homepageEntries.length);

  // next-sitemap writes SITE_SITEMAP after this script, the index only needs its name
  const indexFiles = [SITE_SITEMAP, SITE_BR_SITEMAP, PROJECT_SITEMAP, HOMEPAGE_SITEMAP];
  writeSitemap(INDEX_SITEMAP, buildSitemapIndex(indexFiles), indexFiles.length);

  console.log('Sitemaps generated successfully');
}

await generateSitemaps();
