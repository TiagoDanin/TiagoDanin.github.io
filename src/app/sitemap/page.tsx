import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { XMLParser } from 'fast-xml-parser';

// Interface para os dados do sitemap
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

// Função para analisar um arquivo XML de sitemap
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

// Função para obter todas as URLs de todos os sitemaps
function getAllSitemaps() {
  const basePath = path.join(process.cwd(), 'public');
  
  // Lista de arquivos sitemap para analisar
  const sitemapFiles = [
    'sitemap.xml',
    'sitemap-0.xml',
    'github-sitemap.xml'
  ];
  
  const sitemaps: {
    name: string;
    urls: any[];
  }[] = [];
  
  // Processar cada arquivo de sitemap
  for (const file of sitemapFiles) {
    try {
      const filePath = path.join(basePath, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`Sitemap file not found: ${filePath}`);
        continue;
      }
      
      const data = parseSitemapXML(filePath);
      
      // Verificar se é um sitemap index
      if (data.sitemapindex && data.sitemapindex.sitemap) {
        const sitemap = Array.isArray(data.sitemapindex.sitemap) 
          ? data.sitemapindex.sitemap 
          : [data.sitemapindex.sitemap];
        
        sitemaps.push({
          name: file,
          urls: sitemap.map((s: any) => ({ loc: s.loc }))
        });
      } 
      // Se for um sitemap normal
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

// Função para renderizar a tabela de URLs do sitemap
function SitemapTable({ urls }: { urls: any[] }) {
  // Garantir que todas as URLs tenham os campos necessários
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
            <th className="p-2 text-left border w-1/6">Frequência</th>
            <th className="p-2 text-left border w-1/6">Prioridade</th>
            <th className="p-2 text-left border w-1/5">Última Modificação</th>
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
                  ? new Date(url.lastmod).toLocaleDateString('pt-BR')
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
  // Obter todos os sitemaps
  const sitemaps = getAllSitemaps();
  
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">Mapa do Site</h1>
      
      <div className="mb-6">
        <p className="text-lg">
          Este é o mapa do site, listando todas as páginas disponíveis.
        </p>
      </div>
      
      {sitemaps.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          Nenhum sitemap encontrado.
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
                  Ver XML
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