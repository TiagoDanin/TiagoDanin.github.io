import { NextRequest } from 'next/server';
import posts from '@/data/posts.json';
import { buildRssFeed } from '@/utils/rss';

export const dynamic = 'force-static';

export async function GET(req: NextRequest) {
  const siteUrl = 'https://tiagodanin.com';
  const feedUrl = `${siteUrl}/rss/blog.xml`;
  const items = posts.map((post: any) => ({
    title: post.title,
    link: `${siteUrl}/post/${post.slug}`,
    guid: `${siteUrl}/post/${post.slug}`,
    description: post.description,
    pubDate: post.date,
  }));

  const xml = buildRssFeed({
    title: 'Tiago Danin Blog',
    description: 'Articles and thoughts about development, technology and more',
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