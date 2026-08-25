import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import NPMRankingsClient from './NPMRankingsClient';

type NpmPackage = {
  name: string;
  description: string;
  downloads: number;
  version: string;
  keywords: string[];
  links: { npm: string; repository: string };
};

const pkg = (
  name: string,
  description: string,
  downloads: number,
  version: string,
  keywords: string[],
  repository: string
): NpmPackage => ({
  name,
  description,
  downloads,
  version,
  keywords,
  links: {
    npm: `https://www.npmjs.com/package/${name}`,
    repository,
  },
});

/**
 * Twelve packages, deliberately out of order so the stories prove the sort.
 * `telegraf-getchatmembers` and `ttgram` are tied on 595 downloads.
 */
const npmData: NpmPackage[] = [
  pkg(
    'telegraf-test',
    'Simple test toolkit for Telegram bots built with Telegraf.',
    8180,
    '1.2.1',
    ['telegraf', 'telegram', 'telegram-bot', 'testing', 'mocha', 'offline'],
    'https://github.com/TiagoDanin/Telegraf-Test'
  ),
  pkg(
    'windows-locale',
    'Windows Language Code Identifier (LCID) for JavaScript.',
    2199289,
    '1.1.2',
    ['lcid', 'locale', 'i18n', 'language', 'windows'],
    'https://github.com/TiagoDanin/Windows-Locale'
  ),
  pkg(
    'numberlabel',
    'Convert a large number into a nicely formatted string.',
    12399,
    '1.0.1',
    ['number', 'label', 'string'],
    'https://github.com/TiagoDanin/Number-Label'
  ),
  pkg(
    'iso639-codes',
    'ISO639 language codes for JavaScript.',
    2155266,
    '1.0.1',
    ['iso639', 'codes', 'i18n', 'languages', 'locale', 'json'],
    'https://github.com/TiagoDanin/ISO639-Codes'
  ),
  pkg(
    'require-from-web',
    'Import, load or require a module straight from a URL.',
    13435,
    '1.2.0',
    ['import', 'module', 'require', 'url'],
    'https://github.com/TiagoDanin/Require-From-Web'
  ),
  pkg(
    'locale-codes',
    'Language codes and country codes in one lookup table.',
    7095,
    '1.3.1',
    ['locale', 'language', 'country', 'i18n'],
    'https://github.com/TiagoDanin/Locale-Codes'
  ),
  pkg(
    'nodejs-i18n',
    'Minimalistic internationalization in gettext style for Node.js.',
    3416,
    '2.4.0',
    ['gettext', 'i18n', 'internationalization', 'nodejs', 'translations'],
    'https://github.com/TiagoDanin/NodeJS-i18n'
  ),
  pkg(
    'unsplash-source-node',
    'Wrapper for the Unsplash Source API.',
    2504,
    '1.2.0',
    ['unsplash', 'wallpapers', 'api'],
    'https://github.com/TiagoDanin/Unsplash-Source-Node'
  ),
  pkg(
    'telegraf-getchatmembers',
    'Implementation of the getChatMembers method in Telegraf, with a cache.',
    595,
    '1.0.1',
    ['telegraf', 'telegram', 'cache', 'middleware'],
    'https://github.com/TiagoDanin/Telegraf-GetChatMembers'
  ),
  pkg(
    'ttgram',
    'Integration between Twitter and Telegram.',
    595,
    '2.0.1',
    ['telegram', 'telegram-bot', 'twitter'],
    'https://github.com/TiagoDanin/TTgram'
  ),
  pkg(
    'jformat',
    'The Python str.format function, for JavaScript.',
    558,
    '1.1.0',
    ['format', 'string', 'python'],
    'https://github.com/TiagoDanin/JFormat'
  ),
  pkg(
    'nuxt-vuikit',
    'Vuikit module for Nuxt.js.',
    543,
    '1.1.0',
    ['nuxt', 'nuxt-module', 'vue', 'vuikit', 'uikit'],
    'https://github.com/TiagoDanin/Nuxt-Vuikit'
  ),
];

/**
 * The whole of `/rankings/npm`: the total downloads counter, the top ten
 * packages, aggregate statistics and the cross link to the GitHub rankings.
 *
 * It receives all 66 published packages and reduces them to a leaderboard.
 */
