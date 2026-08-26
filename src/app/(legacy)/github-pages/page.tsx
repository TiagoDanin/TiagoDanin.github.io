import GitHubPagesSection from "@/components/sections/GitHubPages";
import { queryCollection } from 'nextjs-studio/server';

export const metadata = {
  title: "GitHub Pages",
  description: "Browse all GitHub Pages projects and live demos by Tiago Danin. Interactive demos, tools, and open source project showcases.",
  keywords: ["GitHub Pages", "live demos", "projects", "interactive demos", "open source"],
  alternates: {
    canonical: 'https://tiagodanin.com/github-pages/',
  },
  openGraph: {
    title: "GitHub Pages Projects - Tiago Danin",
    description: "Interactive demos, tools, and open source project showcases hosted on GitHub Pages.",
    url: "https://tiagodanin.com/github-pages/",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "GitHub Pages Projects - Tiago Danin",
    description: "Interactive demos and tools hosted on GitHub Pages.",
  },
};

const Index = () => {
  const githubProjects = queryCollection('github').map(p => ({
    name: p.name,
    description: p.description || '',
    homepage: p.homepage || '',
    html_url: p.html_url || '',
  }));

  // The component only renders repos that carry a homepage, so the graph counts
  // the same set the visitor sees.
  const published = githubProjects.filter((p) => p.homepage && p.homepage.trim() !== '');
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "GitHub Pages sites by Tiago Danin",
    "numberOfItems": published.length,
    "itemListElement": published.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.name,
      "url": p.homepage,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com/" },
      { "@type": "ListItem", "position": 2, "name": "GitHub Pages", "item": "https://tiagodanin.com/github-pages/" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div>
        <GitHubPagesSection githubProjects={githubProjects} />
      </div>
    </>
  );
};

export default Index;
