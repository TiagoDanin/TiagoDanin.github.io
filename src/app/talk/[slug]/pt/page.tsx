import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryCollection } from 'nextjs-studio/server';
import { ArrowLeft, Globe, Mic, Video, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GiscusComments } from '@/components/ui/GiscusComments';
import { CallToAction } from '@/components/sections/CallToAction';
import { getTalkBySlug, talkHasLocale } from '@/lib/talks';
import { renderMdx } from '@/lib/render-mdx';
import { toISODate, formatDate, getRandomColorWithDarkMode } from '@/utils/parse';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const talk = getTalkBySlug(slug, 'pt');

  if (!talk) {
    return {
      title: 'Talk nao encontrada',
      robots: { index: false, follow: true },
    };
  }

  const truncatedDescription = talk.description.length > 160
    ? talk.description.substring(0, 157) + '...'
    : talk.description;

  return {
    title: `${talk.title} - ${talk.event}`,
    description: truncatedDescription,
    alternates: {
      canonical: `https://tiagodanin.com/talk/${slug}/pt`,
      languages: {
        'en-US': `https://tiagodanin.com/talk/${slug}`,
        'pt-BR': `https://tiagodanin.com/talk/${slug}/pt`,
        'x-default': `https://tiagodanin.com/talk/${slug}`,
      },
    },
    openGraph: {
      title: `${talk.title} - ${talk.event}`,
      description: truncatedDescription,
      type: talk.youtubeUrl ? 'video.other' : 'article',
      url: `https://tiagodanin.com/talk/${slug}/pt`,
      locale: 'pt_BR',
      siteName: 'Tiago Danin',
      ...(talk.youtubeUrl && {
        video: [{
          url: talk.youtubeUrl,
          type: 'text/html',
          width: 1280,
          height: 720,
        }]
      }),
    },
    twitter: {
      card: talk.youtubeUrl ? 'player' : 'summary_large_image',
      title: talk.title,
      description: truncatedDescription,
      creator: '@tiagodanin',
      site: '@tiagodanin',
    },
  };
}

export function generateStaticParams() {
  const talks = queryCollection('talks').where({ lang: 'en' });
  return talks
    .filter((talk: { slug: string }) => talkHasLocale(talk.slug, 'pt'))
    .map((talk: { slug: string }) => ({
      slug: talk.slug,
    }));
}

export default async function TalkPtPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const talk = getTalkBySlug(slug, 'pt');

  if (!talk) {
    notFound();
  }

  const mdxContent = await renderMdx(talk.body);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com" },
      { "@type": "ListItem", "position": 2, "name": "Talks", "item": "https://tiagodanin.com/talks" },
      { "@type": "ListItem", "position": 3, "name": talk.title, "item": `https://tiagodanin.com/talk/${slug}/pt` },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": talk.title,
    "description": talk.description,
    "startDate": toISODate(talk.date),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": talk.youtubeUrl ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    "location": talk.youtubeUrl ? {
      "@type": "VirtualLocation",
      "url": talk.youtubeUrl
    } : {
      "@type": "Place",
      "name": talk.event,
      "address": { "@type": "PostalAddress", "addressCountry": "BR" }
    },
    "organizer": { "@type": "Organization", "name": talk.event },
    "performer": { "@type": "Person", "name": "Tiago Danin", "url": "https://tiagodanin.com" },
    "url": `https://tiagodanin.com/talk/${slug}/pt`,
    "inLanguage": "pt-BR",
    ...(talk.youtubeUrl && {
      "recordedIn": {
        "@type": "VideoObject",
        "url": talk.youtubeUrl,
        "name": talk.title,
        "description": talk.description,
        "uploadDate": toISODate(talk.date),
        "author": { "@type": "Person", "name": "Tiago Danin" }
      }
    })
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container mx-auto py-32 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back to talks */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/talks" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Talks
              </Link>
            </Button>
          </div>

          {/* Header */}
          <header className="mb-8">
            <time className="text-sm text-muted-foreground">{formatDate(talk.date)}</time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {talk.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {talk.description}
            </p>

            {/* Event badge */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Mic className="h-3 w-3" />
                {talk.event}
              </Badge>
              {talk.youtubeUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={talk.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <Video className="h-3 w-3" />
                    YouTube
                  </a>
                </Button>
              )}
            </div>

            {/* Tags */}
            {talk.tags && talk.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {talk.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-0.5 rounded-full text-xs ${getRandomColorWithDarkMode(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Language toggle */}
            <div className="mt-4 flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/talk/${talk.slug}`} className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  EN
                </Link>
              </Button>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                PT
              </Badge>
            </div>
          </header>

          {/* MDX Content */}
          <div className="prose prose-zinc max-w-none">
            {mdxContent}
          </div>

          {/* Giscus Comments */}
          <GiscusComments term={`${talk.slug}-pt`} category="Talk Comments" categoryId="DIC_kwDONy7kws4C6oQH" />
        </div>
      </article>

      <CallToAction />
    </>
  );
}
