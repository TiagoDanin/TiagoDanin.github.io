import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import { FullProjects, type ProjectSection } from './FullProjects';

const githubSection: ProjectSection = {
  title: 'GitHub',
  projects: [
    {
      title: 'Awesome-Polybar',
      description: 'Curated list of Polybar modules, themes and scripts.',
      href: 'https://tiagodanin.github.io/Awesome-Polybar/',
    },
    {
      title: 'Android-Debug-Bridge-MCP',
      description:
        'MCP plugin to control Android devices over ADB for automation, testing and agent integration.',
      href: 'https://github.com/TiagoDanin/Android-Debug-Bridge-MCP',
    },
    {
      title: 'Telegraf-Test',
      description: 'Simple test toolkit for Telegram bots written with Telegraf.',
      href: 'https://tiagodanin.github.io/Telegraf-Test/',
    },
    {
      title: 'Nuxt-Vuikit',
      description: 'Vuikit module for Nuxt.js. No longer maintained.',
      href: 'https://github.com/TiagoDanin/Nuxt-Vuikit',
      archived: true,
    },
  ],
};

const npmSection: ProjectSection = {
  title: 'NPM',
  projects: [
    {
      title: 'windows-locale',
      description: 'Windows Language Code Identifier (LCID) for JavaScript.',
      href: 'https://www.npmjs.com/package/windows-locale',
    },
    {
      title: 'iso639-codes',
      description: 'ISO639 language codes for JavaScript.',
      href: 'https://www.npmjs.com/package/iso639-codes',
    },
    {
      title: 'locale-codes',
      description: 'Language codes and country codes in a single lookup table.',
      href: 'https://www.npmjs.com/package/locale-codes',
    },
  ],
};

const googlePlaySection: ProjectSection = {
  title: 'Google Play',
  projects: [
    {
      title: 'CAM Covers',
      description: 'Turn a photo into an album cover. Built with Flutter.',
      href: '/app/cam-covers',
    },
    {
      title: 'Defend The Castle',
      description: 'Telegram bot game ported to Android.',
      href: '/app/defend-the-castle',
    },
  ],
};

const privateSection: ProjectSection = {
  title: 'Private',
  projects: [
    {
      title: 'Banking onboarding app',
      description:
        'React Native onboarding flow for a Brazilian bank, including document capture and liveness checks.',
      href: null,
    },
    {
      title: 'Field service app',
      description: 'Offline-first Flutter app for technicians, with background sync.',
      href: null,
    },
  ],
};

const offlineSection: ProjectSection = {
  title: 'Offline/Old Websites',
  projects: [
    {
      title: 'TycotBot',
      description: 'Telegram bot written in Python. The hosting is long gone.',
      href: null,
    },
    {
      title: 'StoreOfBot',
      description: 'Directory of Telegram bots, channels and groups.',
      href: null,
    },
  ],
};

/**
 * The full project archive on `/projects`, rendered under the "Selected work"
 * highlight grid.
 *
 * Every section is collapsed on load, so the page opens as a list of ten
 * headings rather than 250 cards.
 */
const meta = {
  title: 'Sections/FullProjects',
  component: FullProjects,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Accordion over the ten project collections: GitHub, Google Play, NPM,',
          'LuaRocks, Pypi, Atom, Microsoft Store, AUR, Private and Offline.',
          '',
          'Two counts in this component are not simply `projects.length`:',
          '',
          '- A constant of 55 unlisted private projects is added to the header',
          '  total and to the "Private" section count. Passing no sections at all',
          '  therefore still reads "55 Projects".',
          '- The section titled exactly `Private` renders a different body: the',
          '  listed projects under a "Regular Projects" heading, plus an easter',
          '  egg badge for the 55 that are not listed. The match is on the literal',
          '  string, so renaming that section in the page silently drops the',
          '  special body.',
          '',
          'Sections open one at a time through independent state, so several can',
          'be open at once. Each toggle carries `aria-expanded` and',
          '`aria-controls`, and the collapsed body is `display: none` rather than',
          'unmounted.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    projectSections: {
      control: 'object',
      description:
        'One entry per project source, rendered in array order. `href: null` marks a project with no public destination, which renders as a static card.',
    },
  },
  args: {
    projectSections: [
      githubSection,
      googlePlaySection,
      npmSection,
      privateSection,
      offlineSection,
    ],
  },
} satisfies Meta<typeof FullProjects>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Five sections, all collapsed. The header total is the 13 listed projects plus
 * the 55 unlisted private ones.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('68 Projects')).toBeVisible();

    const github = canvas.getByRole('button', { name: /toggle github projects section/i });
    // A collapsed body is display:none, so its cards are not in the a11y tree.
    await expect(canvas.queryByRole('heading', { name: 'Awesome-Polybar' })).not.toBeInTheDocument();

    await userEvent.click(github);

    await expect(github).toHaveAttribute('aria-expanded', 'true');
    await expect(await canvas.findByRole('heading', { name: 'Awesome-Polybar' })).toBeVisible();
  },
};

