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
  homepage?: string;
};

/**
 * Generates a sitemap XML for GitHub projects
 */
async function generateGithubSitemap(): Promise<void> {
  try {
    console.log('Generating GitHub projects sitemap...');
    
    const projectsPath = path.join(__dirname, '..', 'src', 'data', 'github.json');
    const projectsData: GithubProject[] = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    
    if (!projectsData || projectsData.length === 0) {
      console.warn('No GitHub projects data found');
      return;
    }
    
    const tiagoDaninProjects = projectsData.filter(project => 
      project.homepage && (
        project.homepage.toLowerCase().startsWith('https://www.tiagodanin') || 
        project.homepage.toLowerCase().startsWith('https://tiagodanin') ||
        project.homepage.toLowerCase().startsWith('http://www.tiagodanin') ||
        project.homepage.toLowerCase().startsWith('http://tiagodanin')
      )
    );
    
    console.log(`Found ${tiagoDaninProjects.length} GitHub projects with TiagoDanin homepage`);
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    tiagoDaninProjects.forEach(project => {
      sitemap += `\n  <url>\n    <loc>${siteUrl}/${project.name}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    });
    
    sitemap += `\n</urlset>`;
    
    const sitemapPath = path.join(__dirname, '..', 'public', 'github-sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    
    console.log(`Successfully generated GitHub projects sitemap with ${tiagoDaninProjects.length} entries at ${sitemapPath}`);
  } catch (error) {
    console.error('Error generating GitHub projects sitemap:', error);
  }
}

console.log('Starting GitHub projects sitemap generation...');
generateGithubSitemap(); 