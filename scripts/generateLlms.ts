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
import matter from 'gray-matter';
import { titleToSlug } from '../src/utils/parse';

const siteUrl = 'https://tiagodanin.com';
const publicDir = path.join(process.cwd(), 'public');
const contentsDir = path.join(process.cwd(), 'contents');

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

function readJson<T>(collection: string): T {
  return JSON.parse(fs.readFileSync(path.join(contentsDir, collection, 'index.json'), 'utf8')) as T;
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

function absoluteUrl(routePath: string): string {
  return `${siteUrl}${routePath}`;
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

function readEntries(collection: 'posts' | 'talks'): Entry[] {
  const dir = path.join(contentsDir, collection);

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const parsed = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      const data = parsed.data as Omit<Entry, 'body'>;
      return {
        ...data,
        lang: file.includes('.pt.') ? 'pt' : 'en',
        body: mdxToMarkdown(parsed.content),
      };
    })
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

/** `/post/slug` in English, `/post/slug/pt` in Portuguese. */
function entryRoute(prefix: string, entry: Entry): string {
  return entry.lang === 'pt' ? `/${prefix}/${entry.slug}/pt` : `/${prefix}/${entry.slug}`;
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
      `- HTML version: ${absoluteUrl(routePath)}`,
      `- Site index for AI assistants: ${absoluteUrl('/llms.txt')}`,
    ])
  );
}

function footer(): string {
  return block(
    '---',
    `Published by Tiago Danin. Free to quote with attribution and a link to ${siteUrl}.`
  );
}

function renderEntry(prefix: string, entry: Entry): string {
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

function entryLine(prefix: string, entry: Entry): string {
  const routePath = entryRoute(prefix, entry);
  const date = entry.date ? `${entry.date}, ` : '';
  return `- ${link(entry.title, absoluteUrl(markdownPath(routePath)))}: ${date}${truncate(entry.description)}`;
}

function renderEntryIndex(
  heading: string,
  intro: string,
  prefix: string,
  entries: Entry[]
): string {
  const en = entries.filter((entry) => entry.lang === 'en');
  const pt = entries.filter((entry) => entry.lang === 'pt');

  return block(
    `# ${heading}`,
    `> ${intro}`,
    list([
      `- Site index for AI assistants: ${absoluteUrl('/llms.txt')}`,
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
  return `- ${link(name, absoluteUrl(markdownPath(projectRoute(type, project))))}: ${stars}${truncate(description)}`;
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
      `- Site index for AI assistants: ${absoluteUrl('/llms.txt')}`,
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
    list([`- Site index for AI assistants: ${absoluteUrl('/llms.txt')}`]),
    list(
      timeline.map(
        (item) =>
          `- ${item.date}, ${item.title}: ${item.description}${item.tags?.length ? ` (${item.tags.join(', ')})` : ''}`
      )
    ),
    footer()
  );
}

/**
 * The entry point. Kept short on purpose: an assistant should be able to read it
 * whole and then follow one link, so the long lists live in their own files.
 */
function renderLlmsTxt(
  config: LlmsConfig,
  counts: { posts: number; talks: number; projects: number; timeline: number },
  recentPosts: Entry[],
  recentTalks: Entry[],
  profile: {
    about: { bio: string; bioExtra: string; email: string };
    skills: SkillGroup[];
    work: WorkItem[];
    featured: FeaturedProject[];
  }
): string {
  return block(
    `# ${config.title}`,
    `> ${config.summary}`,
    config.note,
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
            `- ${link(page.title, absoluteUrl(markdownPath(page.path)))}: ${page.description}`
        )
      )
    ),
    block(
      '## Full listings',
      list([
        `- ${link('Posts', absoluteUrl('/posts.txt'))}: all ${counts.posts} articles, English and Portuguese.`,
        `- ${link('Talks', absoluteUrl('/talks.txt'))}: all ${counts.talks} talks, English and Portuguese.`,
        `- ${link('Projects', absoluteUrl('/projects.txt'))}: all ${counts.projects} projects across ten channels.`,
        `- ${link('Timeline', absoluteUrl('/timeline.txt'))}: all ${counts.timeline} career milestones.`,
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
        `- ${link('llms-full.txt', absoluteUrl('/llms-full.txt'))}: every page of this site in one file.`,
        `- ${link('sitemap.xml', absoluteUrl('/sitemap.xml'))}: the XML sitemap index.`,
        `- ${link('RSS feeds', absoluteUrl('/rss'))}: blog, talks, timeline and projects.`,
      ])
    )
  );
}

