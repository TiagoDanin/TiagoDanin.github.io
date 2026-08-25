import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';

/**
 * The field label. Used by `FeedbackForm` and by the `form.tsx` field wrapper.
 */
const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A `label` element built on Radix Label, styled `text-sm font-medium`.',
          '',
          'Radix adds one behaviour over the native element: it suppresses text',
          'selection on double click, so double-clicking a label to jump into its',
          'field does not highlight the label text instead. Everything else is the',
          'native contract, which means `htmlFor` still has to match the control\'s',
          '`id`. Clicking a correctly paired label focuses the control, and that is',
          'the cheapest way to verify the pairing is real; the stories here assert',
          'it rather than assuming it.',
          '',
          'One detail in the class list is easy to misread. The base style carries',
          '`peer-disabled:cursor-not-allowed peer-disabled:opacity-70`, which only',
          'applies when a *previous sibling* carries the `peer` class. `FeedbackForm`',
          'puts the label above the input and never adds `peer`, so that styling',
          'never fires there. Dimming a label for a disabled field needs the label',
          'placed after the control with `peer` on the control, or the opacity set',
          'by hand.',
          '',
          'The component adds no required indicator and no optional hint. Both are',
          'plain children, which is how the feedback form marks its three optional',
          'text areas.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    htmlFor: {
      control: 'text',
      description:
        'Must match the `id` of the control it labels. Without it the label is decorative text.',
    },
    children: { control: 'text', description: 'Label text.' },
    className: { control: 'text', description: 'Merged through `cn`.' },
  },
  args: {
    htmlFor: 'talk-title',
    children: 'Talk title',
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A label paired with an input. Clicking the label moves focus into the field,
 * which is the observable proof that `htmlFor` and `id` line up.
 */
export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm space-y-2">
      <Label {...args} />
      <Input id="talk-title" placeholder="Pipelines for React Native on GitLab" />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Talk title');
    await expect(field).toBe(canvas.getByRole('textbox'));

    await userEvent.click(canvas.getByText('Talk title'));
    await expect(field).toHaveFocus();
  },
};

/**
 * A label with an optional hint inside it, the pattern the feedback form uses on
 * its three free-text questions. The hint is part of the label, so it is
 * announced with the field rather than discovered separately.
 */
export const WithOptionalHint: Story = {
  render: () => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor="liked">
        What did you like most?{' '}
        <span className="text-xs text-muted-foreground">(optional)</span>
      </Label>
      <Textarea id="liked" rows={3} maxLength={2000} />
    </div>
  ),
  play: async ({ canvas }) => {
    // The hint travels with the field, not beside it.
    await expect(
      canvas.getByLabelText('What did you like most? (optional)')
    ).toBeVisible();
  },
};

/**
 * A required field. The asterisk is decorative and `aria-hidden`, because the
 * `required` attribute is what actually announces the constraint; without
 * hiding it the field is read as "Your email star".
 */
export const Required: Story = {
  render: () => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor="required-email">
        Your email
        <span aria-hidden="true" className="ml-0.5 text-destructive">
          *
        </span>
      </Label>
      <Input id="required-email" type="email" required placeholder="you@example.com" />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByRole('textbox', { name: /Your email/ });
    await expect(field).toBeRequired();
  },
};

/**
 * The `peer-disabled` styling, working and not working. On the left the label
 * comes first and the input has no `peer` class, which is the arrangement in
 * `FeedbackForm`: the label stays at full contrast beside a disabled field. On
 * the right the order is flipped and the control carries `peer`, so the label
 * dims as intended.
 */
export const PeerDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Left: label before an input with no `peer`, so nothing dims. Right: `peer` on the control, label after it.',
      },
    },
  },
  render: () => (
    <div className="flex max-w-xl flex-col gap-8 sm:flex-row">
      <div className="flex-1 space-y-2">
        <Label htmlFor="peer-off">Email (label first)</Label>
        <Input id="peer-off" disabled defaultValue="tiago@tiagodanin.com" />
      </div>
      <div className="flex-1 space-y-2">
        <Input
          id="peer-on"
          className="peer"
          disabled
          defaultValue="tiago@tiagodanin.com"
        />
        <Label htmlFor="peer-on">Email (label after a peer)</Label>
      </div>
    </div>
  ),
};

/**
 * A long label. It wraps like any block-level text and pushes the control down,
 * so a two-line question does not squeeze the field.
 */
export const LongLabel: Story = {
  render: () => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor="suggestions">
        Which topic would you like me to cover in a future talk at Devs Norte?
      </Label>
      <Textarea id="suggestions" rows={3} maxLength={2000} />
    </div>
  ),
};
