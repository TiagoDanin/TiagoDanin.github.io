import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from 'storybook/test';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

/**
 * Page navigation built from anchors rather than buttons, so every page of the
 * blog stays a real URL a crawler can follow.
 */
const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'The blog does paginate, at `/blog/[page]`, but it links between pages',
          'by hand instead of using this component.',
          '',
          'Every item is an `<a href>` styled with `buttonVariants`, not a',
          'button. That is deliberate on a statically exported site: each page',
          'is pre-rendered at its own URL, so the links have to be crawlable and',
          'openable in a new tab.',
          '',
          '`isActive` does two things at once. It swaps the visual variant from',
          '`ghost` to `outline`, and it sets `aria-current="page"`, which is how',
          'a screen reader user knows which page they are on. Never style the',
          'current page by hand and skip the prop.',
          '',
          'The ellipsis is `aria-hidden` with an `sr-only` "More pages" label,',
          'so the gap is announced once and the three dots are never read out as',
          'punctuation.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description: 'Always a single `PaginationContent` holding the items.',
    },
  },
  args: {},
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Page 2 of a five page blog index. Both arrows are live and the current page
 * is marked with `aria-current`.
 */
export const Default: Story = {
  args: {
    children: (
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="/blog" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog/2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog/3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="/blog/3" />
        </PaginationItem>
      </PaginationContent>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nav = canvas.getByRole('navigation', { name: 'pagination' });
    await expect(nav).toBeVisible();

    await expect(canvas.getByRole('link', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await expect(canvas.getByRole('link', { name: '1' })).not.toHaveAttribute(
      'aria-current'
    );

    // The arrows carry explicit labels, since "Previous" beside a chevron is
    // ambiguous out of context.
    await expect(
      canvas.getByRole('link', { name: 'Go to previous page' })
    ).toBeVisible();
    await expect(
      canvas.getByRole('link', { name: 'Go to next page' })
    ).toBeVisible();
  },
};

/**
 * First page. The previous arrow has nowhere to go, so it is dropped entirely
 * rather than rendered in a disabled state: an anchor has no disabled attribute
 * and a link that does nothing is worse than no link.
 */
export const FirstPage: Story = {
  args: {
    children: (
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="/blog" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog/2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog/3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="/blog/2" />
        </PaginationItem>
      </PaginationContent>
    ),
  },
};

/**
 * A long run of pages, collapsed around the current one. This is the shape to
 * reach for once the blog passes roughly seven pages.
 */
export const WithEllipsis: Story = {
  args: {
    children: (
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="/blog/5" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog/5">5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog/6" isActive>
            6
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog/7">7</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/blog/12">12</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="/blog/7" />
        </PaginationItem>
      </PaginationContent>
    ),
  },
};

/**
 * Two pages, the smallest run worth rendering. With a single page the whole
 * component should be omitted, not rendered with everything inert.
 */
export const TwoPages: Story = {
  args: {
    children: (
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="/talks" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/talks/2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="/talks/2" />
        </PaginationItem>
      </PaginationContent>
    ),
  },
};

type ClientPagerProps = {
  onNavigate: (page: number) => void;
};

/**
 * A client-side pager, used here so the interaction can be driven without the
 * story frame navigating away. On the real site these are plain links and the
 * router does the work.
 */
function ClientPager({ onNavigate }: ClientPagerProps) {
  const [page, setPage] = React.useState(2);
  const pages = [1, 2, 3, 4];

  const go = (next: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPage(next);
    onNavigate(next);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={go(Math.max(1, page - 1))}
          />
        </PaginationItem>
        {pages.map((entry) => (
          <PaginationItem key={entry}>
            <PaginationLink
              href="#"
              isActive={entry === page}
              onClick={go(entry)}
            >
              {entry}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={go(Math.min(pages.length, page + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/**
 * Selecting a page with the mouse and then with the keyboard. The assertion is
 * that `aria-current` moved, not just that the outline moved, because the
 * outline alone tells a screen reader user nothing.
 */
export const SelectingAPage: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story:
          'Clicks page 4, then tabs to the next arrow and activates it with Enter, asserting the current page marker each time.',
      },
    },
  },
  render: () => <ClientPager onNavigate={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page'
    );

    await userEvent.click(canvas.getByRole('link', { name: '4' }));

    await expect(canvas.getByRole('link', { name: '4' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await expect(canvas.getByRole('link', { name: '2' })).not.toHaveAttribute(
      'aria-current'
    );

    // Keyboard path: every item is an anchor, so Tab reaches it and Enter
    // activates it with no key handler of our own.
    const previous = canvas.getByRole('link', { name: 'Go to previous page' });
    previous.focus();
    await expect(previous).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('link', { name: '3' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  },
};
