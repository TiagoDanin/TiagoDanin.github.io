import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, screen, userEvent } from 'storybook/test';

import { Navbar, type MenuItem } from './Navbar';

/**
 * The site shell's top bar, rendered once in the root layout and therefore
 * present on every route.
 *
 * The full menu comes from the `menu` collection, which is a single list shared
 * with the footer. Each entry carries its own `navbar` and `footer` flags, so
 * the same JSON drives both, and the Navbar only renders the entries flagged
 * `navbar`. That is why `Sitemap` never appears here: it is footer-only.
 */
const menu: MenuItem[] = [
  { title: 'Home', href: '/', navbar: true, footer: true, hideOnHome: false },
  { title: 'Services', href: '/services', navbar: true, footer: true, hideOnHome: false },
  { title: 'Projects', href: '/projects', navbar: true, footer: true, hideOnHome: true },
  { title: 'Blog', href: '/blog', navbar: true, footer: true, hideOnHome: false },
  { title: 'Talks', href: '/talks', navbar: true, footer: true, hideOnHome: false },
  { title: 'Sitemap', href: '/sitemap', navbar: false, footer: true, hideOnHome: false },
];

const meta = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      // The bar is `position: fixed`, so inline docs blocks would stack every
      // story on top of each other at the top of the page. An iframe per story
      // gives each one its own viewport to pin itself to.
      story: { inline: false, height: '140px' },
      description: {
        component: [
          'Fixed navigation bar for the whole site, mounted in `src/app/layout.tsx`.',
          '',
          'Two behaviours are worth knowing before changing it:',
          '',
          '1. **Active route matching is prefix based.** `/blog` stays marked as',
          '   the current page on `/blog/2`, `/blog/tags/flutter` and',
          '   `/blog/pt`. Only `/` is matched exactly, otherwise the home link',
          '   would be active everywhere.',
          '2. **The mobile menu is a Radix Sheet.** Below `md` the inline links',
          '   are hidden and the same list is re-rendered inside a portal, so',
          '   there are two copies of every link in the DOM at all times. Only',
          '   one is ever in the accessibility tree.',
          '',
          'The component is a client component: it reads `usePathname()` and',
          'tracks `window.scrollY` to swap between the flat and the translucent',
          'blurred surface. The scrolled state cannot be reproduced in a story',
          'because the frame has nothing to scroll.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    menu: {
      control: 'object',
      description:
        'Full shared menu. Entries without `navbar: true` are filtered out, so the same array can be passed to the Footer unchanged.',
    },
  },
  args: { menu },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The bar as it renders on the home page. `Sitemap` is in the menu array but
 * carries `navbar: false`, so it is absent here and present in the footer.
 */
export const Default: Story = {
  parameters: { nextjs: { navigation: { pathname: '/' } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await expect(canvas.getByRole('link', { name: 'Blog' })).not.toHaveAttribute('aria-current');

    // Footer-only entry: filtered out by the `navbar` flag, not by CSS.
    await expect(canvas.queryByRole('link', { name: 'Sitemap' })).not.toBeInTheDocument();

    // The wordmark is a separate link with its own label, so it never collides
    // with the "Home" nav item for assistive technology.
    await expect(canvas.getByRole('link', { name: 'Tiago Danin home' })).toBeVisible();
  },
};

/**
 * On a section index the matching entry takes `aria-current="page"` and the
 * blue underline. The home link drops back to muted, which the exact match on
 * `/` is there to guarantee.
 */
export const SectionActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/blog' } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Blog' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await expect(canvas.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  },
};

/**
 * Prefix matching in action: a tag page nested three levels under `/blog` keeps
 * `Blog` marked as current, so the reader never loses the section they are in.
 */
export const NestedRouteActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/blog/tags/flutter' } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Blog' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  },
};

/**
 * Portuguese routes live under a `/br` prefix, and the menu hrefs carry it too.
 * Matching strips the locale from both sides, so a section is current in either
 * language without the menu knowing which one it is in.
 */
export const PortugueseRouteActive: Story = {
  args: { locale: 'br' },
  parameters: { nextjs: { navigation: { pathname: '/br/talks' } } },
  play: async ({ canvas }) => {
    const talks = canvas.getByRole('link', { name: 'Talks' });
    await expect(talks).toHaveAttribute('aria-current', 'page');
    await expect(talks).toHaveAttribute('href', '/br/talks');
  },
};

/**
 * Regression: home must not be current on a Portuguese inner page.
 *
 * The home entry used to be special-cased with `href === "/"`, which stopped
 * being true the moment the href gained a locale prefix. `/br` then fell
 * through to the prefix branch and matched every page under `/br/`, so Home was
 * underlined everywhere in Portuguese.
 */
export const LocalePrefixDoesNotMatchEverything: Story = {
  args: { locale: 'br' },
  parameters: { nextjs: { navigation: { pathname: '/br/projects' } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await expect(canvas.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');

    // Exactly one entry, not two.
    const marked = canvas
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page');
    await expect(marked).toHaveLength(1);
  },
};

/**
 * A deep page that no menu entry covers, such as an individual project. Nothing
 * is marked current, which is honest: no nav item leads there.
 */
export const NoActiveRoute: Story = {
  parameters: { nextjs: { navigation: { pathname: '/project/npm/locale-codes' } } },
  play: async ({ canvas }) => {
    const marked = canvas
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page');
    await expect(marked).toHaveLength(0);
  },
};

/**
 * Below `md` the inline links leave the accessibility tree and the hamburger
 * takes over. The trigger is icon only, so it carries an `aria-label`, and both
 * it and every sheet link hold the 44px minimum touch target.
 */
export const MobileMenu: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: {
    nextjs: { navigation: { pathname: '/talks' } },
    docs: { story: { inline: false, height: '420px' } },
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Open menu' });
    await userEvent.click(trigger);

    // The sheet is portalled to document.body, outside the story canvas.
    const talks = await screen.findByRole('link', { name: 'Talks' });
    await expect(talks).toHaveAttribute('aria-current', 'page');
    await expect(screen.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(screen.queryByRole('link', { name: 'Sitemap' })).not.toBeInTheDocument();
  },
};

/**
 * The LinkedIn action stays visible at every width; only its label collapses
 * below `sm`, which is why the anchor carries an explicit `aria-label` rather
 * than relying on the text node.
 */
export const LinkedInActionOnly: Story = {
  args: { menu: [] },
  parameters: { nextjs: { navigation: { pathname: '/about' } } },
  play: async ({ canvas }) => {
    const linkedIn = canvas.getByRole('link', { name: 'LinkedIn' });
    await expect(linkedIn).toHaveAttribute('href', 'https://linkedin.com/in/tiagodanin');
    await expect(linkedIn).toHaveAttribute('rel', expect.stringContaining('noopener'));
  },
};
