import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';

/**
 * Radix Avatar. One page uses it today: `/links`, the link-in-bio page.
 */
const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A round image with a guaranteed fallback, built on Radix Avatar.',
          '',
          'The fallback is the reason to use this over a bare `img`. Radix tracks',
          'the load state of `AvatarImage` and only mounts it once the image has',
          'actually decoded; until then, and forever if the request fails,',
          '`AvatarFallback` holds the space. That matters here because the profile',
          'photo on `/links` is served from `avatars.githubusercontent.com`, a',
          'third-party host the site does not control. A broken avatar degrades to',
          'initials rather than to a torn-image glyph.',
          '',
          'Only one of the two children is ever in the DOM. Assertions have to be',
          'asynchronous: query the fallback first, then wait for the image.',
          '',
          '`Avatar` is `h-10 w-10` by default and `overflow-hidden rounded-full`,',
          'so the size is set by the caller through `className`. `/links` renders',
          'it at `w-24 h-24` with a white ring.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description:
        'Sets the size and any ring. The default is `h-10 w-10`, which is too small for a profile header.',
    },
    children: {
      control: false,
      description: 'An `AvatarImage`, an `AvatarFallback`, or both.',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default 40px avatar with a working image. The fallback is rendered in the
 * tree but swapped out as soon as the image decodes.
 */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/images/github.png" alt="Tiago Danin" />
      <AvatarFallback>TD</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    // Radix mounts the image only after it decodes, so this has to be awaited.
    await expect(await canvas.findByRole('img', { name: 'Tiago Danin' })).toBeVisible();
  },
};

/**
 * A source that will never resolve. Radix keeps the fallback mounted instead of
 * showing a broken image, which is the whole reason this primitive exists on a
 * page whose photo comes from a third-party host.
 */
export const BrokenImage: Story = {
  render: () => (
    <Avatar className="h-24 w-24">
      <AvatarImage src="/images/this-file-does-not-exist.png" alt="Tiago Danin" />
      <AvatarFallback className="text-2xl font-bold">TD</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('TD')).toBeVisible();
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
  },
};

/**
 * No image at all. Initials on the muted surface, which is what a contributor
 * with no avatar would get. The fallback inherits `rounded-full` so it fills the
 * circle rather than sitting in a square inside it.
 */
export const FallbackOnly: Story = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarFallback className="text-lg font-semibold">TD</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('TD')).toBeVisible();
  },
};

/**
 * The profile header from `/links`: 96px with a white ring and a shadow. The
 * ring is applied to `Avatar` rather than to the image, so it survives the
 * fallback state.
 */
export const ProfileHeader: Story = {
  render: () => (
    <div className="text-center">
      <Avatar className="mx-auto mb-4 h-24 w-24 shadow-lg ring-4 ring-background">
        <AvatarImage src="/images/github.png" alt="Tiago Danin" />
        <AvatarFallback className="text-2xl font-bold">TD</AvatarFallback>
      </Avatar>
      <p className="text-2xl font-bold">Tiago Danin</p>
      <p className="text-sm text-muted-foreground">Mobile Developer, Bug Hunter</p>
    </div>
  ),
};

/**
 * Four sizes from the default 40px up to the profile 96px. The component sets no
 * intrinsic size beyond `h-10 w-10`, so every other size is a caller decision.
 */
export const Sizes: Story = {
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Reference grid of the sizes in use.' } },
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      {['h-8 w-8', 'h-10 w-10', 'h-16 w-16', 'h-24 w-24'].map((size) => (
        <Avatar key={size} className={size}>
          <AvatarImage src="/images/github.png" alt="Tiago Danin" />
          <AvatarFallback>TD</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
