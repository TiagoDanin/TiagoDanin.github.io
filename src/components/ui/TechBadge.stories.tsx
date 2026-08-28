import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { TechBadge } from './TechBadge';

/**
 * One technology chip, coloured with that technology's own brand colour.
 *
 * Shared by the skills grid on /about and the stack block on /business, which is
 * why it lives here instead of inside either section.
 */
const meta = {
  title: 'UI/TechBadge',
  component: TechBadge,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TechBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The shape every entry in contents/skills takes. */
export const Default: Story = {
  args: { icon: 'SiFlutter', name: 'Flutter', color: '#02569B' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Flutter')).toBeInTheDocument();
  },
};

/** A dark brand colour, the other end of the contrast range in the collection. */
export const Kotlin: Story = {
  args: { icon: 'SiKotlin', name: 'Kotlin', color: '#7F52FF' },
};

/** A soft skill, which uses a lucide icon rather than a brand mark. */
export const SoftSkill: Story = {
  args: { icon: 'Users', name: 'Leadership', color: '#475569' },
};

/** Unknown icon name: the badge renders nothing rather than an empty coloured box. */
export const UnknownIcon: Story = {
  args: { icon: 'SiDoesNotExist', name: 'Ghost', color: '#02569B' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Ghost')).not.toBeInTheDocument();
  },
};
