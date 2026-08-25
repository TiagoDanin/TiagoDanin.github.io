# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tiago Danin's personal website: Next.js 16 (App Router) + React 19 + TypeScript, statically exported to `dist/` and deployed on GitHub Pages. It showcases blog posts, talks, projects, timeline events, press coverage and professional information, in English and Portuguese.

## Development Commands

```bash
# Development
yarn dev                    # Start dev server (webpack, required - see below)
yarn build                  # Build for production (static export to dist/)
yarn start                  # Start production server

# Data Generation
yarn data:github           # Fetch GitHub projects into contents/github/
yarn data:npm              # Fetch NPM packages into contents/npm/
yarn data:rss              # Generate RSS feeds into public/rss/

# Sitemap Generation
yarn sitemap               # generateSitemaps.ts + next-sitemap

# Machine-readable layer (also runs inside yarn build)
yarn data:llms             # llms.txt, the *.txt lists and the .md page mirrors

# Component catalog
yarn storybook             # Storybook dev server on :6006, also serves the MCP endpoint at /mcp
yarn build-storybook       # Static catalog into storybook-static/

# Full Deployment Pipeline
yarn deploy                # data:github + data:rss + build + sitemap + build (second build picks up the generated sitemap)
```

Package manager is **Yarn 4** (`packageManager: yarn@4.6.0`, Corepack). Node version is pinned in `.nvmrc`.

`yarn build` runs `yarn data` first (`data:rss` + `data:llms`), so a plain build never ships a stale text layer. `yarn sitemap` is **not** part of `build`: only `yarn deploy` chains it. Run `yarn data:github` / `yarn data:npm` manually when you need fresh external data.

**Do not add `pre`/`post` script hooks.** Yarn 4 does not execute them, unlike npm. The project shipped a `prebuild: yarn data:rss && yarn data:llms` that silently never ran, and the whole `llms.txt` layer 404'd in production for as long as it existed. Every generation step must be chained explicitly.

**No headless test runner is configured** (no jest/vitest, no `test` script). Stories carry `play` functions with real assertions, but without `@storybook/addon-vitest` they only execute when a story is opened in the browser, where results show in the Interactions panel. Nothing runs them in CI. Treat correctness claims for UI changes as unverified until exercised in Storybook or the site, and do not report play functions as passing tests unless you actually watched them run.

**`yarn lint` is currently broken.** The script still calls `next lint`, which Next 16 removed; it now parses `lint` as a directory and fails with `Invalid project directory provided`. There is also no `eslint.config.*` / `.eslintrc*` in the repo. Do not run it to validate a change and do not report it as passing. Verify types by reading them directly or with `npx tsc --noEmit`.

## Architecture

### Core Structure
- **Next.js App Router** in `src/app/` with TypeScript
- **Static Export** (`output: "export"`, `trailingSlash: true`, `distDir: 'dist'`) for GitHub Pages
- **Component-Based**: React components with shadcn/ui + Radix UI
- **Data-Driven**: all content lives in `contents/` collections, accessed via nextjs-studio

### Key Directories
- `src/app/`: App Router pages and layouts
- `src/components/`: `layout/`, `sections/`, `ui/` (shadcn primitives + custom components)
- `src/lib/`: content helpers (`mdx.ts`, `talks.ts`, `press.ts`, `render-mdx.tsx`, `utils.ts`)
- `src/utils/parse.ts`: `titleToSlug`, `formatDate`, `toISODate`, tag/color helpers. The slug function here defines every project/post URL.
- `contents/`: all content collections
- `studio.config.ts`: nextjs-studio collection schemas and sync scripts
- `scripts/`: build-time generation. `getProjectsGithub.ts` / `getProjectsNPM.ts` fetch external data, `generateRss.ts` the feeds, `generateSitemaps.ts` the sitemap index and the two GitHub sitemaps, `generateLlms.ts` the machine-readable layer
- `public/`: static assets and generated RSS/sitemap files

`src/App.tsx` is an empty leftover from the pre-Next.js Vite/react-router version. `react-router-dom` and `@tanstack/react-query` are still in `package.json` for the same reason. Do not build on any of them.

