import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import { Projects } from './Projects';

const selectedWork = [
  {
    title: 'BICOS',
    description:
      'An Open Banking application built during the TecBan hackathon. It won by showing that people do not need to understand Open Banking to benefit from it.',
    imageUrl: '/projects/bicos-app.png',
    href: 'https://www.tecmundo.com.br/mercado/155846-ninguem-precisa-entender-open-banking-lucrar.htm',
  },
  {
    title: 'CAM Covers',
    description:
      'An Android app that turns an ordinary photo into an album cover, built with Flutter and published on Google Play.',
    imageUrl: '/projects/cam-covers-app.png',
    href: 'https://play.google.com/store/apps/details?id=com.tiagodanin.camcovers.cam_covers',
  },
  {
    title: 'React Native Zendesk SDK',
    description:
      'A React Native wrapper around the native Zendesk SDKs for iOS and Android, so support chat can be dropped into an app without touching Swift or Kotlin.',
    imageUrl: '/projects/zendesk-sdk.png',
    href: 'https://idopterlabs.github.io/rn-zendesk/',
  },
  {
    title: 'Stone World',
    description:
      'A puzzle game set in a stone world, built with Unity 3D. Not released yet, so the card has no destination.',
    imageUrl: '/projects/stone-game.png',
    href: '',
  },
  {
    title: 'Slime Adventure',
    description:
      'A 2D platformer prototype written in Flutter with the Bonfire engine, used as the teaching project for game development mentoring.',
    imageUrl: '/projects/slime-game.png',
    href: '',
  },
  {
    title: 'Air Conditioning Control',
    description:
      'An IoT side project: an ESP8266 bridge that exposes an old air conditioner to HTTP, driven from a small React Native remote.',
    imageUrl: '/projects/air-conditionin.png',
    href: 'https://github.com/TiagoDanin',
  },
];

/**
 * The "Selected work" block, rendered twice on the site: once on the home page
 * and once at the top of `/projects`, above the full archive.
 *
 * Those two placements are the same component behaving differently, which is
 * the main thing this file documents.
 */
const meta = {
  title: 'Sections/Projects',
  component: Projects,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Six-card highlight grid over three purple blur orbs, driven entirely',
          'by the `projects` collection.',
          '',
          'Two behaviours are route and viewport dependent, so they cannot be',
          'reached through controls:',
          '',
          '- The "See all 250+ projects" call to action hides itself when',
          '  `usePathname()` returns `/projects`, because the archive it points',
          '  at is already on screen. Stories reach that branch through',
          '  `parameters.nextjs.navigation.pathname`.',
          '- Below 768px the grid is clipped to 780px with a fade and a',
          '  "Show More" toggle. On desktop the full grid always renders and the',
          '  toggle is absent.',
          '',
          'A card is only clickable when `href` is truthy. An empty string is the',
          'honest way to say "no destination yet": the card keeps its content but',
          'drops the pointer cursor, the hover lift and the external link icon.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    projects: {
      control: 'object',
      description:
        'Highlighted projects, rendered in array order. Each entry needs `title`, `description`, `imageUrl` and `href`; pass an empty string for either URL to omit the cover or the link.',
    },
  },
  args: {
    projects: selectedWork,
  },
} satisfies Meta<typeof Projects>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The home page placement: six projects and the archive call to action.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const seeAll = canvas.getByRole('link', { name: /see all 250\+ projects/i });
    await expect(seeAll).toHaveAttribute('href', '/projects');

    // Six cards, each with its own heading.
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(6);
  },
};

/**
 * The `/projects` placement. The section drops its own call to action because
 * the full archive renders directly underneath it, so the link would scroll the
 * reader to where they already are.
 */
export const OnProjectsPage: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/projects' } },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('link', { name: /see all 250\+ projects/i })
    ).not.toBeInTheDocument();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(6);
  },
};

/**
 * Two of the six cards ship without a destination. They keep their cover and
 * copy but lose the external link icon and the hover lift, which is the rule in
 * `DESIGN.md`: no affordance without a real target.
 */
export const WithAndWithoutLinks: Story = {
  args: {
    projects: [selectedWork[0], selectedWork[3], selectedWork[4]],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Stone World' })).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  },
};

/**
 * With no cover image the card collapses to title and description. Useful for
 * projects added to the collection before a screenshot exists.
 */
export const WithoutCovers: Story = {
  args: {
    projects: selectedWork.slice(0, 3).map((project) => ({ ...project, imageUrl: '' })),
  },
};

/**
 * An empty collection still renders the heading, the ambient orbs and the call
 * to action. Nothing throws, but the section is a heading floating over an empty
 * grid, so an empty `projects` collection is a content bug rather than a
 * supported state.
 */
export const Empty: Story = {
  args: { projects: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
    await expect(canvas.getByRole('link', { name: /see all 250\+ projects/i })).toBeVisible();
  },
};

/**
 * The layout under pressure: a title long enough to wrap three times and a
 * description of a few hundred characters. Neither is truncated, so cards in the
 * same row grow to the tallest one.
 */
export const LongContent: Story = {
  args: {
    projects: [
      {
        title:
          'React Native Zendesk SDK bridge with Swift, Objective-C and Kotlin native modules',
        description:
          'A wrapper around the official Zendesk SDKs that exposes chat, help center and ticket creation to React Native through a single JavaScript API. The native side is written in Swift and Objective-C on iOS and in Kotlin on Android, with a shared TypeScript surface so the app team never has to open Xcode. Shipped in production for several Idopter Labs clients, with automated tests running on Firebase Test Lab against a matrix of Android versions.',
        imageUrl: '/projects/zendesk-sdk.png',
        href: 'https://idopterlabs.github.io/rn-zendesk/',
      },
      selectedWork[1],
      selectedWork[0],
    ],
  },
};

/**
 * Below 768px the grid is clipped to 780px with a fade over the cut, and a
 * "Show More" button reveals the rest. The toggle only exists on mobile: on
 * desktop the whole grid is always visible.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvas }) => {
    const showMore = await canvas.findByRole('button', { name: /show more/i });
    await userEvent.click(showMore);

    await expect(await canvas.findByRole('button', { name: /show less/i })).toBeVisible();
  },
};
