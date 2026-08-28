import type { Metadata } from "next";
import Link from "next/link";
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagFilter } from "@/components/ui/TagFilter";
import { contentLang, HTML_LANG, localePath } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, openGraphDefaults, pageUrl } from '@/lib/i18n/seo';

const POSTS_PER_PAGE = 10;

/** Videos live on /talks; the blog lists written pieces only. */
function listPosts(lang: string) {
  return [...queryCollection('posts').where({ lang })].filter(
    (p) => !((p.tags as string[]) || []).includes('Video')
  );
}

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = resolveLocale(params.lang);
  const posts = listPosts(contentLang(locale));
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({ page: i.toString() });
  }
  return pages;
}

export async function generateMetadata({ params }: PageProps<'/[lang]/blog/[page]'>): Promise<Metadata> {
  const { lang, page } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const pageNumber = Number(page) || 1;

  return {
    title: t(i18n)`Blog - Page ${pageNumber} - Flutter, AI & Security`,
    description: t(i18n)`Page ${pageNumber} of technical articles on Flutter, React Native, AI agents, and cybersecurity. Free in-depth tutorials for developers.`,
    alternates: localeAlternates(locale, `/blog/${pageNumber}`),
    openGraph: {
      title: t(i18n)`Blog - Page ${pageNumber} - Tiago Danin`,
      description: t(i18n)`Articles about software development, mobile apps, and technology.`,
      url: pageUrl(locale, `/blog/${pageNumber}`),
      type: "website",
      ...openGraphDefaults(locale),
    },
  };
}

const BlogPage = async ({ params }: PageProps<'/[lang]/blog/[page]'>) => {
  const { lang, page } = await params;
  const locale = resolveLocale(lang);
  const i18n = initI18n(locale);

  const posts = listPosts(contentLang(locale)).sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPage = Number(page) || 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  const prevUrl = currentPage === 2
    ? pageUrl(locale, '/blog')
    : pageUrl(locale, `/blog/${currentPage - 1}`);

  // Describes this page of the archive, not the archive as a whole: the item
  // list carries only the posts actually rendered here.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t(i18n)`Blog, page ${currentPage} of ${totalPages}`,
    "url": pageUrl(locale, `/blog/${currentPage}`),
    "inLanguage": HTML_LANG[locale],
    "isPartOf": { "@type": "Blog", "name": "Tiago Danin", "url": pageUrl(locale, '/blog') },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": currentPosts.length,
      "itemListElement": currentPosts.map((post, i) => ({
        "@type": "ListItem",
        "position": startIndex + i + 1,
        "name": post.title,
        "url": pageUrl(locale, `/post/${post.slug}`),
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`Blog`, "item": pageUrl(locale, '/blog') },
      { "@type": "ListItem", "position": 3, "name": t(i18n)`Page ${currentPage}`, "item": pageUrl(locale, `/blog/${currentPage}`) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {currentPage > 1 && <link rel="prev" href={prevUrl} />}
      {currentPage < totalPages && <link rel="next" href={pageUrl(locale, `/blog/${currentPage + 1}`)} />}
    <div className="container mx-auto py-32">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight"><Trans>Blog</Trans></h1>
        <p className="mt-4 text-muted-foreground">
          <Trans>Thoughts, insights, and ideas about technology and development</Trans>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <Trans>{posts.length} articles</Trans>
        </p>
        <TagFilter posts={posts} basePath={localePath(locale, '/tags')} />
      </div>

      <div className="max-w-2xl mx-auto space-y-16">
        {currentPosts.map((post, index) => (
          <ArticleCard
            key={index}
            post={post}
            locale={locale}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={currentPage === 2 ? localePath(locale, "/blog") : localePath(locale, `/blog/${currentPage - 1}`)}>
                <ChevronLeft className="h-4 w-4" />
                <Trans>Previous</Trans>
              </Link>
            ) : (
              <span className="flex items-center">
                <ChevronLeft className="h-4 w-4" />
                <Trans>Previous</Trans>
              </span>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              <Trans>Page {currentPage} of {totalPages}</Trans>
            </span>
          </div>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={localePath(locale, `/blog/${currentPage + 1}`)}>
                <Trans>Next</Trans>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="flex items-center">
                <Trans>Next</Trans>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
    </>
  );
};

export default BlogPage;
