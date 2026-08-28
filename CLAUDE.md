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

# Translation catalogs
yarn i18n:extract          # scan src/ for marked strings, rewrite the .po files (--clean drops obsolete)
yarn i18n:compile          # .po -> src/locales/<locale>/messages.ts (git-ignored, required to run anything)

# Component catalog
yarn storybook             # Storybook dev server on :6006, also serves the MCP endpoint at /mcp
yarn build-storybook       # Static catalog into storybook-static/

# Full Deployment Pipeline
yarn deploy                # data:github + build + sitemap + build (second build picks up the generated sitemap)
```

Package manager is **Yarn 4** (`packageManager: yarn@4.6.0`, Corepack). Node version is pinned in `.nvmrc`.

`yarn build` runs `yarn data` first (`data:rss` + `data:llms` + `i18n:compile`), so a plain build never ships a stale text layer or a stale catalog, then finishes with `scripts/flattenDefaultLocale.ts`. `yarn sitemap` is **not** part of `build`: only `yarn deploy` chains it. Run `yarn data:github` / `yarn data:npm` manually when you need fresh external data.

**A missing `i18n:compile` fails silently.** The compiled catalog is git-ignored, and Lingui renders the English source when it cannot find a translation, so a forgotten compile looks like "the translation did not work" rather than an error. That is why it is chained into `data` and into both `storybook` scripts.

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
3. RSS feeds, sitemaps and the machine-readable layer are generated from `contents/` into `public/`
4. Static site is exported to `dist/`, uploaded by `.github/workflows/deploy.yml`, which runs `yarn deploy` on every push to `main`

### Routing Architecture

All dynamic routes are statically pre-rendered via `generateStaticParams()`. Adding content to a collection is enough for a page to exist; there is no runtime fallback.

**`src/app/` holds no route groups.** The migration is finished: `(legacy)` went when its last route moved, and `(i18n)` went once it was clear it was buying nothing.

```
src/app/
  [lang]/      root layout + every route. One page.tsx per route,
               rendered once per locale.
  globals.css  favicon.ico
