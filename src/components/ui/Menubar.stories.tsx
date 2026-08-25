import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './menubar';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * A menubar is a desktop application chrome. This site is a set of documents
 * with a navbar, so the primitive has no home here and is documented only so
 * the next person can see what it costs.
 */
const meta = {
  title: 'UI/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Horizontal application menu built on `@radix-ui/react-menubar`. Ships',
          'with the shadcn/ui install; no page currently renders it and nothing',
          'in `src/` imports it.',
          '',
          'The structure is `Menubar > MenubarMenu > MenubarTrigger +',
          'MenubarContent`. Once one menu is open, hovering a sibling trigger',
          'switches to it without a second click, which is the behaviour that',
          'separates a menubar from a row of dropdown menus.',
          '',
          'The root is a roving tabstop: the whole bar takes one Tab, and Left',
          'and Right arrows move between triggers. That is correct for an',
          'application toolbar and wrong for site navigation, where every',
          'destination should be its own tab stop.',
          '',
          'Note one upstream typo carried in this copy: `MenubarShortcut` sets',
          '`displayname` in lowercase instead of `displayName`, so it shows as',
          'the minified name in React DevTools. Harmless, but it explains the',
          'odd entry in the tree.',
          '',
          '`MenubarContent` portals itself, so tests query it with `screen`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled value of the open menu. Empty string means all closed.',
    },
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled value of the menu that starts open.',
    },
    loop: {
      control: 'boolean',
      description: 'Wraps arrow key movement from the last trigger back to the first.',
      table: { defaultValue: { summary: 'false' } },
    },
    onValueChange: { description: 'Fires with the value of the menu that opened, or an empty string.' },
  },
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Three menus over the operations this repository actually has: content,
 * builds and feeds. Opening one reports its value through `onValueChange`.
 */
export const Default: Story = {
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu value="content">
        <MenubarTrigger>Content</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New post
            <MenubarShortcut>N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New talk</MenubarItem>
          <MenubarItem>New timeline event</MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Publish queue</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="build">
        <MenubarTrigger>Build</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Sync GitHub projects</MenubarItem>
          <MenubarItem>Sync npm packages</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Generate sitemaps</MenubarItem>
          <MenubarItem>Generate llms.txt</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="feeds">
        <MenubarTrigger>Feeds</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Blog</MenubarItem>
          <MenubarItem>Talks</MenubarItem>
          <MenubarItem>Projects</MenubarItem>
          <MenubarItem>Timeline</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('menubar')).toBeVisible();
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Build' }));

    const menu = await screen.findByRole('menu');
    await expect(menu).toBeVisible();
    await expect(args.onValueChange).toHaveBeenCalledWith('build');
    await expect(within(menu).getByRole('menuitem', { name: 'Generate llms.txt' })).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

/**
 * Checkbox and radio items in a menubar, holding view preferences. As
 * everywhere else in this family, the state is yours.
 */
export const WithSelectionState: Story = {
  render: function SelectionStateRender(args) {
    const [showDrafts, setShowDrafts] = useState(false);
    const [language, setLanguage] = useState('en');

    return (
      <Menubar {...args}>
        <MenubarMenu value="view">
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={showDrafts} onCheckedChange={setShowDrafts}>
              Show drafts
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel>Language</MenubarLabel>
            <MenubarRadioGroup value={language} onValueChange={setLanguage}>
              <MenubarRadioItem value="en">English</MenubarRadioItem>
              <MenubarRadioItem value="pt">Portugues</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('menuitem', { name: 'View' }));

    const menu = await screen.findByRole('menu');
    await expect(within(menu).getByRole('menuitemcheckbox', { name: 'Show drafts' })).not.toBeChecked();
    await expect(within(menu).getByRole('menuitemradio', { name: 'English' })).toBeChecked();

    await userEvent.click(within(menu).getByRole('menuitemradio', { name: 'Portugues' }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());

    await userEvent.click(canvas.getByRole('menuitem', { name: 'View' }));
    const reopened = await screen.findByRole('menu');
    await expect(within(reopened).getByRole('menuitemradio', { name: 'Portugues' })).toBeChecked();
  },
};

/**
 * A submenu nested under a menubar menu, which is where the depth of this
 * primitive starts to show. Three levels is already more structure than a
 * personal site has to offer.
 */
export const WithSubmenu: Story = {
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu value="export">
        <MenubarTrigger>Export</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Download CV</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Press kit</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Short bio</MenubarItem>
              <MenubarItem>Long bio</MenubarItem>
              <MenubarItem>Headshots</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('menuitem', { name: 'Export' }));

    const menu = await screen.findByRole('menu');
    const subTrigger = within(menu).getByRole('menuitem', { name: 'Press kit' });
    await expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');

    await userEvent.click(subTrigger);
    await expect(await screen.findByRole('menuitem', { name: 'Headshots' })).toBeVisible();
  },
};
