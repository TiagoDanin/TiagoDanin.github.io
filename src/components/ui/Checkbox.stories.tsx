import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Checkbox } from './checkbox';
import { Label } from './label';

/**
 * Ships with the shadcn/ui install; no page currently renders it. Documented so
 * that the first form on the site starts from a checked, labelled baseline
 * rather than from the defaults.
 */
const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radix `Checkbox` with the shadcn skin. Ships with the shadcn/ui',
          'install; no page currently renders it.',
          '',
          'The root renders a `<button role="checkbox">`, not an `<input>`.',
          'A `<button>` is a labelable element, so `<Label htmlFor>` still',
          'gives it an accessible name, and that is the only naming route the',
          'component offers: it has no text of its own.',
          '',
          'Radix supports a third value, `"indeterminate"`, which maps to',
          '`aria-checked="mixed"`. The shadcn indicator draws the same check',
          'mark for it as for `true`, so the mixed state is announced but not',
          'drawn. Anything relying on it needs the indicator changed first.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
      description:
        'Controlled state. `"indeterminate"` renders `aria-checked="mixed"`. Omit to let the checkbox own its state.',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Starting state for an uncontrolled checkbox.',
    },
    disabled: {
      control: 'boolean',
      description: 'Blocks pointer and keyboard input and drops opacity to 50%.',
    },
    required: {
      control: 'boolean',
      description:
        'Sets `aria-required` and, inside a `<form>`, makes the hidden mirror input required.',
    },
    onCheckedChange: {
      description: 'Fires with the next state: `true`, `false` or `"indeterminate"`.',
    },
  },
  args: {
    id: 'newsletter',
    disabled: false,
    required: false,
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The shape every checkbox on the site should take: control and label share an
 * `id`, so clicking the text toggles the box.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Send me new posts by email</Label>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: 'Send me new posts by email' });

    await expect(box).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(box);

    await expect(box).toHaveAttribute('aria-checked', 'true');
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

/**
 * Clicking the label has to reach the control, otherwise the hit target is the
 * 16px box alone. This asserts the association rather than the box itself.
 */
export const LabelIsClickable: Story = {
  args: { id: 'newsletter-label-click' },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Send me new posts by email</Label>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText('Send me new posts by email'));

    await expect(canvas.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

/**
 * Keyboard operation, which is the WCAG AA baseline for this site: Tab to reach
 * the control, Space to toggle it. Enter deliberately does nothing, since the
 * checkbox is not a submit control.
 */
export const KeyboardToggle: Story = {
  args: { id: 'newsletter-keyboard' },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Send me new posts by email</Label>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: 'Send me new posts by email' });

    await userEvent.tab();
    await expect(box).toHaveFocus();

    await userEvent.keyboard(' ');
    await expect(box).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard(' ');
    await expect(box).toHaveAttribute('aria-checked', 'false');
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
  },
};

/** Starting state for an uncontrolled checkbox, drawn with the check mark. */
export const Checked: Story = {
  args: { id: 'newsletter-checked', defaultChecked: true },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Send me new posts by email</Label>
    </div>
  ),
};

/**
 * `aria-checked="mixed"`, used for a parent that covers a partly selected set.
 * The indicator still draws a full check mark, so screen readers and sighted
 * users get different answers. Fix the indicator before shipping this state.
 */
export const Indeterminate: Story = {
  args: { id: 'talk-topics-all', checked: 'indeterminate' },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>All talk topics</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('checkbox', { name: 'All talk topics' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  },
};

/**
 * A disabled checkbox stays in the accessibility tree and keeps its name, so a
 * screen reader can still explain why the option is unavailable.
 */
export const Disabled: Story = {
  args: { id: 'newsletter-disabled', disabled: true, defaultChecked: true },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Send me new posts by email</Label>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: 'Send me new posts by email' });

    await expect(box).toBeDisabled();

    await userEvent.click(box);

    await expect(box).toHaveAttribute('aria-checked', 'true');
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

/**
 * A required checkbox inside a real `<form>`. Radix mirrors the state into a
 * hidden input so native validation blocks submission while it is unchecked.
 */
export const RequiredInForm: Story = {
  args: { id: 'talk-contact-consent', required: true },
  render: (args) => (
    <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
      <div className="flex items-center gap-2">
        <Checkbox {...args} name="terms" />
        <Label htmlFor={args.id}>I agree to be contacted about this talk</Label>
      </div>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('checkbox', { name: 'I agree to be contacted about this talk' }),
    ).toHaveAttribute('aria-required', 'true');
  },
};

/**
 * A group of related options. Each control carries its own `id`, since a shared
 * one would point every label at the first checkbox.
 */
export const CheckboxGroup: Story = {
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Contact preferences, as a fieldset of independent options.' } },
  },
  render: () => (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="mb-2 text-sm font-semibold">What should I write about next?</legend>
      {[
        { id: 'topic-flutter', label: 'Flutter' },
        { id: 'topic-react-native', label: 'React Native' },
        { id: 'topic-security', label: 'Mobile security research' },
        { id: 'topic-open-source', label: 'Open source maintenance' },
      ].map((topic) => (
        <div key={topic.id} className="flex items-center gap-2">
          <Checkbox id={topic.id} />
          <Label htmlFor={topic.id}>{topic.label}</Label>
        </div>
      ))}
    </fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('checkbox')).toHaveLength(4);

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Mobile security research' }));

    await expect(canvas.getByRole('checkbox', { name: 'Mobile security research' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(canvas.getByRole('checkbox', { name: 'Flutter' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  },
};
