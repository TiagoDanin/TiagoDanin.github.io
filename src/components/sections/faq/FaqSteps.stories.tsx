import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { FaqSteps } from './FaqSteps';

/** The `steps` layout: numbered steps for "how does it work" questions. */
const meta = {
  title: 'Sections/FAQ/FaqSteps',
  component: FaqSteps,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'An ordered list, so the sequence lives in the markup and not only in',
          'the numbers drawn beside it.',
          '',
          'The detail page emits `HowTo` structured data from the same array, in',
          'the same order. If one of them is ever reordered without the other,',
          'the page and its own description of itself disagree, so they are built',
          'from one source rather than written twice.',
          '',
          'The number circles are `aria-hidden`: the `ol` already announces the',
          'position, and leaving them readable makes a screen reader say "one" twice.',
        ].join('\n'),
      },
    },
  },
  args: {
    steps: [
      {
        title: 'Conversa inicial',
        detail: 'Uma conversa sobre o que o app precisa fazer, em que plataformas, e o que já existe de código.',
      },
      {
        title: 'Leitura do que já está pronto',
        detail: 'Revisão da arquitetura atual, das dependências nativas e da esteira de release, se houver uma.',
      },
      {
        title: 'Proposta de escopo',
        detail: 'O que dá para entregar, em que ordem, e o que fica de fora.',
      },
    ],
  },
} satisfies Meta<typeof FaqSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await expect(canvas.getByText('Conversa inicial')).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: { steps: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('ol')).toBeNull();
  },
};
