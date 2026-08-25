import type { Meta, StoryObj } from '@storybook/nextjs';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import type * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp';
import { Label } from './label';

// `OTPInputProps` is a union: either a `render` callback or `children`, never
// both. Storybook cannot describe a union of arg shapes, and inferring it
// collapses the story args to `never`, so the meta is declared against the
// `children` half. The value is the real component; only its type is narrowed.
type InputOTPArgs = Omit<React.ComponentPropsWithoutRef<typeof InputOTP>, 'render'>;
const InputOTPWithSlots = InputOTP as React.ComponentType<InputOTPArgs>;

/**
 * Ships with the shadcn/ui install; no page currently renders it. The site is a
 * static export with no accounts and no sign in, so there is no one-time code
 * to enter.
 */
const meta = {
  title: 'UI/InputOTP',
  component: InputOTPWithSlots,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'One-time code field, wrapping the `input-otp` package. Ships with',
          'the shadcn/ui install; no page currently renders it.',
          '',
          'The boxes are not inputs. There is a single `<input>` stretched',
          'invisibly across the whole control, and `InputOTPSlot` reads the',
          'character for its index out of context and draws it. That is what',
          'makes paste, autofill and the browser SMS suggestion work, and it',
          'is why a test types into one field rather than into six.',
          '',
          'Because there is one real input, there is one accessible name.',
          'Point a `<Label htmlFor>` at the `id`, or pass `aria-label`. The',
          'boxes themselves are decorative and announce nothing.',
          '',
          '`maxLength` is required and has to match the number of slots',
          'rendered: a slot whose index is past it reads an undefined entry out',
          'of context and throws. `onChange` fires with the whole string on',
          'every keystroke, and `onComplete` fires once, when the last slot',
          'fills.',
          '',
          'The props are a union, `render` or `children`, so the slots are',
          'passed as an arg here rather than assembled in a `render` function.',
          'That keeps every story a plain override of `children` and',
          '`maxLength`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    maxLength: {
      control: 'number',
      description:
        'Required. Number of characters the code holds, and the number of slots that must be rendered.',
    },
    pattern: {
      control: 'text',
      description:
        'Regular expression source string. Input that fails it is rejected before it reaches state. `REGEXP_ONLY_DIGITS` is exported by the package.',
    },
    disabled: {
      control: 'boolean',
      description: 'Blocks input and drops the whole container to 50% opacity.',
    },
    children: {
      control: false,
      description: 'The slots, as `InputOTPGroup` and `InputOTPSlot` elements.',
    },
    onChange: { description: 'Fires with the full value string on every change.' },
    onComplete: { description: 'Fires once with the full value when the last slot fills.' },
  },
  args: {
    maxLength: 6,
    disabled: false,
    // The decorator binds a visible label to this id, which is what gives the
    // single underlying input its accessible name.
    id: 'talk-code',
    children: (
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    ),
    onChange: fn(),
    onComplete: fn(),
  },
  decorators: [
    // The label is bound to whatever `id` the story set, so each story on the
    // docs page owns a distinct id and its own label association.
    (Story, context) => (
      <div className="flex flex-col gap-2">
        <Label htmlFor={String(context.args.id)}>Talk check in code</Label>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<InputOTPArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Six slots in one group. Typing fills them left to right, and the caret sits in
 * the slot that is next to be filled. The label is bound by `id`, so the whole
 * control has one accessible name.
 */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Talk check in code' });

    await userEvent.type(field, '482913');

    await expect(field).toHaveValue('482913');
    await expect(canvas.getByText('4')).toBeInTheDocument();
    await expect(canvas.getByText('3')).toBeInTheDocument();
    await expect(args.onChange).toHaveBeenLastCalledWith('482913');
    await expect(args.onComplete).toHaveBeenCalledWith('482913');
  },
};

/**
 * A partly filled code. `onComplete` has not fired yet, which is the signal a
 * submit button should be waiting on.
 */
export const PartiallyFilled: Story = {
  args: { id: 'talk-code-partial' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Talk check in code' });

    await userEvent.type(field, '482');

    await expect(field).toHaveValue('482');
    await expect(args.onChange).toHaveBeenLastCalledWith('482');
    await expect(args.onComplete).not.toHaveBeenCalled();
  },
};

/**
 * Keyboard correction, which is most of what happens in a real code field: Tab
 * reaches the single input, and Backspace clears the last slot and moves the
 * caret back one.
 */
export const KeyboardCorrection: Story = {
  args: { id: 'talk-code-keyboard' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Talk check in code' });

    await userEvent.tab();
    await expect(field).toHaveFocus();

    await userEvent.keyboard('4829');
    await expect(field).toHaveValue('4829');

    await userEvent.keyboard('{Backspace}{Backspace}');
    await expect(field).toHaveValue('48');

    await userEvent.keyboard('2913');
    await expect(field).toHaveValue('482913');
    await expect(args.onComplete).toHaveBeenCalledWith('482913');
  },
};

/**
 * Two groups of three with a separator between them, which is the usual shape
 * for a six digit code. The separator is presentational: it does not consume a
 * slot index, so the indices still run 0 to 5 across both groups.
 */
export const SplitGroups: Story = {
  args: {
    id: 'talk-code-split',
    children: (
      <>
        <InputOTPGroup>
          {[0, 1, 2].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          {[3, 4, 5].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </>
    ),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Talk check in code' });

    await userEvent.type(field, '482913');

    await expect(field).toHaveValue('482913');
    await expect(canvas.getByRole('separator')).toBeInTheDocument();
    await expect(args.onComplete).toHaveBeenCalledWith('482913');
  },
};

/**
 * `pattern` rejects input before it reaches state, so a letter typed into a
 * digits-only field leaves the value untouched rather than appearing and then
 * being stripped.
 */
export const DigitsOnly: Story = {
  args: {
    id: 'talk-code-digits',
    pattern: REGEXP_ONLY_DIGITS,
    maxLength: 4,
    children: (
      <InputOTPGroup>
        {[0, 1, 2, 3].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    ),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Talk check in code' });

    await userEvent.type(field, '48');
    await expect(field).toHaveValue('48');

    await userEvent.type(field, 'ab');
    await expect(field).toHaveValue('48');

    await userEvent.type(field, '29');
    await expect(field).toHaveValue('4829');
    await expect(args.onComplete).toHaveBeenCalledWith('4829');
  },
};

/**
 * Four slots instead of six. `maxLength` and the rendered slots have to change
 * together, since one drives the underlying input and the other only draws.
 */
export const FourSlots: Story = {
  args: {
    id: 'talk-code-four',
    maxLength: 4,
    children: (
      <InputOTPGroup>
        {[0, 1, 2, 3].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('textbox', { name: 'Talk check in code' })).toHaveAttribute(
      'maxlength',
      '4',
    );
  },
};

/**
 * Disabled. The container drops to 50% opacity through `has-[:disabled]`, and
 * the single underlying input refuses input, so no slot can change.
 */
export const Disabled: Story = {
  args: { id: 'talk-code-disabled', disabled: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Talk check in code' });

    await expect(field).toBeDisabled();

    await userEvent.type(field, '482913');

    await expect(field).toHaveValue('');
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
