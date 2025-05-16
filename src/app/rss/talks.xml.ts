import { NextRequest } from 'next/server';
import talks from '@/data/talks.json';
import { buildRssFeed } from '@/utils/rss';
import { titleToSlug } from '@/utils/parse';

export const dynamic = 'force-static';

export async function GET(req: NextRequest) {
  const siteUrl = 'https://tiagodanin.com';
  const feedUrl = `${siteUrl}/rss/talks.xml`;
  const items = talks.map((talk: any) => ({
    title: talk.title,
    link: `${siteUrl}/talk/${titleToSlug(talk.title)}`,
    guid: `${siteUrl}/talk/${titleToSlug(talk.title)}`,
    description: talk.description,
    pubDate: talk.date,
  }));

  const xml = buildRssFeed({
    title: 'Tiago Danin Talks',
    description: 'Talks and presentations about development, technology and more',
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