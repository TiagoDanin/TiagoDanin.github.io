import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { Card, CardContent, CardHeader } from './card';
import { Skeleton } from './skeleton';

/**
 * The loading placeholder. Available, but not rendered by a shipped page.
 */
const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A pulsing grey block that stands in for content while it loads. The',
          'entire component is `animate-pulse rounded-md bg-muted` plus whatever',
          '`className` the caller passes, so the shape is the caller\'s job: a',
          'skeleton is only useful when its footprint matches the thing it is',
          'replacing.',
          '',
          'Two things to get right when using it.',
          '',
          '**It has no accessible name.** A bare skeleton is an empty div, which',
          'a screen reader passes over in silence. Mark the region with',
          '`role="status"` and an `aria-label`, or `aria-hidden` the skeletons and',
          'announce the loading state once on the container. Rendering a dozen',
          'unlabelled boxes announces nothing at all.',
          '',
          '**`animate-pulse` runs unconditionally.** `DESIGN.md` requires',
          '`prefers-reduced-motion` to be respected for any animation, and this',
          'component does not check it. A caller that cares needs',
          '`motion-reduce:animate-none` in `className`.',
          '',
          'The site is a static export, so almost nothing loads after paint and',
          'nothing renders this today. It is imported only by `ui/sidebar.tsx`,',
          'which is unused template scaffolding.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description:
        'Carries the whole shape: width, height and corner radius. Without it the block has no size.',
    },
  },
  args: {
    className: 'h-4 w-48',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single line of placeholder text. */
export const Default: Story = {};

/**
 * A block of text: a wide first line, then a short last line, because real
 * paragraphs do not end flush. Equal-width bars read as a table, not as prose.
 */
export const TextBlock: Story = {
  render: () => (
    <div
      role="status"
      aria-label="Loading article"
      className="flex max-w-md flex-col gap-2"
    >
      <Skeleton className="h-4 w-full motion-reduce:animate-none" />
      <Skeleton className="h-4 w-full motion-reduce:animate-none" />
      <Skeleton className="h-4 w-4/5 motion-reduce:animate-none" />
    </div>
  ),
  play: async ({ canvas }) => {
    // The skeletons themselves are silent, so the region has to speak for them.
    await expect(canvas.getByRole('status', { name: 'Loading article' })).toBeVisible();
  },
};

/**
 * A circle, for an avatar slot. `rounded-full` overrides the default
 * `rounded-md` through `cn`, and matching the real avatar size is what stops the
 * layout jumping when the image arrives.
 */
export const Circle: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  ),
};

/**
 * A placeholder shaped like a `ProjectCard`: 16:9 cover, title, two lines of
 * description. The point of a skeleton is that swapping it for the real card
 * moves nothing on the page, so the proportions have to be copied, not guessed.
 */
export const ProjectCardPlaceholder: Story = {
  parameters: {
    docs: { description: { story: 'Reference shape: matches the real `ProjectCard` footprint.' } },
  },
  render: () => (
    <div
      role="status"
      aria-label="Loading projects"
      className="grid max-w-3xl gap-6 sm:grid-cols-2"
    >
      {[0, 1].map((index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="aspect-video w-full rounded-none motion-reduce:animate-none" />
          <CardHeader className="p-4">
            <Skeleton className="h-6 w-2/3 motion-reduce:animate-none" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-4 pt-0">
            <Skeleton className="h-4 w-full motion-reduce:animate-none" />
            <Skeleton className="h-4 w-3/4 motion-reduce:animate-none" />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
