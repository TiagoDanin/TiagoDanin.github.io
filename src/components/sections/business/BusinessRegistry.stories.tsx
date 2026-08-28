import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { BusinessRegistry } from './BusinessRegistry';
import { REGISTRY } from './fixtures';

/** The public company record, as a definition list so the pairs stay machine-readable. */
const meta = {
  title: 'Sections/Business/BusinessRegistry',
  component: BusinessRegistry,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BusinessRegistry>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every field the page carries, plus the outbound verification link. */
export const Default: Story = {
  args: {
    title: 'Dados da empresa',
    note: 'Dados públicos do cadastro da Receita Federal.',
    records: REGISTRY,
    linkLabel: 'Consultar na Receita Federal',
    linkHref: 'https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('67.171.570/0001-15')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /Receita Federal/ })).toHaveAttribute(
      'target',
      '_blank'
    );
  },
};
