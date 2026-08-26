import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { FaqEvidence } from './FaqEvidence';

/** The `evidence` layout: a dated record for "has anyone done X" questions. */
const meta = {
  title: 'Sections/FAQ/FaqEvidence',
  component: FaqEvidence,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'An ordered list, newest first, where every row carries a real date and',
          'usually a link.',
          '',
          'This is the layout that does the most work for the FAQ as a whole. The',
          'answer above it makes a claim; this list is why anyone should believe',
          'it. A version of this block without dates would be a list of adjectives,',
          'which proves nothing to a reader and nothing to a model deciding whether',
          'to cite the page.',
          '',
          'The detail page pairs it with `ItemList` structured data.',
        ].join('\n'),
      },
    },
  },
  args: {
    items: [
      {
        date: '2025',
        title: 'O papel das Feature Flags na entrega contínua de Aplicativos Mobile',
        detail: 'DevOpsDays Belém 2025.',
        href: 'https://tasafo.github.io/belemdevopsdays/',
      },
      {
        date: '2024',
        title: 'O Ingrediente Secreto dos apps de sucesso: Teste A/B com Firebase',
        detail: 'DevFest Belém 2024, organizado pelo GDG Belém.',
        href: '/talks',
      },
      {
        date: '2023',
        title: 'DevOps para Desenvolvimento Mobile',
        detail: 'DevOpsDays Belém 2023.',
        href: '/talks',
      },
    ],
  },
} satisfies Meta<typeof FaqEvidence>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await expect(canvas.getByText('2025')).toBeInTheDocument();
  },
};

/** A row with no link stays plain text instead of becoming a dead anchor. */
export const WithoutLinks: Story = {
  args: {
    items: [
      { date: '2020', title: 'Primeiro Hackathon TecBan', detail: 'Primeiro lugar com o app Bicos, feito em 56 horas.' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link')).toBeNull();
  },
};

export const Empty: Story = {
  args: { items: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('ol')).toBeNull();
  },
};
