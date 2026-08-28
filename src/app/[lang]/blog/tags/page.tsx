import type { Metadata } from "next";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { ArrowLeft, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TagCloud, type TagCloudEntry } from "@/components/ui/TagCloud";
import { buildBlogTagIndex, sortedTags } from "@/lib/tags";
import { localePath } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphDefaults, pageUrl } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/blog/tags'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Blog Topics - Browse Articles by Tag`,
    description: t(i18n)`Every topic written about on the blog, with the number of articles under each. Mobile development, Flutter, React Native, Android, AI and more.`,
    alternates: localeAlternates(locale, '/blog/tags'),
    openGraph: {
      title: t(i18n)`Blog Topics - Tiago Danin`,
      description: t(i18n)`Browse the blog by topic.`,
      url: pageUrl(locale, '/blog/tags'),
      type: "website",
      ...openGraphDefaults(locale),
    },
  };
}

export default async function BlogTagsPage({ params }: PageProps<'/[lang]/blog/tags'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const entries = sortedTags(buildBlogTagIndex(locale));

  const tags: TagCloudEntry[] = entries.map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    total: entry.total,
    counts: entry.counts,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t(i18n)`Blog Topics`,
    "url": pageUrl(locale, '/blog/tags'),
    "description": t(i18n)`Browse the blog by topic.`,
    "isPartOf": {
      "@type": "Blog",
      "name": "Tiago Danin",
      "url": pageUrl(locale, '/blog'),
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": tags.length,
      "itemListElement": tags.map((tag, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": tag.name,
        "url": pageUrl(locale, `/blog/tags/${tag.slug}`),
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={localePath(locale, '/blog')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <Trans>Back to Blog</Trans>
              </Link>
            </Button>
          </div>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tag className="h-6 w-6" aria-hidden="true" />
              <h1 className="text-3xl font-bold tracking-tight"><Trans>Blog Topics</Trans></h1>
            </div>
            <p className="text-muted-foreground">
              <Trans>Browse the blog by topic</Trans>
            </p>
            {/* A topic that spans more than articles has more waiting for it on
                the cross-site index. */}
            <p className="mt-2 text-sm text-muted-foreground">
              <Trans>
                Looking for talks and projects too?{' '}
                <Link href={localePath(locale, '/tags')} className="underline hover:text-foreground">
                  Browse all tags
                </Link>
                .
              </Trans>
            </p>
          </div>

          <TagCloud tags={tags} basePath={localePath(locale, '/blog/tags')} />
        </div>
      </div>
    </>
  );
}