const meta = {
  title: 'Sections/NPMRankingsClient',
  component: NPMRankingsClient,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Leaderboard page for the NPM packages, sorted by `downloads`',
          'descending and cut to the first ten.',
          '',
          'The sort runs on a copy, so the caller\'s array is untouched, and',
          '`Array.prototype.sort` is stable: packages tied on downloads keep the',
          'order the collection gave them.',
          '',
          'Ranks one to three get a trophy or a medal, a coloured rank badge and',
          'a tinted card border. Rank four onwards is a plain `#n`.',
          '',
          'The download distribution here is extremely long tailed. The two',
          'internationalization packages account for millions of downloads while',
          'the rest sit in the hundreds, so ranks one and two dominate the totals',
          'and the "Average Downloads" figure describes almost nothing. That is',
          'the data, not a bug, but it explains why the page leads with a total',
          'rather than an average.',
          '',
          'Each card shows at most three keywords and summarises the rest as',
          '"+N more". Both links are external and open in a new tab.',
          '',
          '`totalDownloads / npmData.length` has no guard, so an empty array',
          'renders `NaN` where the average should be.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    npmData: {
      control: 'object',
      description:
        'Packages in any order. `keywords` must be an array, even an empty one, because the card slices it without checking. `links.npm` and `links.repository` are both rendered as buttons.',
    },
  },
  args: { npmData },
} satisfies Meta<typeof NPMRankingsClient>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Twelve packages in, ten on the board. The two least downloaded never appear,
 * but their downloads still count towards the total in the hero.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const titles = canvas.getAllByRole('heading', { level: 3 });

    // The slice, not the input length.
    await expect(titles).toHaveLength(10);

    // Sorted by downloads descending, regardless of the order passed in.
    await expect(titles[0]).toHaveTextContent('windows-locale');
    await expect(titles[1]).toHaveTextContent('iso639-codes');
    await expect(titles[2]).toHaveTextContent('require-from-web');

    // The two least downloaded packages are cut.
    await expect(canvas.queryByRole('heading', { name: 'nuxt-vuikit' })).not.toBeInTheDocument();

    const npmLinks = canvas.getAllByRole('link', { name: 'NPM' });
    await expect(npmLinks).toHaveLength(10);
    await expect(npmLinks[0]).toHaveAttribute(
      'href',
      'https://www.npmjs.com/package/windows-locale'
    );
    await expect(npmLinks[0]).toHaveAttribute('rel', expect.stringContaining('noopener'));
  },
};

/**
 * Exactly ten packages: nothing is cut, and the board matches the collection one
 * for one.
 */
export const ExactlyTen: Story = {
  args: { npmData: npmData.slice(0, 10) },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(10);
  },
};

/**
 * The three podium ranks on their own: trophy, silver medal, bronze medal, each
 * on a tinted card. Below rank three the icon becomes a plain number.
 */
export const TopThreeOnly: Story = {
  args: { npmData: [npmData[0], npmData[1], npmData[3]] },
  play: async ({ canvas }) => {
    const titles = canvas.getAllByRole('heading', { level: 3 });
    await expect(titles).toHaveLength(3);
    await expect(titles[0]).toHaveTextContent('windows-locale');
    await expect(titles[1]).toHaveTextContent('iso639-codes');
    await expect(titles[2]).toHaveTextContent('telegraf-test');
  },
};

/**
 * Two packages tied on 595 downloads. The sort is stable, so they hold the order
 * the collection gave them and the ranks read #9 and #10 with nothing to signal
 * that the order between them is arbitrary.
 */
export const TiedDownloads: Story = {
  args: { npmData },
  play: async ({ canvas }) => {
    const titles = canvas.getAllByRole('heading', { level: 3 });
    await expect(titles[8]).toHaveTextContent('telegraf-getchatmembers');
    await expect(titles[9]).toHaveTextContent('ttgram');
  },
};

/**
 * Keyword handling at both extremes: fourteen keywords collapse to three plus a
 * "+11 more" badge, and an empty array renders no keyword badges at all, leaving
 * the version on its own.
 */
export const KeywordExtremes: Story = {
  args: {
    npmData: [
      pkg(
        'telegraf-test',
        'Simple test toolkit for Telegram bots built with Telegraf.',
        8180,
        '1.2.1',
        [
          'localhost',
          'mocha',
          'offline',
          'sendmessage',
          'telegraf',
          'telegram',
          'telegram-bot',
          'telegram-test',
          'test',
          'test-automation',
          'test-framework',
          'testing',
          'testing-tools',
          'tests',
        ],
        'https://github.com/TiagoDanin/Telegraf-Test'
      ),
      pkg(
        'tiagodanin',
        'A README listing my npm packages.',
        558,
        '1.1.10',
        [],
        'https://github.com/TiagoDanin/TiagoDanin-Packages'
      ),
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('+11 more')).toBeVisible();
    await expect(canvas.getByText('v1.1.10')).toBeVisible();
  },
};

/**
 * A single package. The board, the statistics and the total all describe the
 * same package, so every number on the page is the same number.
 */
export const SinglePackage: Story = {
  args: { npmData: [npmData[1]] },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(1);
  },
};

/**
 * No packages. The board is empty and the headings still render, but
 * "Average Downloads" divides by zero and settles on `NaN`. A failed
 * `yarn data:npm` run leaves exactly this state.
 */
export const Empty: Story = {
  args: { npmData: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
    await expect(canvas.getByRole('heading', { name: /top 10 npm packages/i })).toBeVisible();

    // Divide by zero, rendered to the reader.
    const notANumber = await canvas.findAllByText('NaN');
    await expect(notANumber.length).toBeGreaterThan(0);
  },
};

/**
 * A scoped package name next to a description of a few hundred characters, with
 * the download counter competing for the same row. Neither the name nor the
 * description is truncated.
 */
export const LongContent: Story = {
  args: {
    npmData: [
      pkg(
        '@tiagodanin/react-native-zendesk-support-sdk-bridge',
        'A React Native bridge over the official Zendesk SDKs for iOS and Android, exposing chat, the help center and ticket creation through a single TypeScript API. The native side is written in Swift and Objective-C on iOS and in Kotlin on Android, so an app team can ship customer support without opening Xcode or Android Studio.',
        4212,
        '3.0.0-rc.2',
        ['react-native', 'zendesk', 'support', 'chat', 'ios', 'android'],
        'https://github.com/idopterlabs/rn-zendesk'
      ),
      npmData[0],
      npmData[1],
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('v3.0.0-rc.2')).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: '@tiagodanin/react-native-zendesk-support-sdk-bridge' })
    ).toBeVisible();
  },
};

/** Below `md` the statistics grid becomes a single column under the board. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
