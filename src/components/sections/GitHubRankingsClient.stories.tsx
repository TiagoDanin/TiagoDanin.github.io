import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import GitHubRankingsClient from './GitHubRankingsClient';

type Repo = {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  homepage: string;
  html_url: string;
  size: number;
  private: boolean;
};

const repo = (
  id: number,
  name: string,
  description: string,
  stargazers_count: number,
  forks_count: number,
  language: string,
  size: number,
  homepage = ''
): Repo => ({
  id,
  name,
  description,
  stargazers_count,
  forks_count,
  language,
  homepage,
  html_url: `https://github.com/TiagoDanin/${name}`,
  size,
  private: false,
});

/** Twelve repositories in no particular order: the component does the sorting. */
const githubData: Repo[] = [
  repo(
    182167311,
    'Nuxt-SEO',
    'SEO and HTML meta tags module for Nuxt.js.',
    75,
    7,
    'JavaScript',
    5837,
    'https://tiagodanin.github.io/Nuxt-SEO/'
  ),
  repo(
    129280452,
    'Awesome-Polybar',
    'Curated list of Polybar modules, themes and scripts.',
    496,
    13,
    'HTML',
    86,
    'https://TiagoDanin.github.io/Awesome-Polybar/'
  ),
  repo(
    149122378,
    'Telegraf-Test',
    'Simple test toolkit for Telegram bots built with Telegraf.',
    33,
    5,
    'JavaScript',
    464,
    'https://tiagodanin.github.io/Telegraf-Test/'
  ),
  repo(
    182560118,
    'Locale-Codes',
    'Language codes and country codes in one lookup table.',
    68,
    9,
    'JavaScript',
    205
  ),
  repo(
    164681513,
    'Defend-The-Castle',
    'Telegram bot game written in JavaScript.',
    31,
    8,
    'JavaScript',
    759
  ),
  repo(
    1042404335,
    'Android-Debug-Bridge-MCP',
    'MCP plugin to control Android devices over ADB for automation, testing and agent integration.',
    21,
    6,
    'TypeScript',
    22
  ),
  repo(49294219, 'htmlEntities-for-lua', 'Lua module for decoding HTML entities.', 21, 5, 'Lua', 215),
  repo(93809796, 'TycotBot', 'Telegram bot written in Python.', 21, 9, 'Python', 115),
  repo(
    282446855,
    'OpenTecBan-Service',
    'Open Banking API service built for the TecBan 2020 hackathon.',
    16,
    1,
    'JavaScript',
    152
  ),
  repo(
    145883605,
    'Awesome-Proton',
    'List of games tested with Proton, the compatibility tool for Steam on Linux.',
    13,
    5,
    'JavaScript',
    51
  ),
  repo(
    131896339,
    'Polybar-GitHub',
    'A Polybar module that shows unread GitHub notifications.',
    10,
    4,
    'JavaScript',
    253
  ),
  repo(158372771, 'DocxToPdf-CLI', 'Convert a .docx file to .pdf from the terminal.', 9, 1, 'JavaScript', 44),
];

/**
 * The whole of `/rankings/github`: hero counters, the top ten repositories,
 * aggregate statistics and the cross link to the NPM rankings.
 *
 * It receives the full `github` collection, 141 repositories, and reduces it to
 * a leaderboard of ten.
 */
const meta = {
  title: 'Sections/GitHubRankingsClient',
  component: GitHubRankingsClient,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Leaderboard page for the GitHub repositories, sorted by',
          '`stargazers_count` descending and cut to the first ten.',
          '',
          'The sort runs on a copy, so the caller\'s array is never mutated, and',
          '`Array.prototype.sort` is stable: repositories tied on stars keep the',
          'order the collection gave them, which in practice is the order the',
          'GitHub API returned.',
          '',
          'Ranks one to three are styled differently. They get a trophy or a',
          'medal instead of a number, a coloured rank badge, and a tinted card',
          'border. Rank four onwards is a plain `#n`.',
          '',
          'Totals are computed over the whole array rather than the top ten, so',
          'the hero counters describe all 141 repositories. Every number counts',
          'up from zero through `AnimatedCounter`. The averages divide by',
          '`githubData.length` with no guard, so an empty array renders `NaN`.',
          '',
          'Language badges come from a hardcoded colour map of fourteen',
          'languages. Anything outside it, Dockerfile or Elixir for instance,',
          'falls back to grey.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    githubData: {
      control: 'object',
      description:
        'Repositories in any order. `homepage` adds a Demo button, `private` adds a badge, `size` is in kilobytes and is rendered in MB when above zero.',
    },
  },
  args: { githubData },
} satisfies Meta<typeof GitHubRankingsClient>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Twelve repositories in, ten on the board. The two lowest ranked never appear,
 * but their stars and forks still count towards the totals in the hero.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const titles = canvas.getAllByRole('heading', { level: 3 });

    // The slice, not the input length.
    await expect(titles).toHaveLength(10);

    // Sorted by stars descending, regardless of the order passed in.
    await expect(titles[0]).toHaveTextContent('Awesome-Polybar');
    await expect(titles[1]).toHaveTextContent('Nuxt-SEO');
    await expect(titles[2]).toHaveTextContent('Locale-Codes');

    // The two lowest ranked repositories are cut.
    await expect(canvas.queryByRole('heading', { name: 'DocxToPdf-CLI' })).not.toBeInTheDocument();

    const github = canvas.getAllByRole('link', { name: 'GitHub' });
    await expect(github[0]).toHaveAttribute(
      'href',
      'https://github.com/TiagoDanin/Awesome-Polybar'
    );
    await expect(github[0]).toHaveAttribute('rel', expect.stringContaining('noopener'));
  },
};

