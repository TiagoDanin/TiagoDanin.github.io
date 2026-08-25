import type { Metadata } from 'next';
import { queryCollection } from 'nextjs-studio/server';
import NPMRankingsClient from './NPMRankingsClient';
import { withMarkdown } from '@/lib/markdown-alternate';

export const metadata: Metadata = {
  title: "NPM Rankings - Most Downloaded Packages",
  description: "Rankings of the most downloaded NPM packages with real-time statistics. Compare downloads, versions & dependencies across top JavaScript and Node.js packages.",
  keywords: [
    "NPM rankings",
    "most downloaded NPM packages",
    "NPM package downloads",
    "JavaScript packages ranking",
    "Node.js packages",
    "npm statistics",
    "npm package downloads",
    "popular npm packages",
    "locale-codes npm",
    "telegraf npm",
    "npm package comparison",
    "total packages npm registry"
  ],
  alternates: withMarkdown('https://tiagodanin.com/rankings/npm/'),
  openGraph: {
    title: "Most Downloaded NPM Packages - Rankings & Statistics",
    description: "Compare the most downloaded NPM packages with real-time stats. Downloads, versions & dependency insights for JavaScript developers.",
    url: "https://tiagodanin.com/rankings/npm/",
    type: "website",
    siteName: "Tiago Danin",
    locale: "en_US",
  },
  twitter: {
    card: 'summary_large_image',
    title: "NPM Package Rankings - Downloads & Statistics",
    description: "Rankings of the most downloaded NPM packages. Real-time stats, versions & dependency insights.",
    creator: "@tiagodanin",
    site: "@tiagodanin",
  },
};

interface NpmPackageEntry {
  name: string;
  description?: string;
  downloads: number;
  links?: { npm?: string };
}

export default function NPMRankingsPage() {
  const npmData = queryCollection('npm');
  const packages = [...npmData] as unknown as NpmPackageEntry[];

  // Same ordering the client renders, so the structured data describes the
  // list a crawler actually sees on the page.
  const topPackages = [...packages]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 10);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Most downloaded NPM packages by Tiago Danin",
    "description": "NPM packages published by Tiago Danin, ranked by total downloads.",
    "numberOfItems": topPackages.length,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "itemListElement": topPackages.map((pkg, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": pkg.name,
      "url": pkg.links?.npm ?? `https://www.npmjs.com/package/${pkg.name}`,
      "item": {
        "@type": "SoftwareApplication",
        "name": pkg.name,
        "description": pkg.description ?? '',
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Node.js",
        "url": pkg.links?.npm ?? `https://www.npmjs.com/package/${pkg.name}`,
        "author": { "@type": "Person", "name": "Tiago Danin", "url": "https://tiagodanin.com/" },
      },
    })),
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "NPM Rankings",
    "description": "Rankings of NPM packages published by Tiago Danin, by total downloads.",
    "url": "https://tiagodanin.com/rankings/npm/",
    "inLanguage": "en-US",
    "isPartOf": { "@type": "WebSite", "name": "Tiago Danin", "url": "https://tiagodanin.com/" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com/" },
      { "@type": "ListItem", "position": 2, "name": "NPM Rankings", "item": "https://tiagodanin.com/rankings/npm/" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <NPMRankingsClient npmData={[...npmData]} />
    </>
  );
}
