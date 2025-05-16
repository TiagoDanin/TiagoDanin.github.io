import { NextRequest } from 'next/server';
import timeline from '@/data/timeline.json';
import { buildRssFeed } from '@/utils/rss';
import { titleToSlug } from '@/utils/parse';

export const dynamic = 'force-static';

export async function GET(req: NextRequest) {
  const siteUrl = 'https://tiagodanin.com';
  const feedUrl = `${siteUrl}/rss/timeline.xml`;
  const items = timeline.map((event: any) => ({
    title: event.title,
    link: `${siteUrl}/timeline/${event.date}/${titleToSlug(event.title)}`,
    guid: `${siteUrl}/timeline/${event.date}/${titleToSlug(event.title)}`,
    description: event.description,
    pubDate: event.date,
  }));

  const xml = buildRssFeed({
    title: 'Tiago Danin Timeline',
    description: 'Professional journey and career milestones',
    siteUrl,
    items,
    feedUrl,
    copyright: 'Tiago Danin',
  });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
} 