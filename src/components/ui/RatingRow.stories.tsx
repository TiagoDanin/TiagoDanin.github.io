import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent } from 'storybook/test';
import { useState } from 'react';

import { RatingRow, type RatingRowProps } from './RatingRow';

/**
 * One line of the talk feedback form: a label on the left, a row of stars on the
 * right. `FeedbackForm` renders four of these, one per criterion (Slides,
 * Apresentacao / Fala, Conteudo, Aplicabilidade).
 */
const meta = {
  title: 'UI/RatingRow',
  component: RatingRow,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Star rating for a single criterion, built as five independent buttons',
          'rather than a radio group. That is deliberate: a rating can be changed',
          'in one tap from any current value, where a radio group would need the',
          'reader to move focus through the set first.',
          '',
          'Each star carries its own `aria-label` from `formatStarLabel`, and',
          '`aria-pressed` reflects whether it is part of the current score, so',
          'the rating is not communicated by the yellow fill alone.',
          '',
          'The component is fully controlled. Clicking a star only calls',
          '`onChange`; the owner has to feed the new `value` back in, which is',
          'what `FeedbackForm` does through its `ratings` state map.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'What is being rated. Also seeds every star name through `formatStarLabel`.',
    },
    value: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: 'Current score. `0` means the reader has not answered yet.',
    },
    onChange: {
      description: 'Called with the clicked star number, 1-based.',
    },
    isError: {
      control: 'boolean',
      description:
        'Paints the label and the empty stars in the destructive tone. `FeedbackForm` sets it after a submit attempt with this row still unanswered.',
      table: { defaultValue: { summary: 'false' } },
    },
    max: {
      control: { type: 'number', min: 3, max: 10 },
      description: 'How many stars to offer.',
      table: { defaultValue: { summary: '5' } },
    },
    formatStarLabel: {
      description:
        'Builds each star accessible name. Defaults to Portuguese ("Slides: 4 estrelas") because the feedback form is the only flow using it.',
    },
  },
  args: {
    label: 'Slides',
    value: 3,
    onChange: fn(),
    isError: false,
    max: 5,
  },
} satisfies Meta<typeof RatingRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Wraps the controlled component in local state so a click actually repaints,
 * the way `FeedbackForm` does. It still forwards to the `onChange` spy.
 */
function StatefulRatingRow({ value: initial, onChange, ...rest }: RatingRowProps) {
  const [value, setValue] = useState(initial);

  return (
    <RatingRow
      {...rest}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

/**
 * Three of five chosen. Filled stars are yellow, the rest sit at 40% muted.
 * Clicking here changes nothing on screen: the story passes a fixed `value`, so
 * this is the controlled component with no owner, which is the same thing that
 * happens if a consumer forgets to store the result.
 */
export const Default: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Slides: 4 estrelas' }));
    await expect(args.onChange).toHaveBeenCalledWith(4);

    // No owner fed the new value back, so the third star is still the last one
    // marked as pressed.
    await expect(
      canvas.getByRole('button', { name: 'Slides: 4 estrelas' })
    ).toHaveAttribute('aria-pressed', 'false');
  },
};

/** Nothing chosen yet, which is how every row starts in the feedback form. */
export const Empty: Story = {
  args: { value: 0 },
  play: async ({ canvas }) => {
    for (const n of [1, 2, 3, 4, 5]) {
      await expect(
        canvas.getByRole('button', { name: `Slides: ${n} estrelas` })
      ).toHaveAttribute('aria-pressed', 'false');
    }
  },
};

/**
 * Held in local state, so the row repaints as the reader taps. This is the real
 * behaviour on `/links/talk/`.
 */
export const Interactive: Story = {
  args: { value: 0 },
  render: (args) => <StatefulRatingRow {...args} />,
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Slides: 4 estrelas' }));
    await expect(args.onChange).toHaveBeenCalledWith(4);

    await expect(
      canvas.getByRole('button', { name: 'Slides: 4 estrelas' })
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      canvas.getByRole('button', { name: 'Slides: 5 estrelas' })
    ).toHaveAttribute('aria-pressed', 'false');

    // Lowering the score works in one tap, the reason these are buttons.
    await userEvent.click(canvas.getByRole('button', { name: 'Slides: 2 estrelas' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(2);
    await expect(
      canvas.getByRole('button', { name: 'Slides: 3 estrelas' })
    ).toHaveAttribute('aria-pressed', 'false');
  },
};

/**
 * The unanswered-required state. `FeedbackForm` turns this on after a submit
 * attempt, alongside a red border and the message "Selecione de 1 a 5
 * estrelas.". The tone change reaches the label too, so the row is identifiable
 * without seeing the stars.
 */
export const ErrorState: Story = {
  args: { value: 0, isError: true, label: 'Aplicabilidade' },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Aplicabilidade')).toHaveClass('text-destructive');

    // The row stays usable in the error state: clicking still answers it.
    await userEvent.click(
      canvas.getByRole('button', { name: 'Aplicabilidade: 5 estrelas' })
    );
    await expect(args.onChange).toHaveBeenCalledWith(5);
  },
};

/**
 * `formatStarLabel` is the whole translation surface. Override it and the stars
 * announce in English without touching anything else.
 */
export const EnglishLabels: Story = {
  args: {
    label: 'Content',
    value: 4,
    formatStarLabel: (name, n) => `${name}: ${n} ${n === 1 ? 'star' : 'stars'}`,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Content: 1 star' })).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Content: 4 stars' })
    ).toHaveAttribute('aria-pressed', 'true');
  },
};

/** `max` changes the scale. Nothing on the site uses ten, but the prop is real. */
export const TenPointScale: Story = {
  args: { label: 'Recomendaria a talk', value: 8, max: 10 },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(10);
  },
};

/**
 * A long criterion label next to the stars. The row is a `justify-between`
 * flexbox, so the label takes the slack and the stars keep their size.
 */
export const LongLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Worst case for the row layout: a full sentence as the label.',
      },
    },
  },
  args: {
    label: 'Aplicabilidade do conteudo no seu dia a dia de desenvolvimento mobile',
    value: 4,
  },
};
