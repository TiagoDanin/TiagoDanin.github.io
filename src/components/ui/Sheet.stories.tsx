import type { Meta, StoryObj } from '@storybook/nextjs';
import { Menu } from 'lucide-react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import { Label } from './label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Switch } from './switch';

const NAV_LINKS = [
  { href: '/about/', label: 'About' },
  { href: '/projects/', label: 'Projects' },
  { href: '/blog/', label: 'Blog' },
  { href: '/talks/', label: 'Talks' },
  { href: '/timeline/', label: 'Timeline' },
  { href: '/contact/', label: 'Contact' },
];

/**
 * The one overlay the site actually ships. `Navbar` opens it as the mobile
 * navigation below the `md` breakpoint.
 */
const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Edge anchored panel, the same `@radix-ui/react-dialog` primitive as',
          '`Dialog` with a `side` variant instead of a centred box.',
          '',
          'Two modules import it: `src/components/layout/Navbar.tsx`, which uses',
          "`side=\"right\"` with `className=\"w-[260px] p-4\"` for the mobile menu,",
          'and `src/components/ui/sidebar.tsx`, which is itself unused. The',
          'navbar is the only rendered instance on the site.',
          '',
          'Accessibility note worth carrying forward: the navbar composition has',
          'no `SheetTitle`, so the panel opens as an unnamed dialog. Every story',
          'here renders one, using `className="sr-only"` when the design has no',
          'room for a visible heading. That keeps the accessible name without',
          'changing the layout.',
          '',
          '`SheetContent` supplies its own portal, overlay and close button. The',
          'close button carries an `sr-only` label, so it is reachable in tests',
          "as `getByRole('button', { name: 'Close' })`.",
        ].join('\n'),
      },
    },
  },
  argTypes: {
    open: { control: 'boolean', description: 'Controlled open state.' },
    defaultOpen: {
      control: 'boolean',
      description: 'Uncontrolled initial open state.',
      table: { defaultValue: { summary: 'false' } },
    },
    modal: {
      control: 'boolean',
      description: 'Traps focus and blocks the page behind the panel.',
      table: { defaultValue: { summary: 'true' } },
    },
    onOpenChange: { description: 'Fires with the next open state.' },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The navbar composition, with the accessible name the production one is
 * missing. Six links is the real menu length, read from the `menu` collection.
 */
export const MobileNavigation: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[260px] p-4">
        <SheetHeader>
          <SheetTitle className="sr-only">Site navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Links to every top level page of tiagodanin.com.
          </SheetDescription>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <SheetClose asChild key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </a>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));

    const panel = await screen.findByRole('dialog', { name: 'Site navigation' });
    await expect(panel).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await expect(within(panel).getAllByRole('link')).toHaveLength(NAV_LINKS.length);

    await userEvent.click(within(panel).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

/**
 * A settings style panel: header, scrollable body, footer with the commit
 * action. `SheetFooter` reverses on mobile so the primary action sits last.
 */
export const WithFooter: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline">Filter projects</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filter projects</SheetTitle>
          <SheetDescription>
            Narrow the 250 plus projects listed across GitHub, npm, PyPI and the Play Store.
          </SheetDescription>
        </SheetHeader>
        <div className="my-6 space-y-4">
          {['Flutter', 'React Native', 'Lua', 'Security research'].map((tag) => (
            <div key={tag} className="flex items-center justify-between">
              <Label htmlFor={`filter-${tag}`}>{tag}</Label>
              <Switch id={`filter-${tag}`} />
            </div>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Reset</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Apply filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Filter projects' }));

    const panel = await screen.findByRole('dialog', { name: 'Filter projects' });
    await userEvent.click(within(panel).getByLabelText('Flutter'));
    await expect(within(panel).getByLabelText('Flutter')).toBeChecked();

    await userEvent.click(within(panel).getByRole('button', { name: 'Apply filters' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

/**
 * The four anchors. `left` and `right` are 3/4 width capped at `sm:max-w-sm`,
 * while `top` and `bottom` span the full width and size to their content.
 */
export const AllSides: Story = {
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Reference grid of the four `side` values.' } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">Open {side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Anchored {side}</SheetTitle>
              <SheetDescription>
                The panel slides in from the {side} edge and dismisses back to it.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Open bottom' }));
    await expect(await screen.findByRole('dialog', { name: 'Anchored bottom' })).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
