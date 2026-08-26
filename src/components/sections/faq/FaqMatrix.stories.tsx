import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { FaqMatrix } from './FaqMatrix';

/** The `matrix` layout: a table for "does one person cover X and Y" questions. */
const meta = {
  title: 'Sections/FAQ/FaqMatrix',
  component: FaqMatrix,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Three columns: the technology, where it was used, and the proof.',
          '',
          'A table rather than prose, for both audiences. A reader scans it. An',
          'answer engine reads each row as a fact triple instead of parsing a',
          'sentence that lists six technologies separated by commas and an "and".',
          '',
          'The wrapper carries its own `overflow-x-auto`, so a wide table scrolls',
          'inside itself and never makes the page body scroll sideways. The first',
          'cell of each row is a `th` with `scope="row"`, which is what lets a',
          'screen reader say which technology a cell belongs to.',
        ].join('\n'),
      },
    },
  },
  args: {
    rows: [
      { item: 'Flutter', where: 'Idopter Labs, desde 2022', proof: 'Palestra sobre Firebase em Flutter', href: '/talks' },
      { item: 'React Native', where: 'Idopter Labs e VoxData', proof: 'Artigos sobre testes e listas performáticas', href: '/blog' },
      { item: 'Kotlin', where: 'Módulos nativos Android', proof: 'Artigo sobre Splash Screen em Jetpack Compose', href: '/blog' },
      { item: 'Swift', where: 'Módulos nativos iOS', proof: 'Artigo sobre Keyboard Actions no iOS', href: '/blog' },
    ],
  },
} satisfies Meta<typeof FaqMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('table')).toBeInTheDocument();
    await expect(canvas.getAllByRole('row')).toHaveLength(5);
  },
};

/** Many rows with long text, to check that the table scrolls and the page does not. */
export const Wide: Story = {
  args: {
    rows: [
      { item: 'Elixir com Phoenix', where: 'Backend em projetos da Idopter Labs quando o time precisa', proof: 'Descrito na experiência profissional', href: '/about' },
      { item: 'Node.js', where: 'IssueHunt, bots de Telegram e pacotes npm publicados', proof: 'Pacotes publicados no npm', href: '/projects' },
      { item: 'Next.js', where: 'Frontend, incluindo este site', proof: 'Repositório do site no GitHub', href: '/projects' },
    ],
  },
};

export const Empty: Story = {
  args: { rows: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('table')).toBeNull();
  },
};
