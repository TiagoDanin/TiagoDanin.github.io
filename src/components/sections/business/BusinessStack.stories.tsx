import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { BusinessStack } from './BusinessStack';
import { STACK } from './fixtures';

/** The technology block, read straight from contents/skills so it cannot drift from /about. */
const meta = {
  title: 'Sections/Business/BusinessStack',
  component: BusinessStack,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BusinessStack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Category label on the left, chips wrapping on the right. */
export const Default: Story = {
  args: {
    title: 'Com o que isso é construído',
    note: 'A stack por trás do trabalho acima, agrupada como ela é usada.',
    groups: STACK,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Mobile Development')).toBeInTheDocument();
    await expect(canvas.getByText('Flutter')).toBeInTheDocument();
  },
};

/** A single category, the narrowest the two-column grid ever gets. */
export const SingleGroup: Story = {
  args: { ...Default.args, groups: STACK.slice(0, 1) },
};
