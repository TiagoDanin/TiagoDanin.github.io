import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

interface SitemapData {
  urlset?: {
    url: SitemapURL[] | SitemapURL;
  };
  sitemapindex?: {
    sitemap: {
      loc: string;
    }[] | { loc: string };
  };
}

function parseSitemapXML(filePath: string): any {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`Sitemap file not found: ${filePath}`);
      return {};
    }

    const xmlData = fs.readFileSync(filePath, 'utf8');
    const parser = new XMLParser({ 
      ignoreAttributes: false, 
      parseAttributeValue: true,
      isArray: (name: string) => ['url', 'sitemap'].includes(name)
    });
    return parser.parse(xmlData);
  } catch (error) {
    console.error(`Error parsing sitemap XML at ${filePath}:`, error);
    return {};
  }
}

function getAllSitemaps() {
  const basePath = path.join(process.cwd(), 'public');
  
  const sitemapFiles = [
    'sitemap.xml',
    'sitemap-0.xml',
    'github-sitemap.xml'
  ];
  
  const sitemaps: {
    name: string;
    urls: any[];
  }[] = [];
  
  for (const file of sitemapFiles) {
    try {
      const filePath = path.join(basePath, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`Sitemap file not found: ${filePath}`);
        continue;
      }
      
      const data = parseSitemapXML(filePath);
      
      if (data.sitemapindex && data.sitemapindex.sitemap) {
        const sitemap = Array.isArray(data.sitemapindex.sitemap) 
          ? data.sitemapindex.sitemap 
          : [data.sitemapindex.sitemap];
        
        sitemaps.push({
          name: file,
          urls: sitemap.map((s: any) => ({ loc: s.loc }))
        });
      } 
      else if (data.urlset && data.urlset.url) {
        const urls = Array.isArray(data.urlset.url) 
          ? data.urlset.url 
          : [data.urlset.url];
        
        sitemaps.push({
          name: file,
          urls: urls
        });
      }
    } catch (error) {
      console.error(`Error processing sitemap ${file}:`, error);
    }
  }
  
  return sitemaps;
}

function SitemapTable({ urls }: { urls: any[] }) {
  const safeUrls = urls.map(url => ({
    loc: url.loc || '',
    changefreq: url.changefreq || '',
    priority: url.priority || '',
    lastmod: url.lastmod || ''
  }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left border">URL</th>
            <th className="p-2 text-left border w-1/6">Frequency</th>
            <th className="p-2 text-left border w-1/6">Priority</th>
            <th className="p-2 text-left border w-1/5">Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {safeUrls.map((url, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">
                <a 
                  href={url.loc} 
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.loc.replace('https://tiagodanin.com/', '/')}
                </a>
              </td>
              <td className="p-2 border">{url.changefreq || '-'}</td>
              <td className="p-2 border">{url.priority || '-'}</td>
              <td className="p-2 border">
                {url.lastmod 
                  ? new Date(url.lastmod).toLocaleDateString('en-US')
                  : '-'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SitemapPage() {
  const sitemaps = getAllSitemaps();
  
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">Site Map</h1>
      
      <div className="mb-6">
        <p className="text-lg">
          This is the site map, listing all available pages.
        </p>
      </div>
      
      {sitemaps.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          No sitemaps found.
        </div>
      ) : (
        <div className="space-y-8">
          {sitemaps.map((sitemap) => (
            <div key={sitemap.name} className="border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 flex items-center justify-between">
                <span>{sitemap.name}</span>
                <a 
                  href={`/${sitemap.name}`} 
                  className="text-sm text-blue-500 hover:underline px-3 py-1 border border-blue-300 rounded-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View XML
                </a>
              </h2>
              
              <SitemapTable urls={sitemap.urls} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 