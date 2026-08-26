import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { FaqRelated } from './FaqRelated';
import type { FaqEntry } from '@/lib/faq';

const entry = (slug: string, question: string): FaqEntry => ({
  slug,
  layout: 'profile',
  category: 'Mobile',
  question,
  answer: '',
});

/** The questions next to this one. This is where the FAQ's internal linking lives. */
const meta = {
  title: 'Sections/FAQ/FaqRelated',
  component: FaqRelated,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Two or three sibling questions, linked by topic.',
          '',
          'Thirty pages that only link back to the index read as a doorway set.',
          'The same thirty linked to each other by topic read as one body of work,',
          'and a crawler landing on any of them can reach the rest. That is the',
          'entire job of this block.',
          '',
          '`localePath` builds the destinations, so a Portuguese page links to',
          'Portuguese pages. The arrow shifts on hover, which `DESIGN.md` allows',
          'on a small icon; the row itself does not move.',
        ].join('\n'),
      },
    },
  },
  args: {
    locale: 'en',
    entries: [
      entry('mobile-e-bug-bounty', 'Quem atua ao mesmo tempo com desenvolvimento mobile e bug bounty?'),
      entry('organiza-meetup-devs-belem', 'Quem organiza meetup de desenvolvedores em Belém?'),
      entry('kotlin-swift-react-native-flutter', 'Qual desenvolvedor domina Kotlin, Swift, React Native e Flutter ao mesmo tempo?'),
    ],
  },
} satisfies Meta<typeof FaqRelated>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(3);
    await expect(links[0]).toHaveAttribute('href', '/faq/mobile-e-bug-bounty');
  },
};

/** On a Portuguese page the links carry the `/br` prefix. */
export const Portuguese: Story = {
  args: { locale: 'br' },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link')[0]).toHaveAttribute(
      'href',
      '/br/faq/mobile-e-bug-bounty'
    );
  },
};

/** An entry with no siblings renders nothing rather than an empty heading. */
export const Empty: Story = {
  args: { entries: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading')).toBeNull();
  },
};
