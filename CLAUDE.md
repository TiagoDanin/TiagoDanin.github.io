# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Tiago Danin's personal website built with Next.js 15, featuring a static-exported site deployed on GitHub Pages. The site showcases blog posts, talks, projects, timeline events, and professional information.

## Development Commands

```bash
# Development
yarn dev                    # Start development server
yarn build                  # Build for production (static export)
yarn start                  # Start production server
yarn lint                   # Run ESLint

# Data Generation (run before builds)
yarn data:github           # Fetch GitHub projects data
yarn data:npm              # Fetch NPM packages data
yarn data:rss              # Generate RSS feeds

# Sitemap Generation
yarn sitemap               # Generate sitemaps (runs after build)

# Full Deployment Pipeline
yarn deploy                # data:github + data:rss + build + sitemap + build (second build picks up the generated sitemap)
```

`prebuild` runs `yarn data:rss` and `postbuild` runs `yarn sitemap` automatically; `yarn build` alone is enough during local iteration. Run `yarn data:github` / `yarn data:npm` manually when you need fresh external data.

**No test suite is configured** (no jest/vitest, no `test` script). Treat correctness claims for UI changes as unverified until exercised in the browser. Do not invent passing tests.

## Architecture

### Core Structure
- **Next.js App Router**: Uses `src/app/` directory structure with TypeScript
- **Static Export**: Configured for GitHub Pages deployment (`output: "export"`)
- **Component-Based**: Modular React components with shadcn/ui + Radix UI
- **Data-Driven**: Content sourced from JSON collections in `contents/`, accessed via nextjs-studio

### Key Directories
- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: Reusable UI components (layout, sections, ui)
- `src/data/`: Legacy JSON data files (kept for reference; active data is now in `contents/`)
- `contents/`: Active content collections (posts, talks, github, npm, timeline, etc.)
- `src/lib/studio.ts`: Studio content layer helper (`queryCollection`)
- `studio.config.ts`: nextjs-studio configuration for collections and import scripts
- `scripts/`: Build-time scripts for data fetching and RSS generation
- `public/`: Static assets and generated files

### Data Flow
1. Scripts fetch external data (GitHub, NPM) and write to `contents/<collection>/index.json`
2. All components (server and client) use `queryCollection()` from `nextjs-studio` to access data
3. RSS feeds and sitemaps are generated from `contents/` JSON data
4. Static site is exported to `dist/` directory

### Component Architecture
- **Layout Components**: `Navbar`, `Footer`, shared layout structure
- **Section Components**: Page-specific sections (`Hero`, `Projects`, `Services`, etc.)
- **UI Components**: shadcn/ui components in `src/components/ui/`
- **Utility Functions**: `src/lib/utils.ts` (cn function for className merging)

### Styling
- **Tailwind CSS**: primary styling framework, mobile-first.
- **CSS Custom Properties**: theme variables in `globals.css` (currently HSL-based shadcn defaults; the design direction in `DESIGN.md` migrates these to OKLCH tokens).
- **No dark mode**: brand decision recorded in `PRODUCT.md`. The `.dark` block in `globals.css` and `next-themes` are legacy and should not be reintroduced or wired to a toggle.

### Content Management

The site uses **nextjs-studio** as a content layer. All collections live in `contents/` as JSON files (e.g., `contents/posts/index.json`), replacing the old `src/data/` imports.

- **Posts**: blog posts as `.mdx` files in `contents/posts/` with frontmatter (`title`, `date`, `description`, `slug`, `tags`, `lang`). Bilingual: locale comes from the filename suffix (e.g. `my-post.mdx` is EN, `my-post.pt.mdx` is PT). Treat EN and PT as equal-weight surfaces.
- **Talks**: speaking engagements in `contents/talks/index.json`
- **Projects**: Multiple sources — `contents/github/`, `contents/npm/`, `contents/private/`, etc.
- **Timeline**: Career events in `contents/timeline/index.json`
- **Work/Volunteer**: Professional experience in `contents/work/` and `contents/volunteer/`
- **Contacts/Links**: Social profiles and link-in-bio data in `contents/contacts/` and `contents/links/`

