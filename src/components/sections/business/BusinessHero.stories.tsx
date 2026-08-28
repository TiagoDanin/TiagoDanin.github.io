import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { BusinessHero } from './BusinessHero';

/** Opening block of /business: trade name, positioning line and the two entry actions. */
const meta = {
  title: 'Sections/Business/BusinessHero',
  component: BusinessHero,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BusinessHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Portuguese page as it ships, with the registry chips under the divider. */
export const Default: Story = {
  args: {
    eyebrow: "Desenvolvimento de software em Belém, desde 2020",
    headline: 'Seu app mobile, do briefing até a loja',
    lede: "Fico em Belém, no Pará, e trabalho com software desde 2020. Você chega com um app para construir, uma base de código que ninguém do time quer abrir, ou algo que eu já mantenho e prefere licenciar a refazer. Quem lê o seu e-mail é quem escreve o código.",
    chips: ["Apps publicados na Google Play e na Microsoft Store","Contrato assinado e nota fiscal","Código, credenciais e contas de loja ficam com você"],
    email: 'TiagoDanin@outlook.com',
    emailLabel: "Mandar um e-mail",
    recordLabel: 'Dados para o seu setor de compras cadastrar o fornecedor',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 1 });
    await expect(heading).toHaveTextContent('Seu app mobile, do briefing até a loja');
    await expect(canvas.getByRole('link', { name: /Mandar um e-mail/ })).toHaveAttribute(
      'href',
      'mailto:TiagoDanin@outlook.com'
    );
  },
};

/** English copy, which runs longer and is the wrap case for the headline. */
export const English: Story = {
  args: {
    ...Default.args,
    headline: 'Your mobile app, from the brief to the store',
    lede: "I build software from Belém, in northern Brazil, and have done since 2020. You come with an app to build, a codebase somebody else wrote and nobody wants to open, or a library you would rather license than rebuild. The person who answers your email is the person who writes the code.",
    emailLabel: "Send an email",
    recordLabel: "What your finance team needs to open a supplier record",
  },
};

/** No chips authored: the divider row disappears instead of rendering empty. */
export const WithoutChips: Story = {
  args: { ...Default.args, chips: [] },
};
