import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * A right click menu replaces the browser's own, which is a heavy trade for a
 * public site, so this one stays documented rather than deployed.
 */
const meta = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Right click menu built on `@radix-ui/react-context-menu`. Ships with',
          'the shadcn/ui install; no page currently renders it and nothing in',
          '`src/` imports it.',
          '',
          'It suppresses the browser context menu inside the trigger area, so',
          'copy, open in new tab and view source all disappear for that region.',
          'That is only worth doing when the menu offers something the browser',
          'cannot, and it must never be the only route to an action: there is no',
          'pointer free equivalent of a right click.',
          '',
          'The API mirrors `DropdownMenu` item for item, minus the trigger. The',
          'root takes no `open` or `defaultOpen`, because the position comes from',
          'the pointer event, so a story cannot render it open.',
          '',
          'Tests open it with `userEvent.pointer({ keys: \'[MouseRight]\' })` and',
          'read the portalled content through `screen`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    modal: {
      control: 'boolean',
      description: 'Blocks interaction with the page behind the menu.',
      table: { defaultValue: { summary: 'true' } },
    },
    dir: {
      control: 'inline-radio',
      options: ['ltr', 'rtl'],
      description: 'Reading direction, which decides where submenus open.',
    },
    onOpenChange: { description: 'Fires with the next open state.' },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The trigger is a region, not a control, so it needs to look like one. The
 * dashed box here is doing the job a real card would do with its own affordance.
 */
export const Default: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Right click this project card
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          Copy install command
          <ContextMenuShortcut>C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Copy project URL
          <ContextMenuShortcut>U</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Open on GitHub</ContextMenuItem>
        <ContextMenuItem disabled>Open on npm</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Right click this project card');

    await userEvent.pointer({ keys: '[MouseRight]', target: trigger });

    const menu = await screen.findByRole('menu');
    await expect(menu).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(4);
    await expect(within(menu).getByText('Open on npm')).toHaveAttribute('data-disabled');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

/**
 * Checkbox and radio items behave exactly as they do in `DropdownMenu`: the
 * state lives in React, and selecting an item closes the menu.
 */
export const WithSelectionState: Story = {
  render: function SelectionStateRender(args) {
    const [showTags, setShowTags] = useState(true);
    const [density, setDensity] = useState('comfortable');

    return (
      <ContextMenu {...args}>
        <ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
          Right click the projects grid
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Grid</ContextMenuLabel>
          <ContextMenuCheckboxItem checked={showTags} onCheckedChange={setShowTags}>
            Show tags
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Density</ContextMenuLabel>
          <ContextMenuRadioGroup value={density} onValueChange={setDensity}>
            <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
            <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Right click the projects grid');

    await userEvent.pointer({ keys: '[MouseRight]', target: trigger });

    const menu = await screen.findByRole('menu');
    await expect(within(menu).getByRole('menuitemcheckbox', { name: 'Show tags' })).toBeChecked();
    await expect(
      within(menu).getByRole('menuitemradio', { name: 'Comfortable' }),
    ).toBeChecked();

    await userEvent.click(within(menu).getByRole('menuitemradio', { name: 'Compact' }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());

    await userEvent.pointer({ keys: '[MouseRight]', target: trigger });
    const reopened = await screen.findByRole('menu');
    await expect(within(reopened).getByRole('menuitemradio', { name: 'Compact' })).toBeChecked();
  },
};

/**
 * A submenu inside a context menu. Opening it puts a second `menu` in the
 * document, which is the signal a test should wait on.
 */
export const WithSubmenu: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Right click this post
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>Copy link</ContextMenuItem>
        <ContextMenuItem>Copy Markdown mirror</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>LinkedIn</ContextMenuItem>
            <ContextMenuItem>Bluesky</ContextMenuItem>
            <ContextMenuItem>Hacker News</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.pointer({
      keys: '[MouseRight]',
      target: canvas.getByText('Right click this post'),
    });

    const menu = await screen.findByRole('menu');
    const subTrigger = within(menu).getByRole('menuitem', { name: 'Share' });
    await expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');

    await userEvent.click(subTrigger);
    await waitFor(async () => {
      await expect(screen.getAllByRole('menu')).toHaveLength(2);
    });
    await expect(await screen.findByRole('menuitem', { name: 'Hacker News' })).toBeVisible();
  },
};
