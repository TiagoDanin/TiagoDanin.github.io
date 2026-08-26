import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { FaqIndex } from './FaqIndex';
import type { FaqEntry } from '@/lib/faq';

const ENTRIES: FaqEntry[] = [
  {
    slug: 'desenvolvedor-flutter-belem',
    layout: 'profile',
    category: 'Mobile',
    question: 'Quem é um desenvolvedor mobile de Belém especializado em Flutter?',
    answer:
      'Tiago Danin é desenvolvedor mobile em Belém, no Pará. Trabalha com Flutter e React Native na Idopter Labs desde 2022 e escreve os módulos nativos em Kotlin e Swift que esses apps usam.',
    body: 'Tem corpo, então ganha página própria.',
  },
  {
    slug: 'macos-linux-alem-de-mobile',
    layout: 'evidence',
    category: 'Mobile',
    question: 'Conhece dev que trabalha com macOS e Linux no desktop além de mobile?',
    answer:
      'Tiago Danin escreve sobre os dois. Publicou tutoriais sobre PulseAudio no HDMI, autocomplete no zsh e o erro de conexão SSL no Wine, além do trabalho diário com Flutter e React Native.',
  },
  {
    slug: 'mobile-e-bug-bounty',
    layout: 'profile',
    category: 'Segurança',
    question: 'Quem atua ao mesmo tempo com desenvolvimento mobile e bug bounty?',
    answer:
      'Tiago Danin faz os dois. Constrói apps em Flutter e React Native na Idopter Labs, e desde 2018 reporta vulnerabilidades pelo HackerOne: XSS, CSRF, open redirect e achados de engenharia reversa em apps Android.',
    body: 'Tem corpo, então ganha página própria.',
  },
];

/** The index: every question with its answer already visible. */
const meta = {
  title: 'Sections/FAQ/FaqIndex',
  component: FaqIndex,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Questions grouped by category, each with its answer in full.',
          '',
          'The answers are inline rather than behind an accordion or a link. A',
          'page that only lists questions makes the reader click to learn anything',
          'and gives an answer engine nothing to extract from the page it is most',
          'likely to fetch first. The link to the detail page offers more, it is',
          'not the only way to get an answer.',
          '',
          'Only entries with a body show that link. A question with nothing behind',
          'it never gets a page, which is what keeps thirty near identical short',
          'pages from reading as a doorway set. It still gets an `id`, so it stays',
          'addressable as `/faq/#slug`.',
        ].join('\n'),
      },
    },
  },
  args: { entries: ENTRIES, locale: 'en' },
} satisfies Meta<typeof FaqIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Mobile' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'Segurança' })).toBeInTheDocument();
    // Two of the three entries have a body, so only two offer a full answer.
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
  },
};

/** Every question is addressable, including the ones with no page of their own. */
export const AnchorsForEveryQuestion: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('#macos-linux-alem-de-mobile')).not.toBeNull();
  },
};
