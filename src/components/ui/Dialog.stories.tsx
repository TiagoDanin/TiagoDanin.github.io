import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Check, Link2 } from 'lucide-react';

import { Button } from './button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Input } from './input';
import { Label } from './label';

/**
 * Radix modal dialog, unmodified from the shadcn/ui install.
 *
 * One module imports it, and it is not a page: `command.tsx` wraps it to build
 * `CommandDialog`. No route on the site renders a dialog today.
 */
const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Modal dialog built on `@radix-ui/react-dialog`. The only importer in',
          'the codebase is `src/components/ui/command.tsx`, which composes it',
          'into `CommandDialog`; no page currently renders either one.',
          '',
          '`DialogContent` already portals itself and paints its own overlay and',
          'close button, so a composition is `Dialog > DialogTrigger +',
          'DialogContent`. Wrapping it in `DialogPortal` by hand doubles the',
          'overlay.',
          '',
          'Always render a `DialogTitle`: Radix uses it as the accessible name',
          'through `aria-labelledby`, and without one screen readers announce an',
          'unnamed dialog. `DialogDescription` fills `aria-describedby`; omitting',
          'it logs a warning in development.',
          '',
          'Because the content lives in a portal outside the story canvas, tests',
          'here query it with `screen`, not `within(canvasElement)`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Uncontrolled initial open state.',
      table: { defaultValue: { summary: 'false' } },
    },
    modal: {
      control: 'boolean',
      description:
        'Traps focus and marks the rest of the page inert. Turn off only for a non blocking panel.',
      table: { defaultValue: { summary: 'true' } },
    },
    onOpenChange: {
      description: 'Fires with the next open state on trigger, close button, Escape or overlay click.',
    },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The shape a blog post would use to offer its canonical link: header, body,
 * footer. Opening reports `true` through `onOpenChange`, and Escape closes.
 */
export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link2 />
          Share this post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this post</DialogTitle>
          <DialogDescription>
            Anyone with this link can read Building a Flutter plugin for BLE beacons.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Label htmlFor="share-url" className="sr-only">
            Post URL
          </Label>
          <Input
            id="share-url"
            readOnly
            defaultValue="https://tiagodanin.com/post/flutter-plugin-ble-beacons/"
          />
          <Button size="sm" className="shrink-0">
            <Check />
            Copy
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Share this post' }));

    const dialog = await screen.findByRole('dialog', { name: 'Share this post' });
    await expect(dialog).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await expect(
      within(dialog).getByDisplayValue('https://tiagodanin.com/post/flutter-plugin-ble-beacons/'),
    ).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

/**
 * A dialog whose body is a form. The submit control lives in `DialogFooter`
 * alongside `DialogClose`, so the cancel path never needs its own state.
 */
export const WithForm: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Invite me to speak</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite me to speak</DialogTitle>
          <DialogDescription>
            Tell me about the event. I answer talk invitations in Portuguese or English.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="invite-event">Event</Label>
            <Input id="invite-event" placeholder="Flutterando Conf 2026" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input id="invite-email" type="email" placeholder="voce@evento.com.br" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Send invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Invite me to speak' }));

    const dialog = await screen.findByRole('dialog', { name: 'Invite me to speak' });
    await userEvent.type(within(dialog).getByLabelText('Event'), 'Flutterando Conf 2026');
    await expect(within(dialog).getByLabelText('Event')).toHaveValue('Flutterando Conf 2026');

    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

/**
 * `DialogContent` is a grid with no scroll container of its own, so a long body
 * grows past the viewport. Give the body `max-h-*` and `overflow-y-auto` when
 * the content can be arbitrarily long, as a changelog can.
 */
export const LongContent: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">View changelog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>telegram-bot-api changelog</DialogTitle>
          <DialogDescription>Releases published to npm since 2019.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[50vh] space-y-4 overflow-y-auto pr-2 text-sm">
          {[
            ['4.9.1', 'Fix polling retry after a 429 from the Bot API.'],
            ['4.9.0', 'Add support for inline query results with web app buttons.'],
            ['4.8.2', 'Drop the runtime dependency on request, switch to fetch.'],
            ['4.8.1', 'Type the update payload instead of exposing a loose record.'],
            ['4.8.0', 'Bot API 6.0 methods, including chat menu buttons.'],
            ['4.7.0', 'Allow a custom base URL so a local Bot API server can be used.'],
            ['4.6.0', 'Emit a typed error when the token is rejected on start.'],
          ].map(([version, note]) => (
            <div key={version} className="border-b pb-3 last:border-b-0">
              <p className="font-semibold">v{version}</p>
              <p className="text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'View changelog' }));

    const dialog = await screen.findByRole('dialog', { name: 'telegram-bot-api changelog' });
    await expect(within(dialog).getByText('v4.9.1')).toBeVisible();
    await expect(within(dialog).getByText('v4.6.0')).toBeInTheDocument();
  },
};
