import type { Metadata } from 'next';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';
import GitHubRankingsClient from '@/components/sections/GitHubRankingsClient';
import { HTML_LANG } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, markdownAlternate, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from '@/lib/i18n/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/rankings/github'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`GitHub Stars Ranking - Most Starred Repos`,
    description: t(
      i18n
    )`See the most starred GitHub repositories ranked by stars, forks & watchers. Updated rankings of top open source projects. Compare repos and discover trending projects.`,
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
      ...localeAlternates(locale, '/rankings/github'),
      types: markdownAlternate('/rankings/github'),
    },
    openGraph: {
      title: t(i18n)`Most Starred GitHub Repositories - Rankings by Stars, Forks & Watchers`,
      description: t(
        i18n
      )`Updated rankings of the most starred GitHub repositories. Compare stars, forks & watchers across top open source projects.`,
      url: pageUrl(locale, '/rankings/github'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`Most Starred GitHub Repos - All Time Rankings`,
      description: t(
        i18n
      )`See top GitHub repositories ranked by stars, forks & engagement. Updated rankings of the best open source projects.`,
      site: "@tiagodanin",
    },
  };
}

interface GithubRepoEntry {
  name: string;
  description?: string;
  stargazers_count: number;
  forks_count?: number;
  language?: string;
  html_url?: string;
}

export default async function GitHubRankingsPage({ params }: PageProps<'/[lang]/rankings/github'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

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
    "name": t(i18n)`Most starred GitHub repositories by Tiago Danin`,
    "description": t(i18n)`Open source repositories by Tiago Danin, ranked by GitHub stars.`,
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
        "author": { "@type": "Person", "name": "Tiago Danin", "url": pageUrl(locale, '/') },
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
    "name": t(i18n)`GitHub Rankings`,
    "description": t(i18n)`Rankings of open source repositories by Tiago Danin, by GitHub stars.`,
    "url": pageUrl(locale, '/rankings/github'),
    "inLanguage": HTML_LANG[locale],
    "isPartOf": { "@type": "WebSite", "name": "Tiago Danin", "url": ORIGIN + '/' },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`GitHub Rankings`, "item": pageUrl(locale, '/rankings/github') },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <GitHubRankingsClient githubData={[...githubData]} locale={locale} />
    </>
  );
}
