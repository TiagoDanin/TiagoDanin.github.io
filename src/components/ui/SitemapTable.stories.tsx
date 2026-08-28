import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { SitemapTable } from './SitemapTable';

/**
 * The table on `/sitemap`, rendered once per sitemap file. There are four.
 */
const meta = {
  title: 'UI/SitemapTable',
  component: SitemapTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Renders one sitemap as a table of routes with their crawl hints.',
          '',
          'The site publishes four sitemaps, all generated and git-ignored:',
          '`sitemap.xml` (the index), `sitemap-site.xml` from `next-sitemap`, and',
          '`sitemap-project-github.xml` plus `sitemap-homepage-github.xml` from',
          '`scripts/generateSitemaps.ts`. The `/sitemap` page parses each XML file',
          'at build time and hands the entries here.',
          '',
          'Two transforms happen inside the component, which is why it exists at',
          'all rather than being inlined on the page.',
          '',
          '**Sort.** Rows come out in whatever order the generator emitted, which',
          'is alphabetical by file path and puts `/ai-automation/` above the home',
          'page. The table re-sorts by priority descending, then alphabetically',
          'within a priority band, so it opens on the pages that matter. A missing',
          '`priority` is treated as `0` and sinks to the bottom.',
          '',
          '**Origin strip.** `https://tiagodanin.com` is removed from the display',
          'text, since every row repeats it and it would push the useful part off',
          'screen. The `href` keeps the absolute address. An entry that is exactly',
          'the origin would strip to an empty string, so it falls back to `/`.',
          '',
          'The table sits in an `overflow-x-auto` container, so a long URL scrolls',
          'the table rather than the page.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    urls: {
      control: 'object',
      description:
        'Entries parsed from one sitemap XML. Only `loc` is required; `lastmod`, `changefreq` and `priority` each render as `-` when absent.',
    },
  },
  args: {
    urls: [
      {
        loc: 'https://tiagodanin.com',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: '2026-02-14T09:00:00.000Z',
      },
      {
        loc: 'https://tiagodanin.com/projects/',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: '2026-02-10T09:00:00.000Z',
      },
      {
        loc: 'https://tiagodanin.com/blog/',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: '2026-02-14T09:00:00.000Z',
      },
      {
        loc: 'https://tiagodanin.com/about/',
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: '2025-11-30T09:00:00.000Z',
      },
      {
        loc: 'https://tiagodanin.com/rss/',
        changefreq: 'weekly',
        priority: 0.5,
        lastmod: '2025-08-02T09:00:00.000Z',
      },
      {
        loc: 'https://tiagodanin.com/sitemap/',
      },
    ],
  },
} satisfies Meta<typeof SitemapTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A slice of `sitemap-site.xml`, given in generator order. The rendered order is
 * not the input order: priority 1.0 leads, the 0.9 band follows alphabetically,
 * and the entry with no priority at all sinks to the bottom.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const paths = canvas.getAllByRole('link').map((link) => link.textContent);

    await expect(paths).toEqual([
      '/', // origin-only loc, stripped to empty then defaulted
      '/about/', // the 0.9 band, alphabetical
      '/blog/',
      '/projects/',
      '/rss/', // 0.5
      '/sitemap/', // no priority, treated as 0
    ]);

    // The visible text is a path, but the link still points at the full address.
    await expect(canvas.getByRole('link', { name: '/blog/' })).toHaveAttribute(
      'href',
      'https://tiagodanin.com/blog/'
    );
    // The origin-only row keeps its absolute href rather than pointing at "/".
    await expect(canvas.getByRole('link', { name: '/' })).toHaveAttribute(
      'href',
      'https://tiagodanin.com'
    );
  },
};

/**
 * `sitemap-project-github.xml` carries one entry per repository landing page and
 * no priority or changefreq at all. Every optional column collapses to `-`,
 * leaving a plain list of routes, and the sort falls back to alphabetical.
 */
