import type { Meta, StoryObj } from '@storybook/nextjs';
import { useEffect, useState } from 'react';
import { BookOpen, Boxes, Calendar, FileText, Mic, User } from 'lucide-react';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import { Button } from './button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * It is the one unused primitive with an obvious job here: a palette over the
 * site's own routes, which are all statically known at build time.
 */
const meta = {
  title: 'UI/Command',
  component: Command,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Filterable command palette built on `cmdk`. Ships with the shadcn/ui',
          'install; no page currently renders it. It is the only importer of',
          '`dialog.tsx`, through the `CommandDialog` wrapper.',
          '',
          'The parts do not follow the Radix naming used elsewhere in this',
          'folder. `Command` is the root, `CommandInput` renders a combobox with',
          'a search icon and its own bottom border, `CommandList` is the listbox',
          'and `CommandItem` an option. There is no trigger: mounting the',
          'component is what shows it.',
          '',
          'Filtering is built in and case insensitive, scoring items against the',
          'input. `CommandEmpty` renders only when everything is filtered out, so',
          'the empty state costs nothing when there are results.',
          '',
          '`CommandDialog` wraps the whole thing in `Dialog`. It passes no title,',
          'so give the dialog an accessible name before shipping it, or screen',
          'readers announce an unnamed dialog.',
          '',
          'The inline stories render in the canvas and are queried with `within`.',
          'The `CommandDialog` story is portalled and uses `screen`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Accessible label for the listbox. Not rendered visually.',
    },
    shouldFilter: {
      control: 'boolean',
      description:
        'Built in filtering. Turn off when results come from somewhere else and are already narrowed.',
      table: { defaultValue: { summary: 'true' } },
    },
    loop: {
      control: 'boolean',
      description: 'Wraps arrow key navigation from the last item back to the first.',
      table: { defaultValue: { summary: 'false' } },
    },
    onValueChange: { description: 'Fires with the value of the highlighted item.' },
  },
  args: {
    label: 'Site navigation',
    shouldFilter: true,
    loop: false,
    onValueChange: fn(),
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

const SECTIONS = [
  { icon: User, label: 'About', hint: 'Bio, milestones and press' },
  { icon: FileText, label: 'Blog', hint: 'Posts in English and Portuguese' },
  { icon: Mic, label: 'Talks', hint: 'Conference and meetup recordings' },
  { icon: Boxes, label: 'Projects', hint: 'GitHub, npm, PyPI and the Play Store' },
  { icon: Calendar, label: 'Timeline', hint: 'Career events by year' },
  { icon: BookOpen, label: 'Press kit', hint: 'Bios, logos and photos' },
];

/**
 * The palette listing the site's top level sections, rendered inline. Typing
 * narrows the list without any state of your own.
 */
export const Default: Story = {
  render: (args) => (
    <Command {...args} className="w-[420px] rounded-lg border shadow-md">
      <CommandInput placeholder="Search the site" />
      <CommandList>
        <CommandEmpty>Nothing matches that.</CommandEmpty>
        <CommandGroup heading="Sections">
          {SECTIONS.map(({ icon: Icon, label, hint }) => (
            <CommandItem key={label} value={label}>
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{label}</span>
              <span className="ml-2 text-xs text-muted-foreground">{hint}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Feeds">
          <CommandItem value="rss">
            <span>RSS feeds</span>
            <CommandShortcut>R</CommandShortcut>
          </CommandItem>
          <CommandItem value="llms">
            <span>llms.txt</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('option')).toHaveLength(8);

    await userEvent.type(canvas.getByRole('combobox'), 'talk');
    await expect(await canvas.findByRole('option', { name: /Talks/ })).toBeVisible();
    await expect(canvas.getAllByRole('option')).toHaveLength(1);
  },
};

/**
 * `CommandEmpty` is the whole empty state. It replaces the list rather than
 * sitting under it, so a query with no results never shows a stale group
 * heading.
 */
export const NoResults: Story = {
  render: (args) => (
    <Command {...args} className="w-[420px] rounded-lg border shadow-md">
      <CommandInput placeholder="Search the site" />
      <CommandList>
        <CommandEmpty>
          No page matches that. Try flutter, talks or timeline.
        </CommandEmpty>
        <CommandGroup heading="Sections">
          {SECTIONS.map(({ label }) => (
            <CommandItem key={label} value={label}>
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('combobox'), 'kubernetes');
    await expect(
      await canvas.findByText('No page matches that. Try flutter, talks or timeline.'),
    ).toBeVisible();
    await expect(canvas.queryAllByRole('option')).toHaveLength(0);
  },
};

/**
 * Arrow keys move the highlight and `onValueChange` reports it. The highlighted
 * option carries `aria-selected`, which is what a screen reader announces as
 * you travel the list.
 */
export const KeyboardNavigation: Story = {
  args: { loop: true },
  render: (args) => (
    <Command {...args} className="w-[420px] rounded-lg border shadow-md">
      <CommandInput placeholder="Search the site" />
      <CommandList>
        <CommandEmpty>Nothing matches that.</CommandEmpty>
        <CommandGroup heading="Sections">
          {SECTIONS.map(({ label }) => (
            <CommandItem key={label} value={label}>
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await expect(canvas.getByRole('option', { name: 'About' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: 'Blog' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(args.onValueChange).toHaveBeenCalledWith(expect.stringMatching(/^blog$/i));
  },
};

/**
 * The palette inside a modal, opened by a button and by the Ctrl+K shortcut a
 * palette is expected to answer.
 *
 * `CommandDialog` renders its own `Command` root, so its children are the input
 * and the list, never a second `Command`. It also forwards its props to the
 * `Dialog` root rather than to `DialogContent`, which leaves no way to pass a
 * title or an `aria-label`: the modal opens as an unnamed dialog. Fixing that
 * means editing `command.tsx` to render a `DialogTitle`, so the test below
 * asserts the current behaviour rather than the desired one.
 */
export const InADialog: Story = {
  render: function CommandDialogRender() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          setOpen((previous) => !previous);
        }
      };

      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Search the site
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a section name" />
          <CommandList>
            <CommandEmpty>Nothing matches that.</CommandEmpty>
            <CommandGroup heading="Sections">
              {SECTIONS.map(({ label }) => (
                <CommandItem key={label} value={label} onSelect={() => setOpen(false)}>
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Search the site' }));

    const dialog = await screen.findByRole('dialog');
    await expect(dialog).toBeVisible();

    await userEvent.type(within(dialog).getByRole('combobox'), 'time');
    await expect(await within(dialog).findByRole('option', { name: 'Timeline' })).toBeVisible();
  },
};