/**
 * Exactly ten repositories: nothing is cut, and the board matches the
 * collection one for one.
 */
export const ExactlyTen: Story = {
  args: { githubData: githubData.slice(0, 10) },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(10);
  },
};

/**
 * The three podium ranks and nothing else, which is the fastest way to see the
 * trophy, the silver medal and the bronze medal together with their tinted card
 * borders.
 */
export const TopThreeOnly: Story = {
  args: {
    githubData: [githubData[1], githubData[0], githubData[3]],
  },
  play: async ({ canvas }) => {
    const titles = canvas.getAllByRole('heading', { level: 3 });
    await expect(titles).toHaveLength(3);
    await expect(titles[0]).toHaveTextContent('Awesome-Polybar');
    await expect(titles[2]).toHaveTextContent('Locale-Codes');
  },
};

/**
 * Three repositories tied on 21 stars. The sort is stable, so they hold the
 * order the collection gave them, and the ranks read #6, #7, #8 with no visual
 * hint that the numbers are arbitrary.
 */
export const TiedStarCounts: Story = {
  args: { githubData },
  play: async ({ canvas }) => {
    const titles = canvas.getAllByRole('heading', { level: 3 });

    // Input order among the three repositories on 21 stars.
    await expect(titles[5]).toHaveTextContent('Android-Debug-Bridge-MCP');
    await expect(titles[6]).toHaveTextContent('htmlEntities-for-lua');
    await expect(titles[7]).toHaveTextContent('TycotBot');
  },
};

/**
 * A repository with no description, no language, no homepage and a size of
 * zero. The description falls back to "No description available"; the language
 * badge, the size and the Demo button are all dropped rather than rendered
 * empty.
 */
export const MissingMetadata: Story = {
  args: {
    githubData: [
      {
        id: 1,
        name: 'dotfiles',
        description: '',
        stargazers_count: 42,
        forks_count: 0,
        language: '',
        homepage: '',
        html_url: 'https://github.com/TiagoDanin/dotfiles',
        size: 0,
        private: false,
      },
      githubData[2],
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No description available')).toBeVisible();
    // Only Telegraf-Test publishes a demo.
    await expect(canvas.getAllByRole('link', { name: 'Demo' })).toHaveLength(1);
  },
};

/**
 * A private repository on the board. It gets a badge next to its name, and the
 * GitHub link still points at a URL only the owner can open.
 */
export const WithPrivateRepository: Story = {
  args: {
    githubData: [
      {
        ...githubData[1],
        name: 'client-app-android',
        description: 'Private client work: an Android app in Kotlin with Jetpack Compose.',
        private: true,
        homepage: '',
      },
      githubData[0],
      githubData[3],
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Private')).toBeVisible();
  },
};

/**
 * No repositories. The board is empty and the page still renders its headings,
 * but the averages divide by zero: "Average Stars" and "Average Forks" both
 * settle on `NaN`. Worth knowing, because a failed `yarn data:github` run leaves
 * exactly this state.
 */
export const Empty: Story = {
  args: { githubData: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
    await expect(canvas.getByRole('heading', { name: /top 10 github repositories/i })).toBeVisible();

    // Divide by zero, rendered to the reader.
    const notANumber = await canvas.findAllByText('NaN');
    await expect(notANumber.length).toBeGreaterThan(0);
  },
};

/**
 * A repository name with no spaces to break on, next to a description several
 * lines long. The card puts the star counter on the right of the same row, so
 * this is where the header layout is under the most pressure.
 */
export const LongContent: Story = {
  args: {
    githubData: [
      repo(
        1,
        'Android-Debug-Bridge-MCP-Server-For-Agent-Integration',
        'A Model Context Protocol plugin that exposes the Android Debug Bridge to an agent: listing connected devices, installing and uninstalling builds, driving the interface through input events, pulling logcat, capturing screenshots and running instrumented tests, without leaving the conversation. Written in TypeScript and exercised against physical Pixel devices as well as the emulator on macOS and Linux.',
        1234,
        56,
        'TypeScript',
        22,
        'https://tiagodanin.github.io/Android-Debug-Bridge-MCP/'
      ),
      githubData[1],
      githubData[0],
    ],
  },
};

/** Below `md` the hero counters stack and the statistics grid becomes a column. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
