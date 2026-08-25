import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { SocialLinks } from './SocialLinks';

/**
 * The icon row under the hero on the home page, repeated in the footer. Both
 * read the same `sociallinks` collection, so the two rows can never disagree.
 */
const meta = {
  title: 'UI/SocialLinks',
  component: SocialLinks,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A row of icon-only links to the profiles listed in',
          '`contents/sociallinks/index.json`.',
          '',
          'Each entry names its icon as a string, which the component resolves',
          'against a four-entry map: `Github`, `Linkedin`, `Youtube`,',
          '`Instagram`. An unknown name is skipped rather than rendered as a',
          'blank square, so adding a network to the collection without',
          'registering its icon here silently drops the link. That is the single',
          'non-obvious thing about this component.',
          '',
          'The buttons use `asChild`, so each one is a single anchor carrying the',
          'button styling rather than an anchor nested inside a button. The icon',
          'has no text, so `label` becomes the `aria-label` and is the entire',
          'accessible name.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    socialLinks: {
      description:
        'Rows from the `sociallinks` collection. Order on screen is the order in the file.',
    },
  },
  args: {
    socialLinks: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/tiagodanin', icon: 'Linkedin' },
      { label: 'Instagram', url: 'https://instagram.com/tiagodanin', icon: 'Instagram' },
      {
        label: 'YouTube',
        url: 'https://www.youtube.com/channel/UCC2wpNWwPLPq0vjpOtGcajw',
        icon: 'Youtube',
      },
      { label: 'GitHub', url: 'https://github.com/tiagodanin', icon: 'Github' },
    ],
  },
} satisfies Meta<typeof SocialLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The four profiles in the collection today, in file order. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(4);

    // Icon-only controls have no text, so the label is the only accessible name.
    await expect(links.map((link) => link.getAttribute('aria-label'))).toEqual([
      'LinkedIn',
      'Instagram',
      'YouTube',
      'GitHub',
    ]);

    const github = canvas.getByRole('link', { name: 'GitHub' });
    await expect(github).toHaveAttribute('href', 'https://github.com/tiagodanin');
    await expect(github).toHaveAttribute('target', '_blank');
    // Without noopener the opened tab keeps a handle on this window.
    await expect(github).toHaveAttribute('rel', expect.stringContaining('noopener'));
  },
};

/** One profile. The row is a plain flex container, so a single link is fine. */
export const SingleNetwork: Story = {
  args: {
    socialLinks: [
      { label: 'GitHub', url: 'https://github.com/tiagodanin', icon: 'Github' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
  },
};

/**
 * An entry whose icon name is not in the map. The link is dropped entirely,
 * with nothing to show that a row went missing.
 *
 * Worth seeing, because this is reachable in production: the `sociallinks`
 * collection types `icon` as a plain `string`, which is why `Footer.tsx`
 * carries a type error handing its rows to this component. Any value can get
 * here, and only four of them render.
 */
export const UnknownIconIsDropped: Story = {
  args: {
    socialLinks: [
      { label: 'GitHub', url: 'https://github.com/tiagodanin', icon: 'Github' },
      {
        label: 'Bluesky',
        url: 'https://bsky.app/profile/tiagodanin.com',
        // Deliberately outside the icon map. The collection is JSON, so this
        // value can reach the component in production the same way.
        icon: 'Bluesky' as unknown as 'Github',
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
    await expect(canvas.queryByRole('link', { name: 'Bluesky' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'GitHub' })).toBeVisible();
  },
};

/**
 * An empty collection renders an empty row. The component has no guard for it,
 * so the surrounding `gap` still applies; the hero and footer both place it in
 * a stack where that collapses to nothing visible.
 */
export const Empty: Story = {
  args: { socialLinks: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('link')).toHaveLength(0);
  },
};

/**
 * On the footer surface. The buttons are `ghost`, so they only pick up a
 * background on hover, and the 48px box keeps them a comfortable touch target.
 */
export const OnMutedSurface: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: { story: 'The footer arrangement, on the secondary surface.' },
    },
  },
  render: (args) => (
    <div className="rounded-xl bg-secondary/30 p-8">
      <SocialLinks {...args} />
    </div>
  ),
};
