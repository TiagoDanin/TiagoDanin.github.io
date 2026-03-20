# TiagoDanin.github.io

Personal website and blog of Tiago Danin — software developer, mobile specialist, and bug hunter.

**Live:** [tiagodanin.com](https://tiagodanin.com)

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export)
- **Language:** TypeScript
- **UI:** React 19, shadcn/ui, Radix UI, Tailwind CSS
- **Content:** MDX blog posts via [nextjs-studio](https://github.com/TiagoDanin/Nextjs-Studio)
- **Comments:** Giscus (GitHub Discussions)
- **Deploy:** GitHub Pages via GitHub Actions

## Getting Started

Requires Node.js (see `.nvmrc`) and Yarn.

```sh
git clone https://github.com/TiagoDanin/TiagoDanin.github.io.git
cd TiagoDanin.github.io
yarn install
yarn dev
```

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server |
| `yarn build` | Build for production (static export to `dist/`) |
| `yarn lint` | Run ESLint |
| `yarn data:github` | Fetch GitHub projects data |
| `yarn data:npm` | Fetch NPM packages data |
| `yarn data:rss` | Generate RSS feeds |
| `yarn sitemap` | Generate sitemaps |
| `yarn deploy` | Full pipeline: data fetch + build + sitemap |

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    blog/               # Blog listing (EN + PT), pagination, tag filtering
    post/[slug]/        # Individual blog posts (EN + PT)
    projects/           # Projects showcase
    talks/              # Speaking engagements
    about/              # About page
    ...
  components/
    sections/           # Page sections (Hero, Projects, RecentPosts, etc.)
    ui/                 # shadcn/ui components
  lib/                  # Utilities (MDX rendering, studio helpers)
  utils/                # Parsing and formatting functions

contents/               # Content collections (MDX posts, JSON data)
  posts/                # Blog posts as .mdx files
  talks/                # Speaking engagements
  github/               # GitHub projects (auto-fetched)
  npm/                  # NPM packages (auto-fetched)
  timeline/             # Career timeline
  work/                 # Work experience
  ...

scripts/                # Build-time scripts (data fetching, RSS, sitemap)
public/                 # Static assets
```

## Content Management

Content lives in `contents/` as MDX and JSON files, managed by **nextjs-studio**.

- **Blog posts:** `contents/posts/*.mdx` with frontmatter (title, date, description, slug, tags, lang)
- **Multilingual:** Posts support EN/PT — locale is parsed from filename (e.g., `post.pt.mdx`)
- **Data collections:** GitHub projects, NPM packages, talks, timeline, etc.

Access data via `queryCollection()` from `nextjs-studio/server` in server components.

## Deploy

Push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds and deploys to GitHub Pages.

## License

MIT
