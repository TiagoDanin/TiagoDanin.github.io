import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import { Input } from './input';
import { Label } from './label';

/**
 * The text field. One production form uses it: the talk feedback form at
 * `/links/talk`, where it collects the respondent's email.
 */
const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A thin wrapper over `input` that applies the shadcn field style:',
          '`h-10`, `rounded-md`, a slate border, and a two-pixel focus ring with',
          'an offset.',
          '',
          'It renders no label of its own. Pairing an `id` on the input with a',
          '`htmlFor` on a `Label` is the caller\'s job, and it is not optional: an',
          'unlabelled field is announced as "edit text, blank" and is unusable',
          'with a screen reader. A placeholder is not a label either, since it',
          'disappears the moment typing starts. Every story here does the pairing,',
          'and the default story asserts it.',
          '',
          'There is no error variant. `FeedbackForm` signals invalid input by',
          'setting `aria-invalid` and passing a red border through `className`,',
          'then rendering the message in a sibling paragraph. `aria-invalid` is',
          'the part that carries: the border alone fails WCAG, which does not',
          'accept colour as the only channel for meaning.',
          '',
          'The text size is `text-base` on small screens and `text-sm` from `md`',
          'up. That is deliberate: iOS Safari zooms the viewport when a focused',
          'field renders below 16px.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Required in practice: it is what a `Label` points its `htmlFor` at.',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'url', 'search', 'tel', 'password', 'number'],
      description: 'Native input type. Drives the mobile keyboard and browser validation.',
    },
    placeholder: {
      control: 'text',
      description: 'A hint, never a substitute for the label. It vanishes on first keystroke.',
    },
    disabled: {
      control: 'boolean',
      description: 'Drops opacity to 50% and blocks the cursor. Skipped by tab order.',
    },
    required: { control: 'boolean', description: 'Native required flag.' },
    maxLength: { control: 'number', description: 'Hard cap enforced by the browser.' },
    'aria-invalid': {
      control: 'boolean',
      description:
        'How an error is announced. Set it alongside any red styling, never instead of it.',
    },
  },
  args: {
    id: 'email',
    type: 'email',
    placeholder: 'you@example.com',
    disabled: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A labelled email field, the exact pairing from step one of the feedback form.
 * The play function resolves the input through its label text, which only works
 * if `htmlFor` and `id` match.
 */
export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor={args.id}>Your email</Label>
      <Input {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Your email');
    await expect(field).toBe(canvas.getByRole('textbox'));
    await expect(field).toHaveAttribute('type', 'email');
  },
};

/**
 * Focus. The ring is `ring-2` with a two-pixel offset, so it reads clearly
 * against the white surface. It is `focus-visible`, so clicking with a mouse
 * does not paint it, only keyboard navigation does.
 */
export const Focused: Story = {
  render: (args) => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor={args.id}>Your email</Label>
      <Input {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Your email');
    await userEvent.click(field);
    // A text input always matches :focus-visible, so the ring paints here too.
    await expect(field).toHaveFocus();
  },
};

/**
 * Typing. `maxLength` is enforced by the browser, so the field simply stops
 * accepting characters rather than accepting them and failing on submit.
 */
export const Typing: Story = {
  args: { maxLength: 20 },
  render: (args) => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor={args.id}>Your email</Label>
      <Input {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText<HTMLInputElement>('Your email');
    await userEvent.type(field, 'tiago@tiagodanin.com.br.extra');
    await expect(field.value).toHaveLength(20);
  },
};

/**
 * The invalid state, reproduced from `FeedbackForm`: `aria-invalid` for
 * assistive technology, a red border for sighted users, and a message below.
 * Both channels are needed; either one alone leaves someone without the error.
 */
export const Invalid: Story = {
  args: { 'aria-invalid': true, className: 'border-red-400', defaultValue: 'tiago@' },
  render: (args) => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor={args.id}>Your email</Label>
      <Input {...args} aria-describedby="email-error" />
      <p id="email-error" className="text-xs text-red-600">
        Enter a valid email address to continue.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Your email');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    // aria-describedby is what reads the message out; the red text alone does not.
    await expect(field).toHaveAccessibleDescription(
      'Enter a valid email address to continue.'
    );
  },
};

/**
 * Disabled. Opacity drops to 50% and the field leaves the tab order entirely, so
 * a keyboard user skips straight past it.
 */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'tiago@tiagodanin.com' },
  render: (args) => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor={args.id}>Your email</Label>
      <Input {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Your email');
    await expect(field).toBeDisabled();

    await userEvent.tab();
    await expect(field).not.toHaveFocus();
  },
};

/**
 * The input types the site would plausibly need, stacked. `type` changes the
 * mobile keyboard and the browser's own validation, not the visual style.
 */
export const Types: Story = {
  parameters: {
    docs: { description: { story: 'Reference set of the useful native types.' } },
  },
  render: () => (
    <div className="max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type-text">Name</Label>
        <Input id="type-text" type="text" placeholder="Tiago Danin" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type-email">Email</Label>
        <Input id="type-email" type="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type-url">Portfolio URL</Label>
        <Input id="type-url" type="url" placeholder="https://tiagodanin.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type-search">Search projects</Label>
        <Input id="type-search" type="search" placeholder="telegraf" />
      </div>
    </div>
  ),
};
