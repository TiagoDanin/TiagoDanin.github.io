import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { AspectRatio } from './aspect-ratio';

/**
 * A one line re-export of the Radix primitive that reserves a box of a fixed
 * shape before its contents load.
 */
const meta = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'The post covers on this site are laid out with plain Tailwind',
          'utilities instead.',
          '',
          'The primitive reserves the box before the image arrives, using the',
          'padding-bottom percentage trick, so the surrounding text never jumps',
          'when a cover finishes loading. That matters here more than usual:',
          'images are served unoptimised because the site is a static export, so',
          'a cover can take a visible moment to paint.',
          '',
          'It only reserves space. The child still needs `h-full w-full` and an',
          '`object-fit` of its own, otherwise it sits at its intrinsic size',
          'inside a correctly shaped but empty box.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    ratio: {
      control: { type: 'number', step: 0.01 },
      description:
        'Width divided by height. Pass the division itself, `16 / 9`, rather than a rounded decimal.',
      table: { defaultValue: { summary: '1' } },
    },
    children: {
      control: false,
      description:
        'The content to shape. Give it `h-full w-full object-cover` or it will not fill the reserved box.',
    },
  },
  args: {
    ratio: 16 / 9,
  },
  decorators: [
    (Story) => (
      <div className="w-[30rem] max-w-[90vw]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A real post cover at 16 by 9, the shape the blog cards use. The wrapper sets
 * the width, the primitive derives the height.
 */
export const Default: Story = {
  args: {
    children: (
      <img
        src="/images/posts/liquid-glass-flutter-sera-que-realmente-precisamos-disso/cover.jpg"
        alt="Cover for the post about Liquid Glass in Flutter"
        className="h-full w-full rounded-lg object-cover"
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cover = canvas.getByRole('img', {
      name: /Liquid Glass in Flutter/i,
    });

    await expect(cover).toBeVisible();
  },
};

/**
 * Square, for an avatar or a package logo. Same wrapper width, so the height
 * grows to match.
 */
export const Square: Story = {
  args: {
    ratio: 1,
    children: (
      <img
        src="/images/posts/criando-um-editor-de-imagem-com-flutter-cam-covers-da-ideia-a-realidade/cover.jpg"
        alt="Cover for the post about building an image editor with Flutter"
        className="h-full w-full rounded-lg object-cover"
      />
    ),
  },
};

/**
 * A 21 by 9 banner, wide enough that `object-cover` starts discarding a real
 * part of the image. Worth previewing with the actual artwork before choosing a
 * ratio this extreme.
 */
export const UltraWide: Story = {
  args: {
    ratio: 21 / 9,
    children: (
      <img
        src="/images/posts/flutter-widgetbook-como-documentar-seu-design-system-do-jeito-certo/cover.png"
        alt="Cover for the post about documenting a design system with Widgetbook"
        className="h-full w-full rounded-lg object-cover"
      />
    ),
  },
};

/**
 * What the box looks like with nothing in it yet. This is the state the reader
 * sees between navigation and the cover finishing its download, and the reason
 * to use the primitive at all.
 */
export const EmptyPlaceholder: Story = {
  args: {
    children: (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed bg-muted text-sm text-muted-foreground">
        Cover loading
      </div>
    ),
  },
};

/**
 * The three ratios together. Each column is the same width, so the differing
 * heights are the whole point of the comparison.
 */
export const RatioComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Reference grid of the ratios the site would realistically use.',
      },
    },
  },
  args: { children: null },
  render: () => (
    <div className="grid w-full grid-cols-3 gap-4">
      {[
        { label: '1 / 1', ratio: 1 },
        { label: '4 / 3', ratio: 4 / 3 },
        { label: '16 / 9', ratio: 16 / 9 },
      ].map((item) => (
        <div key={item.label} className="flex flex-col gap-2">
          <AspectRatio ratio={item.ratio}>
            <div className="flex h-full w-full items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
              {item.label}
            </div>
          </AspectRatio>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  ),
};
