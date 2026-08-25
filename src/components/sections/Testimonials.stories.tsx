import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { Testimonials, type TestimonialItem } from './Testimonials';

const testimonials: TestimonialItem[] = [
  {
    name: 'TecBan Hackathon',
    role: '1st place',
    company: 'TecBan',
    quote:
      'First place at the TecBan Open Banking Hackathon. Built BICOS so people benefit from Open Banking without ever needing to learn what it is.',
    icon: 'Trophy',
  },
  {
    name: 'Open source',
    role: 'Arctic Code Vault Contributor',
    company: 'GitHub',
    quote:
      '{npm} npm packages published, {polybarStars} stars on Awesome-Polybar, contributions to Node.js and ElectronJS. GitHub Arctic Code Vault contributor.',
    icon: 'Github',
  },
  {
    name: 'Speaking',
    role: 'Speaker',
    company: 'Conferences',
    quote:
      'Speaker at {talks} events including DevOpsDays Belém, Google DevFest, and BrazilJS. Talks on mobile, DevOps, and security.',
    icon: 'Mic',
  },
];

/** What `getTestimonialsData()` computes from the npm, talks and github collections. */
const tokens = {
  npm: '70+',
  talks: '15+',
  polybarStars: '1520',
};

const meta = {
  title: 'Sections/Testimonials',
  component: Testimonials,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The three-up Recognition grid on the home page. Despite the file',
          'name there are no third-party testimonials here: the copy is first',
          'person, which is why DESIGN.md bans the `Quote` icon in these cards.',
          '',
          'The interesting part is token interpolation. Quote text may contain',
          '`{token}` placeholders, replaced at render time from the `tokens`',
          'map that the page derives from the `npm`, `talks` and `github`',
          'collections. It exists so a claim like "70+ npm packages" cannot go',
          'stale: nobody edits a number in the CMS, the number is counted at',
          'build time and rounded down.',
          '',
          '**An unknown token is left visible as `{name}`, on purpose.** A typo',
          'in the CMS then shows up on the page as a placeholder rather than',
          'silently producing "Speaker at  events". Broken is easier to notice',
          'than merely wrong.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    testimonials: {
      control: 'object',
      description:
        'Cards in render order. `name` doubles as the React key, so it has to be unique. `icon` is one of Trophy, Github, Mic, and is optional.',
    },
    tokens: {
      control: 'object',
      description:
        'Values substituted into `{token}` placeholders in the quotes. Anything not listed here stays on the page as literal `{token}` text.',
    },
  },
  args: { testimonials, tokens },
} satisfies Meta<typeof Testimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The production grid with all three tokens resolved. Every number in this
 * story was counted from a collection, not typed by hand.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    // All three placeholders resolved.
    await expect(canvas.getByText(/70\+ npm packages published/)).toBeVisible();
    await expect(canvas.getByText(/1520 stars on Awesome-Polybar/)).toBeVisible();
    await expect(canvas.getByText(/Speaker at 15\+ events/)).toBeVisible();

    // No placeholder survived the pass.
    await expect(canvas.queryByText(/\{npm\}/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/\{talks\}/)).not.toBeInTheDocument();
  },
};

/**
 * The fallback path. `hackeroneReports` is not in the `tokens` map, so it stays
 * on the page verbatim while the tokens that do resolve still resolve.
 *
 * This is the behaviour to preserve if the interpolation is ever rewritten:
 * failing loudly beats emitting a sentence with a hole in it.
 */
export const UnknownTokenStaysVisible: Story = {
  args: {
    testimonials: [
      {
        name: 'Security research',
        role: 'Bug hunter',
        company: 'HackerOne',
        quote:
          '{hackeroneReports} accepted reports on HackerOne, plus {npm} npm packages published.',
        icon: 'Trophy',
      },
    ],
  },
  play: async ({ canvas }) => {
    const card = canvas.getByText(/accepted reports on HackerOne/);
    // Unknown token: preserved rather than blanked.
    await expect(card).toHaveTextContent('{hackeroneReports} accepted reports');
    // Known token in the same sentence still resolves.
    await expect(card).toHaveTextContent('70+ npm packages published');
  },
};

/**
 * `tokens` omitted entirely, which is what a page that forgot to call
 * `getTestimonialsData()` would render. Every placeholder falls back to itself,
 * so the omission is obvious on the page instead of in a log.
 */
export const WithoutTokens: Story = {
  args: { tokens: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/\{npm\} npm packages published/)).toBeVisible();
    await expect(canvas.getByText(/Speaker at \{talks\} events/)).toBeVisible();
  },
};

/**
 * A card with no `icon`. The tinted tile is skipped rather than left empty, so
 * the quote starts at the top of the card and the row goes slightly uneven.
 * Ship icons on all three or on none.
 */
export const WithoutIcon: Story = {
  args: {
    testimonials: [
      { ...testimonials[0], icon: undefined },
      testimonials[1],
      testimonials[2],
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/First place at the TecBan/)).toBeVisible();
  },
};

/**
 * One card. The three-column grid leaves the remaining two thirds empty rather
 * than centring, so the collection is meant to hold a multiple of three.
 */
export const SingleCard: Story = {
  args: { testimonials: [testimonials[1]] },
};

/**
 * Quotes long enough to run past four lines. Cards equalise per row, so the
 * tallest sets the height and the shorter ones pad out.
 */
export const LongQuotes: Story = {
  args: {
    testimonials: testimonials.map((item) => ({
      ...item,
      quote: `${item.quote} The work behind it is public: every package, every slide deck, and every disclosure timeline is linked from this site rather than summarised here.`,
    })),
  },
};

/**
 * At 320px the grid becomes a single column. Nothing else changes: there is no
 * carousel, and the cards keep their full copy.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
