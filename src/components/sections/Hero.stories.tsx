import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { Hero, type HeroSocialLink, type HeroStat } from './Hero';

const socialLinks: HeroSocialLink[] = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/tiagodanin', icon: 'Linkedin' },
  { label: 'GitHub', url: 'https://github.com/tiagodanin', icon: 'Github' },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UCC2wpNWwPLPq0vjpOtGcajw',
    icon: 'Youtube',
  },
  { label: 'Instagram', url: 'https://instagram.com/tiagodanin', icon: 'Instagram' },
];

/** The four counts `getHeroData()` totals across ten project collections. */
const stats: HeroStat[] = [
  { value: '2.4M+', label: 'npm downloads' },
  { value: '250+', label: 'projects' },
  { value: '31', label: 'posts & videos' },
  { value: '18', label: 'talks' },
];

const meta = {
  title: 'Sections/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Opening block of both the home page and /about: name, bio, the four',
          'derived counts, and the orbiting avatar.',
          '',
          'Three details drive most of the behaviour here:',
          '',
          '- **The bio is split on blank lines.** The first paragraph renders as',
          '  the large lede; everything after it drops to muted body copy. A bio',
          '  with no blank line is therefore all lede, which is what the home',
          '  page ships.',
          '- **The h1 is split in two.** A visually hidden span carries',
          '  `name - seoDescription` for search engines and screen readers, and',
          '  an `aria-hidden` span shows the name alone. That keeps the',
          '  typographic display line short without costing the page its',
          '  descriptive heading.',
          '- **`stats` are pre-formatted strings.** Rounding and the `+` suffix',
          '  happen in `getHeroData()`, so the component never does arithmetic',
          '  and a number shown here is always one the collections can back.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    about: {
      control: 'object',
      description:
        'Profile copy from the `about` collection. `bio` is blank-line separated; `seoDescription` continues the h1 for screen readers only.',
    },
    stats: {
      control: 'object',
      description:
        'Counts derived from the collections at build time and rendered verbatim as a description list.',
    },
    socialLinks: {
      control: 'object',
      description:
        'Profile row under the avatar. `icon` must be one of Github, Linkedin, Youtube, Instagram; anything else renders nothing.',
    },
    showPressKit: {
      control: 'boolean',
      description:
        'Adds the third action. Only /about turns it on, so the home page keeps two competing CTAs instead of three.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    about: {
      name: 'Tiago Danin',
      roles: ['Mobile Developer', 'Bug Hunter'],
      bio: 'I build mobile apps, maintain open source, and report security bugs. Native (Java, Kotlin, Swift) and cross-platform (React Native, Flutter).',
      seoDescription: 'Expert Mobile & Full Stack Developer, Bug Hunter',
      avatar: 'https://avatars.githubusercontent.com/u/5731176?v=4',
    },
    stats,
    socialLinks,
    showPressKit: false,
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The home page hero. The bio has no blank line, so all of it is the lede and
 * the muted secondary block is absent entirely.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    // The accessible heading is the sr-only half, not the displayed name.
    await expect(
      canvas.getByRole('heading', {
        level: 1,
        name: 'Tiago Danin - Expert Mobile & Full Stack Developer, Bug Hunter',
      })
    ).toBeInTheDocument();

    await expect(canvas.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
      'href',
      '#contact'
    );
    await expect(canvas.getByRole('link', { name: 'View my projects' })).toHaveAttribute(
      'href',
      '/projects'
    );
    await expect(canvas.queryByRole('link', { name: /press kit/i })).not.toBeInTheDocument();

    await expect(canvas.getByAltText('Tiago Danin profile photo')).toBeInTheDocument();
  },
};

/**
 * Same content with the bio written as three paragraphs. Only the first keeps
 * the large lede treatment; the rest render as a muted block below it, which is
 * how a longer /about bio degrades without a second layout.
 */
export const MultiParagraphBio: Story = {
  args: {
    about: {
      name: 'Tiago Danin',
      roles: ['Mobile Developer', 'Bug Hunter'],
      bio: [
        'I build mobile apps, maintain open source, and report security bugs. Native (Java, Kotlin, Swift) and cross-platform (React Native, Flutter).',
        'Most of my public work is npm: telegraf plugins, locale-codes, and around seventy other packages that other people depend on in production.',
        'On the security side I report through HackerOne and run CTFs locally in Belém. Same reflex as maintaining a package: read the thing until it stops surprising you.',
      ].join('\n\n'),
      seoDescription: 'Expert Mobile & Full Stack Developer, Bug Hunter',
      avatar: 'https://avatars.githubusercontent.com/u/5731176?v=4',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/^I build mobile apps/)).toBeVisible();
    await expect(canvas.getByText(/Most of my public work is npm/)).toBeVisible();
    await expect(canvas.getByText(/report through HackerOne/)).toBeVisible();
  },
};

/**
 * The /about variant. `showPressKit` adds a third action, which is only
 * acceptable on a page a journalist lands on deliberately.
 */
export const WithPressKit: Story = {
  args: { showPressKit: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /press kit/i })).toHaveAttribute(
      'href',
      '/press-kit'
    );
  },
};

/**
 * Before any project collection has been fetched, `getHeroData()` still returns
 * an array, just an empty one. The stats rule stays, so the border above it
 * reads as a stray divider. Worth seeing before assuming the section survives a
 * failed data fetch gracefully.
 */
export const WithoutStats: Story = {
  args: { stats: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('npm downloads')).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'View my projects' })).toBeVisible();
  },
};

/**
 * A single role and one profile link. The role line is `aria-hidden`, because
 * the same words already reach assistive technology through `seoDescription`
 * inside the h1; repeating them would announce the job title twice.
 */
export const MinimalProfile: Story = {
  args: {
    about: {
      name: 'Tiago Danin',
      roles: ['Mobile Developer'],
      bio: 'Flutter and React Native, shipped to production since 2017.',
      seoDescription: 'Mobile Developer',
      avatar: 'https://avatars.githubusercontent.com/u/5731176?v=4',
    },
    socialLinks: [
      { label: 'GitHub', url: 'https://github.com/tiagodanin', icon: 'Github' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link', { name: 'GitHub' })).toHaveLength(1);
  },
};

/**
 * Below `sm` the avatar column drops under the copy, the two actions stack, and
 * the stats grid folds from four columns to two. Both actions keep the 44px
 * touch target.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
