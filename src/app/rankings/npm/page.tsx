import type { Metadata } from 'next';
import NPMRankingsClient from './NPMRankingsClient';

export const metadata: Metadata = {
  title: "NPM Package Rankings",
  description: "Top 10 most downloaded NPM packages by Tiago Danin. Real-time download statistics from the NPM registry.",
  keywords: ["NPM rankings", "package statistics", "NPM downloads", "npm packages", "JavaScript packages"],
  alternates: {
    canonical: 'https://tiagodanin.com/rankings/npm',
  },
  openGraph: {
    title: "NPM Package Rankings - Tiago Danin",
    description: "Top 10 most downloaded packages with real-time NPM statistics.",
    url: "https://tiagodanin.com/rankings/npm",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "NPM Package Rankings - Tiago Danin",
    description: "Top 10 most downloaded packages with live statistics.",
  },
};

export default function NPMRankingsPage() {
  return <NPMRankingsClient />;
}
