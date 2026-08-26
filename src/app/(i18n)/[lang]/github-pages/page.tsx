import type { Metadata } from "next";
import GitHubPagesSection from "@/components/sections/GitHubPages";
import { queryCollection } from 'nextjs-studio/server';
import { t } from "@lingui/core/macro";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphLocale, pageUrl } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/github-pages'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`GitHub Pages`,
    description: t(
      i18n
    )`Browse all GitHub Pages projects and live demos by Tiago Danin. Interactive demos, tools, and open source project showcases.`,
    keywords: ["GitHub Pages", "live demos", "projects", "interactive demos", "open source"],
    alternates: localeAlternates(locale, '/github-pages'),
    openGraph: {
      title: t(i18n)`GitHub Pages Projects - Tiago Danin`,
      description: t(i18n)`Interactive demos, tools, and open source project showcases hosted on GitHub Pages.`,
      url: pageUrl(locale, '/github-pages'),
      type: "website",
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: t(i18n)`GitHub Pages Projects - Tiago Danin`,
      description: t(i18n)`Interactive demos and tools hosted on GitHub Pages.`,
    },
  };
}

export default async function Index({ params }: PageProps<'/[lang]/github-pages'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

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
    "name": t(i18n)`GitHub Pages sites by Tiago Danin`,
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
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`GitHub Pages`, "item": pageUrl(locale, '/github-pages') },
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
