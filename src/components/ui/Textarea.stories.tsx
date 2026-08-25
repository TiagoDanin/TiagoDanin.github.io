import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import { Label } from './label';
import { Textarea } from './textarea';

/**
 * The multi-line field. One production form uses it: the three free-text
 * questions in the talk feedback form at `/links/talk`.
 */
const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A `textarea` with the shadcn field style: `min-h-[80px]`, a slate',
          'border, `rounded-md`, and the same two-pixel focus ring as `Input`.',
          '',
          '`min-h-[80px]` is a floor, not a height. Passing `rows` sets the',
          'starting height above that floor, which is what `FeedbackForm` does',
          'with `rows={3}`. Because it is a minimum rather than a fixed height,',
          'the browser resize grip still works and the user can drag the field',
          'taller; nothing in the class list disables that. Set `resize-none`',
          'through `className` only when a taller field would break the layout,',
          'since taking the grip away is a real loss on a long answer.',
          '',
          'Unlike `Input` it does not step down to `text-sm` at a breakpoint: it',
          'is `text-sm` everywhere. On iOS that is below the 16px threshold, so',
          'focusing it zooms the viewport. Worth knowing before putting one on a',
          'mobile-first page.',
          '',
          'Like `Input`, it renders no label and has no error variant. Pair it',
          'with a `Label` through `htmlFor` and `id`, and signal errors with',
          '`aria-invalid` plus a described-by message.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Required in practice: the target of the paired `Label`.',
    },
    rows: {
      control: 'number',
      description: 'Starting height in lines, on top of the `min-h-[80px]` floor.',
    },
    maxLength: {
      control: 'number',
      description: 'Hard cap enforced by the browser. The feedback form uses 2000.',
    },
    placeholder: { control: 'text', description: 'Hint text, never a label.' },
    disabled: {
      control: 'boolean',
      description: 'Drops opacity to 50% and removes the field from tab order.',
    },
    className: {
      control: 'text',
      description: 'Merged through `cn`. Where `resize-none` or an error border goes.',
    },
  },
  args: {
    id: 'liked',
    rows: 3,
    maxLength: 2000,
    disabled: false,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The labelled three-row field from the feedback form. The play function
 * resolves it through its label, so the pairing is verified rather than assumed.
 */
export const Default: Story = {
  render: (args) => (
    <div className="max-w-md space-y-2">
      <Label htmlFor={args.id}>What did you like most?</Label>
      <Textarea {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('What did you like most?');
    await expect(field).toBe(canvas.getByRole('textbox'));
    await expect(field.tagName).toBe('TEXTAREA');
  },
};

/**
 * Focus and typing. The field accepts newlines, which is the whole reason to use
 * it over an `Input`, and the value keeps them.
 */
export const Typing: Story = {
  render: (args) => (
    <div className="max-w-md space-y-2">
      <Label htmlFor={args.id}>What did you like most?</Label>
      <Textarea {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText<HTMLTextAreaElement>('What did you like most?');

    await userEvent.click(field);
    await expect(field).toHaveFocus();

    await userEvent.type(
      field,
      'The GitLab pipeline demo was the useful part.{Enter}Seeing the cache hit live sold it.'
    );
    await expect(field.value).toContain('\n');
  },
};

/**
 * `maxLength` at a low value, so the cap is visible. The browser stops accepting
 * characters at the limit; nothing is rejected later at submit time.
 */
export const MaxLength: Story = {
  args: { maxLength: 40 },
  render: (args) => (
    <div className="max-w-md space-y-2">
      <Label htmlFor={args.id}>What could be better?</Label>
      <Textarea {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText<HTMLTextAreaElement>('What could be better?');
    await userEvent.type(
      field,
      'More time on the iOS signing step and less on the intro slides.'
    );
    await expect(field.value).toHaveLength(40);
  },
};

/**
 * Prefilled with a long answer. `min-h-[80px]` plus `rows={3}` is a starting
 * height, not a cap, so the content scrolls inside the field rather than growing
 * it. The resize grip is the escape hatch.
 */
export const WithLongValue: Story = {
  args: {
    defaultValue:
      'The pipeline section was the most useful, especially the part about caching CocoaPods between jobs. I had tried that on our own project and gave up when the cache key kept missing. Seeing the working key format was worth the whole talk. The intro ran a bit long, and I would have traded five minutes of it for more time on the iOS signing step, which is where our team actually loses days.',
  },
  render: (args) => (
    <div className="max-w-md space-y-2">
      <Label htmlFor={args.id}>What did you like most?</Label>
      <Textarea {...args} />
    </div>
  ),
};

/**
 * The invalid state, matching how `FeedbackForm` marks a failed field:
 * `aria-invalid` for assistive technology, a red border for sighted users, and
 * the message wired through `aria-describedby` so it is actually read out.
 */
export const Invalid: Story = {
  args: { 'aria-invalid': true, className: 'border-red-400' },
  render: (args) => (
    <div className="max-w-md space-y-2">
      <Label htmlFor={args.id}>What could be better?</Label>
      <Textarea {...args} aria-describedby="liked-error" />
      <p id="liked-error" className="text-xs text-red-600">
        Tell me at least one thing, even if it is short.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('What could be better?');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAccessibleDescription(
      'Tell me at least one thing, even if it is short.'
    );
  },
};

/**
 * Disabled. Opacity drops to 50%, the resize grip is gone, and the field leaves
 * the tab order.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Submitted feedback cannot be edited.',
  },
  render: (args) => (
    <div className="max-w-md space-y-2">
      <Label htmlFor={args.id}>What did you like most?</Label>
      <Textarea {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('What did you like most?')).toBeDisabled();
  },
};

/**
 * The three optional questions from step two of the feedback form, stacked.
 * Equal heights are intentional: no question looks more important than the
 * others, so none of them anchors the answer.
 */
export const FeedbackQuestions: Story = {
  parameters: {
    docs: { description: { story: 'Reference layout: step two of the talk feedback form.' } },
  },
  render: () => (
    <div className="max-w-md space-y-4">
      {[
        { id: 'q-liked', label: 'What did you like most?' },
        { id: 'q-improve', label: 'What could be better?' },
        { id: 'q-next', label: 'Suggestions for future talks' },
      ].map((question) => (
        <div key={question.id} className="space-y-2">
          <Label htmlFor={question.id}>
            {question.label}{' '}
            <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Textarea id={question.id} rows={3} maxLength={2000} />
        </div>
      ))}
    </div>
  ),
};
