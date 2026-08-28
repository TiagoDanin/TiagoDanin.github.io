import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { TagFilter } from './TagFilter';

/**
 * The tag strip under the heading on `/blog/`, `/blog/[page]/`, `/blog/pt/`,
 * `/blog/tags/[tag]/` and `/tags/[tag]/`.
 */
const meta = {
  title: 'UI/TagFilter',
  component: TagFilter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Despite the name this filters nothing on the client. It is a',
          'navigation strip: it collects every distinct tag across the posts it',
          'is given, sorts them alphabetically, and links each one to its own',
          'statically generated page. There is no selected state and no active',
          'highlight, so on `/tags/[tag]/` the current tag looks like all the',
          'others.',
          '',
          'Hrefs come from `titleToSlug` in `src/utils/parse.ts`, the same',
          'function that generates the tag routes, so a link can only point at a',
          'page that exists. That function keeps `[a-z0-9\\s-]` and drops the',
          'rest, which means accents and punctuation disappear rather than being',
          'transliterated: `Programação` slugs to `programao`, and `CI/CD` slugs',
          'to `cicd`.',
          '',
          'With no tags anywhere in the input the component renders `null`,',
          'so an untagged blog does not leave an empty row of spacing behind.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    posts: {
      description:
        'Any objects carrying a `tags` array. Pages pass their post list straight through; duplicates across posts are expected and deduplicated here.',
    },
    basePath: {
      control: 'text',
      description:
        'Prefix for every link. The three blog routes pass `/blog/tags`, so a tag clicked from a list of articles opens the blog filter; the default sends it to the site-wide index.',
      table: { defaultValue: { summary: '/tags' } },
    },
  },
  args: {
    posts: [
      { tags: ['React Native', 'Performance'] },
      { tags: ['Flutter', 'Firebase'] },
      { tags: ['React Native', 'Testing'] },
      { tags: ['Security', 'HackerOne'] },
    ],
  },
} satisfies Meta<typeof TagFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A realistic blog index. Note that `React Native` appears in two posts and
 * renders once, and that the output is alphabetical rather than in post order.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole('link');

    // Eight tag mentions across four posts, one of them repeated, so seven
    // links come out.
    await expect(links).toHaveLength(7);
    await expect(links.map((link) => link.textContent)).toEqual([
      'Firebase',
      'Flutter',
      'HackerOne',
      'Performance',
      'React Native',
      'Security',
      'Testing',
    ]);

    await expect(canvas.getByRole('link', { name: 'React Native' })).toHaveAttribute(
      'href',
      '/tags/react-native'
    );
  },
};

/** A brand new blog with one tagged post. The strip still renders. */
export const SingleTag: Story = {
  args: { posts: [{ tags: ['Flutter'] }] },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
    await expect(canvas.getByRole('link', { name: 'Flutter' })).toHaveAttribute(
      'href',
      '/tags/flutter'
    );
  },
};

/**
 * Nothing tagged anywhere. The component returns `null` rather than an empty
 * flex row, so the heading above keeps its own bottom spacing.
 */
export const NoTags: Story = {
  args: { posts: [{ tags: [] }, { tags: [] }] },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('link')).toHaveLength(0);
  },
};

/**
 * Accents and punctuation are dropped, not transliterated, because
 * `titleToSlug` keeps only `[a-z0-9\s-]`. The label stays readable; the URL
 * loses the characters. Worth knowing before adding a Portuguese tag whose only
 * distinguishing letter carries an accent.
 */
export const AccentsAndPunctuation: Story = {
  args: {
    posts: [{ tags: ['CI/CD', 'Programação', 'Open Source'] }],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'CI/CD' })).toHaveAttribute(
      'href',
      '/tags/cicd'
    );
    // The cedilla and the tilde are dropped, not transliterated.
    await expect(canvas.getByRole('link', { name: 'Programação' })).toHaveAttribute(
      'href',
      '/tags/programao'
    );
    await expect(canvas.getByRole('link', { name: 'Open Source' })).toHaveAttribute(
      'href',
      '/tags/open-source'
    );
  },
};

/** `basePath` retargets every link at once. */
export const CustomBasePath: Story = {
  args: {
    posts: [{ tags: ['Flutter', 'React Native'] }],
    basePath: '/blog/tags',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Flutter' })).toHaveAttribute(
      'href',
      '/blog/tags/flutter'
    );
  },
};

/**
 * The whole tag vocabulary of the blog at once. The strip wraps and centres,
 * and at this size it is closer to a tag cloud than a filter row.
 */
export const ManyTags: Story = {
  args: {
    posts: [
      {
        tags: [
          'React Native',
          'Flutter',
          'Kotlin',
          'Swift',
          'Firebase',
          'Testing',
          'Performance',
          'Security',
          'HackerOne',
          'Open Source',
          'npm',
          'Git',
          'CI',
          'Elixir',
          'Next.js',
          'MCP',
          'Career',
          'Community',
        ],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link')).toHaveLength(18);
  },
};
