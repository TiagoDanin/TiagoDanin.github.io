import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';

/**
 * Ships with the shadcn/ui install; no page currently renders it. The closest
 * thing on the site is the tag filter on `/blog`, which is multi-select and
 * built from buttons rather than radios.
 */
const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radix `RadioGroup` with the shadcn skin, exporting `RadioGroup` and',
          '`RadioGroupItem`. Ships with the shadcn/ui install; no page',
          'currently renders it.',
          '',
          'The group is a single tab stop. Tab moves into it, arrow keys move',
          'between options *and* select them, and Tab leaves the group. That',
          'is the WAI-ARIA radio pattern, and it is why a radio group must',
          'never hold more than a handful of options.',
          '',
          'The group itself needs a name as much as each option does. Give the',
          'root an `aria-label`, or an `aria-labelledby` pointing at the',
          'heading above it, otherwise a screen reader announces the options',
          'with no idea what question they answer.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled selected value. Omit to let the group own its state.',
    },
    defaultValue: {
      control: 'text',
      description: 'Value selected on first render, for an uncontrolled group.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every option in the group at once.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the group required inside a `<form>`.',
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description:
        'Which arrow keys move between options. Set it to match the visual direction, since the default is inferred, not read from the layout.',
    },
    loop: {
      control: 'boolean',
      description: 'Wrap from the last option back to the first.',
      table: { defaultValue: { summary: 'true' } },
    },
    onValueChange: {
      description: 'Fires with the newly selected value.',
    },
  },
  args: {
    'aria-label': 'How did you attend the talk?',
    disabled: false,
    onValueChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const ATTENDANCE = [
  { value: 'in-person', label: 'In person' },
  { value: 'livestream', label: 'Livestream' },
  { value: 'recording', label: 'Recording afterwards' },
];

// Ids have to be unique across the whole autodocs page, not just within one
// story, or every label resolves to the first radio carrying that id.
function attendanceOptions(prefix: string) {
  return ATTENDANCE.map((option) => (
    <div key={option.value} className="flex items-center gap-2">
      <RadioGroupItem id={`${prefix}-${option.value}`} value={option.value} />
      <Label htmlFor={`${prefix}-${option.value}`}>{option.label}</Label>
    </div>
  ));
}

/** Nothing selected, which is the right starting point for an optional answer. */
export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {attendanceOptions('attendance')}
    </RadioGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('radiogroup', { name: 'How did you attend the talk?' });

    await expect(within(group).getAllByRole('radio')).toHaveLength(3);

    await userEvent.click(canvas.getByRole('radio', { name: 'Livestream' }));

    await expect(canvas.getByRole('radio', { name: 'Livestream' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'In person' })).not.toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith('livestream');
  },
};

/** A pre-selected default, so the form can be submitted without touching it. */
export const WithDefaultValue: Story = {
  args: { defaultValue: 'in-person' },
  render: (args) => (
    <RadioGroup {...args}>
      {attendanceOptions('attendance-default')}
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('radio', { name: 'In person' })).toBeChecked();
  },
};

/**
 * The behaviour that makes a radio group different from a stack of checkboxes:
 * one Tab enters the group, then arrows both move and select. Selection follows
 * focus, so there is no separate confirm step.
 */
export const KeyboardSelection: Story = {
  args: { defaultValue: 'in-person' },
  render: (args) => (
    <RadioGroup {...args}>
      {attendanceOptions('attendance-keyboard')}
    </RadioGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: 'In person' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Livestream' })).toHaveFocus();
    await expect(canvas.getByRole('radio', { name: 'Livestream' })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith('livestream');

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Recording afterwards' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'In person' })).not.toBeChecked();
  },
};

/** A horizontal group. Set `orientation` so the arrow keys match what is drawn. */
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    className: 'flex gap-6',
    'aria-label': 'Which framework should the demo use?',
  },
  render: (args) => (
    <RadioGroup {...args}>
      {[
        { value: 'flutter', label: 'Flutter' },
        { value: 'react-native', label: 'React Native' },
        { value: 'native', label: 'Kotlin and Swift' },
      ].map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <RadioGroupItem id={`stack-${option.value}`} value={option.value} />
          <Label htmlFor={`stack-${option.value}`}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');

    await expect(canvas.getByRole('radio', { name: 'React Native' })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith('react-native');
  },
};

/** The whole group disabled. Every option keeps its name in the tree. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'recording' },
  render: (args) => (
    <RadioGroup {...args}>
      {attendanceOptions('attendance-disabled')}
    </RadioGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('radio', { name: 'In person' })).toBeDisabled();

    await userEvent.click(canvas.getByRole('radio', { name: 'In person' }));

    await expect(canvas.getByRole('radio', { name: 'Recording afterwards' })).toBeChecked();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

/**
 * One option unavailable while the rest stay usable. Disabled items are skipped
 * by arrow navigation, so the group never traps focus on a dead option.
 */
export const OneOptionDisabled: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="attendance-partial-in-person" value="in-person" />
        <Label htmlFor="attendance-partial-in-person">In person</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="attendance-partial-livestream" value="livestream" disabled />
        <Label htmlFor="attendance-partial-livestream">Livestream (not offered this year)</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="attendance-partial-recording" value="recording" />
        <Label htmlFor="attendance-partial-recording">Recording afterwards</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('radio', { name: 'Livestream (not offered this year)' }),
    ).toBeDisabled();

    await userEvent.click(canvas.getByRole('radio', { name: 'Recording afterwards' }));

    await expect(args.onValueChange).toHaveBeenCalledWith('recording');
  },
};

/**
 * `aria-labelledby` instead of `aria-label`, so the visible heading and the
 * announced group name are the same string and cannot drift apart.
 */
export const LabelledByHeading: Story = {
  args: { 'aria-label': undefined, 'aria-labelledby': 'attendance-heading' },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <p id="attendance-heading" className="text-sm font-semibold">
        How did you attend the talk?
      </p>
      <RadioGroup {...args}>
        {attendanceOptions('attendance-labelledby')}
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('radiogroup')).toHaveAccessibleName(
      'How did you attend the talk?',
    );
  },
};
