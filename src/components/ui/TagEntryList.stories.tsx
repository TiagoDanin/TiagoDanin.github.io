import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { TagEntryList } from './TagEntryList';

/**
 * The talk, project and milestone lists on `/tags/[tag]`.
 *
 * Articles on that page keep `ArticleCard`, which carries a cover image and a
 * video badge none of the other three sources has. Everything else is a title,
 * a line of description and one label, so one list renders all of them.
 */
const meta = {
  title: 'UI/TagEntryList',
  component: TagEntryList,
  parameters: { layout: 'padded' },
  argTypes: {
    label: { description: 'Accessible name for the list: the heading sits outside it.' },
    linkLabel: {
      description:
        'Builds the overlay link label from an item title. A function so the title stays inside one translated string.',
    },
  },
} satisfies Meta<typeof TagEntryList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Projects: a platform badge, no date, since the ten collections share none. */
export const Projects: Story = {
  args: {
    label: 'Projects tagged Telegram',
    linkLabel: (title: string) => `View ${title}`,
    items: [
      {
        key: 'project:github/telegraf-test',
        title: 'Telegraf-Test',
        description: 'Testing library for Telegraf, the Telegram bot framework.',
        href: '/project/github/telegraf-test',
        badge: 'Open Source Project',
      },
      {
        key: 'project:npm/telegraf-atom',
        title: 'telegraf-atom',
        description: 'Atom feed middleware for Telegraf.',
        href: '/project/npm/telegraf-atom',
        badge: 'NPM Package',
      },
    ],
  },
};

/** Talks: the event and edition as the badge, the date as authored. */
export const Talks: Story = {
  args: {
    label: 'Talks tagged React Native',
    linkLabel: (title: string) => `View ${title}`,
    items: [
      {
        key: 'talk:construindo-listas-performaticas-no-react-native',
        title: 'Construindo listas performáticas no React Native',
        description: 'Como manter uma lista longa fluida em 60fps.',
        href: '/talk/construindo-listas-performaticas-no-react-native',
        badge: 'React Conf BR 2021',
        date: 'Nov 2021',
      },
    ],
  },
};

/** Empty renders nothing at all: the page hides the whole section instead. */
export const Empty: Story = {
  args: {
    label: 'Projects tagged Cobol',
    linkLabel: (title: string) => `View ${title}`,
    items: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument();
  },
};