```

**There is no `app/layout.tsx`, and `layout.tsx` must not move out of `[lang]`.** It is the root layout, and being inside the dynamic segment is what lets it read the locale and emit `<html lang="en">` against `<html lang="pt-BR">`. At `app/layout.tsx` there are no params, so the tag would freeze at one value for the whole site.

A route group was long assumed to be the only way to have a root layout under `[lang]`. It is not: `app/[lang]/layout.tsx` is accepted as the root layout on its own, verified against the dev server with both languages still emitting their own `<html lang>`. `(i18n)` was ceremony.

**`not-found.tsx` also stays inside `[lang]`.** It builds to `dist/en/404.html`, which `flattenDefaultLocale.ts` moves to `dist/404.html`, and that single file is what GitHub Pages serves for every miss in either language. A root `app/not-found.tsx` would be the Next-default place for it, but it requires an `app/layout.tsx` and so costs the per-locale `<html lang>` for nothing: the 404 that ships is English either way.

**Adding a route is creating the file.** Put it under `[lang]/`, make it take `params`, and stop. There is nothing to register.

This used to take two hand-kept registries in `locales.ts`, `LOCALIZED_ROUTES` for exact paths and `LOCALIZED_PREFIXES` for subtrees, read by `localePath()`, by the sitemap generator and by the dev rewrites. A route missing from both still built, so the failure was silent: the Portuguese page existed, everything linked to the English one, and the English URL 404'd in dev. Four copies of the list accumulated and drifted, one of them deciding which English URLs announce an `hreflang` pair with six entries in it while the Portuguese sitemap announced the pair for all thirty.

What replaced each of them:

- **`localePath()`** prefixes any in-site path, with no list to consult. It leaves a path that is not ours to rewrite alone: an absolute URL, a `mailto:`, an anchor. Menu and card hrefs come from `contents/`, where an external link sits beside an internal one.
- **The dev rewrites** are one catch-all whose lookahead is built from `LOCALES`, so a new language needs no edit and a new route needs none either.
- **`scripts/appRoutes.cjs`** derives the static route list from the App Router tree, for the two places that genuinely need to enumerate pages: `scripts/generateSitemaps.ts` and `next-sitemap.config.cjs`. CommonJS because the latter can only `require`.

**A hardcoded `href` still bypasses all of it.** `localePath()` cannot fix a link that never calls it, and a page-level check misses one that lives in a component. Nine of them survived the migration this way, in `Services`, `Hero`, `Projects`, `ArticleCard`, `TagFilter`, both ranking pages and `FeedbackForm`, every one sending a Portuguese reader to the English page. Components take a `locale` prop and resolve their own internal links; the page passes it.

**Portuguese URLs are all prefix now.** The old trailing-segment form (`/blog/pt`, `/post/[slug]/pt`) is retired and no longer answers: the redirect pages that bridged it went with `(legacy)`. `splitLocale()` still recognises the suffix, so an inbound link is understood wherever a pathname is parsed, but nothing generates one.

**`CONTENT_SUFFIX` in `locales.ts` is the only thing that still knows about `pt`.** The MDX files are `.pt.mdx`, their frontmatter says `lang: "pt"`, and Giscus comment threads are keyed `slug-pt`. Renaming any of that would migrate indexed URLs and orphan every existing comment thread for nothing. Read it through `contentLang(locale)`; never hardcode either marker.

The locale of a post/talk comes from the **filename suffix**, not from frontmatter alone: `my-post.mdx` is EN, `my-post.pt.mdx` is PT. `src/lib/mdx.ts` and `src/lib/talks.ts` wrap this: `getPostBySlug(slug, lang)` / `getTalkBySlug(slug, lang)` and `postHasLocale` / `talkHasLocale`. Use the `*HasLocale` helpers before emitting `alternates.languages` in metadata so hreflang never points at a page that was not generated.

### Internationalization

Two layers, and putting a string in the wrong one is the mistake to avoid:

- **Prose** lives in `contents/`, one `index.<locale>.json` per language. Editable in the studio.
- **Chrome** (button labels, aria labels, headings, the strings inside `generateMetadata`) lives in `src/locales/<locale>/messages.po`, marked in the code with Lingui macros.

If a sentence is something the owner could plausibly want to reword later, it is prose and belongs in a collection.

**`/en/` does not exist.** English is served from `/` and only from there. `generateStaticParams` emits `/en/**` and `/br/**`, then `scripts/flattenDefaultLocale.ts` *moves* `dist/en/**` to the root and deletes it. Copying instead would publish two byte-identical URLs, and a canonical tag is a hint a crawler may ignore. That move is also what creates `dist/index.html`: no route generates `/` any more.

That move has three consequences worth knowing before debugging them:

1. **`next dev` has no build**, so `/` would 404 and `/about/` would error on a `[lang]` param that does not exist. `next.config.ts` swaps `output: "export"` for `rewrites` in development. The two are mutually exclusive, so **dev no longer enforces export compatibility**; `yarn build` is the gate.
2. **`next-sitemap` reads the route manifest, not `dist/`**, so it still thinks English lives under `/en`. Its config excludes `/en/*` and puts the real URLs back with `additionalPaths`.
3. **The root pages are not in the client route manifest.** Client-side navigation from `/` may fall back to a full page load. Unverified either way.

**Locale codes do not line up, on purpose.** `src/lib/i18n/locales.ts` holds all four mappings:

| Concept | English | Portuguese | Why |
|---|---|---|---|
| URL segment | (none) | `br` | `/br/` is an address, not a language tag |
| `HTML_LANG` (`<html lang>`, hreflang) | `en` | `pt-BR` | English is region-neutral; the Portuguese is Brazilian specifically |
| `OG_LOCALE` | `en_US` | `pt_BR` | Open Graph wants `language_TERRITORY`, which has no neutral form |
| `CONTENT_SUFFIX` (MDX files, legacy routes) | (none) | `pt` | those URLs are already indexed |

**Lingui rules.** Macros are transformed by `@lingui/swc-plugin` on the webpack builder; the known Next 16 incompatibility is Turbopack-only. Two config values are load-bearing and were both found the hard way: `format` must be `@lingui/format-po` (a bare `"po"` string is no longer accepted), and `compileNamespace` must be `"ts"`, because the default `cjs` namespace writes `module.exports`, which webpack hands back as an **empty object** to a Server Component, so every string falls back to English with no error.

- Server components publish the catalog with `initI18n(locale)`, which writes into React's per-request cache. **Call it in every page and every layout**, not just the root: that is how the App Router scopes it.
- **`not-found.tsx` is English, in every locale.** It receives no params, and the URL that missed carries no locale to read, so there is nothing to resolve and nothing worth translating. Keep them plain: no Lingui macros, no `localePath`. A `<Trans>` there also breaks the export, because Next renders a not-found outside the scope where the layout published the catalog.
- Client components are a separate bundle with their own module state, so they read from `LinguiClientProvider`. It serialises the whole catalog into each page, roughly 18 bytes gzip per message per page.
- `export const metadata = {...}` at module level cannot be translated: it evaluates once, in one locale. Use `generateMetadata`.
- A message containing literal braces needs ICU escaping (`'{'hotkey'}'`), or Lingui reads them as a placeholder and renders nothing.

**Never hand a raw locale code to `Intl`.** Use `intlLocale(code)`. The site's code is `br`, which is also a real language subtag (Breton), so `Intl.DateTimeFormat("br")` does not throw. It formats the wrong language, silently, and the only symptom is a date that looks slightly off.

**Sweep components, not just pages.** Twice in this codebase a page read as fully Portuguese while a component it mounts stayed English: `FullProjects` on `/br/projects`, and every accessible name on the shell. A page-level check misses them because the string lives one file away. Check `aria-label`, `alt`, `title`, `placeholder` and `sr-only` text alongside visible copy.

**Project routes** are `/project/[type]/[slug]`, where `type` is one of ten collections mapped in `src/app/project/[type]/[slug]/page.tsx`: `github`, `private`, `npm`, `luarocks`, `pypi`, `atom`, `googleplay`, `windows`, `aur`, `offline`. Slugs come from `titleToSlug(project.name ?? project.title)`. Adding a new project source means adding the collection *and* registering it in `getProjectsMap()` plus `urlPrefixMap`.

Other dynamic routes: `/app/[appId]`, `/skills/[slug]`, `/social/[network]`, `/tags/[tag]`, `/blog/tags/[tag]`, `/timeline/[year]/[slug]`.

### Component Architecture
- **Layout**: `Navbar`, `Footer`
- **Sections**: page-level blocks (`Hero`, `Projects`, `RecentPosts`, `Services`, `Testimonials`, `Work`, `CallToAction`, `Milestones`, `PressMentions`, ...) plus the per-page client blocks (`BioBrowser`, `FeedbackForm`, `WebViewClient`, `GitHubRankingsClient`, `NPMRankingsClient`)
- **UI**: shadcn/ui primitives plus project components (`ArticleCard`, `ProjectCard`, `TagFilter`, `CopyButton`, `GiscusComments`, `SocialLinks`, `AnimatedCounter`, `StepIndicator`, `RatingRow`, `FeedItem`, `SitemapTable`)
- **Utilities**: `cn()` in `src/lib/utils.ts`

**No component lives under `src/app/`.** Routes only compose. Anything with markup belongs in `src/components/`, which is what keeps the catalog complete and lets a block be reused by a second route without a move. Small helpers extracted from pages sit in `ui/`; whole page blocks sit in `sections/`.

`AnimatedCounter` was copied verbatim into both ranking pages before it was extracted. If you find yourself pasting a component into a second page, extract it instead.

**32 of the 64 files in `src/components/ui/` have no production consumer.** They ship with the shadcn install and no route renders them. Their stories do not count: measure importers excluding `*.stories.tsx`, or everything looks used. Deadness is also transitive, `dialog` and `tooltip` are imported only by `command` and `sidebar`, which are themselves unreachable. Each is documented in Storybook and labelled as unused, so check whether one already exists before adding a dependency.

**91 components, 90 stories.** The only one without is `LinguiClientProvider`: it has no visual surface worth cataloguing, and its job is done by the Storybook decorator instead.

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

Query API in use across the codebase: `.where({...})`, `.locale('br')`, `.first()`, `.count()`, and `.one()` for singleton collections (e.g. `queryCollection('about').one()`).

#### Locale on a collection

A JSON collection carries a translation the way MDX does, by filename: `contents/about/index.br.json` next to `index.json`. **Never add parallel fields** (`title` + `titlePt`); the language belongs in the filename, where the studio can see it.

`studio.config.ts` sets `defaultLocale: "en"`, which stamps the unsuffixed files so `.locale("en")` selects them the same way `.locale("br")` selects the variant. Two consequences:

- **`.all()` returns every language.** The moment a collection gains a variant, a query without `.locale()` returns both, and a `.map()` over it renders the list twice. Always pass `.locale()` on a list read, including in `scripts/` (`readAll()` in `generateLlms.ts` exists to make that the default).
- **`.one()` prefers the default locale.** It is the only method that guesses, which is why singleton reads survived the migration untouched.

There is **no fallback**: `.locale("es")` on a collection with no Spanish returns empty, exactly like MDX. A partially translated collection renders a partially empty page, by design.

This requires the `nextjs-studio` change that reads locale from JSON collections (`parseLocaleFromFilename` accepts `.json`, `detectCollectionType` counts distinct slugs, `defaultLocale` stamping, locale-aware `reindexFile`). The studio UI has a locale switcher for MDX but **not for JSON**, so `index.br.json` is edited by hand for now.

**Do NOT read `contents/` with `fs`, anywhere.** Always go through `queryCollection`, including in `scripts/`.

`nextjs-studio/server` auto-initializes from `process.cwd()`, so a script run with `tsx` queries content exactly the way a page does. Reading the files directly means a second, worse parser of the same content, free to disagree with the one the site renders: it re-implements frontmatter parsing, the locale-suffix convention and the slug rules, and it silently goes stale when any of them change.

`fs` in `scripts/` is for **output** (writing to `public/`, moving `dist/`) and for reading build artifacts. Never for `contents/`.

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

- Always set `alternates.canonical`. Use `localeAlternates(locale, path)` from `src/lib/i18n/seo.ts` rather than writing the `languages` map by hand.
- **A page's `openGraph` replaces the layout's, it does not merge into it.** Every page that declared a title of its own silently dropped the layout's `og:image` and `og:site_name`, and the whole site shared without a thumbnail until this was found in the built HTML. Spread `openGraphDefaults(locale)` inside every `openGraph` block and `twitterDefaults()` inside every `twitter` block; page-specific keys placed after the spread still win, which is how `/post/[slug]` keeps its cover image.
- **Open Graph profile tags are `profile:first_name`, not `og:profile:first_name`.** They are a separate namespace in the spec and Next emits them that way. Grepping the output for `og:profile` finds nothing and looks like the tags were dropped; they were not.
- Descriptions are truncated to 160 chars before use.
- Page priorities and changefreq are centralized in the `transform` function of `next-sitemap.config.cjs`; add new route prefixes there rather than leaving them at the 0.7 default.
- The site has **five** sitemaps, all generated and git-ignored. `scripts/generateSitemaps.ts` writes `sitemap.xml` (the index), `sitemap-site-br.xml` (the `/br/**` pages), `sitemap-project-github.xml` (one entry per `/project/github/[slug]` landing page) and `sitemap-homepage-github.xml` (the GitHub Pages homepages served under the custom domain, normalized from each repo's `homepage` field). `next-sitemap` then writes `sitemap-site.xml` for the English pages; it has `generateIndexSitemap: false` so it never overwrites the index, and excludes `/project/github/*`, `/br/*` and `/en/*` so the lists stay disjoint.

**Every page announces four alternates**, in its `<head>` and in the sitemap that lists it: `hreflang="en"`, `hreflang="pt-BR"`, `x-default`, and `type="text/markdown"`. The two sources must agree; disagreeing is worse than either being wrong alone.

`scripts/annotateSitemapMarkdown.ts` is a separate pass that adds the Markdown link after `next-sitemap` runs, because `alternateRefs` carries only an `hreflang` with no way to express a `type`. It checks the `.md` exists on disk before announcing it. The mirror is English-only, so a `/br/` entry points at the English document.

Two `next-sitemap` behaviours that produced wrong output and will again if reverted:

- **It reads the route manifest, not `dist/`.** After `flattenDefaultLocale.ts` moves English to the root, the manifest still says `/en`, so without the `/en/*` exclusion plus `additionalPaths` the sitemap lists 404s and omits the real URLs.
- **`alternateRefs.href` is treated as that language's root** and the path is appended again, turning `/about/` into `/about/about/`. `hrefIsAbsolute: true` on each ref stops it.
- `/sitemap` renders all four as tables, reading the XML from `public/` at build time. That is why `yarn deploy` builds twice: the first build has no sitemaps to read.
- Blog posts carry Giscus comments via the `GiscusComments` component.

### RSS

**Eight feeds, four kinds times two languages.** `blog.xml` / `talks.xml` / `timeline.xml` / `projects.xml` for English, and the same names with a `-br` suffix for Portuguese. Never build a feed URL by hand: `feedPath(name, locale)` in `src/lib/i18n/locales.ts` is what `scripts/generateRss.ts` names the files with *and* what the pages link to, so the file written and the URL advertised cannot drift.

The Portuguese posts and talks used to reach no feed at all: the generator filtered `.pt.` out of the directory listing, and `/br/rss/` linked to the four English files. Feed chrome (titles, descriptions) is the one place a translation cannot come from the Lingui catalog, because the strings are produced outside React with no i18n instance in scope; it lives in the `COPY` table at the top of the script.

### Machine-readable layer

`scripts/generateLlms.ts` writes a second, plain-text face of the site into `public/`: `llms.txt` (slim index, llmstxt.org), `llms-full.txt` (whole site in one file), the `posts.txt` / `talks.txt` / `projects.txt` / `timeline.txt` / `faq.txt` lists, and a `.md` mirror of every HTML page at the same path. The lists are separate files so `llms.txt` stays short enough to be read in full.

Three things about it are worth knowing:

- **It runs as `yarn data:llms`, chained into `yarn data`** alongside `data:rss`, which `yarn build` calls before `next build`, so the text layer cannot drift from the HTML.
- **Its copy lives in `contents/llms/index.json`** (site title, summary, the note about bilingual routes, and the page list with descriptions), registered in `studio.config.ts` as "AI Index (llms.txt)". Adding a page there without a matching body in `buildPageBodies` throws at generation time on purpose: announcing a `.md` that was never written promises a 404 to whoever followed the link.
- **Do not implement `.txt` files with App Router `route.ts`.** This repo builds with `output: "export"` for GitHub Pages, so route handlers are the wrong abstraction. Text files in the site root are generated artifacts under `public/`, produced before `next build`.
- **`public/faq.txt` is generated, never hand-written.** It must be built from `contents/faq` through `queryCollection('faq').locale('en')`, with the same token-counting logic as `/faq`, and must stay English-only like the Markdown mirrors. Do not create a Portuguese `faq.txt`, and do not parse `contents/faq/*.json` with `fs` for this path.
- **The output is git-ignored**, like the sitemaps and the feeds. Everything under the `/public/*.md`, `/public/post/`, `/public/talk/`, `/public/project/`, `/public/rankings/`, `/public/faq/` and `/public/br/` patterns is generated, plus `llms.txt`, `llms-full.txt` and the five `*.txt` lists. `public/images/press/README.md` is *not* generated, which is why the ignore rule is `/public/*.md` and not a recursive glob.

Pages announce their mirror with `<link rel="alternate" type="text/markdown">`, via `markdownAlternate(path)` from `src/lib/i18n/seo.ts`. It resolves to the English mirror by default; **posts and talks pass their own locale** (`markdownAlternate(path, locale)`) because the generator mirrors both languages of every entry, and a Portuguese article should not announce the English text. `markdownUrl()` in `src/lib/markdown-alternate.ts` does the URL derivation underneath; `withMarkdown()` next to it went with `(legacy)`, which was its only caller.

When a page already declares a `types` object of its own (the RSS feeds on `/blog`, `/talks`, `/projects`, `/timeline`), spread `markdownAlternate` *inside* it. Spreading it next to a later `types` key silently loses the Markdown link, since the explicit key wins.

Only the routes the generator actually writes carry the alternate: the pages in `contents/llms`, plus `/post/[slug]`, `/talk/[slug]`, their `/br` variants and `/project/[type]/[slug]`. Routes without a mirror (`/tags`, `/skills/[slug]`, `/social/[network]`, `/blog/[page]`, `/app/[appId]`, `/timeline/[year]/[slug]`) must not get one.

## Known broken, deliberately not fixed

Documented so nobody rediscovers them as new bugs:

- **`npx nextjs-studio` fails on its first run on Windows.** It shells out to `tar -xzf "E:/..."`, and GNU tar reads a drive letter as a remote host spec, so it tries to connect to a machine called `E`. `tar --force-local` extracts the cache by hand as a workaround. The fix belongs in the `nextjs-studio` package.
- **Client-side navigation from the copied root pages is unverified.** `/` and `/about/` are moved into place after the build, so they are not in the client route manifest and a `<Link>` may fall back to a full page load. Functionally fine either way.
- **A stale `next dev` will lie to you.** It keeps port 3000 and serves old code while a new one silently starts on 3001, which has twice looked like a routing bug. Check the port in the dev log before believing a 404.

## Important Notes

- **Never add a link to the navbar, the footer or any menu unless it was asked for.** Creating a page does not imply linking to it. `contents/menu` is the owner's curation: every entry competes for attention with the ones already there, and which routes earn a place is his call, not a side effect of building something. Create the route, register it where the build genuinely needs it (`contents/llms`, if it should carry a Markdown mirror), and stop. The same goes for links added into existing page copy to "improve internal linking": propose them, do not insert them.
- **`nextjs-studio` currently points at `portal:../Nextjs-Studio`.** The site does not build without it: the locale-on-JSON support exists only in the local clone. Before any push or deploy, publish that package and swap the `portal:` for a version range.
- TypeScript errors are ignored during builds (`typescript.ignoreBuildErrors: true`). The build will not surface type errors, and `yarn lint` is broken (see above), so type safety has to be checked by reading types or running `tsc` manually.
- Images are unoptimized (`images.unoptimized`) for static export compatibility; `next/image` gets no server-side optimization.
- All data must be pre-generated before building (`yarn build` chains `yarn data` for RSS and the llms layer; GitHub/NPM data is committed under `contents/`).
- Site uses Google Analytics (`G-4M6BE19CKV`) and Google Tag Manager (`GTM-WT3T53NB`), wired in `src/app/layout.tsx`.
- `.mcp.json` registers the `chrome-devtools` MCP server (verifying UI in a real browser) and the Storybook one (only answers while `yarn storybook` runs). It is tracked, but a `.gitignore` outside the repo also lists it, so re-adding it needs `git add -f`.
- **Commits carry no `Co-Authored-By` trailer.** Owner's preference, and it overrides the default.
- Never run `yarn build`, `yarn deploy`, or any data-fetching command without explicit user permission. Builds are slow and overwrite generated files (`dist/`, `public/rss/`, `public/*sitemap*`, `contents/github`, `contents/npm`).
