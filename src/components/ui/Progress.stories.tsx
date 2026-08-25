import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import { Progress } from './progress';

/**
 * Ships with the shadcn/ui install; no page currently renders it. The site is a
 * static export with no uploads or long running jobs, so there is nothing yet
 * for a progress bar to report on.
 */
const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radix `Progress` with the shadcn skin. Ships with the shadcn/ui',
          'install; no page currently renders it.',
          '',
          'Two constraints are worth knowing before reaching for it.',
          '',
          'First, **the fill assumes a 0 to 100 scale**. The indicator is',
          'positioned with `translateX(-(100 - value)%)`, which ignores `max`',
          'entirely. Radix will still report `aria-valuemax` correctly, so a',
          'custom `max` gives a bar that is announced right and drawn wrong.',
          'Convert to a percentage before passing `value` in.',
          '',
          'Second, **`value` is not a progress label**. A bar with no text',
          'beside it announces a bare number. Pair it with a caption, or pass',
          '`getValueLabel` so the announced value reads as a sentence.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description:
        'Completion on a 0 to 100 scale. Pass `null` for an indeterminate bar whose duration is unknown.',
    },
    max: {
      control: 'number',
      description:
        'Upper bound reported to assistive technology. The shadcn indicator does not honour it, so leave it at 100.',
      table: { defaultValue: { summary: '100' } },
    },
    getValueLabel: {
      description:
        'Turns the raw value into the string announced as `aria-valuetext`. Worth setting whenever the number alone is not self explanatory.',
    },
  },
  args: {
    value: 40,
    className: 'w-72',
    'aria-label': 'Talk proposals reviewed',
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Determinate progress with a visible caption carrying the same number. */
export const Default: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">Talk proposals reviewed</span>
        <span className="text-sm text-muted-foreground">40%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', { name: 'Talk proposals reviewed' });

    await expect(bar).toHaveAttribute('aria-valuenow', '40');
    await expect(bar).toHaveAttribute('aria-valuemax', '100');
  },
};

/** Nothing done yet. The track is still drawn, so the layout does not jump. */
export const Empty: Story = {
  args: { value: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  },
};

/** Finished. The fill covers the full track and the state is `complete`. */
export const Complete: Story = {
  args: { value: 100 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar');

    await expect(bar).toHaveAttribute('aria-valuenow', '100');
    await expect(bar).toHaveAttribute('data-state', 'complete');
  },
};

/**
 * `value={null}` marks the work as ongoing with an unknown end. Radix drops
 * `aria-valuenow` so nothing claims a percentage, but the shadcn indicator
 * treats the missing value as zero and draws an empty track, with no animation
 * to say the bar is alive. It needs a spinner or a striped fill to read as
 * indeterminate.
 */
export const Indeterminate: Story = {
  args: { value: null, 'aria-label': 'Fetching GitHub repositories' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', { name: 'Fetching GitHub repositories' });

    await expect(bar).not.toHaveAttribute('aria-valuenow');
    await expect(bar).toHaveAttribute('data-state', 'indeterminate');
  },
};

/**
 * `getValueLabel` replaces the announced number with a sentence, which is the
 * cheapest way to make a bar understandable without a caption.
 */
export const WithValueLabel: Story = {
  args: {
    value: 7,
    getValueLabel: (value, max) => `${value} of ${max} packages published`,
    max: 100,
    'aria-label': 'npm release progress',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '7 of 100 packages published',
    );
  },
};

/**
 * The bar reacting to a state change, which is the only way it will ever be
 * used. The fill transitions with `transition-all`, so a jump from 20 to 80
 * animates rather than snapping.
 */
export const Advancing: Story = {
  render: (args) => {
    const StatefulProgress = () => {
      const [value, setValue] = React.useState(20);

      return (
        <div className="flex w-72 flex-col gap-4">
          <Progress {...args} value={value} aria-label="Slide deck upload" />
          <Button variant="outline" onClick={() => setValue(80)}>
            Upload the slide deck
          </Button>
        </div>
      );
    };

    return <StatefulProgress />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', { name: 'Slide deck upload' });

    await expect(bar).toHaveAttribute('aria-valuenow', '20');

    await userEvent.click(canvas.getByRole('button', { name: 'Upload the slide deck' }));

    await waitFor(async () => {
      await expect(bar).toHaveAttribute('aria-valuenow', '80');
    });
  },
};

/**
 * Documents the `max` limitation. The value is announced as 3 of 12, but the
 * fill is drawn at 3% because the indicator hard codes a 100 point scale.
 */
export const CustomMaxIsDrawnWrong: Story = {
  args: { value: 3, max: 12, 'aria-label': 'Talks delivered this year' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', { name: 'Talks delivered this year' });

    await expect(bar).toHaveAttribute('aria-valuenow', '3');
    await expect(bar).toHaveAttribute('aria-valuemax', '12');

    // Announced as a quarter done, drawn as 3% of the track: the inline
    // transform is computed from the raw value, never from `max`.
    const indicator = bar.firstElementChild as HTMLElement;
    await expect(indicator.style.transform).toBe('translateX(-97%)');
  },
};