### Data Flow
1. Scripts fetch external data (GitHub, NPM) and write to `contents/<collection>/index.json`
2. Server components read data with `queryCollection()` from `nextjs-studio/server`
3. RSS feeds (`blog`, `talks`, `timeline`, `projects`), sitemaps and the machine-readable layer are generated from `contents/` into `public/`
4. Static site is exported to `dist/`, uploaded by `.github/workflows/deploy.yml`, which runs `yarn deploy` on every push to `main`

### Routing Architecture

All dynamic routes are statically pre-rendered via `generateStaticParams()`. Adding content to a collection is enough for a page to exist; there is no runtime fallback.

**Bilingual routing is duplicated route segments, not i18n middleware.** English lives at the base path and Portuguese at a `/pt` child segment:

| English | Portuguese |
|---|---|
| `/blog`, `/blog/[page]` | `/blog/pt` |
| `/post/[slug]` | `/post/[slug]/pt` |
| `/talks` | `/talks/pt` |
| `/talk/[slug]` | `/talk/[slug]/pt` |

The locale of a post/talk comes from the **filename suffix**, not from frontmatter alone: `my-post.mdx` is EN, `my-post.pt.mdx` is PT. `src/lib/mdx.ts` and `src/lib/talks.ts` wrap this: `getPostBySlug(slug, lang)` / `getTalkBySlug(slug, lang)` and `postHasLocale` / `talkHasLocale`. Use the `*HasLocale` helpers before emitting `alternates.languages` in metadata so hreflang never points at a page that was not generated.

**Project routes** are `/project/[type]/[slug]`, where `type` is one of ten collections mapped in `src/app/project/[type]/[slug]/page.tsx`: `github`, `private`, `npm`, `luarocks`, `pypi`, `atom`, `googleplay`, `windows`, `aur`, `offline`. Slugs come from `titleToSlug(project.name ?? project.title)`. Adding a new project source means adding the collection *and* registering it in `getProjectsMap()` plus `urlPrefixMap`.

Other dynamic routes: `/app/[appId]`, `/skills/[slug]`, `/social/[network]`, `/tags/[tag]`, `/blog/tags/[tag]`, `/timeline/[year]/[slug]`.

### Component Architecture
- **Layout**: `Navbar`, `Footer`
- **Sections**: page-level blocks (`Hero`, `Projects`, `RecentPosts`, `Services`, `Testimonials`, `Work`, `CallToAction`, `Milestones`, `PressMentions`, ...) plus the per-page client blocks (`BioBrowser`, `FeedbackForm`, `WebViewClient`, `GitHubRankingsClient`, `NPMRankingsClient`)
- **UI**: shadcn/ui primitives plus project components (`ArticleCard`, `ProjectCard`, `TagFilter`, `CopyButton`, `GiscusComments`, `SocialLinks`, `AnimatedCounter`, `StepIndicator`, `RatingRow`, `FeedItem`, `SitemapTable`)
- **Utilities**: `cn()` in `src/lib/utils.ts`

**No component lives under `src/app/`.** Routes only compose. Anything with markup belongs in `src/components/`, which is what keeps the catalog complete and lets a block be reused by a second route without a move. Small helpers extracted from pages sit in `ui/`; whole page blocks sit in `sections/`.

`AnimatedCounter` was copied verbatim into both ranking pages before it was extracted. If you find yourself pasting a component into a second page, extract it instead.

**31 of the 57 shadcn primitives have zero importers.** They ship with the install and no page renders them. They are documented in Storybook and labelled as unused, so reach for one that already exists before adding a dependency.

### Styling
- **Tailwind CSS** (v3), mobile-first.
- **CSS Custom Properties**: theme variables in `globals.css` (currently HSL-based shadcn defaults; the design direction in `DESIGN.md` migrates these to OKLCH tokens).
- **No dark mode**: brand decision recorded in `PRODUCT.md`. The `.dark` block in `globals.css` and `next-themes` are legacy and should not be reintroduced or wired to a toggle.

