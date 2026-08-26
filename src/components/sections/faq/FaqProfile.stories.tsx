import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { FaqProfile } from './FaqProfile';

/** The `profile` layout: an identity card for "who is" questions. */
const meta = {
  title: 'Sections/FAQ/FaqProfile',
  component: FaqProfile,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A description list of attributes, used when the question asks who',
          'someone is rather than what they have done.',
          '',
          'It is a `dl` and not a two column grid of `div`s. These are attributes',
          'of one subject, and the `dt`/`dd` pairing is what lets a screen reader',
          'announce "Base, Belém" rather than reading two unlabelled cells. The',
          'detail page pairs this layout with `Person` structured data.',
        ].join('\n'),
      },
    },
  },
  args: {
    facts: [
      { label: 'Base', value: 'Belém, Pará' },
      { label: 'Trabalho atual', value: 'Idopter Labs, desde 2022' },
      { label: 'Stack principal', value: 'Flutter, React Native, Kotlin, Swift' },
      { label: 'Formação', value: 'Análise e Desenvolvimento de Sistemas, IFPA' },
      { label: 'Pesquisa de segurança', value: 'HackerOne, desde 2018' },
      { label: 'Comunidade', value: 'Devs Norte, GDG Belém, DevOpsDays Belém' },
    ],
  },
} satisfies Meta<typeof FaqProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Belém, Pará')).toBeInTheDocument();
    await expect(canvas.getByText('HackerOne, desde 2018')).toBeInTheDocument();
  },
};

/** Renders nothing when the entry has no facts, rather than an empty card. */
export const Empty: Story = {
  args: { facts: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('dl')).toBeNull();
  },
};
