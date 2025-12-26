import type { Metadata } from 'next';
import WebViewClient from './WebViewClient';

export const metadata: Metadata = {
  title: "WebView Inspector",
  description: "Browser environment exploration tool for bug bounty research. Inspect window properties, execute JavaScript, and test security POCs.",
  keywords: ["WebView inspector", "bug bounty", "security testing", "JavaScript debugging", "browser API", "POC testing"],
  alternates: {
    canonical: 'https://tiagodanin.com/webview',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "WebView Inspector - Bug Bounty Research Tool",
    description: "Explore browser environments and test security POCs. Property inspection and code execution.",
    url: "https://tiagodanin.com/webview",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "WebView Inspector - Bug Bounty Tool",
    description: "Browser environment exploration for security research.",
  },
};

export default function WebViewPage() {
  return <WebViewClient />;
}
