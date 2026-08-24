// This file should be renamed to generateGithubSitemap.ts to resolve type annotation errors and enable TypeScript features.
// This script generates a sitemap for all GitHub projects

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteUrl = 'https://tiagodanin.com';

type GithubProject = {
  name: string;
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
 * Generates a sitemap XML for GitHub projects.
 * Points to the canonical /project/github/[slug] URLs instead of legacy GitHub Pages paths.
 */
async function generateGithubSitemap(): Promise<void> {
  try {
    console.log('Generating GitHub projects sitemap...');

    const projectsPath = path.join(__dirname, '..', 'contents', 'github', 'index.json');
    const projectsData: GithubProject[] = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

    if (!projectsData || projectsData.length === 0) {
      console.warn('No GitHub projects data found');
      return;
    }

    // Every repo in contents/github has a landing page at /project/github/[slug]
    // (see generateStaticParams in src/app/project/[type]/[slug]/page.tsx),
    // so the sitemap lists all of them.
    const slugs = [...new Set(
      projectsData
        .map(project => titleToSlug(project.name))
        .filter(Boolean)
    )];

    console.log(`Found ${slugs.length} GitHub project pages`);

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    slugs.forEach(slug => {
      sitemap += `\n  <url>\n    <loc>${siteUrl}/project/github/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>`;
    });

    sitemap += `\n</urlset>`;

    const sitemapPath = path.join(__dirname, '..', 'public', 'github-sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);

    console.log(`Successfully generated GitHub projects sitemap with ${slugs.length} entries at ${sitemapPath}`);
  } catch (error) {
    console.error('Error generating GitHub projects sitemap:', error);
  }
}

console.log('Starting GitHub projects sitemap generation...');
generateGithubSitemap();
