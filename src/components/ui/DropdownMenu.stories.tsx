import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Globe, MoreHorizontal, Share2 } from 'lucide-react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * The site has one place that would want it, the EN and PT switch in the
 * navbar, and that is built as two plain links instead.
 */
const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Button triggered command menu built on',
          '`@radix-ui/react-dropdown-menu`. Ships with the shadcn/ui install; no',
          'page currently renders it and nothing in `src/` imports it.',
          '',
          'A dropdown menu holds commands, not navigation. Radix gives the items',
          'role `menuitem`, which screen readers announce as an action, so a set',
          'of destinations belongs in a `nav` with real links instead. That is',
          'why the language switch in the navbar is two anchors.',
          '',
          'The item variants are `DropdownMenuItem`, `DropdownMenuCheckboxItem`',
          'and `DropdownMenuRadioItem`, mapping to roles `menuitem`,',
          '`menuitemcheckbox` and `menuitemradio`. The checkbox and radio ones',
          'reserve their left padding for the indicator, so mixing plain items',
          'into the same group needs `inset` to keep the labels aligned.',
          '',
          '`DropdownMenuContent` portals itself, so tests query it with `screen`.',
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
      description:
        'Blocks interaction with the page behind the menu. Set `false` when the page must stay scrollable.',
      table: { defaultValue: { summary: 'true' } },
    },
    onOpenChange: { description: 'Fires with the next open state.' },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The overflow menu on a project card: a label, a group of commands, and a
 * separated destructive one at the bottom.
 */
export const Default: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Project actions">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>telegram-bot-api</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Copy install command
            <DropdownMenuShortcut>C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Open on GitHub</DropdownMenuItem>
          <DropdownMenuItem>Open on npm</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Edit in the studio</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Project actions' }));

    const menu = await screen.findByRole('menu');
    await expect(menu).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(4);
    await expect(within(menu).getByText('Edit in the studio')).toHaveAttribute('data-disabled');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

/**
 * Selecting an item closes the menu and fires `onSelect`. That is the whole
 * contract, and it is what a command menu has to get right.
 */
export const ItemSelection: Story = {
  args: { onOpenChange: fn() },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Share2 />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Copy link</DropdownMenuItem>
        <DropdownMenuItem>Share on LinkedIn</DropdownMenuItem>
        <DropdownMenuItem>Share on Bluesky</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Share' }));

    const menu = await screen.findByRole('menu');
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Copy link' }));

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};

/**
 * Checkbox and radio items, each driven by React state. Radix does not hold the
 * value: `checked` and `value` are yours to own, which is what makes the menu
 * usable as a filter.
 */
export const CheckboxAndRadioItems: Story = {
  render: function CheckboxAndRadioRender(args) {
    const [showArchived, setShowArchived] = useState(false);
    const [showForks, setShowForks] = useState(true);
    const [sort, setSort] = useState('stars');

    return (
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">View options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Show</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
            Archived repositories
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showForks} onCheckedChange={setShowForks}>
            Forks
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="stars">Stars</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="updated">Last updated</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'View options' }));

    const menu = await screen.findByRole('menu');
    await expect(
      within(menu).getByRole('menuitemcheckbox', { name: 'Archived repositories' }),
    ).not.toBeChecked();
    await expect(within(menu).getByRole('menuitemradio', { name: 'Stars' })).toBeChecked();

    await userEvent.click(within(menu).getByRole('menuitemcheckbox', { name: 'Forks' }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());

    await userEvent.click(canvas.getByRole('button', { name: 'View options' }));
    const reopened = await screen.findByRole('menu');
    await expect(within(reopened).getByRole('menuitemcheckbox', { name: 'Forks' })).not.toBeChecked();
  },
};

/**
 * A submenu. `DropdownMenuSub` opens on hover and on Right Arrow, and its
 * content is a second portalled menu, so a test has to disambiguate the two.
 */
export const WithSubmenu: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Globe />
          Language
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>Read in English</DropdownMenuItem>
        <DropdownMenuItem>Ler em portugues</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Machine readable</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>llms.txt</DropdownMenuItem>
            <DropdownMenuItem>Markdown mirror</DropdownMenuItem>
            <DropdownMenuItem>RSS feed</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Language' }));

    const menu = await screen.findByRole('menu');
    const subTrigger = within(menu).getByRole('menuitem', { name: 'Machine readable' });
    await expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');

    await userEvent.click(subTrigger);
    await waitFor(async () => {
      await expect(screen.getAllByRole('menu')).toHaveLength(2);
    });
    await expect(await screen.findByRole('menuitem', { name: 'llms.txt' })).toBeVisible();
  },
};
