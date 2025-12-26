import type { Metadata } from 'next';
import GitHubRankingsClient from './GitHubRankingsClient';

export const metadata: Metadata = {
  title: "GitHub Repository Rankings",
  description: "Top 10 most starred GitHub repositories by Tiago Danin. Real-time statistics and rankings from the GitHub API.",
  keywords: ["GitHub rankings", "repository statistics", "GitHub stars", "open source", "top repositories"],
  alternates: {
    canonical: 'https://tiagodanin.com/rankings/github',
  },
  openGraph: {
    title: "GitHub Repository Rankings - Tiago Danin",
    description: "Top 10 most starred repositories with real-time GitHub API statistics.",
    url: "https://tiagodanin.com/rankings/github",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "GitHub Repository Rankings - Tiago Danin",
    description: "Top 10 most starred repositories with live statistics.",
  },
};

export default function GitHubRankingsPage() {
  return <GitHubRankingsClient />;
}
