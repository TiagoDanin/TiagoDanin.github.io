import fs from 'fs';
import path from 'path';
import RSS from 'rss';
import matter from 'gray-matter';

// Read English posts from MDX files
const postsDir = path.join(process.cwd(), 'contents', 'posts');
const posts = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.mdx') && !f.includes('.pt.'))
  .map(f => {
    const raw = fs.readFileSync(path.join(postsDir, f), 'utf-8');
    return matter(raw).data as { title: string; date: string; description: string; slug: string; originalUrl: string };
  });
// Read English talks from MDX files
const talksDir = path.join(process.cwd(), 'contents', 'talks');
const talks = fs.readdirSync(talksDir)
  .filter(f => f.endsWith('.mdx') && !f.includes('.pt.'))
  .map(f => {
    const raw = fs.readFileSync(path.join(talksDir, f), 'utf-8');
    return matter(raw).data as { title: string; date: string; description: string; slug: string; event: string; youtubeUrl?: string };
  });
import timeline from '../contents/timeline/index.json' assert { type: 'json' };
import projectsGithub from '../contents/github/index.json' assert { type: 'json' };
import projectsPrivate from '../contents/private/index.json' assert { type: 'json' };
import projectsNpm from '../contents/npm/index.json' assert { type: 'json' };
import projectsLuarocks from '../contents/luarocks/index.json' assert { type: 'json' };
import projectsPypi from '../contents/pypi/index.json' assert { type: 'json' };
import projectsAtom from '../contents/atom/index.json' assert { type: 'json' };
import projectsGooglePlay from '../contents/googleplay/index.json' assert { type: 'json' };
import projectsMicrosoftStore from '../contents/windows/index.json' assert { type: 'json' };
import projectsAUR from '../contents/aur/index.json' assert { type: 'json' };
import projectsOffline from '../contents/offline/index.json' assert { type: 'json' };
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
posts.forEach((post) => {
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
talks.forEach((talk) => {
  talksFeed.item({
    title: talk.title,
    description: talk.description,
    url: `${siteUrl}/talk/${talk.slug}`,
    guid: `${siteUrl}/talk/${talk.slug}`,
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