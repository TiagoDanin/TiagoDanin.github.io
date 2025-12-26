import type { Metadata } from 'next';
import NPMRankingsClient from './NPMRankingsClient';

export const metadata: Metadata = {
  title: "Top NPM Packages - Real-time Download Rankings",
  description: "Discover top 10 NPM packages with live download rankings. Real-time statistics, version tracking & dependency insights. See what developers use most.",
  keywords: [
    "NPM rankings",
    "NPM packages download",
    "most downloaded packages",
    "JavaScript packages",
    "Node.js packages",
    "npm statistics",
    "package downloads",
    "real-time package rankings",
    "NPM package statistics 2025",
    "popular JavaScript packages",
    "trending npm packages",
    "open source package rankings",
    "package maintenance metrics",
    "npm package downloads tracker",
    "JavaScript developer portfolio"
  ],
  alternates: {
    canonical: 'https://tiagodanin.com/rankings/npm',
  },
  openGraph: {
    title: "Top NPM Packages 2025 - Real-time Download Rankings",
    description: "Discover top 10 NPM packages with live statistics. Real-time downloads, versions & dependencies. See what JavaScript developers use most.",
    url: "https://tiagodanin.com/rankings/npm",
    type: "website",
    siteName: "Tiago Danin - Developer Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: 'summary_large_image',
    title: "See the Top 10 NPM Packages Developers Love Most",
    description: "Real-time download rankings, stats & insights. Track the JavaScript packages shaping the ecosystem.",
    creator: "@tiagodanin",
    site: "@tiagodanin",
  },
};

export default function NPMRankingsPage() {
  return <NPMRankingsClient />;
}
