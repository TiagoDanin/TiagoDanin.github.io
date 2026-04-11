import type { Metadata } from 'next';
import { queryCollection } from 'nextjs-studio/server';
import NPMRankingsClient from './NPMRankingsClient';

export const metadata: Metadata = {
  title: "NPM Package Rankings - Most Downloaded Node.js Packages",
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
  alternates: {
    canonical: 'https://tiagodanin.com/rankings/npm',
  },
  openGraph: {
    title: "Most Downloaded NPM Packages - Rankings & Statistics",
    description: "Compare the most downloaded NPM packages with real-time stats. Downloads, versions & dependency insights for JavaScript developers.",
    url: "https://tiagodanin.com/rankings/npm",
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

export default function NPMRankingsPage() {
  const npmData = queryCollection('npm');
  return <NPMRankingsClient npmData={[...npmData]} />;
}