### Content Management

The site uses **nextjs-studio** as a content layer. All collections live in `contents/`, replacing the old `src/data/` imports (that directory no longer exists).

- **Posts**: `.mdx` files in `contents/posts/` with frontmatter (`title`, `date`, `description`, `slug`, `originalUrl`, `lang`, `cover`, `tags`). Bilingual via filename suffix. Treat EN and PT as equal-weight surfaces.
- **Talks**: `.mdx` files in `contents/talks/`, same bilingual convention, plus `event`, `edition`, `youtubeUrl`.
- **Projects**: multiple JSON sources - `contents/github/`, `contents/npm/`, `contents/private/`, `contents/pypi/`, and the rest of the ten types above.
- **Timeline / Work / Volunteer**: `contents/timeline/`, `contents/work/`, `contents/volunteer/`
- **Press**: `contents/press/` (coverage), `contents/presskit/` and `contents/bios/` (press kit)
- **Site copy**: `contents/about/`, `contents/expertise/`, `contents/skills/`, `contents/testimonials/`, `contents/sociallinks/`, `contents/menu/`, `contents/contacts/`, `contents/links/`

#### Data Access Patterns

**nextjs-studio** has two entry points:
- `nextjs-studio` - client-safe: types and pure utilities (no fs)
- `nextjs-studio/server` - server-only: auto-init, FsAdapter, `queryCollection`, `loadContent`

**Server components** (pages, layouts, server-only components):
```ts
import { queryCollection } from 'nextjs-studio/server';
```

**Client components** (`'use client'`) must **NOT** call `queryCollection` - they can only import types from `nextjs-studio`. Data must be fetched in a parent server component and passed as props:
```ts
// Server component (page.tsx)
import { queryCollection } from 'nextjs-studio/server';
const posts = queryCollection('posts');
return <ClientComponent posts={[...posts]} />;
// Spread into an array to serialize QueryResult for the client
```

Query API in use across the codebase: `.where({...})`, `.locale('pt')`, `.first()`, `.count()`, and `.one()` for singleton collections (e.g. `queryCollection('about').one()`).

**Do NOT** import JSON directly from `contents/` - always use the `queryCollection` API. The only exception is build-time scripts in `scripts/`, which run outside Next and read the JSON with `fs`.

`next.config.ts` wraps the config with `withStudio()` from `nextjs-studio/next`. That is what makes saving a file in `contents/` refresh the browser in dev; without it the dev server serves fresh content only on a full page load. It only works on webpack, which is why `yarn dev` and `yarn build` both pass `--webpack` explicitly. Next 16 defaults to Turbopack and aborts the build when a `webpack` config is present without a `turbopack` config, so the flag is required, not optional.

#### Never hardcode content in code

**nextjs-studio is the CMS. Copy belongs in `contents/`, never in a `.ts`/`.tsx` file.** If a change adds prose the user could plausibly want to edit later (bios, page copy, descriptions, quotes, FAQ answers, list items with text), it goes in a collection:

1. Add the collection to `studio.config.ts` with a `schema` so it is editable in the studio UI.
2. Write the data to `contents/<collection>/index.json`.
3. Read it in the server component with `queryCollection('<collection>')`.

Do not create a `data.ts`, `copy.ts`, or `*.ts` file that exports strings of user-facing text, and do not inline long prose as JSX literals. Hardcoding content in code makes it invisible to the CMS and forces the user to ask for a code change to fix a sentence.

**Values computed at build time are the exception.** Numbers derived from other collections (years of experience, counts, dates) stay in code. Write them into the content as `{placeholder}` tokens and interpolate at render time. Example: `contents/bios/index.json` stores `"com mais de {years} anos"` and `src/lib/bios.ts` fills `{years}` in `buildBios`.

Code in the same folder as a collection consumer should only hold types, UI chrome labels (button text, aria labels, tab names) and the interpolation helper.

## TypeScript Rules

- **Never use `any`** - always use proper types. Use `unknown` when the type is truly unknown, or define explicit interfaces/types. Using `any` defeats the purpose of TypeScript.

