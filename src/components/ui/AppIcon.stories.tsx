import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { AppIcon } from './AppIcon';

/**
 * The launcher icon on `/apps` and `/app/[appId]`.
 *
 * Apps on Google Play show their store icon. An app with no artwork falls back
 * to its emoji on a tile tinted with the accent colour.
 */
const meta = {
  title: 'UI/AppIcon',
  component: AppIcon,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AppIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tomely's store icon, at the size the app page hero uses. */
export const StoreIcon: Story = {
  args: {
    name: 'Tomely',
    image: '/images/apps/tomely/icon.webp',
    emoji: '💊',
    accentColor: '#14B8A6',
    size: 128,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Tomely' })).toHaveAttribute(
      'src',
      expect.stringContaining('/images/apps/tomely/icon.webp')
    );
  },
};

/** The list card size on `/apps`. */
export const Small: Story = {
  args: {
    name: 'FlyControl',
    image: '/images/apps/flycontrol/icon.webp',
    emoji: '🎈',
    accentColor: '#7C3AED',
    size: 56,
  },
};

/** No icon file: the emoji on the accent tile, still announced by name. */
export const EmojiFallback: Story = {
  args: {
    name: 'Petmob',
    emoji: '🐾',
    accentColor: '#8B5CF6',
    size: 96,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Petmob' })).toHaveTextContent('🐾');
  },
};
