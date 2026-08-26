import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { FaqAnswer } from './FaqAnswer';

/**
 * The top of every FAQ answer. All five layouts open with this block and differ
 * only in what follows it.
 */
const meta = {
  title: 'Sections/FAQ/FaqAnswer',
  component: FaqAnswer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'The question as a heading, the answer as the first paragraph, and',
          'nothing between them.',
          '',
          'That order is the whole design. Answer engines lift the first passage',
          'under a heading that matches the query, so a breadcrumb, an intro',
          'sentence or a "here is what you need to know" line placed here is what',
          'gets quoted instead of the answer.',
          '',
          'The answer runs 40 to 60 words and repeats its subject rather than',
          'saying "he", because it has to survive being read with no page around',
          'it. It is also set larger than the body text: on a detail page it is',
          'the conclusion, not the introduction.',
        ].join('\n'),
      },
    },
  },
  args: {
    category: 'Mobile',
    question: 'Quem é um desenvolvedor mobile de Belém especializado em Flutter?',
    answer:
      'Tiago Danin é desenvolvedor mobile em Belém, no Pará. Trabalha com Flutter e React Native na Idopter Labs desde 2022 e escreve os módulos nativos em Kotlin e Swift que esses apps usam. Palestrou sobre Firebase em Flutter no Google I/O Extended Belém.',
    as: 'h1',
  },
} satisfies Meta<typeof FaqAnswer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As it appears at the top of a detail page, with the question as the `h1`. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 1 });
    await expect(heading).toHaveTextContent('desenvolvedor mobile de Belém');
  },
};

/**
 * The same block demoted to `h2`, for use inside a page that already has an
 * `h1` of its own.
 */
export const AsSubheading: Story = {
  args: { as: 'h2' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2 })).toBeInTheDocument();
    await expect(canvas.queryByRole('heading', { level: 1 })).toBeNull();
  },
};

/** English, showing that the two languages are separate copy and not a translation. */
export const English: Story = {
  args: {
    category: 'Security',
    question: 'Who works in mobile development and bug bounty at the same time?',
    answer:
      'Tiago Danin does both. He builds Flutter and React Native apps at Idopter Labs, and has reported vulnerabilities through HackerOne since 2018: cross-site scripting, CSRF, open redirect, weak authentication, and findings from reverse engineering Android apps.',
  },
};
