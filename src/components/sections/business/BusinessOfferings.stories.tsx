import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { BusinessOfferings } from './BusinessOfferings';
import { OFFERINGS, RESOLVE_HREF } from './fixtures';

/** The three registered activities, each labelled with the CNAE code it comes from. */
const meta = {
  title: 'Sections/Business/BusinessOfferings',
  component: BusinessOfferings,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BusinessOfferings>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three cards, one icon each, as the collection ships them. */
export const Default: Story = {
  args: {
    title: 'O que a empresa está registrada para fazer',
    note: 'Três atividades, tiradas direto dos CNAEs registrados no CNPJ. Nada aqui é serviço inventado para encher uma página.',
    offerings: OFFERINGS,
    resolveHref: RESOLVE_HREF,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('CNAE 6201-5/01')).toBeInTheDocument();
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  },
};

/** A single activity, the fallback shape when only one is published. */
export const SingleOffering: Story = {
  args: { ...Default.args, offerings: OFFERINGS.slice(0, 1) },
};