function renderLlmsFull(documents: Array<{ routePath: string; body: string }>): string {
  return block(
    '# Tiago Danin, complete site content',
    '> Every page of tiagodanin.com in one file, for ingestion in a single request.',
    list([
      `- Slim index: ${absoluteUrl('/llms.txt')}`,
      `- Documents: ${documents.length}`,
    ]),
    ...documents.map((doc) =>
      block(`<!-- ${absoluteUrl(doc.routePath)} -->`, doc.body)
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
function buildPageBodies(indexes: Record<string, string>): Record<string, string> {
  const about = readJson<{ bio: string; bioExtra: string; email: string; cvUrl: string }>('about');
  const work = readJson<WorkItem[]>('work');
  const volunteer = readJson<WorkItem[]>('volunteer');
  const skills = readJson<SkillGroup[]>('skills');
  const expertise = readJson<PageRef[] & Array<{ title: string; description: string }>>('expertise');
  const press = readJson<PressItem[]>('press');
  const bios = readJson<BioItem[]>('bios');
  const presskit = readJson<Array<{ file: string; caption: string }>>('presskit');
  const links = readJson<LabelledLink[]>('links');
  const contacts = readJson<LabelledLink[]>('contacts');
  const googleplay = readJson<Project[]>('googleplay');
  const windows = readJson<Project[]>('windows');
  const github = readJson<Project[]>('github');
  const npm = readJson<Project[]>('npm');

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

    '/services': block(
      ...expertise.map((item) => block(`## ${item.title}`, item.description))
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
              `- ${link(app.name ?? app.title ?? '', absoluteUrl(markdownPath(projectRoute('googleplay', app))))}: ${truncate(app.description ?? '')}`
          )
        )
      ),
      block(
        '## Microsoft Store',
        list(
          windows.map(
            (app) =>
              `- ${link(app.name ?? app.title ?? '', absoluteUrl(markdownPath(projectRoute('windows', app))))}: ${truncate(app.description ?? '')}`
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
            `${index + 1}. ${link(repo.name ?? '', absoluteUrl(markdownPath(projectRoute('github', repo))))}: ${repo.stargazers_count ?? 0} stars, ${repo.forks_count ?? 0} forks${repo.language ? `, ${repo.language}` : ''}`
        )
      )
    ),

    '/rankings/npm': block(
      '## Packages by downloads',
      list(
        topNpm.map(
          (pkg, index) =>
            `${index + 1}. ${link(pkg.name ?? '', absoluteUrl(markdownPath(projectRoute('npm', pkg))))}: ${pkg.downloads ?? 0} downloads`
        )
      )
    ),

    '/sitemap': block(
      '## XML sitemaps',
      list([
        `- ${link('sitemap.xml', absoluteUrl('/sitemap.xml'))}: index of the three below.`,
        `- ${link('sitemap-site.xml', absoluteUrl('/sitemap-site.xml'))}: site pages.`,
        `- ${link('sitemap-project-github.xml', absoluteUrl('/sitemap-project-github.xml'))}: GitHub project pages.`,
        `- ${link('sitemap-homepage-github.xml', absoluteUrl('/sitemap-homepage-github.xml'))}: GitHub Pages homepages.`,
      ])
    ),
  };
}

// ── main ─────────────────────────────────────────────────────────────────────

function generate(): void {
  console.log('Generating llms.txt and Markdown mirrors...');

  const config = readJson<LlmsConfig>('llms');
  const posts = readEntries('posts');
  const talks = readEntries('talks');
  const timeline = readJson<TimelineItem[]>('timeline');

  const projects = Object.fromEntries(
    PROJECT_TYPES.map((type) => [type, readJson<Project[]>(type)])
  ) as Record<ProjectType, Project[]>;

  const projectCount = PROJECT_TYPES.reduce((sum, type) => sum + projects[type].length, 0);
  const documents: Array<{ routePath: string; body: string }> = [];

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

  writeFile('/posts.txt', postsIndex);
  writeFile('/talks.txt', talksIndex);
  writeFile('/projects.txt', projectsIndex);
  writeFile('/timeline.txt', timelineIndex);

  // Markdown mirror for every page announced in contents/llms
  const pageBodies = buildPageBodies({
    '/blog': postsIndex,
    '/talks': talksIndex,
    '/projects': projectsIndex,
    '/timeline': timelineIndex,
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

  // The home mirror is the site map in prose: what exists and where
  const homePage = config.pages.find((page) => page.path === '/');
  if (homePage) {
    const homeBody = block(
      config.summary,
      config.note,
      block(
        '## Pages',
        list(
          config.pages
            .filter((page) => page.path !== '/')
            .map(
              (page) =>
                `- ${link(page.title, absoluteUrl(markdownPath(page.path)))}: ${page.description}`
            )
        )
      )
    );
    writeFile('/index.md', renderPage(homePage, homeBody));
    documents.push({ routePath: '/', body: homeBody });
  }

  const recentPosts = posts.filter((post) => post.lang === 'en').slice(0, 10);
  const recentTalks = talks.filter((talk) => talk.lang === 'en').slice(0, 5);

  writeFile(
    '/llms.txt',
    renderLlmsTxt(
      config,
      {
        posts: posts.length,
        talks: talks.length,
        projects: projectCount,
        timeline: timeline.length,
      },
      recentPosts,
      recentTalks,
      {
        about: readJson<{ bio: string; bioExtra: string; email: string }>('about'),
        skills: readJson<SkillGroup[]>('skills'),
        work: readJson<WorkItem[]>('work'),
        featured: readJson<FeaturedProject[]>('projects'),
      }
    )
  );

  writeFile('/llms-full.txt', renderLlmsFull(documents));

  console.log(`  ${posts.length} posts, ${talks.length} talks, ${projectCount} projects`);
  console.log(`  ${documents.length} Markdown mirrors`);
  console.log('  llms.txt, posts.txt, talks.txt, projects.txt, timeline.txt, llms-full.txt');
  console.log('Machine-readable files generated successfully');
}

generate();
