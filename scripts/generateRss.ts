import fs from 'fs';
import path from 'path';
import RSS from 'rss';
import posts from '../src/data/posts.json' assert { type: 'json' };
import talks from '../src/data/talks.json' assert { type: 'json' };
import timeline from '../src/data/timeline.json' assert { type: 'json' };
import projectsGithub from '../src/data/github.json' assert { type: 'json' };
import projectsPrivate from '../src/data/private.json' assert { type: 'json' };
import projectsNpm from '../src/data/npm.json' assert { type: 'json' };
import projectsLuarocks from '../src/data/luarocks.json' assert { type: 'json' };
import projectsPypi from '../src/data/pypi.json' assert { type: 'json' };
import projectsAtom from '../src/data/atom.json' assert { type: 'json' };
import projectsGooglePlay from '../src/data/googleplay.json' assert { type: 'json' };
import projectsMicrosoftStore from '../src/data/windows.json' assert { type: 'json' };
import projectsAUR from '../src/data/aur.json' assert { type: 'json' };
import projectsOffline from '../src/data/offline.json' assert { type: 'json' };
import { titleToSlug } from '../src/utils/parse'

const siteUrl = 'https://tiagodanin.com';
const outDir = path.join(process.cwd(), 'public/rss');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function writeFeed(filename: string, xml: string): void {
  fs.writeFileSync(path.join(outDir, filename), xml, 'utf8');
}

// Blog Feed
const blogFeed = new RSS({
  title: 'Tiago Danin Blog',
  description: 'Articles and thoughts about development, technology and more',
  feed_url: `${siteUrl}/rss/blog.xml`,
  site_url: siteUrl,
  language: 'en',
  copyright: 'Tiago Danin',
});
posts.forEach((post: any) => {
  blogFeed.item({
    title: post.title,
    description: post.description,
    url: `${siteUrl}/post/${post.slug}`,
    guid: `${siteUrl}/post/${post.slug}`,
    date: post.date,
  });
});
writeFeed('blog.xml', blogFeed.xml({ indent: true }));

// Talks Feed
const talksFeed = new RSS({
  title: 'Tiago Danin Talks',
  description: 'Talks and presentations about development, technology and more',
  feed_url: `${siteUrl}/rss/talks.xml`,
  site_url: siteUrl,
  language: 'en',
  copyright: 'Tiago Danin',
});
talks.forEach((talk: any) => {
  const slug = titleToSlug(talk.title);
  talksFeed.item({
    title: talk.title,
    description: talk.description,
    url: `${siteUrl}/talk/${slug}`,
    guid: `${siteUrl}/talk/${slug}`,
    date: talk.date,
  });
});
writeFeed('talks.xml', talksFeed.xml({ indent: true }));

// Timeline Feed
const timelineFeed = new RSS({
  title: 'Tiago Danin Timeline',
  description: 'Professional journey and career milestones',
  feed_url: `${siteUrl}/rss/timeline.xml`,
  site_url: siteUrl,
  language: 'en',
  copyright: 'Tiago Danin',
});
timeline.forEach((event: any) => {
  const slug = titleToSlug(event.title);
  timelineFeed.item({
    title: event.title,
    description: event.description,
    url: `${siteUrl}/timeline/${event.date}/${slug}`,
    guid: `${siteUrl}/timeline/${event.date}/${slug}`,
    date: event.date,
  });
});
writeFeed('timeline.xml', timelineFeed.xml({ indent: true }));

// Projects Feed
const allProjects = [
  ...projectsGithub,
  ...projectsPrivate,
  ...projectsNpm,
  ...projectsLuarocks,
  ...projectsPypi,
  ...projectsAtom,
  ...projectsGooglePlay,
  ...projectsMicrosoftStore,
  ...projectsAUR,
  ...projectsOffline,
];
const projectsFeed = new RSS({
  title: 'Tiago Danin Projects',
  description: 'All projects by Tiago Danin',
  feed_url: `${siteUrl}/rss/projects.xml`,
  site_url: siteUrl,
  language: 'en',
  copyright: 'Tiago Danin',
});
allProjects.forEach((project: any) => {
  const link = project.html_url || project.url || project.homepage || '';
  if (!link) return;
  projectsFeed.item({
    title: project.title || project.name,
    description: project.description || '',
    url: link,
    guid: link,
    date: project.created_at || project.date || '',
  });
});
writeFeed('projects.xml', projectsFeed.xml({ indent: true })); 