#### Data Access Patterns

**nextjs-studio** has two entry points:
- `nextjs-studio` — client-safe: `queryCollection`, types, pure utilities (no fs)
- `nextjs-studio/server` — server-only: auto-init, FsAdapter, loadContent

**Server components** (pages, layouts, server-only components):
```ts
import { queryCollection } from 'nextjs-studio/server';
```

**Client components** (`'use client'`) must **NOT** call `queryCollection` — they can only import types from `nextjs-studio`. Data must be fetched in a parent server component and passed as props:
```ts
// Server component (page.tsx)
import { queryCollection } from 'nextjs-studio/server';
const posts = queryCollection('posts');
return <ClientComponent posts={[...posts]} />;
// Spread into array to serialize QueryResult for client
```

For singleton collections (e.g., `about`), use `.one()`:
```ts
const about = queryCollection('about').one();
```

**Do NOT** import JSON directly from `contents/` — always use the `queryCollection` API.

The `studio.config.ts` at the project root configures collection scripts for CMS integration.

`next.config.ts` wraps the config with `withStudio()` from `nextjs-studio/next`. That is what makes saving a file in `contents/` refresh the browser in dev; without it the dev server serves fresh content only on a full page load. It only works on webpack, which is why `yarn dev` and `yarn build` both pass `--webpack` explicitly. Next 16 defaults to Turbopack and aborts the build when a `webpack` config is present without a `turbopack` config, so the flag is required, not optional.

#### Never hardcode content in code

**nextjs-studio is the CMS. Copy belongs in `contents/`, never in a `.ts`/`.tsx` file.** If a change adds prose the user could plausibly want to edit later (bios, page copy, descriptions, quotes, FAQ answers, list items with text), it goes in a collection:

1. Add the collection to `studio.config.ts` with a `schema` so it is editable in the studio UI.
2. Write the data to `contents/<collection>/index.json`.
3. Read it in the server component with `queryCollection('<collection>')`.

Do not create a `data.ts`, `copy.ts`, or `*.ts` file that exports strings of user-facing text, and do not inline long prose as JSX literals. Hardcoding content in code makes it invisible to the CMS and forces the user to ask for a code change to fix a sentence.

**Values computed at build time are the exception.** Numbers derived from other collections (years of experience, counts, dates) stay in code. Write them into the content as `{placeholder}` tokens and interpolate at render time. Example: `contents/bios/index.json` stores `"com mais de {years} anos"` and `src/app/press-kit/bios.ts` fills `{years}` in `buildBios`.

Code in the same folder as a collection consumer should only hold types, UI chrome labels (button text, aria labels, tab names) and the interpolation helper.

## TypeScript Rules

- **Never use `any`** — always use proper types. Use `unknown` when the type is truly unknown, or define explicit interfaces/types. Using `any` defeats the purpose of TypeScript.

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

## Important Notes

- TypeScript and ESLint errors are ignored during builds (`ignoreBuildErrors: true`). Do not rely on the build to surface type errors; check with `yarn lint` and by reading types directly.
- Images are unoptimized (`next/image` `unoptimized` flag) for static export compatibility.
- All data must be pre-generated before building (the `prebuild` hook handles RSS; GitHub/NPM data is committed under `contents/`).
- Site uses Google Analytics (`G-4M6BE19CKV`) and Google Tag Manager (`GTM-WT3T53NB`), wired in `src/app/layout.tsx`.
- RSS feeds are generated for blog, talks, timeline, and projects.
- Sitemap includes dynamic GitHub project pages, generated by `scripts/generateGithubSitemap.ts` before `next-sitemap` runs.
- Never run `yarn build`, `yarn deploy`, or any data-fetching command without explicit user permission. Builds are slow and overwrite generated files.