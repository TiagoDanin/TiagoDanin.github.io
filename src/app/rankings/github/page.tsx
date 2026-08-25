import type { Metadata } from 'next';
import { queryCollection } from 'nextjs-studio/server';
import GitHubRankingsClient from './GitHubRankingsClient';
import { withMarkdown } from '@/lib/markdown-alternate';

export const metadata: Metadata = {
  title: "GitHub Stars Ranking - Most Starred Repos",
  description: "See the most starred GitHub repositories ranked by stars, forks & watchers. Updated rankings of top open source projects. Compare repos and discover trending projects.",
  keywords: [
    "GitHub rankings",
    "most starred GitHub repositories",
    "top GitHub repositories all time",
    "GitHub stars ranking",
    "gitstar ranking",
    "GitHub repository rankings by stars",
    "open source projects ranking",
    "trending GitHub repositories",
    "GitHub stars leaderboard",
    "most popular GitHub repos",
    "top starred repositories",
    "GitHub project analytics"
  ],
  alternates: withMarkdown('https://tiagodanin.com/rankings/github/'),
  openGraph: {
    title: "Most Starred GitHub Repositories - Rankings by Stars, Forks & Watchers",
    description: "Updated rankings of the most starred GitHub repositories. Compare stars, forks & watchers across top open source projects.",
    url: "https://tiagodanin.com/rankings/github/",
    type: "website",
    siteName: "Tiago Danin",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Most Starred GitHub Repos - All Time Rankings",
    description: "See top GitHub repositories ranked by stars, forks & engagement. Updated rankings of the best open source projects.",
    creator: "@tiagodanin",
    site: "@tiagodanin",
  },
};

interface GithubRepoEntry {
  name: string;
  description?: string;
  stargazers_count: number;
  forks_count?: number;
  language?: string;
  html_url?: string;
}

export default function GitHubRankingsPage() {
  const githubData = queryCollection('github');
  const repos = [...githubData] as unknown as GithubRepoEntry[];

  // Same ordering the client renders, so the structured data describes the
  // list a crawler actually sees on the page.
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Most starred GitHub repositories by Tiago Danin",
    "description": "Open source repositories by Tiago Danin, ranked by GitHub stars.",
    "numberOfItems": topRepos.length,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "itemListElement": topRepos.map((repo, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": repo.name,
      "url": repo.html_url ?? `https://github.com/TiagoDanin/${repo.name}`,
      "item": {
        "@type": "SoftwareSourceCode",
        "name": repo.name,
        "description": repo.description ?? '',
        "codeRepository": repo.html_url ?? `https://github.com/TiagoDanin/${repo.name}`,
        ...(repo.language ? { "programmingLanguage": repo.language } : {}),
        "author": { "@type": "Person", "name": "Tiago Danin", "url": "https://tiagodanin.com/" },
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/LikeAction",
          "userInteractionCount": repo.stargazers_count,
        },
      },
    })),
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "GitHub Rankings",
    "description": "Rankings of open source repositories by Tiago Danin, by GitHub stars.",
    "url": "https://tiagodanin.com/rankings/github/",
    "inLanguage": "en-US",
    "isPartOf": { "@type": "WebSite", "name": "Tiago Danin", "url": "https://tiagodanin.com/" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com/" },
      { "@type": "ListItem", "position": 2, "name": "GitHub Rankings", "item": "https://tiagodanin.com/rankings/github/" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <GitHubRankingsClient githubData={[...githubData]} />
    </>
  );
}
