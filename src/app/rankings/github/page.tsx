import type { Metadata } from 'next';
import { queryCollection } from 'nextjs-studio/server';
import GitHubRankingsClient from './GitHubRankingsClient';

export const metadata: Metadata = {
  title: "GitHub Repository Rankings by Stars - Most Starred Repos (All Time)",
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
  alternates: {
    canonical: 'https://tiagodanin.com/rankings/github',
  },
  openGraph: {
    title: "Most Starred GitHub Repositories - Rankings by Stars, Forks & Watchers",
    description: "Updated rankings of the most starred GitHub repositories. Compare stars, forks & watchers across top open source projects.",
    url: "https://tiagodanin.com/rankings/github",
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

export default function GitHubRankingsPage() {
  const githubData = queryCollection('github');
  return <GitHubRankingsClient githubData={[...githubData]} />;
}
