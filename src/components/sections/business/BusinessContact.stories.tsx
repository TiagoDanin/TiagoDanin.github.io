import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { BusinessContact } from './BusinessContact';

/** Closing band on the slate background, with the invoicing note under the actions. */
const meta = {
  title: 'Sections/Business/BusinessContact',
  component: BusinessContact,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BusinessContact>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both actions available, which is the shipped state. */
export const Default: Story = {
  args: {
    title: 'Me conte o que precisa ser construído',
    detail:
      'Eu leio e respondo o e-mail pessoalmente. Não existe gerente de contas entre nós, e a primeira resposta já diz se eu acho que sou a pessoa certa para aquilo.',
    note: 'Nota fiscal, contrato assinado e Simples Nacional. Trabalho remoto, com clientes no Brasil e fora dele.',
    email: 'TiagoDanin@outlook.com',
    emailLabel: 'Mandar um e-mail',
    linkedInUrl: 'https://linkedin.com/in/tiagodanin',
    linkedInLabel: 'Chamar no LinkedIn',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
  },
};

/** LinkedIn missing from the collection: the second button is dropped, not disabled. */
export const WithoutLinkedIn: Story = {
  args: { ...Default.args, linkedInUrl: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
  },
};
