import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Label } from './label';
import { Slider } from './slider';

/**
 * Ships with the shadcn/ui install; no page currently renders it. Documented
 * mainly because of the labelling gap described below, which any first use of
 * it will run into.
 */
const meta = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radix `Slider` with the shadcn skin. Ships with the shadcn/ui',
          'install; no page currently renders it.',
          '',
          'The value is always an array, even with one thumb: `value={[70]}`,',
          'and `onValueChange` hands back `[70]`. A second entry turns it into',
          'a range slider with two thumbs.',
          '',
          '**Labelling gap.** `role="slider"` sits on the thumb, not on the',
          'root, and this wrapper renders the thumb itself without forwarding',
          'any props to it. An `aria-label` passed to `<Slider>` lands on the',
          'root, which is a plain container, so a single-thumb slider ends up',
          'with no accessible name. Radix names the two thumbs of a range',
          'slider "Minimum" and "Maximum" on its own, so only the',
          'single-thumb case is affected. Fixing it properly means letting',
          '`slider.tsx` forward a label to `SliderPrimitive.Thumb`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: {
      control: 'object',
      description: 'Controlled value, as an array with one entry per thumb.',
    },
    defaultValue: {
      control: 'object',
      description: 'Starting value for an uncontrolled slider. Its length decides the thumb count.',
    },
    min: { control: 'number', description: 'Lowest selectable value.', table: { defaultValue: { summary: '0' } } },
    max: { control: 'number', description: 'Highest selectable value.', table: { defaultValue: { summary: '100' } } },
    step: {
      control: 'number',
      description: 'Increment for a drag or an arrow key press.',
      table: { defaultValue: { summary: '1' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Blocks pointer and keyboard input and drops thumb opacity to 50%.',
    },
    minStepsBetweenThumbs: {
      control: 'number',
      description: 'Stops the two thumbs of a range slider from crossing or meeting.',
    },
    onValueChange: {
      description: 'Fires on every step while dragging, with the full value array.',
    },
    onValueCommit: {
      description: 'Fires once, when the drag or key press ends. Use this to trigger a request.',
    },
  },
  args: {
    defaultValue: [60],
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    className: 'w-72',
    onValueChange: fn(),
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One thumb, reported as `aria-valuenow`. The visible text above the track is
 * the only thing telling a sighted user what the number means, which is why the
 * missing thumb name matters.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Talk length: 60 minutes</p>
      <Slider {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider');

    await expect(thumb).toHaveAttribute('aria-valuenow', '60');
    await expect(thumb).toHaveAttribute('aria-valuemin', '0');
    await expect(thumb).toHaveAttribute('aria-valuemax', '100');
  },
};

/**
 * Keyboard operation, the WCAG AA baseline: Tab reaches the thumb, arrow keys
 * move it by one step, Home and End jump to the ends of the range.
 */
export const KeyboardControl: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Talk length</p>
      <Slider {...args} step={5} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider');

    await userEvent.tab();
    await expect(thumb).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '65');
    await expect(args.onValueChange).toHaveBeenCalledWith([65]);

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '55');

    await userEvent.keyboard('{End}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '100');

    await userEvent.keyboard('{Home}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '0');
  },
};

/**
 * The documented workaround while the wrapper does not forward props to the
 * thumb: label the group instead, and accept that the thumb itself stays
 * unnamed. This is a stopgap, not the pattern to copy.
 */
export const LabellingGap: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Label htmlFor="talk-length">Talk length in minutes</Label>
      <Slider {...args} id="talk-length" aria-label="Talk length in minutes" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The aria-label lands on the root container, not on the thumb that
    // actually carries role="slider", so the control stays unnamed.
    await expect(canvas.getByRole('slider')).toHaveAccessibleName('');
  },
};

/**
 * Two thumbs. Radix names them "Minimum" and "Maximum" by itself, so a range
 * slider is the one shape of this component that is announced correctly out of
 * the box.
 */
export const Range: Story = {
  args: { defaultValue: [15, 45], min: 0, max: 60, step: 5 },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Session length to accept: 15 to 45 minutes</p>
      <Slider {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    const minimum = canvas.getByRole('slider', { name: 'Minimum' });
    const maximum = canvas.getByRole('slider', { name: 'Maximum' });

    await expect(minimum).toHaveAttribute('aria-valuenow', '15');
    await expect(maximum).toHaveAttribute('aria-valuenow', '45');

    await userEvent.tab();
    await expect(minimum).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(minimum).toHaveAttribute('aria-valuenow', '20');
    await expect(args.onValueChange).toHaveBeenCalledWith([20, 45]);
  },
};

/**
 * A coarse step turns the track into a small set of discrete choices. Arrow
 * keys then move a whole step at a time, which is what makes this usable
 * without a mouse.
 */
export const CoarseSteps: Story = {
  args: { defaultValue: [50], step: 25 },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">How much live coding? 50%</p>
      <Slider {...args} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>None</span>
        <span>All of it</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider');

    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');

    await expect(thumb).toHaveAttribute('aria-valuenow', '75');
  },
};

/** A disabled slider drops out of the tab order and ignores arrow keys. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Talk length: fixed by the call for papers</p>
      <Slider {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider');

    await userEvent.tab();
    await expect(thumb).not.toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '60');
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};
