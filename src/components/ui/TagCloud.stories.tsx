import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent, within } from 'storybook/test';

import { TagCloud, type TagCloudEntry } from './TagCloud';

/**
 * The tag index behind `/tags` and `/blog/tags`.
 *
 * Once GitHub topics and npm keywords count as tags the site has several
 * hundred of them, well past the point where a wall of badges is browsable, so
 * the list carries a text filter and an optional content-type filter. Both run
 * in the browser over a list the page already rendered: every tag is in the
 * HTML whether or not it survives the filter.
 */
const meta = {
  title: 'UI/TagCloud',
  component: TagCloud,
  parameters: { layout: 'padded' },
  args: { basePath: '/tags' },
  argTypes: {
    tags: { description: 'Every tag, already sorted by the page.' },
    basePath: { description: 'Prefix every tag links under, locale included.' },
    showSourceFilter: {
      description:
        'Shows the content-type chips. `/tags` turns it on; `/blog/tags` leaves it off, where every tag is a post tag and the row could only narrow to "articles".',
    },
  },
} satisfies Meta<typeof TagCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

const tag = (
  name: string,
  slug: string,
  counts: Partial<TagCloudEntry['counts']>
): TagCloudEntry => ({
  slug,
  name,
  total: (counts.post ?? 0) + (counts.talk ?? 0) + (counts.project ?? 0) + (counts.timeline ?? 0),
  counts: { post: 0, talk: 0, project: 0, timeline: 0, ...counts },
});

const tags: TagCloudEntry[] = [
  tag('Telegram', 'telegram', { project: 20, post: 1 }),
  tag('telegram-bot', 'telegram-bot', { project: 17 }),
  tag('Flutter', 'flutter', { post: 4, talk: 2 }),
  tag('React Native', 'react-native', { post: 3, talk: 3, project: 1 }),
  tag('Node', 'node', { project: 5 }),
  tag('JavaScript', 'javascript', { post: 2, project: 8 }),
  tag('HackerOne', 'hackerone', { timeline: 2 }),
  tag('Open Source', 'open-source', { post: 1, talk: 1, project: 4, timeline: 1 }),
  tag('lastfm', 'lastfm', { project: 4 }),
  tag('AI', 'ai', { post: 2 }),
];

export const Default: Story = {
  args: { tags, showSourceFilter: true },
};

/** `/blog/tags`, where every tag counts the same one thing. */
export const BlogOnly: Story = {
  args: {
    basePath: '/blog/tags',
    showSourceFilter: false,
    tags: tags
      .filter((entry) => entry.counts.post > 0)
      .map((entry) => ({
        ...entry,
        total: entry.counts.post,
        counts: { ...entry.counts, talk: 0, project: 0, timeline: 0 },
      })),
  },
};

/** Typing narrows the list, and the live region reports the new count. */
export const FilteredByText: Story = {
  args: { tags, showSourceFilter: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: /filter tags/i });

    await userEvent.type(input, 'telegram');

    await expect(canvas.getByRole('link', { name: /^Telegram/ })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /^Flutter/ })).not.toBeInTheDocument();
    await expect(canvas.getByText('2 tags')).toBeInTheDocument();
  },
};

/** The chips drop every tag with nothing of that type under it. */
export const FilteredBySource: Story = {
  args: { tags, showSourceFilter: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Timeline' }));

    await expect(canvas.getByRole('link', { name: /^HackerOne/ })).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /^Flutter/ })).not.toBeInTheDocument();
  },
};

/** Nothing matched: the count and the empty line say so without clearing the filter. */
export const NoMatch: Story = {
  args: { tags, showSourceFilter: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('searchbox', { name: /filter tags/i }), 'cobol');

    await expect(canvas.getByText('No tag matches this filter.')).toBeInTheDocument();
  },
};
