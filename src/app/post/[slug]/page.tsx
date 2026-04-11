import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowLeft, Globe, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GiscusComments } from '@/components/ui/GiscusComments';
import { CallToAction } from '@/components/sections/CallToAction';
import { getPostBySlug, postHasLocale } from '@/lib/mdx';
import { renderMdx } from '@/lib/render-mdx';
import { toISODate, formatDate } from '@/utils/parse';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'en');

  if (!post) {
    return {
      title: 'Post not found',
      robots: { index: false, follow: true },
    };
  }

  const truncatedDescription = post.description.length > 160
    ? post.description.substring(0, 157) + '...'
    : post.description;

  const coverUrl = post.cover
    ? `https://tiagodanin.com${post.cover}`
    : undefined;

  const keywords = post.tags.length > 0
    ? [...post.tags, 'Tiago Danin', 'blog']
    : ['blog', 'software development', 'technology'];

  return {
    title: post.title,
    description: truncatedDescription,
    keywords,
    alternates: {
      canonical: `https://tiagodanin.com/post/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: truncatedDescription,
      url: `https://tiagodanin.com/post/${post.slug}`,
      type: 'article',
      publishedTime: toISODate(post.date),
      authors: ['https://tiagodanin.com/about'],
      locale: 'en_US',
      siteName: 'Tiago Danin',
      ...(coverUrl && { images: [{ url: coverUrl, alt: post.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: truncatedDescription,
      creator: '@tiagodanin',
      site: '@tiagodanin',
      ...(coverUrl && { images: [coverUrl] }),
    },
  };
}

export function generateStaticParams() {
  const posts = queryCollection('posts').where({ lang: 'en' });
  return posts.map((post: { slug: string; }) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'en');

  if (!post) {
    notFound();
  }

  const hasPt = postHasLocale(slug, 'pt');
  const mdxContent = await renderMdx(post.body);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://tiagodanin.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://tiagodanin.com/post/${post.slug}` },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": toISODate(post.date),
    "url": `https://tiagodanin.com/post/${post.slug}`,
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "author": { "@type": "Person", "name": "Tiago Danin", "url": "https://tiagodanin.com" },
    "publisher": { "@type": "Person", "name": "Tiago Danin" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container mx-auto py-32 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back to blog */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Header */}
          <header className="mb-8">
            <time className="text-sm text-muted-foreground">{formatDate(post.date)}</time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {post.description}
            </p>

            {/* Language toggle */}
            <div className="mt-4 flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                EN
              </Badge>
              {hasPt && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/post/${post.slug}/pt`} className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    PT
                  </Link>
                </Button>
              )}
            </div>
          </header>

          {/* MDX Content */}
          <div className="prose prose-zinc max-w-none">
            {mdxContent}
          </div>

          {/* Giscus Comments */}
          <GiscusComments term={`${post.slug}-en`} />

          {/* LLM Translation Notice */}
          <div className="mt-8 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground">
              This article was translated from Portuguese with the help of an LLM.
              The original version may contain nuances not fully captured in this translation.
            </p>
          </div>

          {/* Original article link */}
          {post.originalUrl && (
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={post.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Read original article
                </a>
              </Button>
            </div>
          )}
        </div>
      </article>

      <CallToAction />
    </>
  );
}
