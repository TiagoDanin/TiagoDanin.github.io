import type { Metadata } from 'next';
import Link from "next/link";
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagEntryList } from "@/components/ui/TagEntryList";
import { titleToSlug, toISODate, getRandomColorWithDarkMode } from '@/utils/parse';
import { allTagSlugs, buildTagIndex, isTagIndexable, prettifyTagSlug, type TagEntry, type TaggedItem } from '@/lib/tags';
import { contentLang, localePath, type Locale } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, openGraphDefaults, pageUrl } from '@/lib/i18n/seo';

export const dynamicParams = false;

export async function generateStaticParams() {
  // One list for every locale on purpose: see `allTagSlugs`. A tag page that
  // exists in English and 404s in Portuguese would break its own hreflang.
  return allTagSlugs('all').map((tag) => ({ tag }));
}

function entryFor(locale: Locale, slug: string): { entry?: TagEntry; name: string } {
  const entry = buildTagIndex(locale).get(slug);
  return { entry, name: entry?.name ?? prettifyTagSlug(slug) };
}

function itemsOf(entry: TagEntry | undefined, source: TaggedItem['source']): TaggedItem[] {
  return (entry?.items ?? []).filter((item) => item.source === source);
}

/**
 * The other tags carried by the same content, most shared first.
 *
 * This row used to be every tag on the site, which was fine at forty and is not
 * at four hundred. Co-occurrence keeps it a navigation aid instead of a dump.
 */
