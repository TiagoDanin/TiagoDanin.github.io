import type { Metadata } from "next";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { queryCollection } from 'nextjs-studio/server';
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagFilter } from "@/components/ui/TagFilter";
import { toISODate } from '@/utils/parse';
import { contentLang, DEFAULT_LOCALE, entryPath, HTML_LANG } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphLocale, ORIGIN, pageUrl } from "@/lib/i18n/seo";

const POSTS_PER_PAGE = 10;

/** Videos live on /talks; the blog lists written pieces only. */
function listPosts(lang: string) {
  return [...queryCollection('posts').where({ lang })]
    .filter((post) => !((post.tags as string[]) || []).includes('Video'))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/blog'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);
  const posts = listPosts(contentLang(locale));

  const alternates = localeAlternates(locale, '/blog');

  return {
    title: t(i18n)`Blog - Flutter, AI & Cybersecurity`,
    description: t(
      i18n
    )`Technical articles on mobile development, AI agents, and cybersecurity. Tutorials on Flutter, React Native, Node.js, and more. Free, in-depth guides for developers.`,
    alternates: {
      ...alternates,
      types: {
        ...markdownAlternate('/blog'),
        // Declared inside the existing types object: spreading the Markdown
        // helper next to a later `types` key would drop it silently.
        'application/rss+xml': [{ url: '/rss/blog.xml', title: 'Blog RSS Feed' }],
      },
    },
    openGraph: {
      title: t(i18n)`Blog - Technical Articles on Flutter, AI & Cybersecurity`,
      description: t(
        i18n
      )`In-depth tutorials and articles on mobile development, AI agents, cybersecurity, and open source. Free guides for developers.`,
      url: pageUrl(locale, '/blog'),
      type: "website",
      siteName: "Tiago Danin",
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: t(i18n)`Dev Blog - Flutter, AI & Security | Tiago Danin`,
      description: t(
        i18n
      )`Free technical articles on mobile development, AI agents, and cybersecurity. Tutorials and in-depth guides.`,
      creator: "@tiagodanin",
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": t(i18n)`Blog: Articles on Development & AI`,
          "description": t(i18n)`Blog about software development, mobile, AI and security`,
          "url": pageUrl(locale, '/blog'),
          "inLanguage": HTML_LANG[locale],
          "author": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/')
          },
          "blogPost": posts.map((post) => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "datePublished": toISODate(post.date),
            // Posts have not migrated, so their locale is still a trailing
            // segment: entryPath is the only thing that knows that.
            "url": `${ORIGIN}${entryPath(locale, 'post', String(post.slug))}/`,
            "inLanguage": HTML_LANG[locale],
            "isAccessibleForFree": true,
            "author": { "@type": "Person", "name": "Tiago Danin" }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": pageUrl(locale, '/') },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": pageUrl(locale, '/blog') }
          ]
        }
      ])
    }
  };
}

const Blog = async ({ params }: PageProps<'/[lang]/blog'>) => {
  const locale = resolveLocale((await params).lang);
  initI18n(locale);

  const posts = listPosts(contentLang(locale));

  // Pagination exists only for the default locale: /blog/[page] has not been
  // migrated, so any other language lists everything on one page, which is what
  // it did before the move.
  const paginated = locale === DEFAULT_LOCALE;
  const totalPages = paginated ? Math.ceil(posts.length / POSTS_PER_PAGE) : 1;
  const currentPosts = paginated ? posts.slice(0, POSTS_PER_PAGE) : posts;
  const hasNextPage = totalPages > 1;

  return (
    <>
      {hasNextPage && <link rel="next" href="https://tiagodanin.com/blog/2/" />}
      <div className="container mx-auto py-32">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="mt-4 text-muted-foreground">
            <Trans>Thoughts, insights, and ideas about technology and development</Trans>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <Trans>{posts.length} articles</Trans>
          </p>
          <TagFilter posts={posts} />
        </div>

        <div className="max-w-2xl mx-auto space-y-16">
          {currentPosts.map((post, index) => (
            <ArticleCard key={index} post={post} locale={contentLang(locale) as 'en' | 'pt'} />
          ))}
        </div>

        {hasNextPage && (
          <div className="mt-16 flex justify-center gap-2">
            <Button variant="outline" disabled>
              <span className="flex items-center"><Trans>Previous</Trans></span>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                <Trans>Page 1 of {totalPages}</Trans>
              </span>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog/2">
                <Trans>Next</Trans>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
