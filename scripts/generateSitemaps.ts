// Generates the sitemap family for tiagodanin.com:
//   sitemap.xml                  index pointing at the three sitemaps below
//   sitemap-site.xml             site pages (written by next-sitemap, only referenced here)
//   sitemap-project-github.xml   /project/github/[slug] landing pages
//   sitemap-homepage-github.xml  GitHub Pages homepages served under the custom domain

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = 'https://tiagodanin.com';
const publicDir = path.join(__dirname, '..', 'public');

const SITE_SITEMAP = 'sitemap-site.xml';
const PROJECT_SITEMAP = 'sitemap-project-github.xml';
const HOMEPAGE_SITEMAP = 'sitemap-homepage-github.xml';
const INDEX_SITEMAP = 'sitemap.xml';

type GithubProject = {
  name: string;
  homepage?: string;
};

type SitemapEntry = {
  loc: string;
  changefreq: string;
  priority: string;
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
    .map(
      entry =>
        `\n  <url>\n    <loc>${entry.loc}</loc>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`;
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
    loc: `${siteUrl}/project/github/${slug}`,
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

  writeSitemap(PROJECT_SITEMAP, buildUrlset(projectEntries), projectEntries.length);
  writeSitemap(HOMEPAGE_SITEMAP, buildUrlset(homepageEntries), homepageEntries.length);

  // next-sitemap writes SITE_SITEMAP after this script, the index only needs its name
  const indexFiles = [SITE_SITEMAP, PROJECT_SITEMAP, HOMEPAGE_SITEMAP];
  writeSitemap(INDEX_SITEMAP, buildSitemapIndex(indexFiles), indexFiles.length);

  console.log('Sitemaps generated successfully');
}

generateSitemaps();
