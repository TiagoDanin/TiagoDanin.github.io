import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { Footer } from './Footer';
import type { MenuItem } from './Navbar';

/**
 * The other half of the site shell. Rendered once in the root layout, below
 * every page.
 */
const menu: MenuItem[] = [
  { title: 'Home', href: '/', navbar: true, footer: true, hideOnHome: false },
  { title: 'Services', href: '/services', navbar: true, footer: true, hideOnHome: false },
  { title: 'Projects', href: '/projects', navbar: true, footer: true, hideOnHome: true },
  { title: 'Blog', href: '/blog', navbar: true, footer: true, hideOnHome: false },
  { title: 'Talks', href: '/talks', navbar: true, footer: true, hideOnHome: false },
  { title: 'Sitemap', href: '/sitemap', navbar: false, footer: true, hideOnHome: false },
];

const socialLinks = [
  { label: 'LinkedIn', url: 'https://linkedin.com/in/tiagodanin', icon: 'Linkedin' },
  { label: 'Instagram', url: 'https://instagram.com/tiagodanin', icon: 'Instagram' },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UCC2wpNWwPLPq0vjpOtGcajw',
    icon: 'Youtube',
  },
  { label: 'GitHub', url: 'https://github.com/tiagodanin', icon: 'Github' },
];

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Closing shell of every page: secondary navigation, social profiles,',
          'and the colophon.',
          '',
          'It shares one `menu` array with the Navbar and filters it twice. An',
          'entry reaches the footer when `footer` is true, and is then dropped',
          'again when `hideOnHome` is true and the current route is `/`. That',
          'second rule exists so the home page does not repeat a link the page',
          'body already shows in full: `Projects` has its own section up there,',
          'so the footer link would be the third route to the same place.',
          '',
          'The copyright year is read from `new Date()` at render time. In a',
          'static export that freezes it to the build date, which is acceptable',
          'because the site is rebuilt on every push to `main`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    menu: {
      control: 'object',
      description:
        'Full shared menu. Entries are filtered by `footer`, then again by `hideOnHome` when the route is `/`.',
    },
    socialLinks: {
      control: 'object',
      description:
        'Profiles under "Find me on". `icon` is resolved against a fixed set: Github, Linkedin, Youtube, Instagram. An unrecognised name renders nothing.',
    },
  },
  args: { menu, socialLinks },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An inner page, where the whole footer menu is shown. This is what the reader
 * sees on all but one route.
 */
export const Default: Story = {
  parameters: { nextjs: { navigation: { pathname: '/blog' } } },
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Footer' });
    await expect(nav).toBeVisible();

    // Footer-only entry, invisible in the Navbar, present here.
    await expect(canvas.getByRole('link', { name: 'Sitemap' })).toHaveAttribute(
      'href',
      '/sitemap'
    );
    // hideOnHome only bites on "/", so Projects is here.
    await expect(canvas.getByRole('link', { name: 'Projects' })).toBeVisible();
  },
};

/**
 * On the home page `Projects` disappears, because the page already carries a
 * full Projects section with its own "see all" action. Every other entry stays.
 */
export const OnHomePage: Story = {
  parameters: { nextjs: { navigation: { pathname: '/' } } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link', { name: 'Projects' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Sitemap' })).toBeVisible();
  },
};

/**
 * Entries flagged `navbar` only never reach the footer. Passing the same array
 * to both components is safe because each one filters on its own flag.
 */
export const NavbarOnlyEntriesExcluded: Story = {
  args: {
    menu: [
      { title: 'Blog', href: '/blog', navbar: true, footer: true },
      { title: 'Press kit', href: '/press-kit', navbar: true, footer: false },
    ],
  },
  parameters: { nextjs: { navigation: { pathname: '/blog' } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(canvas.queryByRole('link', { name: 'Press kit' })).not.toBeInTheDocument();
  },
};

/**
 * With no profiles configured the whole "Find me on" block is dropped, heading
 * included, so an empty collection closes the section instead of leaving a
 * label over a gap. Navigation and the colophon are unaffected.
 */
export const WithoutSocialLinks: Story = {
  args: { socialLinks: [] },
  parameters: { nextjs: { navigation: { pathname: '/about' } } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading', { name: 'Find me on' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();
    // The rest of the footer still stands.
    await expect(canvas.getByRole('link', { name: 'Blog' })).toBeVisible();
  },
};

/**
 * Every social icon is icon only, so each anchor is named by its `label`. That
 * label is the only thing a screen reader announces, which is why "GitHub" and
 * "YouTube" are spelled the way a person would read them.
 */
export const SocialLinkLabels: Story = {
  parameters: { nextjs: { navigation: { pathname: '/about' } } },
  play: async ({ canvas }) => {
    for (const link of socialLinks) {
      const anchor = canvas.getByRole('link', { name: link.label });
      await expect(anchor).toHaveAttribute('href', link.url);
      await expect(anchor).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  },
};

/**
 * The link row wraps rather than scrolling. At 320px the six entries stack into
 * three rows, each keeping the 44px touch target.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { nextjs: { navigation: { pathname: '/blog' } } },
};
