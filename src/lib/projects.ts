/**
 * The ten project collections, and the single place that knows how one maps to
 * a URL, to a slug and to its list of tags.
 *
 * This lived inside `app/[lang]/project/[type]/[slug]/page.tsx` while the detail
 * page was the only reader. `/tags/[tag]` now lists projects too, and two copies
 * of the map would be free to disagree about which collections exist.
 *
 * Adding a project source is still one entry in `PROJECT_TYPES` plus one in
 * `urlPrefixMap`; both live here now.
 */
import { queryCollection } from 'nextjs-studio/server';

import { titleToSlug } from '@/utils/parse';

export type LicenseInfo = {
  key?: string;
  name?: string;
  spdx_id?: string;
  url?: string;
};

export type GenericProject = {
  name?: string;
  title?: string;
  description?: string;
  url?: string;
  html_url?: string;
  language?: string;
  archived?: boolean;
  stargazers_count?: number;
  forks_count?: number;
  watchers_count?: number;
  open_issues_count?: number;
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  homepage?: string;
  topics?: string[];
  license?: LicenseInfo;
  keywords?: string[];
  tags?: string[];
  downloads?: number;
  version?: string;
  scope?: string;
  [key: string]: unknown;
};

export const PROJECT_TYPES = [
  'github',
  'private',
  'npm',
  'luarocks',
  'pypi',
  'atom',
  'googleplay',
  'windows',
  'aur',
  'offline',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

/**
 * This map has no locale variant: the ten project collections carry no
 * index.br.json, so the catalogue is the same list for every language.
 */
export function getProjectsMap(): Record<string, GenericProject[]> {
  return Object.fromEntries(
    PROJECT_TYPES.map((type) => [type, queryCollection(type) as unknown as GenericProject[]])
  ) as Record<string, GenericProject[]>;
}

export const urlPrefixMap: Record<string, string> = {
  npm: "https://www.npmjs.com/package/",
  luarocks: "https://luarocks.org/modules/tiagodanin/",
  pypi: "https://pypi.python.org/pypi/",
  atom: "https://atom.io/packages/",
  github: "",
  private: "",
  googleplay: "",
  windows: "",
  aur: "",
  offline: "",
};

/** The slug half of `/project/[type]/[slug]`. */
export function projectSlug(project: GenericProject): string {
  return titleToSlug(project.name || project.title || '');
}

export function projectTitle(project: GenericProject): string {
  return project.title || project.name || '';
}

/**
 * Every source spells its tags differently: GitHub calls them `topics`, npm
 * `keywords`, the hand-written Google Play entries `tags`. The rest carry none.
 */
export function projectTags(project: GenericProject): string[] {
  return project.topics || project.keywords || project.tags || [];
}