## Design Context

Strategic and visual direction live at the project root. Read these before any UI work, refactor, or content change that affects how the site looks or feels.

- **`PRODUCT.md`** (strategic): register, users, brand personality, anti-references, design principles, accessibility. Register is `brand`.
- **`DESIGN.md`** (visual): tokens, typography, elevation, components, do's and don'ts. Follows the Stitch DESIGN.md format.

Key strategic principles (from PRODUCT.md): **Show, don't tell** · **Practice what you preach** · **Open source first** · **Sem hype** · **Bilíngue de verdade**.

Visual baseline (from DESIGN.md):
- **Light theme único.** Fundo branco `#ffffff`. Sem dark mode toggle.
- **Pastel blur orbs** (verde-100, azul-100, lilás-100, amarelo-100) como ambiente de seções; é marca registrada do site, não anti-pattern.
- **Slate ink sobre branco** (shadcn defaults). Texto principal é slate; pastéis vivem só em blur.
- **shadow-sm em repouso, shadow-md/lg no hover** é bem-vindo em cards.
- Tipografia system-sans (`ui-sans-serif`); hierarquia via peso (400/600/700).

Hard bans:
- No dark mode toggle (brand decision).
- No gradient text (`background-clip: text` com gradient).
- No side-stripe borders >1px como faixa colorida em cards/alerts.
- No hero-metric template (número grande + label + 3 stats com gradient accent).
- No SaaS template copy ("We help X grow", "Always looking for new challenges", "Let's build something amazing").
- No solto de cor fora do sistema (`bg-blue-600` hardcoded etc.).
- No em-dashes (—) em UI copy; en-dash (–) em ranges de data; vírgula no resto. (Prose de blog é livre.)
- No `hover:scale` ou `translateY` em **cards inteiros** (em badges/ícones pequenos é aceitável).

Use `/impeccable <command>` for design work. Each command reads `PRODUCT.md` and `DESIGN.md` before acting.

## Storybook

Every component in `src/components/` has a story beside it. `yarn storybook` serves the catalog on `:6006`.

**Storybook 10 with `@storybook/nextjs` on the webpack builder.** Not `nextjs-vite`: that framework does not support Next 16, and this project already requires webpack because of `withStudio()`. Import `Meta` and `StoryObj` from `@storybook/nextjs`, and test helpers from `storybook/test` (no `@` prefix; `@storybook/test` was removed in v9).

### The rule that makes it work

**A component takes props and never calls `queryCollection`.** That function reads the filesystem, so a component that queries its own data renders on the site and cannot render anywhere else. The page reads, the component draws:

```tsx
const hero = getHeroData();
<Hero about={hero.about} stats={hero.stats} socialLinks={hero.socialLinks} />
```

`Hero`, `Services`, `Testimonials` and `CallToAction` used to query directly and were rewritten. Do not reintroduce the pattern in a component.

Where the data prep goes depends on how heavy it is. A single `queryCollection` call stays inline in the page. Anything more, twenty lines of derived counts, or the same lookup repeated across six routes, goes in `src/lib/sections.ts` (the same split `src/lib/press.ts` already uses). Sections are the exception, not the rule: most components already received props.

### Conventions

- The story sits next to its component: `ui/ArticleCard.tsx` gets `ui/ArticleCard.stories.tsx`. shadcn files are lowercase but their stories are PascalCase (`badge.tsx` -> `Badge.stories.tsx`).
- `title` mirrors the folder: `Layout/*`, `Sections/*`, `UI/*`.
- **Documentation is written in English**, including every story's JSDoc, which becomes its description in the docs page.
- `tags: ['autodocs']` is global in `preview.tsx`. Never repeat it per story.
- Sections use `layout: 'fullscreen'`; small components use `'centered'` or `'padded'`.
- Radix overlays render in a portal, outside the story canvas. Query them with `screen`, not `canvas`.
- Fixtures use real portfolio content (Flutter, npm packages, HackerOne, talks), never Lorem ipsum.

