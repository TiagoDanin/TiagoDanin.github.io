import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { StepIndicator } from './StepIndicator';

/**
 * Progress header of the talk feedback flow at `/links/talk/`: email, then
 * ratings, then the thank-you screen.
 */
const meta = {
  title: 'UI/StepIndicator',
  component: StepIndicator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A row of bars plus a caption, showing how far along a multi-step form',
          'the reader is.',
          '',
          'The bars are `aria-hidden`. Everything they say, the caption below',
          'repeats as text, and the same string is the wrapper `aria-label`.',
          'That is on purpose: filled versus empty is a colour difference, and',
          'colour alone is not an accessible way to carry state. Anyone reading',
          'the caption, or listening to it, gets the full picture.',
          '',
          'The component is presentational. It has no `onChange` and cannot move',
          'the flow; the owning form drives `step`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    step: {
      control: { type: 'range', min: 1, max: 3, step: 1 },
      description: 'Current step, 1-based. Bars up to and including it read as done.',
    },
    total: {
      control: { type: 'number', min: 2, max: 6 },
      description: 'How many steps the flow has.',
      table: { defaultValue: { summary: '3' } },
    },
    formatLabel: {
      description:
        'Builds the caption and the accessible label. Defaults to Portuguese ("Passo 2 de 3"), since the feedback form is the only consumer.',
    },
  },
  args: {
    step: 1,
    total: 3,
  },
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Where the feedback form opens: email step, one bar of three filled. */
export const FirstStep: Story = {
  play: async ({ canvas }) => {
    // The caption is the accessible text, not a decoration beside it.
    await expect(canvas.getByText('Passo 1 de 3')).toBeVisible();
    await expect(canvas.getByLabelText('Passo 1 de 3')).toBeInTheDocument();
  },
};

/** The ratings step, reached after a valid email. */
export const SecondStep: Story = {
  args: { step: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Passo 2 de 3')).toBeInTheDocument();
  },
};

/** The thank-you screen. Every bar filled, so the flow reads as finished. */
export const LastStep: Story = {
  args: { step: 3 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Passo 3 de 3')).toBeVisible();
  },
};

/**
 * `total` is not fixed at three. The bars are `flex-1`, so five split the same
 * width rather than overflowing.
 */
export const FiveSteps: Story = {
  args: { step: 2, total: 5 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Passo 2 de 5')).toBeVisible();
  },
};

/**
 * `formatLabel` is the entire translation surface: it feeds the caption and the
 * accessible label from the same string, so they cannot drift apart.
 */
export const EnglishLabel: Story = {
  args: {
    step: 2,
    formatLabel: (current, count) => `Step ${current} of ${count}`,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Step 2 of 3')).toBeVisible();
    await expect(canvas.getByLabelText('Step 2 of 3')).toBeInTheDocument();
  },
};

/** The three states of the shipped flow, stacked for comparison. */
export const AllSteps: Story = {
  parameters: {
    docs: {
      description: { story: 'Reference stack of the feedback form progression.' },
    },
  },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      <StepIndicator step={1} />
      <StepIndicator step={2} />
      <StepIndicator step={3} />
    </div>
  ),
};
