/**
 * One tag index for the whole site.
 *
 * A tag used to mean "a word on a post or a talk". Every project page also
 * linked its GitHub topics and npm keywords at `/tags/<topic>`, and those pages
 * were never generated: a crawl found 400+ internal links resolving to a 404,
 * `/tags/telegram/` alone with twenty of them. The fix is not to stop linking,
 * it is to make the tag page mean what the links already assumed: everything on
 * the site carrying that tag, whatever collection it lives in.
 *
 * Four sources feed it: posts, talks, the ten project collections and the
 * timeline. Posts, talks and the timeline are per-locale; the ten project
 * collections carry no translation and appear under every language.
 */
import { queryCollection } from 'nextjs-studio/server';

import { getTimelineEvents } from '@/lib/timeline';

import { titleToSlug } from '@/utils/parse';
import { entryPath, localePath, contentLang, LOCALES, type Locale } from '@/lib/i18n/locales';
import {
  PROJECT_TYPES,
  getProjectsMap,
  projectSlug,
  projectTags,
  projectTitle,
  type GenericProject,
} from '@/lib/projects';

export type TagSource = 'post' | 'talk' | 'project' | 'timeline';

/** Order the sources are listed in, and the order display names win in. */
export const TAG_SOURCES: readonly TagSource[] = ['post', 'talk', 'project', 'timeline'] as const;

export interface TaggedItem {
  source: TagSource;
  /** Unique within a tag entry: two collections can hold the same slug. */
  key: string;
  title: string;
  description: string;
  /** Free-form, as authored. Sorting is by string, which is why it is not a Date. */
  date: string;
  /** Route without the locale prefix, for `pageUrl()` in JSON-LD. */
  path: string;
  /** The same route, prefixed for the locale the index was built for. */
  href: string;
  /** Project type (`github`, `npm`, ...) for a project, the event for a talk. */
  meta?: string;
  tags: string[];
}

export interface TagEntry {
  slug: string;
  name: string;
  items: TaggedItem[];
  counts: Record<TagSource, number>;
  total: number;
}

export type TagIndex = Map<string, TagEntry>;

// Overrides never localize: acronyms and brand casing read the same in every
// language.
const TAG_DISPLAY_OVERRIDES: Record<string, string> = {
  ai: 'AI', ios: 'iOS', uiux: 'UI/UX', devops: 'DevOps', api: 'API', css: 'CSS',
};

