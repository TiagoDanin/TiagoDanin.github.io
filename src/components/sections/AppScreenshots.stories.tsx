import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { AppScreenshots } from './AppScreenshots';

/**
 * The screenshot strip on `/app/[appId]`.
 *
 * The images are the store's own, converted to WebP under
 * `/images/apps/<slug>/`. An app whose screenshots differ by language keeps
 * them in `en/` and `br/`, and each locale file of the collection points at its
 * own set.
 */
const meta = {
  title: 'Sections/AppScreenshots',
  component: AppScreenshots,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppScreenshots>;

export default meta;
type Story = StoryObj<typeof meta>;

const shot = (slug: string, dir: string, n: number, width: number, height: number) => ({
  src: `/images/apps/${slug}/${dir}screenshot-${n}.webp`,
  width,
  height,
  alt: `Screenshot ${n}`,
});

/** Five portrait phone screens, more than fit the container, so the strip scrolls. */
export const Tomely: Story = {
  args: {
    title: 'Screenshots',
    label: 'Tomely screenshots',
    screenshots: [1, 2, 3, 4, 5].map((n) => shot('tomely', 'en/', n, 720, 1280)),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const strip = canvas.getByRole('region', { name: 'Tomely screenshots' });

    await expect(within(strip).getAllByRole('img')).toHaveLength(5);
    // Focusable, so the arrow keys can scroll it.
    await expect(strip).toHaveAttribute('tabindex', '0');
  },
};

/** Two captures only: the strip does not need to scroll. */
export const TwoScreens: Story = {
  args: {
    title: 'Screenshots',
    label: 'The Slime Dungeon screenshots',
    screenshots: [1, 2].map((n) => shot('the-slime-dungeon', '', n, 590, 1280)),
  },
};

/** No screenshots: the section renders nothing rather than an empty heading. */
export const Empty: Story = {
  args: {
    title: 'Screenshots',
    label: 'Petmob screenshots',
    screenshots: [],
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('section')).toBeNull();
  },
};