export const OnlyLocations: Story = {
  args: {
    urls: [
      { loc: 'https://tiagodanin.com/project/github/telegraf/' },
      { loc: 'https://tiagodanin.com/project/github/locale-codes/' },
      { loc: 'https://tiagodanin.com/project/github/add-license-bot/' },
      { loc: 'https://tiagodanin.com/project/github/polybar-themes/' },
    ],
  },
  play: async ({ canvas }) => {
    const paths = canvas.getAllByRole('link').map((link) => link.textContent);
    await expect(paths).toEqual([
      '/project/github/add-license-bot/',
      '/project/github/locale-codes/',
      '/project/github/polybar-themes/',
      '/project/github/telegraf/',
    ]);
    // Four rows, three empty columns each.
    await expect(canvas.getAllByText('-')).toHaveLength(12);
  },
};

/**
 * A single row. `sitemap.xml` is the index and lists only the three sitemaps it
 * points at, so the table is routinely this short.
 */
export const SingleRow: Story = {
  args: {
    urls: [
      {
        loc: 'https://tiagodanin.com/sitemap-site.xml',
        lastmod: '2026-02-14T09:00:00.000Z',
      },
    ],
  },
};

/**
 * A deep post URL, longer than the column can hold. The table keeps its natural
 * width and the `overflow-x-auto` wrapper scrolls, so the page body never
 * scrolls sideways. Narrow the docs frame to see the scrollbar appear.
 */
export const LongUrl: Story = {
  args: {
    urls: [
      {
        loc: 'https://tiagodanin.com/post/android-splash-screen-em-jetpack-compose-construindo-uma-introducao-impactante-para-seu-app/pt/',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: '2025-09-05T09:00:00.000Z',
      },
      {
        loc: 'https://tiagodanin.com/post/aprimorando-a-experiencia-do-usuario-com-teclados-no-ios-usando-keyboard-actions/',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: '2025-07-19T09:00:00.000Z',
      },
      {
        loc: 'https://tiagodanin.com/blog/',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: '2026-02-14T09:00:00.000Z',
      },
    ],
  },
  play: async ({ canvas }) => {
    // Highest priority first even though it is the shortest and last supplied.
    const paths = canvas.getAllByRole('link').map((link) => link.textContent);
    await expect(paths[0]).toBe('/blog/');
  },
};

/**
 * Priorities arriving as strings, which is what `fast-xml-parser` yields when a
 * value is quoted in the XML. The sort coerces with `Number()`, so `"0.64"`
 * still lands between `0.7` and `0.5` rather than sorting as text.
 */
export const StringPriorities: Story = {
  args: {
    urls: [
      { loc: 'https://tiagodanin.com/skills/', priority: '0.5', changefreq: 'monthly' },
      { loc: 'https://tiagodanin.com/talks/', priority: '0.7', changefreq: 'weekly' },
      { loc: 'https://tiagodanin.com/press/', priority: '0.64', changefreq: 'monthly' },
    ],
  },
  play: async ({ canvas }) => {
    const paths = canvas.getAllByRole('link').map((link) => link.textContent);
    await expect(paths).toEqual(['/talks/', '/press/', '/skills/']);
  },
};

/**
 * No entries. The page guards this case itself and prints "Run `yarn sitemap`"
 * instead, because the sitemaps are git-ignored and a fresh checkout has none.
 * The component does not guard it, so an empty table renders as headers alone.
 */
export const Empty: Story = {
  args: { urls: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('columnheader', { name: 'URL' })).toBeVisible();
    await expect(canvas.queryAllByRole('link')).toHaveLength(0);
  },
};

/**
 * Portuguese. `lastmod` is the only locale-dependent cell, and it used to be
 * hardcoded to `en-US`, so `/br/sitemap/` printed American dates in a
 * Portuguese table.
 *
 * The locale reaches the component as the site's own code (`br`), which
 * `intlLocale()` maps to `pt-BR` before Intl sees it. Handing `br` straight to
 * Intl does not throw: it is Breton, and it formats the wrong language in
 * silence.
 */
export const Portuguese: Story = {
  args: {
    locale: 'br',
    urls: [
      { loc: 'https://tiagodanin.com/br/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-03-09T00:00:00.000Z' },
      { loc: 'https://tiagodanin.com/br/blog/', priority: '0.9', changefreq: 'daily', lastmod: '2026-03-09T00:00:00.000Z' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('09/03/2026')).toBeVisible();
  },
};
