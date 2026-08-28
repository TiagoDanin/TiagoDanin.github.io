// Generates the RSS feeds into public/rss/.
//
// Two feeds per kind, one per language: blog.xml and blog-br.xml, and so on.
// The Portuguese posts and talks exist in the same numbers as the English ones
// and used to reach no feed at all, because this script filtered them out.
//
// Content is read through queryCollection, never with fs. The studio
// auto-initializes from process.cwd(), so a script sees exactly what a page
// sees; parsing frontmatter here would be a second reader of the same files,
// free to disagree with the one the site renders.

import fs from 'fs';
import path from 'path';
import RSS from 'rss';

import { queryCollection } from 'nextjs-studio/server';

import { getTimelineEvents } from '../src/lib/timeline';
import {
  contentLang,
  entryPath,
  feedPath,
  type FeedName,
  HTML_LANG,
  localePath,
  LOCALES,
  type Locale,
} from '../src/lib/i18n/locales.js';

const siteUrl = 'https://tiagodanin.com';
const outDir = path.join(process.cwd(), 'public/rss');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

/**
 * Filename for a feed, derived from the same helper the pages link with, so the
 * file this script writes and the URL `/rss` advertises cannot drift apart.
 */
function feedFile(name: FeedName, locale: Locale): string {
  return feedPath(name, locale).replace('/rss/', '');
}

function writeFeed(filename: string, xml: string, count: number): void {
  fs.writeFileSync(path.join(outDir, filename), xml, 'utf8');
  console.log(`  ${filename}: ${count} items`);
}

function newFeed(name: FeedName, locale: Locale, title: string, description: string) {
  return new RSS({
    title,
    description,
    feed_url: `${siteUrl}/rss/${feedFile(name, locale)}`,
    // localePath returns `/br` with no trailing slash; every HTML route on the
    // site is served with one.
    site_url: `${siteUrl}${localePath(locale, '/').replace(/\/?$/, '/')}`,
    language: HTML_LANG[locale],
    copyright: 'Tiago Danin',
  });
}

type Entry = {
  title: string;
  date: string;
  description: string;
  slug: string;
};

// Feed copy is the one place a translation cannot come from the Lingui catalog:
// these strings are produced outside React, with no i18n instance in scope.
const COPY: Record<Locale, Record<FeedName, { title: string; description: string }>> = {
  en: {
    blog: {
      title: 'Tiago Danin Blog',
      description: 'Articles and thoughts about development, technology and more',
    },
    talks: {
      title: 'Tiago Danin Talks',
      description: 'Talks and presentations about development, technology and more',
    },
    timeline: {
      title: 'Tiago Danin Timeline',
      description: 'Professional journey and career milestones',
    },
    projects: {
      title: 'Tiago Danin Projects',
      description: 'All projects by Tiago Danin',
    },
  },
  br: {
    blog: {
      title: 'Blog do Tiago Danin',
      description: 'Artigos e ideias sobre desenvolvimento, tecnologia e mais',
    },
    talks: {
      title: 'Palestras do Tiago Danin',
      description: 'Palestras e apresentações sobre desenvolvimento, tecnologia e mais',
    },
    timeline: {
      title: 'Linha do tempo do Tiago Danin',
      description: 'Trajetória profissional e marcos de carreira',
    },
    projects: {
      title: 'Projetos do Tiago Danin',
      description: 'Todos os projetos do Tiago Danin',
    },
  },
};

function buildEntryFeed(kind: 'post' | 'talk', collection: 'posts' | 'talks', locale: Locale) {
  const name: FeedName = collection === 'posts' ? 'blog' : 'talks';
  const copy = COPY[locale][name];
  const feed = newFeed(name, locale, copy.title, copy.description);

  const entries = [...queryCollection(collection).where({ lang: contentLang(locale) })] as unknown as Entry[];
  for (const entry of entries) {
    const url = `${siteUrl}${entryPath(locale, kind, entry.slug)}/`;
    feed.item({
      title: entry.title,
      description: entry.description,
      url,
      guid: url,
      date: entry.date,
    });
  }

  writeFeed(feedFile(name, locale), feed.xml({ indent: true }), entries.length);
}

function buildTimelineFeed(locale: Locale) {
  const copy = COPY[locale].timeline;
  const feed = newFeed('timeline', locale, copy.title, copy.description);

  const source = getTimelineEvents(locale);

  for (const event of source) {
    const url = `${siteUrl}${localePath(locale, `/timeline/${event.date}/${event.slug}`)}/`;
    feed.item({
      title: event.title,
      description: event.description,
      url,
      guid: url,
      date: event.date,
    });
  }

  writeFeed(feedFile('timeline', locale), feed.xml({ indent: true }), source.length);
}

const PROJECT_COLLECTIONS = [
  'github', 'private', 'npm', 'luarocks', 'pypi',
  'atom', 'googleplay', 'windows', 'aur', 'offline',
] as const;

type Project = {
  title?: string;
  name?: string;
  description?: string;
  html_url?: string;
  url?: string;
  homepage?: string;
  created_at?: string;
  date?: string;
};

function buildProjectsFeed(locale: Locale) {
  const copy = COPY[locale].projects;
  const feed = newFeed('projects', locale, copy.title, copy.description);

  const projects = PROJECT_COLLECTIONS.flatMap(
    (name) => [...queryCollection(name)] as unknown as Project[]
  );

  let count = 0;
  for (const project of projects) {
    // Items point at the project's own home, which is off-site for most of
    // them, so there is nothing locale-dependent to build here.
    const link = project.html_url || project.url || project.homepage || '';
    if (!link) continue;

    feed.item({
      title: project.title || project.name || '',
      description: project.description || '',
      url: link,
      guid: link,
      date: project.created_at || project.date || '',
    });
    count += 1;
  }

  writeFeed(feedFile('projects', locale), feed.xml({ indent: true }), count);
}

console.log('Generating RSS feeds...');
for (const locale of LOCALES) {
  buildEntryFeed('post', 'posts', locale);
  buildEntryFeed('talk', 'talks', locale);
  buildTimelineFeed(locale);
  buildProjectsFeed(locale);
}
console.log('RSS feeds generated successfully');
