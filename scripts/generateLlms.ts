// Generates the machine-readable layer of tiagodanin.com:
//
//   /llms.txt          slim index, the entry point for AI assistants (llmstxt.org)
//   /posts.txt         every article, EN and PT
//   /talks.txt         every talk, EN and PT
//   /projects.txt      every published project, across the ten sources
//   /timeline.txt      career milestones
//   /llms-full.txt     the whole site in one file, for RAG and IDE ingestion
//   /<route>.md        a Markdown mirror of each HTML page, announced by
//                      <link rel="alternate" type="text/markdown"> in the page head
//
// The big lists live in their own files so llms.txt stays short enough to be read
// in full: it links to them instead of inlining 300 URLs.

import fs from 'fs';
import path from 'path';
import { queryCollection } from 'nextjs-studio/server';
import { titleToSlug } from '../src/utils/parse';
import { entryPath, type Locale } from '../src/lib/i18n/locales.js';

const siteUrl = 'https://tiagodanin.com';

/** Newline, as a constant so generated patches cannot mangle the escape. */
const NL = String.fromCharCode(10);
const publicDir = path.join(process.cwd(), 'public');

const PROJECT_TYPES = [
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

type ProjectType = (typeof PROJECT_TYPES)[number];

interface Entry {
  title: string;
  date?: string;
  description: string;
  slug: string;
  lang: string;
  tags?: string[];
  originalUrl?: string;
  youtubeUrl?: string;
  event?: string;
  edition?: string;
  body: string;
}

interface Project {
  name?: string;
  title?: string;
  description?: string;
  language?: string;
  html_url?: string;
  homepage?: string;
  stargazers_count?: number;
  forks_count?: number;
  topics?: string[];
  keywords?: string[];
  license?: { spdx_id?: string; name?: string } | string;
  version?: string;
  downloads?: number;
  archived?: boolean;
}

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  tags?: string[];
}

interface PageRef {
  path: string;
  title: string;
  description: string;
}

interface LlmsConfig {
  title: string;
  summary: string;
  note: string;
  pages: PageRef[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Every row of a list collection, in English.
 *
 * `.locale()` is explicit even though the mirrors are English-only: without it
 * a collection that gains an `index.br.json` starts returning both languages,
 * and the list silently renders twice.
 */
function readAll<T>(collection: string): T[] {
  return [...queryCollection(collection as 'links').locale('en')] as unknown as T[];
}

/** The single row of a singleton collection. `.one()` already prefers English. */
function readOne<T>(collection: string): T {
  return queryCollection(collection as 'about').one() as unknown as T;
}

function block(...parts: Array<string | false | null | undefined>): string {
  return parts.filter((part): part is string => Boolean(part)).join('\n\n');
}

function list(items: string[]): string {
  return items.join('\n');
}

function link(label: string, url: string): string {
  return `[${label}](${url})`;
}

/** Index lines stay scannable: the full text is always one click away in the mirror. */
function truncate(text: string, max = 180): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max).replace(/[\s,;.]+\S*$/, '')}...`;
}

/**
 * Two URL shapes live here and they take opposite rules. Checked against
 * production: an HTML route without the trailing slash answers 301, and a
 * static file with one answers 404.
 *
 * Route paths are stored without the slash because markdownPath() derives the
 * mirror filename from them; the slash belongs on the HTML URL alone.
 */
function pageUrl(routePath: string): string {
  const path = routePath.endsWith('/') ? routePath : `${routePath}/`;
  return `${siteUrl}${path}`;
}

/** A file is a file: /llms.txt and /about.md must never carry a trailing slash. */
function fileUrl(filePath: string): string {
  return `${siteUrl}${filePath.replace(/\/+$/, '')}`;
}

/** `/post/foo` becomes `/post/foo.md`, and the home becomes `/index.md`. */
function markdownPath(routePath: string): string {
  const clean = routePath.replace(/\/+$/, '');
  return clean === '' ? '/index.md' : `${clean}.md`;
}

function writeFile(relativePath: string, body: string): void {
  const target = path.join(publicDir, relativePath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${body.trimEnd()}\n`, 'utf8');
}

/**
 * MDX is Markdown plus components. The mirrors are read by machines that have no
 * renderer, so the embeds become plain links instead of unresolved JSX.
 */
