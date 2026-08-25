import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { PressMentions, type PressMention } from './PressMentions';

const items: PressMention[] = [
  {
    outlet: 'Diário Online',
    title: 'Trabalhar com produção de jogos vai muito além da diversão',
    url: 'https://dol.com.br/entretenimento/games/783643/trabalhar-com-producao-de-jogos-vai-muito-alem-da-diversao?d=1',
    date: '2022-11-27',
    displayDate: 'November 27, 2022',
  },
  {
    outlet: 'TI Inside',
    title: 'Hackathon TecBan seleciona startups voltadas para ecossistema de Open Banking',
    url: 'https://tiinside.com.br/14/08/2020/hackathon-tecban-seleciona-startups-voltadas-para-ecossistema-de-open-banking/',
    date: '2020-08-14',
    displayDate: 'August 14, 2020',
  },
  {
    outlet: 'Canaltech',
    title: 'App focado na economia de "bicos" vence hackathon open banking da Tecban',
    url: 'https://canaltech.com.br/inovacao/app-focado-na-economia-de-bicos-vence-hackathon-open-banking-da-tecban-169871/',
    date: '2020-08-13',
    displayDate: 'August 13, 2020',
  },
];

const meta = {
  title: 'Sections/PressMentions',
  component: PressMentions,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Third-party coverage on /about, as a list of outlet-dated cards. The',
          'page passes the three most recent entries from the `press`',
          'collection.',
          '',
          'The second of the two blocks that separate /about from the home',
          'page. Everything here was written by someone else, which is the',
          'whole point: it is the one section on the site where the claims are',
          'not self-reported.',
          '',
          'Three things it does deliberately:',
          '',
          '- **It renders nothing when `items` is empty.** No heading, no empty',
          '  state, no "coverage coming soon". A press section with no press is',
          '  worse than no press section, so the component returns `null`.',
          '- **Dates arrive pre-formatted.** `pressDate()` runs server side and',
          '  the component never parses a date string, so the static export',
          '  cannot disagree with the visitor\'s locale.',
          '- **Every title is an external link** with a visible `ExternalLink`',
          '  glyph, rather than leaving the reader to discover mid-click that',
          '  they are leaving the site.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'Coverage in render order. `url` doubles as the React key, so the same article cannot appear twice. `date` is the ISO value behind `datetime`; `displayDate` is what the reader sees.',
    },
    href: {
      control: 'text',
      description: 'Destination of the closing "All press mentions" link.',
      table: { defaultValue: { summary: '/press' } },
    },
  },
  args: { items },
} satisfies Meta<typeof PressMentions>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The section as /about renders it: three articles, newest first.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'In the press' })).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);

    const article = canvas.getByRole('link', {
      name: /Trabalhar com produção de jogos/,
    });
    await expect(article).toHaveAttribute('target', '_blank');
    // Without rel=noopener the opened tab keeps a handle on this window.
    await expect(article).toHaveAttribute('rel', expect.stringContaining('noopener'));

    await expect(canvas.getByRole('link', { name: /all press mentions/i })).toHaveAttribute(
      'href',
      '/press'
    );
  },
};

/**
 * The empty case, which is the only state where this component draws nothing at
 * all. `/about` still calls it unconditionally, so the guard is what keeps a
 * bare "In the press" heading off the page when the collection is empty.
 */
export const Empty: Story = {
  args: { items: [] },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('heading', { name: 'In the press' })
    ).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: /all press mentions/i })).not.toBeInTheDocument();
    await expect(canvas.queryAllByRole('listitem')).toHaveLength(0);
  },
};

/**
 * A single mention. The list renders normally and the closing link stays, since
 * the archive is still worth reaching.
 */
export const SingleMention: Story = {
  args: { items: [items[1]] },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
    await expect(canvas.getByText('TI Inside')).toBeVisible();
  },
};

/**
 * Headlines long enough to wrap. The external-link glyph is inline and
 * `align-baseline`, so it stays attached to the last word instead of floating
 * to the end of the card.
 */
export const LongHeadlines: Story = {
  args: {
    items: [
      {
        outlet: 'Portal Amazônia',
        title:
          'Desenvolvedor paraense leva soluções de código aberto para eventos de tecnologia no Brasil e mantém dezenas de pacotes usados em produção mundo afora',
        url: 'https://portalamazonia.com/tecnologia/desenvolvedor-paraense-codigo-aberto',
        date: '2023-05-19',
        displayDate: 'May 19, 2023',
      },
      items[0],
    ],
  },
};

/**
 * The full press archive is not the only possible destination. A campaign page
 * or a language-specific index can take over the closing link.
 */
export const CustomDestination: Story = {
  args: { href: '/press-kit' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /all press mentions/i })).toHaveAttribute(
      'href',
      '/press-kit'
    );
  },
};

/**
 * At 320px the outlet, separator and date still share one line, and the
 * headline takes the width it needs.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
