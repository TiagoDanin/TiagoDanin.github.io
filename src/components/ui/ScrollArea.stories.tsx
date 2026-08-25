import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { ScrollArea, ScrollBar } from './scroll-area';
import { Separator } from './separator';

/**
 * Radix scroll container with a styled scrollbar, for regions that need to
 * scroll independently of the page.
 */
const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'Every list on this site scrolls with the document instead, which is',
          'usually the right call for a reading page.',
          '',
          'The height has to come from the caller. `ScrollArea` is',
          '`relative overflow-hidden` with no size of its own, so without a',
          'height or a `max-h` it simply grows to fit its contents and never',
          'scrolls.',
          '',
          'The default export renders a vertical `ScrollBar` for you. A',
          'horizontal one has to be passed as a child, together with',
          '`orientation="horizontal"`, and the content then needs to be laid out',
          'in a row that is wider than the viewport.',
          '',
          'The scrollbar itself is not focusable. Keyboard users scroll the',
          'region by moving focus onto something inside it, so an interactive',
          'child is what makes a long list reachable without a mouse.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['auto', 'always', 'scroll', 'hover'],
      description:
        'When the scrollbar is shown. `hover` reveals it on pointer entry, `always` keeps it visible, `auto` shows it only when the content overflows.',
      table: { defaultValue: { summary: 'hover' } },
    },
    scrollHideDelay: {
      control: 'number',
      description:
        'Milliseconds before the scrollbar fades out after the pointer leaves. Only applies to `hover` and `scroll`.',
    },
    className: {
      control: 'text',
      description:
        'Where the height goes. Without one the region grows to fit and never scrolls.',
    },
  },
  args: {
    className: 'h-[18rem] w-[22rem] rounded-md border',
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const talks = [
  { event: 'Flutter Conf BR', year: '2025', title: 'Design systems que sobrevivem ao segundo ano' },
  { event: 'DevFest Sao Paulo', year: '2024', title: 'Wear OS com Jetpack Compose' },
  { event: 'React Native EU', year: '2024', title: 'Pipelines de release no GitLab' },
  { event: 'GDG Campinas', year: '2024', title: 'Testes que ninguem escreve' },
  { event: 'Flutterando', year: '2023', title: 'Do Figma ao Widgetbook' },
  { event: 'TDC Sao Paulo', year: '2023', title: 'Publicando pacotes npm sem medo' },
  { event: 'DevParana', year: '2023', title: 'Automatizando review de codigo' },
  { event: 'GDG Londrina', year: '2022', title: 'Primeiros passos com Flutter' },
  { event: 'Meetup Mobile BR', year: '2022', title: 'Teclado no iOS sem gambiarra' },
  { event: 'Hackathon Unicamp', year: '2021', title: 'Bots de Telegram em uma tarde' },
];

/**
 * A talk history that would otherwise push the page down by several screens.
 * The whole list is in the DOM, so in-page search and screen readers still
 * reach the last entry even though it starts out below the fold of the region.
 */
export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <h4 className="mb-3 text-sm font-medium">Speaking history</h4>
        {talks.map((talk) => (
          <div key={`${talk.event}-${talk.year}`}>
            <div className="py-2">
              <div className="text-sm">{talk.title}</div>
              <div className="text-xs text-muted-foreground">
                {talk.event}, {talk.year}
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The last entry is off screen but present, which is the point: clipping is
    // visual, not structural.
    await expect(
      canvas.getByText('Bots de Telegram em uma tarde')
    ).toBeInTheDocument();
    await expect(canvas.getByText('Design systems que sobrevivem ao segundo ano')).toBeVisible();
  },
};

/**
 * Content shorter than the region. No scrollbar appears and the box keeps its
 * declared height, leaving empty space below the last item.
 */
export const NoOverflow: Story = {
  args: {
    children: (
      <div className="p-4">
        <h4 className="mb-3 text-sm font-medium">Speaking history</h4>
        {talks.slice(0, 2).map((talk) => (
          <div key={talk.event} className="py-2">
            <div className="text-sm">{talk.title}</div>
            <div className="text-xs text-muted-foreground">
              {talk.event}, {talk.year}
            </div>
          </div>
        ))}
      </div>
    ),
  },
};

/**
 * Horizontal scrolling, for a row of tags that must not wrap. The extra
 * `ScrollBar` is required: the component only renders the vertical one by
 * default.
 */
export const Horizontal: Story = {
  args: {
    className: 'w-[22rem] whitespace-nowrap rounded-md border',
    children: (
      <>
        <div className="flex w-max gap-2 p-4">
          {[
            'flutter',
            'react-native',
            'typescript',
            'ci-cd',
            'jetpack-compose',
            'security',
            'open-source',
            'npm',
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </>
    ),
  },
};

/**
 * `type="always"` keeps the scrollbar on screen. Useful when the region sits
 * beside other content and a hidden scrollbar would leave no hint that there is
 * more to read.
 */
export const AlwaysVisibleScrollbar: Story = {
  args: {
    type: 'always',
    children: (
      <div className="p-4">
        {talks.map((talk) => (
          <div key={`${talk.event}-${talk.year}`} className="py-2 text-sm">
            {talk.title}
          </div>
        ))}
      </div>
    ),
  },
};

/**
 * A tall region holding one long block of prose rather than a list, to confirm
 * the padding and the scrollbar gutter do not fight with running text.
 */
export const LongProse: Story = {
  args: {
    className: 'h-[14rem] w-[24rem] rounded-md border',
    children: (
      <div className="space-y-3 p-4 text-sm text-muted-foreground">
        <p>
          A escolha de manter as versoes em ingles e portugues em rotas separadas
          nasceu de um problema pratico: um unico endereco que troca o idioma no
          cliente nao da ao buscador nada para indexar.
        </p>
        <p>
          Cada idioma tem sua propria URL, sua propria tag canonica e sua propria
          entrada no sitemap. O sufixo do arquivo decide o idioma, entao criar a
          traducao e criar um arquivo, nao editar um campo.
        </p>
        <p>
          Quando so existe uma versao, nenhum link alternativo e emitido. Isso
          evita apontar um rastreador para uma pagina que nunca foi gerada, que e
          o erro mais comum em sites bilingues.
        </p>
      </div>
    ),
  },
};
