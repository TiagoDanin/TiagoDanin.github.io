import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { BusinessProcess } from './BusinessProcess';
import { PROCESS } from './fixtures';

/** The four contract steps, numbered, as an ordered list rather than a card grid. */
const meta = {
  title: 'Sections/Business/BusinessProcess',
  component: BusinessProcess,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BusinessProcess>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Four steps across one row on desktop, two columns on tablet. */
export const Default: Story = {
  args: {
    title: 'Como um projeto corre',
    note: 'Quatro etapas, iguais em todo contrato.',
    steps: PROCESS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('01')).toBeInTheDocument();
    await expect(canvas.getByText('04')).toBeInTheDocument();
  },
};
