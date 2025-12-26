import type { Metadata } from 'next';
import GitHubRankingsClient from './GitHubRankingsClient';

export const metadata: Metadata = {
  title: "Top GitHub Repos: Real-Time Rankings & Star Stats",
  description: "Explore live GitHub rankings showcasing top repositories by stars, forks & watchers. Real-time analytics powered by GitHub API for developers & recruiters.",
  keywords: [
    "GitHub rankings",
    "GitHub repository rankings",
    "top GitHub repositories",
    "GitHub stars",
    "real-time GitHub statistics",
    "live GitHub API",
    "GitHub project rankings by stars",
    "open source projects",
    "trending GitHub repositories",
    "GitHub portfolio showcase",
    "open source contributions",
    "developer portfolio projects",
    "GitHub stars leaderboard",
    "discover GitHub projects",
    "GitHub repository analytics",
    "most popular GitHub repos"
  ],
  alternates: {
    canonical: 'https://tiagodanin.com/rankings/github',
  },
  openGraph: {
    title: "Top GitHub Repositories - Real-Time Rankings & Analytics",
    description: "Explore live-ranked GitHub projects with real-time stars, forks & watchers. Discover prolific open source contributions.",
    url: "https://tiagodanin.com/rankings/github",
    type: "website",
    siteName: "Tiago Danin",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Top GitHub Repos - Live Rankings & Star Stats",
    description: "Real-time GitHub repository analytics. Top projects by stars, forks & engagement.",
    creator: "@tiagodanin",
    site: "@tiagodanin",
  },
};

export default function GitHubRankingsPage() {
  return <GitHubRankingsClient />;
}