function mdxToMarkdown(body: string): string {
  return body
    .replace(/^import\s.+$/gm, '')
    .replace(
      /<YouTubeEmbed\s+videoId="([^"]+)"(?:\s+title="([^"]*)")?\s*\/>/g,
      (_match, id: string, title: string) =>
        link(title || 'Watch on YouTube', `https://www.youtube.com/watch?v=${id}`)
    )
    .replace(/<iframe[^>]*src="([^"]+)"[^>]*>\s*<\/iframe>/g, (_match, src: string) =>
      link('Watch the recording', src)
    )
    .replace(/<[/]?(?:div|section|p|br)[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Both languages of a post/talk collection, newest first.
 *
 * The studio already resolved the locale from the filename suffix and split the
 * frontmatter from the body, so `lang` and `body` come straight off the entry.
 */
function readEntries(collection: 'posts' | 'talks'): Entry[] {
  return [...queryCollection(collection)]
    .map((entry) => {
      const data = entry as unknown as Omit<Entry, 'body'> & { body?: string };
      return { ...data, body: mdxToMarkdown(data.body ?? '') };
    })
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

/**
 * `/post/slug` in English, `/br/post/slug` in Portuguese.
 *
 * The trailing-segment form this used to build (`/post/slug/pt`) was retired
 * with the `(legacy)` group, so every Portuguese URL in the text layer pointed
 * at a page that no longer exists.
 */
function entryRoute(prefix: 'post' | 'talk', entry: Entry): string {
  const locale: Locale = entry.lang === 'pt' ? 'br' : 'en';
  return entryPath(locale, prefix, entry.slug);
}

function licenseOf(project: Project): string {
  if (!project.license) return '';
  return typeof project.license === 'string'
    ? project.license
    : (project.license.spdx_id ?? project.license.name ?? '');
}

function projectRoute(type: ProjectType, project: Project): string {
  return `/project/${type}/${titleToSlug(project.name ?? project.title ?? '')}`;
}

// ── Markdown mirrors ─────────────────────────────────────────────────────────

function header(title: string, description: string, routePath: string): string {
  return block(
    `# ${title}`,
    description && `> ${description}`,
    list([
      `- HTML version: ${pageUrl(routePath)}`,
      `- Site index for AI assistants: ${fileUrl('/llms.txt')}`,
    ])
  );
}

function footer(): string {
  return block(
    '---',
    `Published by Tiago Danin. Free to quote with attribution and a link to ${siteUrl}.`
  );
}

function renderEntry(prefix: 'post' | 'talk', entry: Entry): string {
  const routePath = entryRoute(prefix, entry);
  const facts = [
    entry.date && `- Date: ${entry.date}`,
    entry.lang && `- Language: ${entry.lang === 'pt' ? 'Portuguese' : 'English'}`,
    entry.event && `- Event: ${entry.event}${entry.edition ? `, ${entry.edition}` : ''}`,
    entry.tags?.length && `- Tags: ${entry.tags.join(', ')}`,
    entry.youtubeUrl && `- Recording: ${entry.youtubeUrl}`,
    entry.originalUrl && `- Originally published at: ${entry.originalUrl}`,
  ].filter((fact): fact is string => Boolean(fact));

  return block(
    header(entry.title, entry.description, routePath),
    list(facts),
    entry.body,
    footer()
  );
}

function renderProject(type: ProjectType, project: Project): string {
  const name = project.name ?? project.title ?? '';
  const facts = [
    `- Type: ${type}`,
    project.language && `- Language: ${project.language}`,
    licenseOf(project) && `- License: ${licenseOf(project)}`,
    project.version && `- Version: ${project.version}`,
    typeof project.stargazers_count === 'number' && `- Stars: ${project.stargazers_count}`,
    typeof project.forks_count === 'number' && `- Forks: ${project.forks_count}`,
    typeof project.downloads === 'number' && `- Downloads: ${project.downloads}`,
    project.archived && '- Status: archived',
    project.html_url && `- Source: ${project.html_url}`,
    project.homepage && `- Homepage: ${project.homepage}`,
    (project.topics?.length || project.keywords?.length) &&
      `- Topics: ${(project.topics ?? project.keywords ?? []).join(', ')}`,
  ].filter((fact): fact is string => Boolean(fact));

  return block(
    header(name, project.description ?? '', projectRoute(type, project)),
    list(facts),
    footer()
  );
}

function renderPage(page: PageRef, body: string): string {
  return block(header(page.title, page.description, page.path), body, footer());
}

// ── Index files ──────────────────────────────────────────────────────────────

function entryLine(prefix: 'post' | 'talk', entry: Entry): string {
  const routePath = entryRoute(prefix, entry);
  const date = entry.date ? `${entry.date}, ` : '';
  return `- ${link(entry.title, fileUrl(markdownPath(routePath)))}: ${date}${truncate(entry.description)}`;
}

function renderEntryIndex(
  heading: string,
  intro: string,
  prefix: 'post' | 'talk',
  entries: Entry[]
): string {
  const en = entries.filter((entry) => entry.lang === 'en');
  const pt = entries.filter((entry) => entry.lang === 'pt');

  return block(
    `# ${heading}`,
    `> ${intro}`,
    list([
      `- Site index for AI assistants: ${fileUrl('/llms.txt')}`,
      `- Every link below points at the Markdown mirror. Drop the .md for the HTML page.`,
    ]),
    block('## English', list(en.map((entry) => entryLine(prefix, entry)))),
    pt.length > 0 && block('## Portuguese', list(pt.map((entry) => entryLine(prefix, entry)))),
    footer()
  );
}

function projectLine(type: ProjectType, project: Project): string {
  const name = project.name ?? project.title ?? '';
  const stars =
    typeof project.stargazers_count === 'number' && project.stargazers_count > 0
      ? `${project.stargazers_count} stars, `
      : '';
  const description = project.description ?? 'No description.';
  return `- ${link(name, fileUrl(markdownPath(projectRoute(type, project))))}: ${stars}${truncate(description)}`;
}

function renderProjectsIndex(projects: Record<ProjectType, Project[]>): string {
  const labels: Record<ProjectType, string> = {
    github: 'GitHub repositories',
    private: 'Closed source',
    npm: 'NPM packages',
    luarocks: 'LuaRocks modules',
    pypi: 'PyPI packages',
    atom: 'Atom packages',
    googleplay: 'Google Play apps',
    windows: 'Microsoft Store apps',
    aur: 'Arch User Repository',
    offline: 'Discontinued',
  };

  const total = PROJECT_TYPES.reduce((sum, type) => sum + projects[type].length, 0);

  return block(
    '# Projects, Tiago Danin',
    `> All ${total} published projects, across ten distribution channels.`,
    list([
      `- Site index for AI assistants: ${fileUrl('/llms.txt')}`,
      `- Every link below points at the Markdown mirror. Drop the .md for the HTML page.`,
    ]),
    ...PROJECT_TYPES.filter((type) => projects[type].length > 0).map((type) =>
      block(
        `## ${labels[type]}`,
        list(projects[type].map((project) => projectLine(type, project)))
      )
    ),
    footer()
  );
}

function renderTimelineIndex(timeline: TimelineItem[]): string {
  return block(
    '# Timeline, Tiago Danin',
    '> Career milestones, awards, certifications and events, most recent first.',
    list([`- Site index for AI assistants: ${fileUrl('/llms.txt')}`]),
    list(
      timeline.map(
        (item) =>
          `- ${item.date}, ${item.title}: ${item.description}${item.tags?.length ? ` (${item.tags.join(', ')})` : ''}`
      )
    ),
    footer()
  );
}

interface SiteCounts {
  posts: number;
  talks: number;
  projects: number;
  timeline: number;
}

interface Profile {
  about: { bio: string; bioExtra: string; email: string };
  skills: SkillGroup[];
  work: WorkItem[];
  featured: FeaturedProject[];
}

/**
 * The body shared by `/llms.txt` and its Markdown twin `/index.md`: who Tiago is,
 * what he works with, and where everything else lives. Both files answer the same
 * question, so they are built from one function instead of drifting apart.
 */
function siteSections(
  config: LlmsConfig,
  counts: SiteCounts,
  recentPosts: Entry[],
  recentTalks: Entry[],
  profile: Profile
): string {
  return block(
    block('## About', profile.about.bio, profile.about.bioExtra),
    block(
      '## Technical skills',
      ...profile.skills.map((group) =>
        block(`### ${group.category}`, `- ${group.items.map((item) => item.name).join(', ')}`)
      )
    ),
    block(
      '## Professional experience',
      list(profile.work.map((item) => roleLine(item)))
    ),
    block(
      '## Featured projects',
      list(
        profile.featured.map(
          (project) =>
            `- ${project.href ? link(project.title, project.href) : project.title}: ${truncate(project.description)}`
        )
      )
    ),
    block(
      '## Pages',
      list(
        config.pages.map(
          (page) =>
            `- ${link(page.title, fileUrl(markdownPath(page.path)))}: ${page.description}`
        )
      )
    ),
    block(
      '## Full listings',
      list([
        `- ${link('Posts', fileUrl('/posts.txt'))}: all ${counts.posts} articles, English and Portuguese.`,
        `- ${link('Talks', fileUrl('/talks.txt'))}: all ${counts.talks} talks, English and Portuguese.`,
        `- ${link('Projects', fileUrl('/projects.txt'))}: all ${counts.projects} projects across ten channels.`,
        `- ${link('Timeline', fileUrl('/timeline.txt'))}: all ${counts.timeline} career milestones.`,
      ])
    ),
    block(
      '## Recent posts',
      list(recentPosts.map((entry) => entryLine('post', entry)))
    ),
    block(
      '## Recent talks',
      list(recentTalks.map((entry) => entryLine('talk', entry)))
    ),
    block(
      '## Optional',
      list([
        `- ${link('llms-full.txt', fileUrl('/llms-full.txt'))}: every page of this site in one file.`,
        `- ${link('sitemap.xml', fileUrl('/sitemap.xml'))}: the XML sitemap index.`,
        `- ${link('RSS feeds', pageUrl('/rss'))}: blog, talks, timeline and projects, in English and Portuguese.`,
      ])
    )
  );
}

/**
 * The entry point. Kept short on purpose: an assistant should be able to read it
 * whole and then follow one link, so the long lists live in their own files.
 */
function renderLlmsTxt(
  config: LlmsConfig,
  counts: SiteCounts,
  recentPosts: Entry[],
  recentTalks: Entry[],
  profile: Profile
): string {
  return block(
    `# ${config.title}`,
    `> ${config.summary}`,
    config.note,
    siteSections(config, counts, recentPosts, recentTalks, profile)
  );
}

function renderLlmsFull(documents: Array<{ routePath: string; body: string }>): string {
  return block(
    '# Tiago Danin, complete site content',
    '> Every page of tiagodanin.com in one file, for ingestion in a single request.',
    list([
      `- Slim index: ${fileUrl('/llms.txt')}`,
      `- Documents: ${documents.length}`,
    ]),
    ...documents.map((doc) =>
      block(`<!-- ${pageUrl(doc.routePath)} -->`, doc.body)
    )
  );
}

// ── Page bodies, built from the collections each page renders ────────────────

interface WorkItem {
  company?: string;
  organization?: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface SkillGroup {
  category: string;
  items: Array<{ name: string }>;
}

/** The curated highlights in contents/projects, not the full catalogue. */
interface FeaturedProject {
  title: string;
  description: string;
  href?: string;
}

/** A service on /services, each with a dedicated HTML page behind `link`. */
interface ExpertiseItem {
  title: string;
  description: string;
  link?: string;
}

interface PressItem {
  outlet: string;
  title: string;
  url: string;
  date: string;
  author?: string;
  summary?: string;
}

interface BioItem {
  lang: string;
  focus: string;
  short: string;
  medium: string;
  long: string;
}

interface LabelledLink {
  label?: string;
  title?: string;
  url: string;
  enabled?: boolean;
}

/**
 * Several descriptions in contents/work carry their own bullet list. Inlining that
 * whole block into an index turns one entry into a dozen loose list items, so the
 * index keeps the opening paragraph and the /about mirror keeps the full text.
 */
function roleLine(item: WorkItem, { full = false } = {}): string {
  const org = item.company ?? item.organization ?? '';
  const period = `${item.startDate} to ${item.endDate || 'present'}`;
  const head = `- ${item.role}, ${org} (${period}):`;

  if (full) return `${head} ${item.description}`;

  const opening = item.description.split(/\r?\n/)[0];
  return `${head} ${truncate(opening, 220)}`;
}

/**
 * A body for every page listed in contents/llms. Announcing a mirror that was
 * never written is promising a 404 to whoever followed the link.
 */
interface FaqDoc {
  slug: string;
  category: string;
  layout: string;
  question: string;
  answer: string;
  body?: string;
  facts?: Array<{ label: string; value: string }>;
  evidence?: Array<{ date: string; title: string; detail: string; href?: string }>;
  matrix?: Array<{ item: string; where: string; proof: string; href?: string }>;
  steps?: Array<{ title: string; detail: string }>;
  offering?: Array<{ title: string; detail: string }>;
  links?: Array<{ label: string; href: string }>;
}

function readFaq(): FaqDoc[] {
  const en = [...queryCollection('faq').locale('en')] as unknown as FaqDoc[];
  const br = [...queryCollection('faq').locale('br')] as unknown as FaqDoc[];

  const enSlugs = new Set(en.map(entry => entry.slug));
  const brSlugs = new Set(br.map(entry => entry.slug));
  const onlyEn = [...enSlugs].filter(slug => !brSlugs.has(slug));
  const onlyBr = [...brSlugs].filter(slug => !enSlugs.has(slug));

  if (onlyEn.length || onlyBr.length) {
    throw new Error(
      'contents/faq: the two locale files disagree on which questions exist.' + NL +
        (onlyEn.length ? `  Only in index.json:    ${onlyEn.join(', ')}` + NL : '') +
        (onlyBr.length ? `  Only in index.br.json: ${onlyBr.join(', ')}` + NL : '') +
        '/faq/ is a localized prefix, so every slug must exist in both or its hreflang points at a 404.'
    );
  }

  return en;
}

function fillFaqTokens(text: string, counts: FaqCounts): string {
  return text
    .replaceAll('{talkCount}', String(counts.talks))
    .replaceAll('{postCount}', String(counts.posts))
    .replaceAll('{repoCount}', String(counts.repos))
    .replaceAll('{npmCount}', String(counts.npm))
    .replaceAll('{npmDownloads}', new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(counts.npmDownloads))
    .replaceAll('{polybarStars}', String(counts.polybarStars));
}

interface FaqCounts {
  talks: number;
  posts: number;
  repos: number;
  npm: number;
  npmDownloads: number;
  polybarStars: number;
}

function faqRoute(entry: FaqDoc): string {
  return `/faq/${entry.slug}`;
}

function renderFaqEntry(entry: FaqDoc, counts: FaqCounts): string {
  const t = (text: string) => fillFaqTokens(text, counts);

  const blocks: string[] = [];

  if (entry.facts?.length) {
    blocks.push(block('## Facts', list(entry.facts.map(f => `- ${t(f.label)}: ${t(f.value)}`))));
  }
  if (entry.evidence?.length) {
    blocks.push(
      block(
        '## Record',
        list(entry.evidence.map(e => `- ${e.date}, ${t(e.title)}: ${t(e.detail)}`))
      )
    );
  }
  if (entry.matrix?.length) {
    blocks.push(
      block(
        '## Coverage',
        list(entry.matrix.map(m => `- ${t(m.item)}, used in ${t(m.where)}: ${t(m.proof)}`))
      )
    );
  }
  if (entry.steps?.length) {
    blocks.push(
      block(
        '## Steps',
        list(entry.steps.map((step, i) => `${i + 1}. ${t(step.title)}: ${t(step.detail)}`))
      )
    );
  }
  if (entry.offering?.length) {
    blocks.push(
      block('## Scope', list(entry.offering.map(o => `- ${t(o.title)}: ${t(o.detail)}`)))
    );
  }
  if (entry.links?.length) {
    blocks.push(
      block(
        '## Sources',
        list(
          entry.links.map(l =>
            `- ${link(t(l.label), l.href.startsWith('http') ? l.href : pageUrl(l.href))}`
          )
        )
      )
    );
  }

  return block(
    header(t(entry.question), t(entry.answer), faqRoute(entry)),
    t(entry.body ?? ''),
    ...blocks,
    footer()
  );
}

function renderFaqIndex(entries: FaqDoc[], counts: FaqCounts): string {
  const t = (text: string) => fillFaqTokens(text, counts);

  const byCategory = new Map<string, FaqDoc[]>();
  for (const entry of entries) {
    const key = entry.category || 'General';
    const bucket = byCategory.get(key);
    if (bucket) bucket.push(entry);
    else byCategory.set(key, [entry]);
  }

  return block(
    ...[...byCategory].map(([category, group]) =>
      block(
        `## ${category}`,
        group
          .map(entry =>
            block(
              `### ${t(entry.question)}`,
              t(entry.answer),
              (entry.body ?? '').trim()
                ? `Full answer: ${fileUrl(markdownPath(faqRoute(entry)))}`
                : undefined
            )
          )
          .join('\n\n')
      )
    )
  );
}

interface BusinessRecordRow {
  label: string;
  value: string;
}

interface BusinessOfferingRow {
  code: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
}

interface BusinessRow {
  stackTitle: string;
  stackNote: string;
  trackTitle: string;
  track: string;
  audienceTitle: string;
  audienceNote: string;
  audience: Array<{ title: string; detail: string }>;
  registrySummaryLabel: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  lede: string;
  offeringsTitle: string;
  offerings: BusinessOfferingRow[];
  processTitle: string;
  process: Array<{ title: string; detail: string }>;
  registryTitle: string;
  registry: BusinessRecordRow[];
  registryLinkLabel: string;
  registryLinkHref: string;
  contactTitle: string;
  contactDetail: string;
  contactNote: string;
}

function businessYears(): number {
  const starts = readAll<WorkItem>('work')
    .map((entry) => Number(String(entry.startDate ?? '').slice(0, 4)))
    .filter((year) => Number.isFinite(year) && year > 1900);
  return starts.length ? new Date().getFullYear() - Math.min(...starts) : 0;
}

function renderBusiness(
  business: BusinessRow,
  counts: FaqCounts,
  email: string,
  skills: SkillGroup[],
  years: number
): string {
  const t = (text: string) =>
    fillFaqTokens(text, counts).replaceAll('{years}', String(years));

  return block(
    t(business.lede),
    block(`## ${t(business.trackTitle)}`, t(business.track)),
    block(
      `## ${t(business.offeringsTitle)}`,
      ...business.offerings.map((offering) =>
        block(
          offering.code ? `### ${t(offering.title)} (CNAE ${offering.code})` : `### ${t(offering.title)}`,
          t(offering.description),
          list(offering.bullets.map((bullet) => `- ${t(bullet)}`)),
          offering.href ? `- Details: ${pageUrl(offering.href)}` : undefined
        )
      )
    ),
    block(
      `## ${t(business.audienceTitle)}`,
      t(business.audienceNote),
      list(business.audience.map((item) => `- ${t(item.title)}: ${t(item.detail)}`))
    ),
    block(
      `## ${t(business.stackTitle)}`,
      t(business.stackNote),
      list(
        skills.map((group) => `- ${group.category}: ${group.items.map((item) => item.name).join(', ')}`)
      )
    ),
    block(
      `## ${t(business.processTitle)}`,
      list(business.process.map((step, index) => `${index + 1}. ${t(step.title)}: ${t(step.detail)}`))
    ),
    block(
      `## ${t(business.registryTitle)}`,
      list(business.registry.map((record) => `- ${record.label}: ${record.value}`)),
      link(t(business.registryLinkLabel), business.registryLinkHref)
    ),
    block(
      `## ${t(business.contactTitle)}`,
      t(business.contactDetail),
      list([`- Email: ${email}`, `- ${t(business.contactNote)}`])
    )
  );
}

function buildPageBodies(indexes: Record<string, string>): Record<string, string> {
  const about = readOne<{ bio: string; bioExtra: string; email: string; cvUrl: string }>('about');
  const work = readAll<WorkItem>('work');
  const volunteer = readAll<WorkItem>('volunteer');
  const skills = readAll<SkillGroup>('skills');
  const expertise = readAll<ExpertiseItem>('expertise');
  const featured = readAll<FeaturedProject>('projects');
  const press = readAll<PressItem>('press');
  const bios = readAll<BioItem>('bios');
  const presskit = readAll<{ file: string; caption: string }>('presskit');
  const links = readAll<LabelledLink>('links');
  const contacts = readAll<LabelledLink>('contacts');
  const googleplay = readAll<Project>('googleplay');
  const windows = readAll<Project>('windows');
  const github = readAll<Project>('github');
  const npm = readAll<Project>('npm');

  const topGithub = [...github]
    .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .slice(0, 30);
  const topNpm = [...npm].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0)).slice(0, 30);

  return {
    ...indexes,

    '/about': block(
      about.bio,
      about.bioExtra,
      block('## Work', list(work.map((item) => roleLine(item, { full: true })))),
      block('## Volunteering', list(volunteer.map((item) => roleLine(item, { full: true })))),
      block('## Contact', list([`- Email: ${about.email}`, `- CV: ${about.cvUrl}`]))
    ),

    '/skills': block(
      ...skills.map((group) =>
        block(`## ${group.category}`, list(group.items.map((item) => `- ${item.name}`)))
      )
    ),

    // "Show, don't tell": what he does, then the skills behind it, then shipped
    // work as evidence, then how to reach him. A list of adjectives would be
    // useless to an agent asked "can this person build X?".
    '/services': block(
      block(
        '## What Tiago takes on',
        ...expertise.map((item) =>
          block(
            `### ${item.title}`,
            item.description,
            // The last entry links back to /services itself; a page linking to
            // itself as "details" is noise.
            item.link && item.link !== '/services'
              ? `- Details: ${pageUrl(item.link)}`
              : undefined
          )
        )
      ),
      block(
        '## Technical skills',
        ...skills.map((group) =>
          block(`### ${group.category}`, `- ${group.items.map((item) => item.name).join(', ')}`)
        )
      ),
      block(
        '## Selected work',
        list(
          featured.map(
            (project) =>
              `- ${project.href ? link(project.title, project.href) : project.title}: ${truncate(project.description)}`
          )
        )
      ),
      block(
        '## Contact',
        list([
          `- Email: ${about.email}`,
          `- CV: ${about.cvUrl}`,
          `- Full project catalogue: ${fileUrl('/projects.md')}`,
        ])
      )
    ),

    '/press': block(
      '## Coverage',
      list(
        press.map(
          (item) =>
            `- ${link(item.title, item.url)}: ${item.outlet}, ${item.date}${item.author ? `, by ${item.author}` : ''}${item.summary ? `. ${truncate(item.summary)}` : ''}`
        )
      )
    ),

    '/press-kit': block(
      '## Bios',
      list(
        bios.map(
          (bio) => `- ${bio.lang.toUpperCase()}, ${bio.focus}, short: ${bio.short}`
        )
      ),
      block('## Photos', list(presskit.map((photo) => `- ${photo.file}: ${photo.caption}`)))
    ),

    '/apps': block(
      block(
        '## Google Play',
        list(
          googleplay.map(
            (app) =>
              `- ${link(app.name ?? app.title ?? '', fileUrl(markdownPath(projectRoute('googleplay', app))))}: ${truncate(app.description ?? '')}`
          )
        )
      ),
      block(
        '## Microsoft Store',
        list(
          windows.map(
            (app) =>
              `- ${link(app.name ?? app.title ?? '', fileUrl(markdownPath(projectRoute('windows', app))))}: ${truncate(app.description ?? '')}`
          )
        )
      )
    ),

    '/links': block(
      '## Links',
      list(
        links
          .filter((item) => item.enabled !== false)
          .map((item) => `- ${link(item.title ?? item.label ?? '', item.url)}`)
      )
    ),

    '/all-contacts': block(
      '## Profiles and channels',
      list(contacts.map((item) => `- ${link(item.label ?? item.title ?? '', item.url)}`))
    ),

    '/rankings/github': block(
      '## Repositories by stars',
      list(
        topGithub.map(
          (repo, index) =>
            `${index + 1}. ${link(repo.name ?? '', fileUrl(markdownPath(projectRoute('github', repo))))}: ${repo.stargazers_count ?? 0} stars, ${repo.forks_count ?? 0} forks${repo.language ? `, ${repo.language}` : ''}`
        )
      )
    ),

    '/rankings/npm': block(
      '## Packages by downloads',
      list(
        topNpm.map(
          (pkg, index) =>
            `${index + 1}. ${link(pkg.name ?? '', fileUrl(markdownPath(projectRoute('npm', pkg))))}: ${pkg.downloads ?? 0} downloads`
        )
      )
    ),

    '/sitemap': block(
      '## XML sitemaps',
      list([
        `- ${link('sitemap.xml', fileUrl('/sitemap.xml'))}: index of the three below.`,
        `- ${link('sitemap-site.xml', fileUrl('/sitemap-site.xml'))}: site pages.`,
        `- ${link('sitemap-project-github.xml', fileUrl('/sitemap-project-github.xml'))}: GitHub project pages.`,
        `- ${link('sitemap-homepage-github.xml', fileUrl('/sitemap-homepage-github.xml'))}: GitHub Pages homepages.`,
      ])
    ),
  };
}

// ── main ─────────────────────────────────────────────────────────────────────

function generate(): void {
  console.log('Generating llms.txt and Markdown mirrors...');

  const config = readOne<LlmsConfig>('llms');
  const posts = readEntries('posts');
  const talks = readEntries('talks');
  const timeline = readAll<TimelineItem>('timeline');

  const projects = Object.fromEntries(
    PROJECT_TYPES.map((type) => [type, readAll<Project>(type)])
  ) as Record<ProjectType, Project[]>;

  const projectCount = PROJECT_TYPES.reduce((sum, type) => sum + projects[type].length, 0);
  const documents: Array<{ routePath: string; body: string }> = [];

  const counts: SiteCounts = {
    posts: posts.length,
    talks: talks.length,
    projects: projectCount,
    timeline: timeline.length,
  };
  const recentPosts = posts.filter((post) => post.lang === 'en').slice(0, 10);
  const recentTalks = talks.filter((talk) => talk.lang === 'en').slice(0, 5);
  const profile: Profile = {
    about: readOne<Profile['about']>('about'),
    skills: readAll<SkillGroup>('skills'),
    work: readAll<WorkItem>('work'),
    featured: readAll<FeaturedProject>('projects'),
  };

  // Markdown mirrors, one per HTML page that has content behind it
  for (const post of posts) {
    const routePath = entryRoute('post', post);
    const body = renderEntry('post', post);
    writeFile(markdownPath(routePath), body);
    documents.push({ routePath, body });
  }

  for (const talk of talks) {
    const routePath = entryRoute('talk', talk);
    const body = renderEntry('talk', talk);
    writeFile(markdownPath(routePath), body);
    documents.push({ routePath, body });
  }

  for (const type of PROJECT_TYPES) {
    for (const project of projects[type]) {
      if (!titleToSlug(project.name ?? project.title ?? '')) continue;
      const routePath = projectRoute(type, project);
      const body = renderProject(type, project);
      writeFile(markdownPath(routePath), body);
      documents.push({ routePath, body });
    }
  }

  // Index files
  const postsIndex = renderEntryIndex(
    'Posts, Tiago Danin',
    'Articles on mobile development, security and open source.',
    'post',
    posts
  );
  const talksIndex = renderEntryIndex(
    'Talks, Tiago Danin',
    'Conference and meetup talks, most with a recording.',
    'talk',
    talks
  );
  const projectsIndex = renderProjectsIndex(projects);
  const timelineIndex = renderTimelineIndex(timeline);

  // The FAQ. readFaq() throws when the two locale files disagree on which
  // questions exist, which is the one way /faq/ can break silently.
  const faqEntries = readFaq();
  const polybar = projects.github.find(repo => repo.name === 'Awesome-Polybar');
  const faqCounts: FaqCounts = {
    talks: talks.filter(talk => talk.lang === 'en').length,
    posts: posts.filter(post => post.lang === 'en').length,
    repos: projects.github.length,
    npm: projects.npm.length,
    npmDownloads: projects.npm.reduce((sum, pkg) => sum + (pkg.downloads ?? 0), 0),
    polybarStars: polybar?.stargazers_count ?? 0,
  };

  for (const entry of faqEntries) {
    // Only the questions with a body exist as pages, so only they get a mirror.
    // Announcing a .md for a question that has no page promises a 404.
    if (!(entry.body ?? '').trim()) continue;
    const routePath = faqRoute(entry);
    const body = renderFaqEntry(entry, faqCounts);
    writeFile(markdownPath(routePath), body);
    documents.push({ routePath, body });
  }

  const faqIndex = renderFaqIndex(faqEntries, faqCounts);
  writeFile('/faq.txt', faqIndex);

  const businessBody = renderBusiness(
    readOne<BusinessRow>('business'),
    faqCounts,
    readOne<{ email: string }>('about').email,
    readAll<SkillGroup>('skills'),
    businessYears()
  );

  // Every listing exists twice at the root: .txt for the llms.txt convention and
  // .md for anything that follows a Markdown link. Same bytes, two extensions, so
  // neither audience has to guess which one this site happens to publish.
  const listings: Array<[string, string]> = [
    ['posts', postsIndex],
    ['talks', talksIndex],
    ['projects', projectsIndex],
    ['timeline', timelineIndex],
  ];

  for (const [name, body] of listings) {
    writeFile(`/${name}.txt`, body);
    writeFile(`/${name}.md`, body);
  }

  // Markdown mirror for every page announced in contents/llms
  const pageBodies = buildPageBodies({
    '/blog': postsIndex,
    '/talks': talksIndex,
    '/projects': projectsIndex,
    '/timeline': timelineIndex,
    '/faq': faqIndex,
    '/business': businessBody,
  });

  for (const page of config.pages) {
    if (page.path === '/') continue;
    const body = pageBodies[page.path];
    if (!body) {
      throw new Error(
        `contents/llms lists ${page.path} but no mirror is built for it. ` +
          'Add it to buildPageBodies, or the .md link in llms.txt will 404.'
      );
    }
    writeFile(markdownPath(page.path), renderPage(page, body));
    documents.push({ routePath: page.path, body });
  }

  // The home mirror carries the same sections as llms.txt, so an agent that lands
  // on /index.md gets the full picture without having to fetch the index too.
  const homePage = config.pages.find((page) => page.path === '/');
  if (homePage) {
    const homeBody = block(
      config.summary,
      config.note,
      siteSections(config, counts, recentPosts, recentTalks, profile)
    );
    writeFile('/index.md', renderPage(homePage, homeBody));
    documents.push({ routePath: '/', body: homeBody });
  }

  writeFile('/llms.txt', renderLlmsTxt(config, counts, recentPosts, recentTalks, profile));

  writeFile('/llms-full.txt', renderLlmsFull(documents));

  console.log(`  ${posts.length} posts, ${talks.length} talks, ${projectCount} projects`);
  console.log(`  ${documents.length} Markdown mirrors`);
  console.log(`  ${faqEntries.length} FAQ questions, ${faqEntries.filter(e => (e.body ?? '').trim()).length} with a page`);
  console.log('  llms.txt, posts.txt, talks.txt, projects.txt, timeline.txt, faq.txt, llms-full.txt');
  console.log('Machine-readable files generated successfully');
}

generate();