Standalone docs pages (`Introduction.mdx`, `DesignTokens.mdx`) live in `.storybook/` because they belong to no single component. The token page reads the live `globals.css`, so a swatch that looks wrong there is wrong in production.

`a11y.test` is set to `'todo'`: violations are reported without failing the story. Move it to `'error'` once the catalog is audited.

### The MCP server

`@storybook/addon-mcp` exposes the catalog at `http://localhost:6006/mcp`, registered in `.mcp.json`. It only answers while `yarn storybook` is running.

Query it instead of reading types out of `node_modules`: `list-all-documentation` to see what exists, `get-documentation` for a component's real props, `get-storybook-story-instructions` for conventions, `preview-stories` for rendered preview URLs after a visual change. **Never assume a prop from its name.** If the tools do not document it, it does not exist.

## Project Skills

`.claude/skills/` holds project skills (`create-post`, `create-talk`, `create-timeline`, `sort-data`, `sync-projects`, `validate-data`, `generate-metadata`, `deploy-site`, `impeccable`), plus two that are not plain single-file skills:

- **`seo/`** is a router, not a skill in itself. It carries 22 sub-skills from [marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT) in subfolders, each with its own `references/`, plus a shared `tools/`. They live nested so they cost one entry in the skill list instead of 22, and so several can be chained in one task. `seo/SKILL.md` holds the routing index, the task pipelines and the project-specific rules that override the upstream skills — those were written for B2B SaaS and need translating for a personal site. Do not edit the sub-skills: updating means re-copying from upstream, so project-specific tweaks belong in `seo/SKILL.md`.
- **`skill-creator`** is a symlink to `.agents/skills/skill-creator` (untracked).

**Several of the older skills, and `.claude/skills/README.md`, still describe the old `src/data/*.json` layout and predate the MDX migration.** Their intent (slug rules, date formats, ordering, validation checks) is still useful, but when a skill tells you to edit `src/data/posts.json` or `src/data/talks.json`, write to the `contents/` collection instead: posts and talks are `.mdx` files, everything else is `contents/<collection>/index.json`. Prefer the conventions in this file over the skill text where they disagree.

## SEO Conventions

Metadata is defined per page with `generateMetadata`, hardcoding `https://tiagodanin.com` as the origin (static export has no request context).

### Trailing slash: two rules, not one

`next.config.ts` sets `trailingSlash: true`, and the two kinds of URL take **opposite** rules. Verified against production:

| URL | Correct form | The other form |
|---|---|---|
| HTML route (`/about`, `/project/github/x`) | **with** `/` | 301 redirect |
| Static file (`.md`, `.txt`, `.xml`) | **without** `/` | 404 |
| Home `/` | either | same resource |

**Next normalizes this for you inside `metadata`.** `alternates.canonical`, `openGraph.url` and `alternates.languages` all come out with the slash even when the source string lacks it, and Next correctly leaves `alternates.types` file URLs alone. Do not "fix" those by hand: the output was already right.

**Next does not touch anything else.** Raw strings inside a JSON-LD `<script>`, and every URL built in `scripts/`, are emitted verbatim. Those are the only places where the slash has to be written correctly by hand:

- JSON-LD `"url"` / `"item"` fields, which are page URLs and need the slash.
- `scripts/generateSitemaps.ts`, `generateRss.ts`: page URLs, need the slash.
- `scripts/generateLlms.ts`: use `pageUrl()` for routes and `fileUrl()` for `.md`/`.txt`/`.xml`. They exist precisely because one blanket helper cannot serve both.

A regex sweep over the whole repo is the wrong tool here: it cannot tell a route from a file, and it will happily corrupt `${...}` interpolations and schema.org placeholders like `{search_term_string}`.