/**
 * Opening the GitHub section shows an archived repository. The badge is the only
 * signal that a project is no longer maintained; the card stays clickable.
 */
export const WithArchivedProject: Story = {
  args: { projectSections: [githubSection] },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /toggle github projects section/i }));

    await expect(await canvas.findByText('Archived')).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Nuxt-Vuikit' })).toBeVisible();
  },
};

/**
 * The "Private" section and its easter egg. The listed projects sit under
 * "Regular Projects", and the 55 that cannot be named get a badge of their own.
 * None of these cards has an `href`, so none of them is interactive.
 */
export const PrivateSection: Story = {
  args: { projectSections: [privateSection] },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /toggle private projects section/i }));

    await expect(await canvas.findByRole('heading', { name: /regular projects \(2\)/i })).toBeVisible();
    await expect(canvas.getByText('55 secret projects')).toBeVisible();
    // 2 listed + 55 unlisted, shown on the collapsed toggle itself.
    await expect(canvas.getByText('57 projects')).toBeVisible();
  },
};

/**
 * Two sections open at once. State is per section title, so opening one never
 * closes another, and the reader can compare two sources side by side.
 */
export const MultipleSectionsOpen: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /toggle github projects section/i }));
    await userEvent.click(canvas.getByRole('button', { name: /toggle npm projects section/i }));

    await expect(await canvas.findByRole('heading', { name: 'Awesome-Polybar' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'windows-locale' })).toBeVisible();
  },
};

/**
 * A source with nothing in it. The toggle still renders and still opens; the
 * body is simply an empty grid. Worth knowing when a data script fails and
 * writes an empty collection.
 */
export const EmptySection: Story = {
  args: {
    projectSections: [githubSection, { title: 'Atom', projects: [] }],
  },
  play: async ({ canvas }) => {
    const atom = canvas.getByRole('button', { name: /toggle atom projects section/i });
    await expect(canvas.getByText('0 projects')).toBeVisible();

    await userEvent.click(atom);
    await expect(atom).toHaveAttribute('aria-expanded', 'true');
  },
};

/**
 * No sections at all. The accordion disappears but the header still claims 55
 * projects, because the private constant is added unconditionally.
 */
export const Empty: Story = {
  args: { projectSections: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('55 Projects')).toBeVisible();
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
  },
};

/**
 * Package names and descriptions are not truncated, so a long entry sets the row
 * height for its neighbours. This is the realistic worst case: a repository
 * description copied straight from GitHub, where nothing enforces a length.
 */
export const LongContent: Story = {
  args: {
    projectSections: [
      {
        title: 'GitHub',
        projects: [
          {
            title: 'Android-Debug-Bridge-MCP-Server-For-Agent-Integration',
            description:
              'A Model Context Protocol plugin that exposes the Android Debug Bridge to an agent: list connected devices, install and uninstall builds, drive the UI through input events, pull logcat, capture screenshots and run instrumented tests, all without leaving the conversation. Written in TypeScript, tested against physical Pixel devices and the Android emulator on both macOS and Linux.',
            href: 'https://github.com/TiagoDanin/Android-Debug-Bridge-MCP',
          },
          githubSection.projects[0],
          githubSection.projects[2],
        ],
      },
    ],
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /toggle github projects section/i }));
    await expect(
      await canvas.findByRole('heading', {
        name: 'Android-Debug-Bridge-MCP-Server-For-Agent-Integration',
      })
    ).toBeVisible();
  },
};
