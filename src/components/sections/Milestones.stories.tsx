import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { Milestones, type MilestoneEntry } from './Milestones';

const milestones: MilestoneEntry[] = [
  {
    date: '2025',
    title: '4th place at the Hack In Cariri CTF, XibéSec',
    description:
      'First in-person capture the flag competition, at XibéSec in Belém. Finished 4th out of the field.',
    tags: ['ctf', 'cybersecurity', 'xibesec'],
  },
  {
    date: '2024',
    title: 'AI agent driving an Android phone through Claude Code',
    description:
      'Wired Claude Code to Android-Debug-Bridge-MCP so an agent could drive a real device for test automation and app documentation.',
    tags: ['ai', 'android', 'automation', 'mcp'],
  },
  {
    date: '2023',
    title: 'DevOpsDays Belém: mobile delivery without a release engineer',
    description:
      'Talk on shipping Flutter and React Native builds through a pipeline small teams can actually maintain.',
    tags: ['talks', 'devops'],
  },
  {
    date: '2020',
    title: '1st place at the TecBan Open Banking Hackathon',
    description:
      'Built BICOS, an app that puts Open Banking to work for informal workers without asking them to learn what Open Banking is.',
    tags: ['hackathon', 'open-banking'],
  },
];

const meta = {
  title: 'Sections/Milestones',
  component: Milestones,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Career highlights on /about, as an ordered list of dated cards.',
          '',
          'One of the two blocks that give /about a reason to exist next to the',
          'home page: the home sells what he builds, /about backs it with a',
          'record. It reads the `timeline` collection, sorted newest first and',
          'capped at six by the page, not by this component.',
          '',
          'Two constraints are baked in:',
          '',
          '- **Only the first two tags render.** A milestone tagged with six',
          '  keywords would otherwise wrap the meta row onto three lines and',
          '  push the heading below the fold. The remaining tags still exist in',
          '  the collection and still drive /tags.',
          '- **The React key is `date-title`.** Timeline entries only carry a',
          '  year, so two milestones in the same year need distinct titles.',
          '',
          'It is an `ol`, not a `ul`: the order is chronological and carries',
          'meaning.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    milestones: {
      control: 'object',
      description:
        'Entries in render order. `date` is the raw year from the collection and is used as both the visible label and the `datetime` value. Only `tags[0]` and `tags[1]` are shown.',
    },
    href: {
      control: 'text',
      description: 'Destination of the closing "Full timeline" link.',
      table: { defaultValue: { summary: '/timeline' } },
    },
  },
  args: { milestones },
} satisfies Meta<typeof Milestones>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The section as /about renders it, four entries newest first.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Milestones' })).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);

    await expect(canvas.getByRole('link', { name: /full timeline/i })).toHaveAttribute(
      'href',
      '/timeline'
    );
  },
};

/**
 * A heavily tagged entry. Six tags go into the collection, two come out, and
 * the meta row stays on one line next to the year.
 *
 * The truncation is silent: there is no "+4" affordance, so a reader has no
 * signal that tags were dropped. That is the trade the design makes.
 */
export const TagsTruncatedToTwo: Story = {
  args: {
    milestones: [
      {
        date: '2025',
        title: '4th place at the Hack In Cariri CTF, XibéSec',
        description:
          'First in-person capture the flag competition, at XibéSec in Belém. Finished 4th out of the field.',
        tags: ['ctf', 'cybersecurity', 'xibesec', 'competition', 'events', 'belem'],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('ctf')).toBeVisible();
    await expect(canvas.getByText('cybersecurity')).toBeVisible();

    await expect(canvas.queryByText('xibesec')).not.toBeInTheDocument();
    await expect(canvas.queryByText('competition')).not.toBeInTheDocument();
    await expect(canvas.queryByText('belem')).not.toBeInTheDocument();
  },
};

/**
 * `tags` is optional and older timeline entries omit it. The meta row then
 * holds the year alone, with no empty badge slot left behind.
 */
export const WithoutTags: Story = {
  args: {
    milestones: [
      {
        date: '2017',
        title: 'First npm package published',
        description:
          'locale-codes went out as a small lookup table and is still downloaded every day, which is most of what maintaining open source turned out to mean.',
      },
      { ...milestones[3], tags: undefined },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
    await expect(canvas.getByText('2017')).toBeVisible();
  },
};

/**
 * Two entries from the same year. They render as separate cards, and the
 * repeated year is the intended reading: the timeline stores years, not dates.
 */
export const SameYearEntries: Story = {
  args: {
    milestones: [
      milestones[1],
      {
        date: '2024',
        title: 'Talk on mobile careers with Studio Code and OWASP Belém',
        description:
          'Walked through the actual path into mobile work, including the parts that were luck, for an audience mostly at the start of theirs.',
        tags: ['career', 'owasp'],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('2024')).toHaveLength(2);
  },
};

/**
 * A single milestone. The list still renders, and so does the closing link,
 * which is the right call: one highlight is a reason to see the full timeline,
 * not a reason to hide it.
 */
export const SingleMilestone: Story = {
  args: { milestones: [milestones[0]] },
};

/**
 * Empty collection renders nothing at all, matching PressMentions. A heading
 * and a "Full timeline" link over a blank list would read as a broken section
 * rather than an absent one.
 */
export const Empty: Story = {
  args: { milestones: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading', { name: 'Milestones' })).not.toBeInTheDocument();
    await expect(canvas.queryAllByRole('listitem')).toHaveLength(0);
    await expect(canvas.queryByRole('link', { name: /full timeline/i })).not.toBeInTheDocument();
  },
};

/**
 * `href` points the closing link somewhere else, for a page that lists a single
 * year rather than the whole record.
 */
export const CustomDestination: Story = {
  args: { href: '/timeline/2025' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /full timeline/i })).toHaveAttribute(
      'href',
      '/timeline/2025'
    );
  },
};

/**
 * At 320px the meta row wraps the year and its badges onto separate lines and
 * the cards keep their 24px padding.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