/** Title-cases a slug, for a tag whose original spelling was never recorded. */
export function prettifyTagSlug(slug: string): string {
  if (TAG_DISPLAY_OVERRIDES[slug]) return TAG_DISPLAY_OVERRIDES[slug];
  return decodeURIComponent(slug)
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * A post tagged `Video` is a YouTube link, not an article. The blog lists drop
 * those, so the blog tag index does too.
 *
 * The site-wide index keeps them. `ArticleCard` links every tag it renders, a
 * video card included, so a tag carried only by video posts would be a link to
 * a page `generateStaticParams` never built.
 */
function isVideoPost(tags: string[]): boolean {
  return tags.includes('Video');
}

function postItems(locale: Locale): TaggedItem[] {
  return [...queryCollection('posts').where({ lang: contentLang(locale) })].map((post) => ({
    source: 'post' as const,
    key: `post:${post.slug}`,
    title: String(post.title),
    description: String(post.description ?? ''),
    date: String(post.date ?? ''),
    path: `/post/${post.slug}`,
    href: entryPath(locale, 'post', String(post.slug)),
    tags: (post.tags as string[]) || [],
  }));
}

function talkItems(locale: Locale): TaggedItem[] {
  return [...queryCollection('talks').where({ lang: contentLang(locale) })].map((talk) => ({
    source: 'talk' as const,
    key: `talk:${talk.slug}`,
    title: String(talk.title),
    description: String(talk.description ?? ''),
    date: String(talk.date ?? ''),
    path: `/talk/${talk.slug}`,
    href: entryPath(locale, 'talk', String(talk.slug)),
    meta: [talk.event, talk.edition].filter(Boolean).join(' '),
    tags: (talk.tags as string[]) || [],
  }));
}

function timelineItems(locale: Locale): TaggedItem[] {
  return getTimelineEvents(locale).map((event) => ({
    source: 'timeline' as const,
    key: `timeline:${event.date}-${event.slug}`,
    title: event.title,
    description: event.description,
    date: event.date,
    path: `/timeline/${event.date}/${event.slug}`,
    href: localePath(locale, `/timeline/${event.date}/${event.slug}`),
    tags: event.tags,
  }));
}

function projectItems(locale: Locale): TaggedItem[] {
  const map = getProjectsMap();
  const items: TaggedItem[] = [];

  for (const type of PROJECT_TYPES) {
    for (const project of (map[type] || []) as GenericProject[]) {
      const slug = projectSlug(project);
      if (!slug) continue;

      const tags = projectTags(project);
      if (tags.length === 0) continue;

      items.push({
        source: 'project',
        key: `project:${type}/${slug}`,
        title: projectTitle(project),
        description: String(project.description ?? ''),
        // Display only: the ten collections share no comparable date field.
        date: String(project.pushed_at ?? project.created_at ?? ''),
        path: `/project/${type}/${slug}`,
        href: localePath(locale, `/project/${type}/${slug}`),
        meta: type,
        tags,
      });
    }
  }

  return items;
}

function emptyCounts(): Record<TagSource, number> {
  return { post: 0, talk: 0, project: 0, timeline: 0 };
}

function addItems(index: TagIndex, items: TaggedItem[]) {
  for (const item of items) {
    for (const tag of item.tags) {
      const slug = titleToSlug(tag);
      if (!slug) continue;

      let entry = index.get(slug);
      if (!entry) {
        entry = { slug, name: tag, items: [], counts: emptyCounts(), total: 0 };
        index.set(slug, entry);
      } else if (
        // Posts and talks are hand-written, so their spelling wins over a
        // GitHub topic: `Telegram` reads better as a page title than `telegram`.
        TAG_SOURCES.indexOf(item.source) < TAG_SOURCES.indexOf(entry.items[0].source)
      ) {
        entry.name = tag;
      }

      entry.items.push(item);
      entry.counts[item.source] += 1;
      entry.total += 1;
    }
  }
}

function sortEntry(entry: TagEntry) {
  entry.items.sort((a, b) => {
    const bySource = TAG_SOURCES.indexOf(a.source) - TAG_SOURCES.indexOf(b.source);
    if (bySource !== 0) return bySource;
    if (a.source === 'project') return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    return b.date.localeCompare(a.date);
  });
}

function build(locale: Locale, sources: readonly TagSource[], skipVideos = false): TagIndex {
  const index: TagIndex = new Map();

  if (sources.includes('post')) {
    const posts = postItems(locale);
    addItems(index, skipVideos ? posts.filter((post) => !isVideoPost(post.tags)) : posts);
  }
  if (sources.includes('talk')) addItems(index, talkItems(locale));
  if (sources.includes('project')) addItems(index, projectItems(locale));
  if (sources.includes('timeline')) addItems(index, timelineItems(locale));

  index.forEach(sortEntry);
  return index;
}

/**
 * Rebuilding the index costs a full pass over every collection, and
 * `generateMetadata` plus the page body ask for it once each on every one of
 * ~400 tag pages per locale. Memoized per build; skipped in development, where
 * `withStudio()` refreshes content under a running server and a module-level
 * cache would keep serving the files as they were when the server started.
 */
const memo = new Map<string, TagIndex>();

function cached(key: string, make: () => TagIndex): TagIndex {
  if (process.env.NODE_ENV === 'development') return make();

  let value = memo.get(key);
  if (!value) {
    value = make();
    memo.set(key, value);
  }
  return value;
}

/** Every tag on the site: posts, talks, projects and timeline events. */
export function buildTagIndex(locale: Locale): TagIndex {
  return cached(`all:${locale}`, () => build(locale, TAG_SOURCES));
}

/** Blog-only view, for `/blog/tags`. Articles, no videos, nothing else. */
export function buildBlogTagIndex(locale: Locale): TagIndex {
  return cached(`blog:${locale}`, () => build(locale, ['post'], true));
}

/** Tags sorted the way both index pages list them: most content first. */
export function sortedTags(index: TagIndex): TagEntry[] {
  return [...index.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}

/** The display name for a slug, falling back to a title-cased slug. */
export function tagName(index: TagIndex, slug: string): string {
  return index.get(slug)?.name ?? prettifyTagSlug(slug);
}

/**
 * The static params for a tag route, unioned across every locale.
 *
 * Deliberately not per-locale. A tag carried only by an English post still
 * announces `hreflang="pt-BR"` pointing at `/br/tags/<slug>/`, so generating
 * the Portuguese page only where Portuguese content uses the tag would publish
 * an alternate link to a 404. Projects and the timeline are language-neutral
 * anyway, which is most of the index.
 */
export function allTagSlugs(source: 'all' | 'blog'): string[] {
  const slugs = new Set<string>();

  for (const locale of LOCALES) {
    const index = source === 'blog' ? buildBlogTagIndex(locale) : buildTagIndex(locale);
    index.forEach((_, slug) => slugs.add(slug));
  }

  return [...slugs];
}
