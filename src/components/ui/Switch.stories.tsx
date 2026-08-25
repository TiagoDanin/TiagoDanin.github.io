import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Label } from './label';
import { Switch } from './switch';

/**
 * Ships with the shadcn/ui install; no page currently renders it. The site is
 * light theme only by brand decision, so the usual first job for a switch, a
 * theme toggle, does not exist here.
 */
const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radix `Switch` with the shadcn skin. Ships with the shadcn/ui',
          'install; no page currently renders it, and the obvious candidate,',
          'a dark mode toggle, is ruled out in `PRODUCT.md`.',
          '',
          'A switch takes effect the moment it is flipped. If the change only',
          'lands after a Save button, use a `Checkbox` instead: the role tells',
          'assistive technology which of the two it is.',
          '',
          'The root renders a `<button role="switch">` with no text, so it',
          'needs either `<Label htmlFor>` or an `aria-label` to be announced.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled state. Omit to let the switch own its state.',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Starting state for an uncontrolled switch.',
    },
    disabled: {
      control: 'boolean',
      description: 'Blocks pointer and keyboard input and drops opacity to 50%.',
    },
    required: {
      control: 'boolean',
      description: 'Sets `aria-required` on the control.',
    },
    onCheckedChange: {
      description: 'Fires with the next boolean state.',
    },
  },
  args: {
    id: 'talk-recording',
    disabled: false,
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Off by default, with the label carrying the whole meaning of the control. */
export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} />
      <Label htmlFor={args.id}>Publish the talk recording</Label>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Publish the talk recording' });

    await expect(control).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(control);

    await expect(control).toHaveAttribute('aria-checked', 'true');
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

/** Starting state for a preference that defaults to on. */
export const Checked: Story = {
  args: { id: 'talk-recording-checked', defaultChecked: true },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} />
      <Label htmlFor={args.id}>Publish the talk recording</Label>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Publish the talk recording' });

    await userEvent.click(control);

    await expect(control).toHaveAttribute('aria-checked', 'false');
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);
  },
};

/**
 * Tab reaches the switch, Space and Enter both flip it. Radix binds Enter as
 * well as Space, which is what the WAI-ARIA switch pattern asks for.
 */
export const KeyboardToggle: Story = {
  args: { id: 'talk-recording-keyboard' },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} />
      <Label htmlFor={args.id}>Publish the talk recording</Label>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Publish the talk recording' });

    await userEvent.tab();
    await expect(control).toHaveFocus();

    await userEvent.keyboard(' ');
    await expect(control).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{Enter}');
    await expect(control).toHaveAttribute('aria-checked', 'false');

    await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
  },
};

/**
 * Without a visible label the switch still needs a name. `aria-label` is the
 * fallback, not the default: a visible label is preferred wherever there is
 * room for one.
 */
export const AriaLabelOnly: Story = {
  args: { id: 'talk-recording-aria' },
  render: (args) => <Switch {...args} aria-label="Publish the talk recording" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('switch')).toHaveAccessibleName('Publish the talk recording');
  },
};

/**
 * A disabled switch keeps its name and state in the accessibility tree, so the
 * reason it cannot be flipped can still be explained beside it.
 */
export const Disabled: Story = {
  args: { id: 'talk-recording-disabled', disabled: true, defaultChecked: true },
  render: (args) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <Switch {...args} />
        <Label htmlFor={args.id}>Publish the talk recording</Label>
      </div>
      <p className="text-sm text-muted-foreground">The recording is already public on YouTube.</p>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Publish the talk recording' });

    await expect(control).toBeDisabled();

    await userEvent.click(control);

    await expect(control).toHaveAttribute('aria-checked', 'true');
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

/**
 * A settings list, where each row applies immediately. Long labels wrap, so the
 * switch is pinned to the top of the row rather than centred against it.
 */
export const SettingsList: Story = {
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Three independent switches with descriptions.' } },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-5">
      {[
        {
          id: 'setting-newsletter',
          label: 'Monthly newsletter',
          hint: 'One email a month with new posts and talks.',
        },
        {
          id: 'setting-pt',
          label: 'Portuguese first',
          hint: 'Open the Portuguese version of a post when both exist.',
        },
        {
          id: 'setting-releases',
          label: 'npm release notes',
          hint: 'Notify me when one of the published packages ships a major version.',
        },
      ].map((setting) => (
        <div key={setting.id} className="flex items-start gap-3">
          <Switch id={setting.id} className="mt-0.5" />
          <div className="flex flex-col gap-1">
            <Label htmlFor={setting.id}>{setting.label}</Label>
            <p className="text-sm text-muted-foreground">{setting.hint}</p>
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('switch')).toHaveLength(3);

    await userEvent.click(canvas.getByRole('switch', { name: 'Portuguese first' }));

    await expect(canvas.getByRole('switch', { name: 'Portuguese first' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(canvas.getByRole('switch', { name: 'Monthly newsletter' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  },
};
