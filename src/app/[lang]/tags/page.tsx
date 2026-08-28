import type { Metadata } from "next";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { Tag } from "lucide-react";

import { TagCloud, type TagCloudEntry } from "@/components/ui/TagCloud";
import { buildTagIndex, sortedTags } from "@/lib/tags";
import { localePath } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphDefaults, pageUrl } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/tags'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Browse by Tags - Articles, Talks & Projects`,
    description: t(
      i18n
    )`Every topic on tiagodanin.com in one index: articles, talks, open source projects and career milestones, grouped by tag. Flutter, React Native, Android, AI, DevOps, Telegram and more.`,
    keywords: ["tags", "topics", "Flutter", "React Native", "Android", "AI", "DevOps", "JavaScript", "mobile development"],
    alternates: localeAlternates(locale, '/tags'),
    openGraph: {
      title: t(i18n)`Browse by Tags - Tiago Danin`,
      description: t(i18n)`Every topic on the site in one index: articles, talks, projects and milestones.`,
      url: pageUrl(locale, '/tags'),
      type: "website",
      ...openGraphDefaults(locale),
    },
  };
}

export default async function TagsPage({ params }: PageProps<'/[lang]/tags'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const entries = sortedTags(buildTagIndex(locale));

  const tags: TagCloudEntry[] = entries.map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    total: entry.total,
    counts: entry.counts,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t(i18n)`Browse by Tags`,
    "url": pageUrl(locale, '/tags'),
    "description": t(i18n)`Every topic on the site in one index: articles, talks, projects and milestones.`,
    "author": {
      "@type": "Person",
      "name": "Tiago Danin",
      "url": pageUrl(locale, '/'),
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": tags.length,
      "itemListElement": tags.slice(0, 50).map((tag, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": tag.name,
        "url": pageUrl(locale, `/tags/${tag.slug}`),
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tag className="h-6 w-6" aria-hidden="true" />
              <h1 className="text-3xl font-bold tracking-tight"><Trans>Tags</Trans></h1>
            </div>
            <p className="text-muted-foreground">
              <Trans>Browse articles, talks, projects and milestones by topic</Trans>
            </p>
          </div>

          <TagCloud tags={tags} basePath={localePath(locale, '/tags')} showSourceFilter />
        </div>
      </div>
    </>
  );
}
