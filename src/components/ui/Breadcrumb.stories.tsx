import type { Meta, StoryObj } from '@storybook/nextjs';
import { Slash } from 'lucide-react';
import { expect, within } from 'storybook/test';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

/**
 * Trail of ancestor pages. The project routes on this site are three levels
 * deep, which is exactly the depth where a trail starts earning its space.
 */
const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'The deepest routes here are `/project/[type]/[slug]` and',
          '`/timeline/[year]/[slug]`, both of which would read better with one.',
          '',
          'The root is a `<nav aria-label="breadcrumb">` wrapping an ordered',
          'list, which is what lets a screen reader announce it as a landmark',
          'and skip it. The separators carry `aria-hidden` and',
          '`role="presentation"` so the chevrons are never read out as content.',
          '',
          '`BreadcrumbPage` is the current page and is deliberately not a link:',
          'it renders a `span` with `aria-current="page"`. Using a link that',
          'points at the page you are already on is the mistake this component',
          'exists to prevent.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    separator: {
      control: false,
      description:
        'Declared on the root type but never read. Pass custom separators as children of `BreadcrumbSeparator` instead.',
    },
    children: {
      control: false,
      description: 'Always a single `BreadcrumbList`.',
    },
  },
  args: {},
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The real shape of a project page: `/project/github/telegram-bot-api`. Three
 * links and a leaf, which is the longest trail the site can produce.
 */
export const Default: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/project/github">GitHub</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>telegram-bot-api</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nav = canvas.getByRole('navigation', { name: 'breadcrumb' });
    await expect(nav).toBeVisible();

    // The leaf is not a link, so it is queried by its current-page marker.
    const current = canvas.getByText('telegram-bot-api');
    await expect(current).toHaveAttribute('aria-current', 'page');

    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'href',
      '/projects'
    );
  },
};

/**
 * Two levels, which is what a blog post would get. Short enough that the trail
 * adds orientation without competing with the title below it.
 */
export const TwoLevels: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            Criando um agente de IA no Claude Code
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
};

/**
 * Collapsed middle. Once a trail passes four items the interesting parts are
 * the first and the last, so the rest folds into an ellipsis that is hidden
 * from assistive technology and carries an `sr-only` label of its own.
 */
export const Collapsed: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/timeline/2024">2024</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Google Developer Expert nomination</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
};

/**
 * A slash instead of the default chevron. The separator renders whatever it is
 * given as children and falls back to `ChevronRight` when given nothing.
 */
export const CustomSeparator: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">tiagodanin.com</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/talks">Talks</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Flutter Conf BR 2024</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
};

/**
 * A single item, which happens on a top level page. The trail degrades to the
 * page name with no separators, and is arguably not worth rendering at all at
 * this depth.
 */
export const SingleItem: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Press kit</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
};

/**
 * A long slug. The list wraps rather than overflowing, because
 * `BreadcrumbList` is a flex container with `flex-wrap` and `break-words`.
 */
export const LongTrail: Story = {
  parameters: { layout: 'padded' },
  args: {
    className: 'max-w-md',
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/blog/tags/flutter">flutter</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            Criando um editor de imagem com Flutter, Cam Covers, da ideia a
            realidade
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
};
