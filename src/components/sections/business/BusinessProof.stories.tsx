import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { BusinessProof } from './BusinessProof';
import { PROOF, RESOLVE_HREF } from './fixtures';

/** The band that pairs the track record with numbers counted from the collections. */
const meta = {
  title: 'Sections/Business/BusinessProof',
  component: BusinessProof,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BusinessProof>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every row links to the page its number was counted from. */
export const Default: Story = {
  args: {
    title: 'O que dá para conferir',
    note: 'Cada número abaixo é um link para a coisa que ele conta.',
    trackTitle: 'Registro próprio desde 2020, 8 anos de trabalho profissional',
    track:
      'Atuando desde 2020, em Belém. Atrás disso: backend freelance no IssueHunt de 2018 a 2019, desenvolvedor mobile na VoxData de 2019 a 2022 e desenvolvedor mobile na Idopter Labs desde 2022.',
    items: PROOF,
    resolveHref: RESOLVE_HREF,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(4);
    await expect(links[0]).toHaveAttribute('href', '/projects');
  },
};

/** Portuguese route prefix, the way the page passes localePath in. */
export const Localized: Story = {
  args: {
    ...Default.args,
    resolveHref: (href: string) => '/br' + href,
  },
};
