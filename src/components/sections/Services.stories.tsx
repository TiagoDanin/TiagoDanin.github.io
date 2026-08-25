import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { Services, type ExpertiseItem } from './Services';

const expertise: ExpertiseItem[] = [
  {
    title: 'Mobile Development',
    description:
      'Native Android and iOS (Kotlin, Swift) and cross-platform (Flutter, React Native) shipped to production.',
    icon: 'Smartphone',
    link: '/mobile',
  },
  {
    title: 'Full Stack Development',
    description:
      'End-to-end web in React and Node.js, plus the database layer that holds it together.',
    icon: 'Code',
    link: '/web-development',
  },
  {
    title: 'Cybersecurity',
    description:
      'Bug hunting, penetration testing, and secure coding reviews on production systems.',
    icon: 'Shield',
    link: '/cybersecurity',
  },
  {
    title: 'DevOps & CI/CD',
    description:
      'Pipelines, cloud infra, and the build/test/deploy loop that keeps releases boring.',
    icon: 'Zap',
    link: '/services',
  },
];

const meta = {
  title: 'Sections/Services',
  component: Services,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The four-up expertise grid on the home page, backed by the',
          '`expertise` collection.',
          '',
          'The symmetric grid is deliberate and documented in DESIGN.md: the',
          'general ban on identical card grids does not apply here, because the',
          'variation is meant to happen inside the card, through a different',
          'icon per category and fact-first copy.',
          '',
          'The one behavioural fork is `link`. A card with a route renders as an',
          'anchor: focusable, with a hover lift and a heading that shifts to',
          'primary. A card without one renders as a plain `div` and is not',
          'reachable by keyboard, because there is nowhere for it to go. That is',
          'the honest-affordance rule from DESIGN.md, so do not add a hover',
          'state to the static branch to make the row look uniform.',
          '',
          'Icons are resolved by name against a bundled set of four. An',
          'unrecognised name is not an error: the icon tile renders empty.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    expertise: {
      control: 'object',
      description:
        'Cards in render order. `title` doubles as the React key, so it has to be unique. `icon` is one of Code, Smartphone, Shield, Zap. `link` is optional and decides whether the card is interactive.',
    },
  },
  args: { expertise },
} satisfies Meta<typeof Services>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The production grid: four categories, four different icons, every card
 * pointing at its own service page.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const cards = canvas.getAllByRole('link');
    await expect(cards).toHaveLength(4);

    await expect(canvas.getByRole('link', { name: /Mobile Development/ })).toHaveAttribute(
      'href',
      '/mobile'
    );
    await expect(canvas.getByRole('link', { name: /Cybersecurity/ })).toHaveAttribute(
      'href',
      '/cybersecurity'
    );
    await expect(canvas.getByRole('heading', { level: 2, name: 'My Expertise' })).toBeVisible();
  },
};

/**
 * Every card without a `link`. The whole grid drops out of the tab order and
 * renders as static panels, which is the intended behaviour when a category has
 * no page of its own yet.
 *
 * Compare with Default: the copy and the layout are identical, only the
 * affordance changes.
 */
export const StaticCards: Story = {
  args: {
    expertise: expertise.map(({ link: _link, ...rest }) => rest),
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('link')).toHaveLength(0);
    // The content is still there; only the destination is gone.
    await expect(canvas.getByRole('heading', { name: 'Cybersecurity' })).toBeVisible();
  },
};

/**
 * A mixed row, which is what happens the moment one service page ships before
 * the others. Two cards are links and two are not, and the difference is
 * visible only on hover and focus.
 */
export const MixedLinkage: Story = {
  args: {
    expertise: [
      expertise[0],
      { ...expertise[1], link: undefined },
      expertise[2],
      { ...expertise[3], link: undefined },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
    await expect(canvas.getByRole('heading', { name: 'Full Stack Development' })).toBeVisible();
  },
};

/**
 * An icon name outside the bundled set. Nothing throws: the tinted 48px tile
 * still renders, just empty. Easy to miss in review, so this is what a typo in
 * the CMS looks like.
 */
export const UnknownIcon: Story = {
  args: {
    expertise: [
      { ...expertise[0], icon: 'Rocket' },
      expertise[1],
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Mobile Development' })).toBeVisible();
  },
};

/**
 * A single card. The grid does not stretch it, so it sits at one quarter width
 * on desktop with the rest of the row empty. Only ship counts that divide the
 * four column grid cleanly.
 */
export const SingleCard: Story = {
  args: { expertise: [expertise[2]] },
};

/**
 * Long copy in every card. The grid rows equalise, so the tallest card sets the
 * height and the short ones gain trailing whitespace rather than clipping.
 */
export const LongDescriptions: Story = {
  args: {
    expertise: expertise.map((item) => ({
      ...item,
      description: `${item.description} Delivered on real products, with the release pipeline, the store review process, and the post-launch crash triage included rather than handed off.`,
    })),
  },
};

/**
 * At 320px the grid collapses to one column and the cards read as a stack. Each
 * linked card keeps a 44px minimum target.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
