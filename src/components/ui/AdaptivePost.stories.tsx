import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { AdaptivePost, Variant } from './AdaptivePost';

const variants = [
  {
    id: 'flutter',
    label: 'Flutter',
    title: 'Anatomia das barras do sistema no Flutter',
    description: 'Status bar e navigation bar com SystemUiOverlayStyle.',
  },
  {
    id: 'compose',
    label: 'Jetpack Compose',
    title: 'Anatomia das barras do sistema no Jetpack Compose',
    description: 'Status bar e navigation bar com enableEdgeToEdge.',
  },
  {
    id: 'swiftui',
    label: 'SwiftUI',
    title: 'Anatomia das barras do sistema no SwiftUI',
    description: 'Status bar, home indicator e safe area.',
  },
];

/**
 * The frame of an adaptive post: one article written for several readers, where
 * each version is its own static page with its own title and description.
 *
 * A post becomes adaptive when its frontmatter has `variants` (`id`, `label`,
 * `title`, `seoTitle`, `description`). `[lang]/post/[slug]/[variant]` exports
 * one page per id at `/post/<slug>/<id>/`, and the post's own URL is the `all`
 * version. The body marks blocks with `<Variant for="...">`, a space-separated
 * list of ids plus `all`; `renderMdx(body, id)` drops every block not marked for
 * the page being rendered, so each page's HTML holds only its own text. Text
 * outside every `Variant` is in all versions.
 *
 * The picker is plain links, with `aria-current="page"` on the version being
 * read. No client JavaScript.
 *
 * The Markdown mirror (`scripts/generateLlms.ts`) is the `all` version.
 */
const meta = {
  title: 'UI/AdaptivePost',
  component: AdaptivePost,
  parameters: { layout: 'padded' },
  args: { locale: 'br', slug: 'system-bars-anatomy-mobile', variants, active: 'all', children: null },
} satisfies Meta<typeof AdaptivePost>;

export default meta;
type Story = StoryObj<typeof meta>;

const body = (active: string) => (
  <div className="prose prose-zinc max-w-none">
    <p>Fundo claro pede ícones escuros, e fundo escuro pede ícones claros.</p>
    <Variant for="all flutter" active={active}>
      <p>No Flutter, o nome descreve o ícone: ícones escuros são <code>Brightness.dark</code>.</p>
    </Variant>
    <Variant for="all compose" active={active}>
      <p>No Compose, o nome descreve o fundo: ícones escuros vêm de <code>SystemBarStyle.light</code>.</p>
    </Variant>
    <Variant for="all swiftui" active={active}>
      <p>No SwiftUI, <code>toolbarColorScheme(.dark)</code> descreve o fundo e deixa o texto claro.</p>
    </Variant>
  </div>
);

/** The post's own URL: every block marked `all`, and `Todos` as the current page. */
export const All: Story = {
  render: (args) => <AdaptivePost {...args}>{body(args.active)}</AdaptivePost>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/No Flutter/)).toBeInTheDocument();
    await expect(canvas.getByText(/No Compose/)).toBeInTheDocument();
    await expect(canvas.getByRole('link', { current: 'page' })).toHaveAttribute('href', '/br/post/system-bars-anatomy-mobile');
  },
};

/** `/br/post/system-bars-anatomy-mobile/flutter/`: the other stacks are not in the HTML at all. */
export const Flutter: Story = {
  args: { active: 'flutter' },
  render: (args) => <AdaptivePost {...args}>{body(args.active)}</AdaptivePost>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/No Flutter/)).toBeInTheDocument();
    await expect(canvas.queryByText(/No Compose/)).toBeNull();
    await expect(canvas.getByText(/Fundo claro/)).toBeInTheDocument();
    await expect(canvas.getByRole('link', { current: 'page' })).toHaveTextContent('Flutter');
  },
};
