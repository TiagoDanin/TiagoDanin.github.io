import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { BusinessFit } from './BusinessFit';
import { FIT } from './fixtures';

/**
 * Who the work suits and who it does not.
 *
 * The two columns are derived, not authored: an entry whose label starts with
 * "Não" or "Not" lands on the right. Stating the limits is what makes the left
 * column credible, so the section is only worth shipping with both halves.
 */
const meta = {
  title: 'Sections/Business/BusinessFit',
  component: BusinessFit,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BusinessFit>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three and three, the shape the collection ships. */
export const Default: Story = {
  args: {
    title: 'Quando faz sentido me chamar, e quando não faz',
    note: 'Três casos que funcionam bem e três em que eu não sou a pessoa certa. Prefiro que você leia isso antes de escrever.',
    items: FIT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(6);
    await expect(canvas.getByText('Projeto com escopo fechado')).toBeInTheDocument();
  },
};

/** English labels, which the split reads through the "Not this" prefix instead. */
export const English: Story = {
  args: {
    title: 'Who this works for, and who it does not',
    note: 'Three cases that work well, and three where I am not the right person.',
    items: [
      {
        title: 'A project with a closed scope',
        detail:
          'You know roughly what the app has to do, and you want a price, a deadline and a list of exclusions in writing before anything starts.',
      },
      {
        title: 'A codebase somebody else wrote',
        detail:
          'Your app is failing store review, or the developer who built it is gone. I read it and tell you what I find.',
      },
      {
        title: 'Not this: a developer allocated to your squad',
        detail:
          'What I sell is scoped work. Renting a seat by the month gets the same answer.',
      },
    ],
  },
};

/** Only positives authored: the second column collapses rather than rendering empty. */
export const WithoutLimits: Story = {
  args: { ...Default.args, items: FIT.slice(0, 3) },
};