- Always set `alternates.canonical`, and `alternates.languages` with `en-US`, `pt-BR` and `x-default` when a locale variant actually exists.
- Descriptions are truncated to 160 chars before use.
- Page priorities and changefreq are centralized in the `transform` function of `next-sitemap.config.cjs`; add new route prefixes there rather than leaving them at the 0.7 default.
- The site has four sitemaps, all generated and git-ignored. `scripts/generateSitemaps.ts` writes `sitemap.xml` (the index), `sitemap-project-github.xml` (one entry per `/project/github/[slug]` landing page) and `sitemap-homepage-github.xml` (the GitHub Pages homepages served under the custom domain, normalized from each repo's `homepage` field). `next-sitemap` then writes `sitemap-site.xml` for the site pages; it has `generateIndexSitemap: false` so it never overwrites the index, and excludes `/project/github/*` so the three lists stay disjoint.
- `/sitemap` renders all four as tables, reading the XML from `public/` at build time. That is why `yarn deploy` builds twice: the first build has no sitemaps to read.
- Blog posts carry Giscus comments via the `GiscusComments` component.

### Machine-readable layer

`scripts/generateLlms.ts` writes a second, plain-text face of the site into `public/`: `llms.txt` (slim index, llmstxt.org), `llms-full.txt` (whole site in one file), the `posts.txt` / `talks.txt` / `projects.txt` / `timeline.txt` lists, and a `.md` mirror of every HTML page at the same path. The lists are separate files so `llms.txt` stays short enough to be read in full.

Three things about it are worth knowing:

- **It runs as `yarn data:llms`, chained into `yarn data`** alongside `data:rss`, which `yarn build` calls before `next build`, so the text layer cannot drift from the HTML.
- **Its copy lives in `contents/llms/index.json`** (site title, summary, the note about bilingual routes, and the page list with descriptions), registered in `studio.config.ts` as "AI Index (llms.txt)". Adding a page there without a matching body in `buildPageBodies` throws at generation time on purpose: announcing a `.md` that was never written promises a 404 to whoever followed the link.
- **The output is git-ignored**, like the sitemaps. Everything under the `/public/*.md`, `/public/post/`, `/public/talk/`, `/public/project/` and `/public/rankings/` patterns is generated, plus `llms.txt`, `llms-full.txt` and the four `*.txt` lists. `public/images/press/README.md` is *not* generated, which is why the ignore rule is `/public/*.md` and not a recursive glob.

Pages announce their mirror with `<link rel="alternate" type="text/markdown">`, built by `withMarkdown()` / `markdownUrl()` in `src/lib/markdown-alternate.ts`. Use `withMarkdown(canonical)` when `alternates` has no `types` of its own; when the page already declares one (the RSS feeds on `/blog`, `/talks`, `/projects`, `/timeline`), add `'text/markdown': markdownUrl(canonical)` *inside* that existing `types` object. Spreading `withMarkdown` next to a later `types` key silently loses the Markdown link, since the explicit key wins.

Only the routes the generator actually writes carry the alternate: the pages in `contents/llms`, plus `/post/[slug]`, `/talk/[slug]`, their `/pt` variants and `/project/[type]/[slug]`. Routes without a mirror (`/tags`, `/skills/[slug]`, `/social/[network]`, `/blog/[page]`, `/app/[appId]`, `/timeline/[year]/[slug]`) must not get one.

## Important Notes

- TypeScript errors are ignored during builds (`typescript.ignoreBuildErrors: true`). The build will not surface type errors, and `yarn lint` is broken (see above), so type safety has to be checked by reading types or running `tsc` manually.
- Images are unoptimized (`images.unoptimized`) for static export compatibility; `next/image` gets no server-side optimization.
- All data must be pre-generated before building (`yarn build` chains `yarn data` for RSS and the llms layer; GitHub/NPM data is committed under `contents/`).
- Site uses Google Analytics (`G-4M6BE19CKV`) and Google Tag Manager (`GTM-WT3T53NB`), wired in `src/app/layout.tsx`.
- `.mcp.json` registers the `chrome-devtools` MCP server, useful for verifying UI changes in a real browser.
- Never run `yarn build`, `yarn deploy`, or any data-fetching command without explicit user permission. Builds are slow and overwrite generated files (`dist/`, `public/rss/`, `public/*sitemap*`, `contents/github`, `contents/npm`).
