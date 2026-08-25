import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { FeedItem } from './FeedItem';

/**
 * The row on `/rss`, which is the only page that renders it, four times.
 */
const meta = {
  title: 'UI/FeedItem',
  component: FeedItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'One RSS feed on the `/rss` index: name, address, and what the feed',
          'carries.',
          '',
          'The address is printed in full rather than hidden behind a "Subscribe"',
          'label. A feed URL is meant to be copied into a reader by hand, and a',
          'link whose text is the URL can be copied from the page without opening',
          'it. `break-all` keeps a long address inside the card instead of pushing',
          'the layout sideways.',
          '',
          'The link opens in a new tab with `rel="noopener noreferrer"`, since the',
          'browser renders raw XML and losing the index page to it would be a dead',
          'end.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Feed name, rendered as an `h2`. The page supplies the `h1` above it.',
    },
    url: {
      control: 'text',
      description: 'Feed address. Shown verbatim and used as the link target.',
    },
    description: {
      control: 'text',
      description: 'One line on what the feed carries. No length cap, so keep it short.',
    },
  },
  args: {
    title: 'Blog Posts',
    url: '/rss/blog.xml',
    description: 'All articles and thoughts about development, technology and more.',
  },
} satisfies Meta<typeof FeedItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The blog feed, exactly as `/rss` renders it. Relative addresses are what the
 * page passes today, which keeps the links working on a preview deploy.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: '/rss/blog.xml' });
    await expect(link.getAttribute('href')).toMatch(/^\/rss\/blog\.xml\/?$/);
    await expect(link).toHaveAttribute('target', '_blank');
    // A new tab without noopener keeps a handle back to this window.
    await expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  },
};

/**
 * An absolute address, which is the form a reader actually needs. The title and
 * the URL share one row, so a long address squeezes the title before it wraps.
 */
export const AbsoluteUrl: Story = {
  args: {
    title: 'Talks',
    url: 'https://tiagodanin.com/rss/talks.xml',
    description: 'Talks and presentations about development, technology and more.',
  },
};

/**
 * All four feeds stacked, which is the whole of `/rss`. Worth looking at as a
 * set: the addresses are near-identical, so the description is what tells them
 * apart.
 */
export const AllFeeds: Story = {
  parameters: {
    docs: { description: { story: 'Reference layout: the complete `/rss` index.' } },
  },
  render: () => (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <FeedItem
        title="Blog Posts"
        url="/rss/blog.xml"
        description="All articles and thoughts about development, technology and more."
      />
      <FeedItem
        title="Talks"
        url="/rss/talks.xml"
        description="Talks and presentations about development, technology and more."
      />
      <FeedItem
        title="Timeline"
        url="/rss/timeline.xml"
        description="Professional journey and career milestones."
      />
      <FeedItem
        title="Projects"
        url="/rss/projects.xml"
        description="All projects by Tiago Danin."
      />
    </div>
  ),
};