function relatedTags(entry: TagEntry | undefined, slug: string): Array<{ slug: string; name: string }> {
  const counts = new Map<string, { name: string; count: number }>();

  for (const item of entry?.items ?? []) {
    for (const tag of item.tags) {
      const tagSlug = titleToSlug(tag);
      if (!tagSlug || tagSlug === slug) continue;
      const current = counts.get(tagSlug);
      if (current) current.count += 1;
      else counts.set(tagSlug, { name: tag, count: 1 });
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].name.localeCompare(b[1].name))
    .slice(0, 18)
    .map(([tagSlug, value]) => ({ slug: tagSlug, name: value.name }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/tags/[tag]'>): Promise<Metadata> {
  const { lang, tag: tagSlug } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const { entry, name } = entryFor(locale, tagSlug);

  return {
    title: t(i18n)`${name} - Articles, Talks & Projects`,
    description: t(i18n)`Everything about ${name} by Tiago Danin: articles, talks, open source projects and career milestones.`,
    alternates: localeAlternates(locale, `/tags/${tagSlug}`),
    // A tag with one or two items is a page with one or two links on it.
    // `follow` keeps it crawlable and keeps passing equity to what it lists.
    robots: isTagIndexable(entry) ? undefined : { index: false, follow: true },
    openGraph: {
      title: t(i18n)`${name} - Articles, Talks & Projects | Tiago Danin`,
      description: t(i18n)`Everything about ${name}: articles, talks, projects and milestones.`,
      url: pageUrl(locale, `/tags/${tagSlug}`),
      type: "website",
      ...openGraphDefaults(locale),
    },
  };
}

export default async function TagPage({ params }: PageProps<'/[lang]/tags/[tag]'>) {
  const { lang, tag: tagSlug } = await params;
  const locale = resolveLocale(lang);
  const i18n = initI18n(locale);

  const { entry, name } = entryFor(locale, tagSlug);

  // Articles keep `ArticleCard`, which needs the cover and the original URL the
  // tag index does not carry.
  const taggedPosts = [...queryCollection('posts').where({ lang: contentLang(locale) })]
    .filter((post) => ((post.tags as string[]) || []).some((tag) => titleToSlug(tag) === tagSlug))
    .sort((a, b) => b.date.localeCompare(a.date));

  const taggedTalks = itemsOf(entry, 'talk');
  const taggedProjects = itemsOf(entry, 'project');
  const taggedTimeline = itemsOf(entry, 'timeline');
  const related = relatedTags(entry, tagSlug);

  const platformLabels: Record<string, string> = {
    npm: t(i18n)`NPM Package`,
    pypi: t(i18n)`PyPI Package`,
    luarocks: t(i18n)`LuaRocks Module`,
    atom: t(i18n)`Atom Package`,
    github: t(i18n)`Open Source Project`,
    aur: t(i18n)`AUR Package`,
    googleplay: t(i18n)`Android App`,
    windows: t(i18n)`Windows App`,
    private: t(i18n)`Project`,
    offline: t(i18n)`Project`,
  };

  const total = taggedPosts.length + taggedTalks.length + taggedProjects.length + taggedTimeline.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t(i18n)`${name} - Articles, Talks & Projects`,
    "url": pageUrl(locale, `/tags/${tagSlug}`),
    "description": t(i18n)`Everything about ${name}: articles, talks, projects and milestones.`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": total,
      "itemListElement": [
        ...taggedPosts.map((post, i) => ({
          "@type": "BlogPosting",
          "position": i + 1,
          "headline": post.title,
          "description": post.description,
          "datePublished": toISODate(post.date),
          "url": pageUrl(locale, `/post/${post.slug}`),
          "author": { "@type": "Person", "name": "Tiago Danin" },
        })),
        ...taggedTalks.map((talk, i) => ({
          "@type": "Event",
          "position": taggedPosts.length + i + 1,
          "name": talk.title,
          "description": talk.description,
          "startDate": toISODate(talk.date),
          "url": pageUrl(locale, talk.path),
          "performer": { "@type": "Person", "name": "Tiago Danin" },
        })),
        ...taggedProjects.map((project, i) => ({
          "@type": "SoftwareSourceCode",
          "position": taggedPosts.length + taggedTalks.length + i + 1,
          "name": project.title,
          "description": project.description,
          "url": pageUrl(locale, project.path),
          "author": { "@type": "Person", "name": "Tiago Danin" },
        })),
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={localePath(locale, '/tags')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <Trans>All Tags</Trans>
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="mt-2 text-muted-foreground">
              {taggedPosts.length > 0 && (
                <span>
                  {taggedPosts.length === 1
                    ? <Trans>{taggedPosts.length} article</Trans>
                    : <Trans>{taggedPosts.length} articles</Trans>}
                </span>
              )}
              {taggedTalks.length > 0 && (
                <span>
                  {taggedPosts.length > 0 && <> &middot; </>}
                  {taggedTalks.length === 1
                    ? <Trans>{taggedTalks.length} talk</Trans>
                    : <Trans>{taggedTalks.length} talks</Trans>}
                </span>
              )}
              {taggedProjects.length > 0 && (
                <span>
                  {(taggedPosts.length > 0 || taggedTalks.length > 0) && <> &middot; </>}
                  {taggedProjects.length === 1
                    ? <Trans>{taggedProjects.length} project</Trans>
                    : <Trans>{taggedProjects.length} projects</Trans>}
                </span>
              )}
              {taggedTimeline.length > 0 && (
                <span>
                  {(taggedPosts.length > 0 || taggedTalks.length > 0 || taggedProjects.length > 0) && <> &middot; </>}
                  {taggedTimeline.length === 1
                    ? <Trans>{taggedTimeline.length} milestone</Trans>
                    : <Trans>{taggedTimeline.length} milestones</Trans>}
                </span>
              )}
            </p>

            {related.length > 0 && (
              <div className="mt-6">
                <h2 className="sr-only"><Trans>Related tags</Trans></h2>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {related.map((tag) => (
                    <Link key={tag.slug} href={localePath(locale, `/tags/${tag.slug}`)}>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${getRandomColorWithDarkMode(tag.name)}`}
                      >
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {taggedPosts.length > 0 && (
          <section className="max-w-2xl mx-auto mb-16">
            <h2 className="text-xl font-semibold tracking-tight mb-8"><Trans>Articles</Trans></h2>
            <div className="space-y-16">
              {taggedPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          </section>
        )}

        {taggedTalks.length > 0 && (
          <section className="max-w-2xl mx-auto mb-16">
            <h2 className="text-xl font-semibold tracking-tight mb-8"><Trans>Talks</Trans></h2>
            <TagEntryList
              label={t(i18n)`Talks tagged ${name}`}
              linkLabel={(title) => t(i18n)`View ${title}`}
              items={taggedTalks.map((talk) => ({
                key: talk.key,
                title: talk.title,
                description: talk.description,
                href: talk.href,
                date: talk.date,
                badge: talk.meta || undefined,
              }))}
            />
          </section>
        )}

        {taggedProjects.length > 0 && (
          <section className="max-w-2xl mx-auto mb-16">
            <h2 className="text-xl font-semibold tracking-tight mb-8"><Trans>Projects</Trans></h2>
            <TagEntryList
              label={t(i18n)`Projects tagged ${name}`}
              linkLabel={(title) => t(i18n)`View ${title}`}
              items={taggedProjects.map((project) => ({
                key: project.key,
                title: project.title,
                description: project.description,
                href: project.href,
                badge: platformLabels[project.meta ?? ''] ?? project.meta,
              }))}
            />
          </section>
        )}

        {taggedTimeline.length > 0 && (
          <section className="max-w-2xl mx-auto mb-16">
            <h2 className="text-xl font-semibold tracking-tight mb-8"><Trans>Milestones</Trans></h2>
            <TagEntryList
              label={t(i18n)`Milestones tagged ${name}`}
              linkLabel={(title) => t(i18n)`View ${title}`}
              items={taggedTimeline.map((event) => ({
                key: event.key,
                title: event.title,
                description: event.description,
                href: event.href,
                date: event.date,
              }))}
            />
          </section>
        )}

        {total === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <p className="text-muted-foreground text-lg"><Trans>No content found with this tag.</Trans></p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href={localePath(locale, '/tags')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                <Trans>Back to All Tags</Trans>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
