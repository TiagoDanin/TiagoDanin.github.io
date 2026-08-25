import type { Meta, StoryObj } from '@storybook/nextjs';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

/**
 * Ships with the shadcn/ui install; no page currently renders it. The tag
 * filter on `/blog` is the nearest thing the site has, and it is built from
 * plain buttons rather than from this component.
 */
const meta = {
  title: 'UI/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radix `ToggleGroup` with the shadcn skin, exporting `ToggleGroup`',
          'and `ToggleGroupItem`. Ships with the shadcn/ui install; no page',
          'currently renders it.',
          '',
          '`type` is required and changes what the items *are*, not just how',
          'many can be active. With `type="single"` each item becomes',
          '`role="radio"` with `aria-checked`, and `onValueChange` receives a',
          'string. With `type="multiple"` the items stay buttons with',
          '`aria-pressed`, and the callback receives an array.',
          '',
          'The group is one tab stop: Tab moves into it, arrow keys move',
          'between items, Space or Enter activates the focused one. Focus does',
          'not select, so a keyboard user can pass over an option without',
          'choosing it.',
          '',
          'A `variant` or `size` set on the group flows to every item through',
          'context, so setting it per item is redundant.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description:
        'Required. `single` gives radio semantics and a string value, `multiple` gives pressed buttons and an array.',
    },
    value: {
      control: 'object',
      description: 'Controlled value: a string for `single`, an array for `multiple`.',
    },
    defaultValue: {
      control: 'object',
      description: 'Starting value for an uncontrolled group.',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Passed to every item through context. `outline` keeps borders at rest.',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Passed to every item through context.',
      table: { defaultValue: { summary: 'default' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every item in the group at once.',
    },
    onValueChange: {
      description: 'Fires with the new selection. Its shape follows `type`.',
    },
  },
  args: {
    type: 'single',
    variant: 'outline',
    size: 'default',
    disabled: false,
    'aria-label': 'Filter posts by stack',
    onValueChange: fn(),
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const STACKS = [
  { value: 'flutter', label: 'Flutter' },
  { value: 'react-native', label: 'React Native' },
  { value: 'node', label: 'Node.js' },
];

/**
 * `type="single"`, which is the shape most filters want: exactly one choice, and
 * the items are announced as radios.
 */
export const Single: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      {STACKS.map((stack) => (
        <ToggleGroupItem key={stack.value} value={stack.value}>
          {stack.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('group', { name: 'Filter posts by stack' })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('radio', { name: 'React Native' }));

    await expect(canvas.getByRole('radio', { name: 'React Native' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(args.onValueChange).toHaveBeenCalledWith('react-native');

    await userEvent.click(canvas.getByRole('radio', { name: 'Flutter' }));

    await expect(canvas.getByRole('radio', { name: 'React Native' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith('flutter');
  },
};

/**
 * Clicking the active item in a single group clears it, handing back an empty
 * string. Guard against that if the filter must always have one value.
 */
export const SingleCanBeCleared: Story = {
  args: { defaultValue: 'flutter' },
  render: (args) => (
    <ToggleGroup {...args}>
      {STACKS.map((stack) => (
        <ToggleGroupItem key={stack.value} value={stack.value}>
          {stack.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('radio', { name: 'Flutter' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await userEvent.click(canvas.getByRole('radio', { name: 'Flutter' }));

    await expect(canvas.getByRole('radio', { name: 'Flutter' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith('');
  },
};

/**
 * `type="multiple"`, where the items stay buttons with `aria-pressed` and the
 * callback receives every active value.
 */
export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['flutter'] },
  render: (args) => (
    <ToggleGroup {...args}>
      {STACKS.map((stack) => (
        <ToggleGroupItem key={stack.value} value={stack.value}>
          {stack.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'Flutter' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Node.js' }));

    await expect(canvas.getByRole('button', { name: 'Node.js' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['flutter', 'node']);
  },
};

/**
 * Roving focus: one Tab reaches the group, arrows walk it, Space activates. The
 * focused item is not selected until it is activated, which is what separates
 * this from a `RadioGroup`.
 */
export const KeyboardNavigation: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      {STACKS.map((stack) => (
        <ToggleGroupItem key={stack.value} value={stack.value}>
          {stack.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: 'Flutter' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'React Native' })).toHaveFocus();
    await expect(canvas.getByRole('radio', { name: 'React Native' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    await expect(args.onValueChange).not.toHaveBeenCalled();

    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('radio', { name: 'React Native' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(args.onValueChange).toHaveBeenCalledWith('react-native');
  },
};

/**
 * Icon-only items, where every item needs its own `aria-label`. A group of three
 * unlabelled icons is announced as three identical buttons.
 */
export const IconItems: Story = {
  args: { 'aria-label': 'Cover image alignment' },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align centre">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('radio')).toHaveLength(3);

    await userEvent.click(canvas.getByRole('radio', { name: 'Align centre' }));

    await expect(args.onValueChange).toHaveBeenCalledWith('center');
  },
};

/** One item unavailable while the rest of the group stays usable. */
export const OneItemDisabled: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="flutter">Flutter</ToggleGroupItem>
      <ToggleGroupItem value="react-native">React Native</ToggleGroupItem>
      <ToggleGroupItem value="node" disabled>
        Node.js
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('radio', { name: 'Node.js' })).toBeDisabled();

    await userEvent.click(canvas.getByRole('radio', { name: 'Node.js' }));
    await expect(args.onValueChange).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('radio', { name: 'Flutter' }));
    await expect(args.onValueChange).toHaveBeenCalledWith('flutter');
  },
};

/** The whole group disabled, for a filter with nothing left to filter. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'flutter' },
  render: (args) => (
    <ToggleGroup {...args}>
      {STACKS.map((stack) => (
        <ToggleGroupItem key={stack.value} value={stack.value}>
          {stack.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('radio', { name: 'React Native' }));

    await expect(canvas.getByRole('radio', { name: 'Flutter' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};
