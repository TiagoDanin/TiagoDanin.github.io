import type { Metadata } from 'next';
import { t } from "@lingui/core/macro";
import WebViewClient from '@/components/sections/WebViewClient';
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphDefaults, pageUrl, twitterDefaults } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/webview'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`WebView Inspector`,
    description: t(i18n)`Browser environment exploration tool for bug bounty research. Inspect window properties, execute JavaScript, and test security POCs.`,
    keywords: ["WebView inspector", "bug bounty", "security testing", "JavaScript debugging", "browser API", "POC testing"],
    alternates: localeAlternates(locale, '/webview'),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: t(i18n)`WebView Inspector - Bug Bounty Research Tool`,
      description: t(i18n)`Explore browser environments and test security POCs. Property inspection and code execution.`,
      url: pageUrl(locale, '/webview'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`WebView Inspector - Bug Bounty Tool`,
      description: t(i18n)`Browser environment exploration for security research.`,
    },
  };
}

export default async function WebViewPage({ params }: PageProps<'/[lang]/webview'>) {
  const locale = resolveLocale((await params).lang);
  initI18n(locale);
  return <WebViewClient />;
}
