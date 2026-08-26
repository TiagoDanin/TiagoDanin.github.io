import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { FaqService } from './FaqService';

/** The `service` layout: scope and limits, for "who do I call for" questions. */
const meta = {
  title: 'Sections/FAQ/FaqService',
  component: FaqService,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Cards describing what a piece of work covers, and often what it does',
          'not.',
          '',
          'Cards rather than a list because each item is a separate piece of scope',
          'that a reader weighs against their own need. Stating the limits is part',
          'of the job here: the FAQ answers questions like "who do I hire for a',
          'pentest", and an honest "that is not what this is" is more useful than',
          'a card implying otherwise.',
          '',
          'No hover transform. `DESIGN.md` allows it on small badges and icons,',
          'not on whole cards, and these are not links, so they get no hover',
          'affordance at all.',
        ].join('\n'),
      },
    },
  },
  args: {
    offering: [
      {
        title: 'Revisão de arquitetura mobile',
        detail: 'Leitura da estrutura do app, das dependências nativas e da esteira de release, com os pontos que vão doer primeiro.',
      },
      {
        title: 'Olhar de segurança no mesmo projeto',
        detail: 'Os mesmos tipos de falha que ele reporta pelo HackerOne desde 2018, aplicados ao código que ele acabou de ler.',
      },
    ],
  },
} satisfies Meta<typeof FaqService>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Revisão de arquitetura mobile')).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: { offering: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/Revisão/)).toBeNull();
  },
};
