import { NextRequest } from 'next/server';
import projectsGithub from '@/data/github.json';
import projectsPrivate from '@/data/private.json';
import projectsNpm from '@/data/npm.json';
import projectsLuarocks from '@/data/luarocks.json';
import projectsPypi from '@/data/pypi.json';
import projectsAtom from '@/data/atom.json';
import projectsGooglePlay from '@/data/googleplay.json';
import projectsMicrosoftStore from '@/data/windows.json';
import projectsAUR from '@/data/aur.json';
import projectsOffline from '@/data/offline.json';
import { buildRssFeed } from '@/utils/rss';

export const dynamic = 'force-static';

export async function GET(req: NextRequest) {
  const siteUrl = 'https://tiagodanin.com';
  const feedUrl = `${siteUrl}/rss/projects.xml`;
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
  const items = allProjects.map((project: any) => ({
    title: project.title || project.name,
    link: project.html_url || project.url || project.homepage || '',
    guid: project.html_url || project.url || project.homepage || '',
    description: project.description || '',
    pubDate: project.created_at || project.date || '',
  })).filter(item => item.link);

  const xml = buildRssFeed({
    title: 'Tiago Danin Projects',
    description: 'All projects by Tiago Danin',
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