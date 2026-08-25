import type { Meta, StoryObj } from '@storybook/nextjs';
import { Bold, Code, Italic, Languages } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Toggle } from './toggle';

/**
 * One import in the whole codebase, and it is not for this component:
 * `toggle-group.tsx` pulls in `toggleVariants` for its own items. The `Toggle`
 * component itself is never rendered.
 */
const meta = {
  title: 'UI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radix `Toggle` with the shadcn skin. The file has exactly one',
          'importer, `toggle-group.tsx`, and it imports `toggleVariants`',
          'rather than the component, so no page renders a `Toggle`.',
          '',
          'It renders a `<button aria-pressed>`, which is the right role for',
          '"this button stays pushed in": a formatting control, a filter that',
          'is on or off. It is not a `Switch`, which announces on and off',
          'states, and not a `Checkbox`, which belongs in a form that gets',
          'submitted.',
          '',
          'Both the pressed and unpressed states share one label, so the label',
          'has to name the thing being toggled, not the action. "Bold", not',
          '"Make bold". Icon-only toggles carry that name in `aria-label`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    pressed: {
      control: 'boolean',
      description: 'Controlled pressed state. Omit to let the toggle own its state.',
    },
    defaultPressed: {
      control: 'boolean',
      description: 'Starting state for an uncontrolled toggle.',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description:
        '`default` is borderless and only shows a background when pressed. `outline` keeps a border at rest, so a lone toggle still reads as a control.',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Control height and horizontal padding.',
      table: { defaultValue: { summary: 'default' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Blocks pointer and keyboard input and drops opacity to 50%.',
    },
    onPressedChange: {
      description: 'Fires with the next boolean pressed state.',
    },
  },
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
    onPressedChange: fn(),
    children: 'Portuguese',
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A text toggle. The pressed state is carried by `aria-pressed`, not by the
 * label, so the label stays the same in both states.
 */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Portuguese' });

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(toggle);

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPressedChange).toHaveBeenCalledWith(true);
  },
};

/** The pressed state, tinted with `bg-accent` rather than the primary slate. */
export const Pressed: Story = {
  args: { defaultPressed: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Portuguese' });

    await userEvent.click(toggle);

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onPressedChange).toHaveBeenCalledWith(false);
  },
};

/**
 * Keyboard operation. A toggle is a real `<button>`, so Space and Enter both
 * activate it and Tab reaches it with no extra work.
 */
export const KeyboardToggle: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Portuguese' });

    await userEvent.tab();
    await expect(toggle).toHaveFocus();

    await userEvent.keyboard(' ');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await expect(args.onPressedChange).toHaveBeenCalledTimes(2);
  },
};

/**
 * `outline` gives the control a border at rest. Use it whenever the toggle
 * stands alone, since the borderless `default` variant is invisible until it is
 * hovered or pressed.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <Languages />
        Portuguese
      </>
    ),
  },
};

/**
 * Icon only, so the label lives in `aria-label`. Without it the button is
 * announced as "button" and nothing else, which is the most common way this
 * component gets shipped broken.
 */
export const IconOnly: Story = {
  args: {
    variant: 'outline',
    'aria-label': 'Bold',
    children: <Bold />,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Bold' });

    await expect(toggle).toHaveAccessibleName('Bold');

    await userEvent.click(toggle);

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPressedChange).toHaveBeenCalledWith(true);
  },
};

/** A disabled toggle keeps its name and pressed state in the accessibility tree. */
export const Disabled: Story = {
  args: { disabled: true, defaultPressed: true, variant: 'outline' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Portuguese' });

    await expect(toggle).toBeDisabled();

    await userEvent.click(toggle);

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPressedChange).not.toHaveBeenCalled();
  },
};

/**
 * Independent toggles side by side. Each keeps its own state, which is the
 * difference from `ToggleGroup`, where the items share one value.
 */
export const IndependentToggles: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Three formatting toggles that do not know about each other.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-1">
      <Toggle variant="outline" aria-label="Bold">
        <Bold />
      </Toggle>
      <Toggle variant="outline" aria-label="Italic">
        <Italic />
      </Toggle>
      <Toggle variant="outline" aria-label="Inline code">
        <Code />
      </Toggle>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Bold' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Inline code' }));

    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Inline code' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  },
};

/** The three sizes, in the `outline` variant so the footprint is visible. */
export const AllSizes: Story = {
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Reference grid of the three shipped sizes.' } },
  },
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle variant="outline" size="sm">
        Small
      </Toggle>
      <Toggle variant="outline" size="default">
        Default
      </Toggle>
      <Toggle variant="outline" size="lg">
        Large
      </Toggle>
    </div>
  ),
};
