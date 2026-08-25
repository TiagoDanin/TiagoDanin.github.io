import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * `Navbar` builds the real navigation from the `menu` collection with plain
 * links and a `Sheet` for mobile, so nothing here is in production.
 */
const meta = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Site navigation with expandable panels, built on',
          '`@radix-ui/react-navigation-menu`. Ships with the shadcn/ui install;',
          'no page currently renders it and nothing in `src/` imports it.',
          '',
          'It is the odd one out in this folder in two ways. The root renders a',
          'real `nav` element, so give it an `aria-label` when more than one nav',
          'exists on the page. And the content is not portalled: `NavigationMenu`',
          'mounts a `NavigationMenuViewport` inside itself and the open panel',
          'renders there, which is why the tests below use',
          '`within(canvasElement)` rather than `screen`.',
          '',
          'Panels open on hover after `delayDuration` and on click, and only one',
          'is open at a time. Items inside are ordinary links, so keyboard and',
          'screen reader users reach every destination without opening anything.',
          '',
          '`navigationMenuTriggerStyle()` is exported so a leaf link can match the',
          'height and padding of a trigger that has a panel behind it.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: { control: 'text', description: 'Controlled value of the open panel.' },
    defaultValue: { control: 'text', description: 'Value of the panel that starts open.' },
    delayDuration: {
      control: { type: 'number' },
      description: 'Milliseconds of hover before a panel opens.',
      table: { defaultValue: { summary: '200' } },
    },
    skipDelayDuration: {
      control: { type: 'number' },
      description: 'Window after closing during which the next panel opens with no delay.',
      table: { defaultValue: { summary: '300' } },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Direction of the list and of arrow key movement.',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    onValueChange: { description: 'Fires with the value of the panel that opened, or an empty string.' },
  },
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const POSTS = [
  {
    href: '/post/flutter-plugin-ble-beacons/',
    title: 'Building a Flutter plugin for BLE beacons',
    summary: 'Platform channels on both sides, and the permission maze on Android 12.',
  },
  {
    href: '/post/react-native-new-architecture/',
    title: 'Shipping the React Native new architecture',
    summary: 'What broke, what was worth it, and what I would postpone.',
  },
  {
    href: '/post/reverse-engineering-a-lua-bytecode/',
    title: 'Reverse engineering Lua bytecode',
    summary: 'Reading a stripped chunk header byte by byte.',
  },
];

/**
 * Two panels and one leaf link, which is the shape a portfolio navbar would
 * take: writing and projects expand, contact does not.
 */
export const Default: Story = {
  render: (args) => (
    <NavigationMenu {...args} aria-label="Main">
      <NavigationMenuList>
        <NavigationMenuItem value="writing">
          <NavigationMenuTrigger>Writing</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[420px] gap-2 p-4">
              {POSTS.map((post) => (
                <li key={post.href}>
                  <NavigationMenuLink
                    href={post.href}
                    className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="block text-sm font-medium leading-none">{post.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {post.summary}
                    </span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="projects">
          <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[320px] gap-1 p-4">
              {[
                ['GitHub', '/project/github/'],
                ['npm', '/project/npm/'],
                ['PyPI', '/project/pypi/'],
                ['Google Play', '/project/googleplay/'],
              ].map(([label, href]) => (
                <li key={href}>
                  <NavigationMenuLink
                    href={href}
                    className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {label}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="contact">
          <NavigationMenuLink href="/contact/" className={cn(navigationMenuTriggerStyle())}>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact/',
    );

    const trigger = canvas.getByRole('button', { name: /Writing/ });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await expect(
      await canvas.findByRole('link', { name: /Building a Flutter plugin for BLE beacons/ }),
    ).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onValueChange).toHaveBeenCalledWith('writing');

    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        canvas.queryByRole('link', { name: /Building a Flutter plugin for BLE beacons/ }),
      ).not.toBeInTheDocument(),
    );
  },
};

/**
 * Only one panel is open at a time. Opening the second closes the first, which
 * is the behaviour that keeps a navbar from stacking two overlapping sheets.
 */
export const SwitchingPanels: Story = {
  render: (args) => (
    <NavigationMenu {...args} aria-label="Main">
      <NavigationMenuList>
        <NavigationMenuItem value="writing">
          <NavigationMenuTrigger>Writing</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[320px] gap-1 p-4">
              <li>
                <NavigationMenuLink href="/blog/" className="block rounded-md p-2 text-sm">
                  All posts
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/blog/pt/" className="block rounded-md p-2 text-sm">
                  Posts em portugues
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="speaking">
          <NavigationMenuTrigger>Speaking</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[320px] gap-1 p-4">
              <li>
                <NavigationMenuLink href="/talks/" className="block rounded-md p-2 text-sm">
                  All talks
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/press-kit/" className="block rounded-md p-2 text-sm">
                  Press kit
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Writing/ }));
    await expect(await canvas.findByRole('link', { name: 'All posts' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: /Speaking/ }));
    await expect(await canvas.findByRole('link', { name: 'All talks' })).toBeVisible();
    await waitFor(() =>
      expect(canvas.queryByRole('link', { name: 'All posts' })).not.toBeInTheDocument(),
    );
  },
};

/**
 * A menu with no expandable panel at all: every item is a link styled with
 * `navigationMenuTriggerStyle()`. This is the closest the primitive gets to
 * what the site's navbar actually does.
 */
export const LinksOnly: Story = {
  render: (args) => (
    <NavigationMenu {...args} aria-label="Main">
      <NavigationMenuList>
        {[
          ['About', '/about/'],
          ['Blog', '/blog/'],
          ['Talks', '/talks/'],
          ['Projects', '/projects/'],
          ['Contact', '/contact/'],
        ].map(([label, href]) => (
          <NavigationMenuItem key={href} value={href}>
            <NavigationMenuLink href={href} className={cn(navigationMenuTriggerStyle())}>
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('link')).toHaveLength(5);
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Talks' })).toHaveAttribute('href', '/talks/');
  },
};
