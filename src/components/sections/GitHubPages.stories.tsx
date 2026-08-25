import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import GitHubPagesSection from './GitHubPages';

const githubProjects = [
  {
    name: 'Awesome-Polybar',
    description: 'Curated list of Polybar modules, themes and scripts.',
    homepage: 'https://TiagoDanin.github.io/Awesome-Polybar/',
    html_url: 'https://github.com/TiagoDanin/Awesome-Polybar',
  },
  {
    name: 'Nuxt-SEO',
    description: 'SEO and HTML meta tags module for Nuxt.js.',
    homepage: 'https://tiagodanin.github.io/Nuxt-SEO/',
    html_url: 'https://github.com/TiagoDanin/Nuxt-SEO',
  },
  {
    name: 'Telegraf-Test',
    description: 'Simple test toolkit for Telegram bots built with Telegraf.',
    homepage: 'https://tiagodanin.github.io/Telegraf-Test/',
    html_url: 'https://github.com/TiagoDanin/Telegraf-Test',
  },
  {
    name: 'htmlEntities-for-lua',
    description: 'Lua module for decoding HTML entities.',
    homepage: 'https://tiagodanin.github.io/htmlEntities-for-lua/',
    html_url: 'https://github.com/TiagoDanin/htmlEntities-for-lua',
  },
  {
    name: 'Windows-Locale',
    description: 'Windows Language Code Identifier (LCID) for JavaScript.',
    homepage: 'https://tiagodanin.github.io/Windows-Locale/',
    html_url: 'https://github.com/TiagoDanin/Windows-Locale',
  },
  {
    name: 'Polybar-GitHub',
    description: 'A Polybar module that shows unread GitHub notifications.',
    homepage: 'https://tiagodanin.github.io/Polybar-GitHub/',
    html_url: 'https://github.com/TiagoDanin/Polybar-GitHub',
  },
  // No published page: filtered out before the grid renders.
  {
    name: 'Locale-Codes',
    description: 'Language codes and country codes.',
    homepage: '',
    html_url: 'https://github.com/TiagoDanin/Locale-Codes',
  },
  {
    name: 'Android-Debug-Bridge-MCP',
    description: 'MCP plugin to control Android devices over ADB.',
    homepage: '',
    html_url: 'https://github.com/TiagoDanin/Android-Debug-Bridge-MCP',
  },
  // Whitespace only, which the filter treats the same as empty.
  {
    name: 'Defend-The-Castle',
    description: 'Telegram bot game.',
    homepage: '   ',
    html_url: 'https://github.com/TiagoDanin/Defend-The-Castle',
  },
];

/**
 * The whole of `/github-pages`: the search field and the grid of repositories
 * that publish a live demo.
 *
 * The page passes the entire `github` collection, 141 repositories, and this
 * component decides which of them have somewhere to link to.
 */
const meta = {
  title: 'Sections/GitHubPages',
  component: GitHubPagesSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Searchable index of the repositories that ship a GitHub Pages site.',
          '',
          'Filtering happens in two steps inside one `useMemo`. First every',
          'repository without a non-blank `homepage` is dropped, which is what',
          'turns 141 repositories into a couple of dozen demos. Then the search',
          'query is matched, case insensitively, against the name and the',
          'description.',
          '',
          'The counter in the header reads the filtered list, not the input, so',
          'it changes while typing. That is intentional as a result count, but it',
          'means the page never states how many repositories exist in total.',
          '',
          'The empty state interpolates the query directly. With an empty query',
          'and no matching repositories it reads `No projects found matching ""`,',
          'which is the one state the copy does not handle well.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    githubProjects: {
      control: 'object',
      description:
        'Repositories straight from the `github` collection. `homepage` decides whether a repository appears at all; an empty or whitespace-only value removes it.',
    },
  },
  args: { githubProjects },
} satisfies Meta<typeof GitHubPagesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Nine repositories in, six on screen: three are filtered out for having no
 * published page.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('6 Pages')).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(6);
    await expect(
      canvas.queryByRole('heading', { name: 'Android-Debug-Bridge-MCP' })
    ).not.toBeInTheDocument();
  },
};

/**
 * Typing narrows the grid and the counter together. The match runs against both
 * the repository name and its description, so "polybar" finds Awesome-Polybar by
 * name and Polybar-GitHub by both.
 */
export const Searching: Story = {
  play: async ({ canvas }) => {
    const search = canvas.getByRole('textbox', { name: /search github pages projects/i });
    await userEvent.type(search, 'polybar');

    await expect(await canvas.findByText('2 Pages')).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Awesome-Polybar' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Polybar-GitHub' })).toBeVisible();
    await expect(canvas.queryByRole('heading', { name: 'Nuxt-SEO' })).not.toBeInTheDocument();
  },
};

/**
 * The description is searched as well as the name, which is how a query like
 * "telegram" reaches a repository whose name never mentions it.
 */
export const SearchingByDescription: Story = {
  play: async ({ canvas }) => {
    const search = canvas.getByRole('textbox', { name: /search github pages projects/i });
    await userEvent.type(search, 'telegram');

    await expect(await canvas.findByText('1 Pages')).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Telegraf-Test' })).toBeVisible();
  },
};

/**
 * A query that matches nothing. The grid is replaced by a message quoting the
 * query back, so the reader can see what was actually searched for.
 */
export const NoResults: Story = {
  play: async ({ canvas }) => {
    const search = canvas.getByRole('textbox', { name: /search github pages projects/i });
    await userEvent.type(search, 'kubernetes');

    await expect(await canvas.findByText(/no projects found matching/i)).toBeVisible();
    await expect(canvas.getByText('0 Pages')).toBeVisible();
  },
};

/**
 * A repository with no description still renders, with an empty paragraph where
 * the summary would be. `description` is coalesced to an empty string rather
 * than skipped, so the card keeps its shape.
 */
export const MissingDescription: Story = {
  args: {
    githubProjects: [
      {
        name: 'TycotBot',
        description: '',
        homepage: 'https://tiagodanin.github.io/TycotBot/',
        html_url: 'https://github.com/TiagoDanin/TycotBot',
      },
      githubProjects[0],
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'TycotBot' })).toBeVisible();
    await expect(canvas.getByText('2 Pages')).toBeVisible();
  },
};

/**
 * Nothing in the collection publishes a page. The empty state renders with an
 * empty query, which is where the copy reads `matching ""`. The search box stays
 * available, which is a little unhelpful when there is nothing to search.
 */
export const Empty: Story = {
  args: { githubProjects: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('0 Pages')).toBeVisible();
    await expect(canvas.getByText(/no projects found matching/i)).toBeVisible();
    await expect(canvas.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
  },
};

/**
 * Repository names have no spaces to break on, and GitHub descriptions have no
 * length limit. This is both at once: the longest realistic name next to a
 * description of a few hundred characters.
 */
export const LongContent: Story = {
  args: {
    githubProjects: [
      {
        name: 'Android-Debug-Bridge-MCP-Server-For-Agent-Integration',
        description:
          'A Model Context Protocol plugin that exposes the Android Debug Bridge to an agent: listing connected devices, installing and uninstalling builds, driving the interface through input events, pulling logcat, capturing screenshots and running instrumented tests. Written in TypeScript and exercised against physical Pixel devices as well as the Android emulator on macOS and Linux.',
        homepage: 'https://tiagodanin.github.io/Android-Debug-Bridge-MCP/',
        html_url: 'https://github.com/TiagoDanin/Android-Debug-Bridge-MCP',
      },
      githubProjects[0],
      githubProjects[1],
    ],
  },
};

/** Single column below `sm`, with the counter dropping under the heading. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
