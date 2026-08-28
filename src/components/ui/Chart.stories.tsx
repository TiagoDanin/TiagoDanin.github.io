import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import { expect, within } from 'storybook/test';

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './chart';

/**
 * Thin wrapper around Recharts that turns a `ChartConfig` into CSS custom
 * properties and supplies styled tooltip and legend bodies.
 */
const meta = {
  title: 'UI/Chart',
  component: ChartContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'Nothing on the site plots data today, and `recharts` is carried as a',
          'dependency purely for this file.',
          '',
          'Two constraints decide whether a chart appears at all:',
          '',
          '1. **The container needs a resolved height.** `ChartContainer`',
          '   renders a Recharts `ResponsiveContainer`, which measures its',
          '   parent. Inside a flex or grid cell with no height that measurement',
          '   comes back as zero and the chart paints nothing. The base class',
          '   sets `aspect-video`, which is enough in a normal document flow;',
          '   every story here also pins an explicit height so it renders the',
          '   same way in an automated run.',
          '2. **Colours come from the config, not from the mark.** Each key in',
          '   `ChartConfig` is emitted as `--color-<key>` scoped to that chart,',
          '   so a series is filled with `var(--color-downloads)` rather than a',
          '   literal. This project never added the `--chart-1` through',
          '   `--chart-5` tokens that shadcn assumes, so the configs below reach',
          '   for `--primary` and `--muted-foreground` instead.',
          '',
          'The dark half of `ChartStyle` emits a `.dark` block that this site',
          'never matches, since there is no dark theme. It is harmless dead CSS.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    config: {
      control: false,
      description:
        'Maps each series key to a label and a colour. The colour becomes `--color-<key>` on the container.',
    },
    children: {
      control: false,
      description:
        'A single Recharts chart element. It is handed to `ResponsiveContainer`, which only accepts one child.',
    },
    className: {
      control: 'text',
      description:
        'Give the container a height here. Without one the responsive container measures zero and renders empty.',
    },
  },
  args: {
    config: {},
    children: <BarChart data={[]} />,
    className: 'h-80 w-full',
  },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Weekly npm downloads for one package over a year. */
const downloadsByMonth = [
  { month: 'Jan', downloads: 1840 },
  { month: 'Feb', downloads: 2110 },
  { month: 'Mar', downloads: 2680 },
  { month: 'Apr', downloads: 2450 },
  { month: 'May', downloads: 3120 },
  { month: 'Jun', downloads: 3690 },
  { month: 'Jul', downloads: 3410 },
  { month: 'Aug', downloads: 4020 },
  { month: 'Sep', downloads: 4580 },
  { month: 'Oct', downloads: 4310 },
  { month: 'Nov', downloads: 5090 },
  { month: 'Dec', downloads: 4760 },
];

const downloadsConfig = {
  downloads: {
    label: 'Weekly downloads',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

/** Stars and forks on one repository, sampled per quarter. */
const repoGrowth = [
  { quarter: '2023 Q1', stars: 62, forks: 9 },
  { quarter: '2023 Q2', stars: 94, forks: 14 },
  { quarter: '2023 Q3', stars: 131, forks: 21 },
  { quarter: '2023 Q4', stars: 178, forks: 27 },
  { quarter: '2024 Q1', stars: 240, forks: 35 },
  { quarter: '2024 Q2', stars: 296, forks: 44 },
];

const repoConfig = {
  stars: {
    label: 'Stars',
    color: 'hsl(var(--primary))',
  },
  forks: {
    label: 'Forks',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig;

/**
 * Single series bar chart of npm downloads. The bar is filled with
 * `var(--color-downloads)`, which the container emits from the config, so the
 * colour is declared once and never repeated on the mark.
 */
export const Default: Story = {
  args: {
    config: downloadsConfig,
    children: (
      <BarChart data={downloadsByMonth} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="downloads" fill="var(--color-downloads)" radius={4} />
      </BarChart>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Recharts renders axis ticks as SVG text, so a rendered chart is one that
    // has real tick labels rather than an empty measured box.
    await expect(await canvas.findByText('Jan')).toBeInTheDocument();
    await expect(await canvas.findByText('Dec')).toBeInTheDocument();
  },
};

/**
 * Two series with a legend. Both colours come from the config, and
 * `ChartLegendContent` reads the same config for its labels, so the legend can
 * never drift from what is plotted.
 */
export const MultiSeriesLine: Story = {
  args: {
    config: repoConfig,
    children: (
      <LineChart data={repoGrowth} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="quarter"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="stars"
          stroke="var(--color-stars)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="forks"
          stroke="var(--color-forks)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('2024 Q2')).toBeInTheDocument();
    // The legend takes its labels from the config, not from the data keys.
    await expect(await canvas.findByText('Stars')).toBeVisible();
    await expect(await canvas.findByText('Forks')).toBeVisible();
  },
};

/**
 * Area chart, same data as the bar story. Recharts needs the fill declared on
 * the mark, so a gradient or a flat colour both reference the config variable.
 */
export const AreaVariant: Story = {
  args: {
    config: downloadsConfig,
    children: (
      <AreaChart data={downloadsByMonth} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Area
          dataKey="downloads"
          stroke="var(--color-downloads)"
          fill="var(--color-downloads)"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    ),
  },
};

/**
 * A single data point, which is what a package published last week produces.
 * The axes and the grid still render, so the chart reads as "one month of data"
 * rather than as a failure.
 */
export const SingleDataPoint: Story = {
  args: {
    config: downloadsConfig,
    className: 'h-64 w-full',
    children: (
      <BarChart data={[downloadsByMonth[0]]} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="downloads" fill="var(--color-downloads)" radius={4} />
      </BarChart>
    ),
  },
};

/**
 * No data at all. Recharts draws the frame and nothing else, which is why an
 * empty collection deserves its own message in the page rather than an empty
 * chart. This story exists to show what you get if you skip that.
 */
export const NoData: Story = {
  args: {
    config: downloadsConfig,
    className: 'h-64 w-full',
    children: (
      <BarChart data={[]} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <Bar dataKey="downloads" fill="var(--color-downloads)" radius={4} />
      </BarChart>
    ),
  },
};
