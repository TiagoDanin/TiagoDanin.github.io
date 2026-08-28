import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { AnimatedCounter } from './AnimatedCounter';

/**
 * The count-up behind every total on `/rankings/github/` and
 * `/rankings/npm/`: stars, forks, downloads, repository counts, the top
 * project's own numbers.
 */
const meta = {
  title: 'UI/AnimatedCounter',
  component: AnimatedCounter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Counts from zero to `target` on mount over `duration` milliseconds,',
          'driven by `requestAnimationFrame` and eased with a cubic ease-out, so',
          'the number decelerates into its final value instead of stopping dead.',
          '',
          'It renders a bare `<span>` with no styling of its own. The ranking',
          'pages wrap it in their own heading type, which is why the same',
          'component can be a 4xl hero figure in one place and a table cell in',
          'another.',
          '',
          '`formatNumber` decides whether the value is grouped with',
          '`toLocaleString`. Leave it on for quantities, where 1,284,930 is much',
          'easier to read at a glance than 1284930. Turn it off for values that',
          'are not quantities, above all years: a formatted 2019 would render as',
          '"2,019".',
          '',
          'Grouping follows the reader browser locale, so the separator is a',
          'comma on `en-US` and a period on `pt-BR`. The interaction tests below',
          'compare against `toLocaleString` rather than a hardcoded string for',
          'exactly that reason.',
          '',
          'The animation is not gated on `prefers-reduced-motion`, and the count',
          'starts on mount rather than when the number scrolls into view.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    target: {
      control: 'number',
      description: 'Final value. The count animates from zero up to it.',
    },
    duration: {
      control: { type: 'number', min: 100, step: 100 },
      description:
        'Length of the count-up in milliseconds. The ranking pages use 1500 to 3000, longer for the bigger figures.',
      table: { defaultValue: { summary: '2000' } },
    },
    formatNumber: {
      control: 'boolean',
      description:
        'Group thousands with `toLocaleString`. Turn off for years and other non-quantities.',
      table: { defaultValue: { summary: 'true' } },
    },
  },
  args: {
    target: 1247,
    duration: 2000,
    formatNumber: true,
  },
} satisfies Meta<typeof AnimatedCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Production timing: total GitHub stars over two seconds. Reload the story to
 * watch it again, since the count runs on mount.
 */
export const Default: Story = {};

/**
 * Total npm downloads, the largest figure on the site. `duration` is cut to
 * 100ms here so the assertion on the settled value stays fast and
 * deterministic; the real page uses 3000.
 */
export const TotalDownloads: Story = {
  args: { target: 1284930, duration: 100 },
  play: async ({ canvas, args }) => {
    // Compare against the runtime locale, not a hardcoded separator.
    await canvas.findByText(args.target.toLocaleString());
  },
};

/**
 * `formatNumber: false` for a year. This is the `GitHubRankingsClient` case for
 * repository counts and single-project star totals, where grouping would either
 * be wrong or add noise to a two-digit number.
 */
export const Unformatted: Story = {
  args: { target: 2019, duration: 100, formatNumber: false },
  play: async ({ canvas }) => {
    await canvas.findByText('2019');
    await expect(canvas.queryByText('2,019')).not.toBeInTheDocument();
  },
};

/**
 * A project with no stars yet. The counter settles on `0` immediately rather
 * than rendering an empty span, which matters because the ranking pages pass
 * `sortedRepos[0]?.stargazers_count || 0`.
 */
export const Zero: Story = {
  args: { target: 0, duration: 100 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('0')).toBeVisible();
  },
};

/**
 * The shortest duration the ranking pages use, on the smallest figure. At this
 * size the animation is closer to a flicker than a count.
 */
export const SmallAndFast: Story = {
  args: { target: 42, duration: 1500, formatNumber: false },
};

/**
 * How the ranking pages actually present it: the counter inside the page's own
 * display type, with the label owned by the caller.
 */
export const InRankingCard: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Two totals side by side, matching the stat cards at the top of the GitHub rankings page.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="rounded-xl border bg-background p-6 shadow-xs">
        <p className="text-3xl font-bold tabular-nums">
          <AnimatedCounter target={1247} duration={2500} />
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Total stars</p>
      </div>
      <div className="rounded-xl border bg-background p-6 shadow-xs">
        <p className="text-3xl font-bold tabular-nums">
          <AnimatedCounter target={1284930} duration={3000} />
        </p>
        <p className="mt-1 text-sm text-muted-foreground">npm downloads</p>
      </div>
    </div>
  ),
};
