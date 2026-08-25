import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { toast } from '@/hooks/use-toast';

import { Button } from './button';
import { ToastAction } from './toast';
import { Toaster } from './toaster';

/**
 * Mounted on every page through `ToasterProvider` in `src/app/layout.tsx`, and
 * that is its only importer. Nothing in the app calls `toast()`, so the host is
 * live on the site but has never rendered a notification.
 */
const meta = {
  title: 'UI/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'The toast host. It owns the `ToastProvider` and the',
          '`ToastViewport`, subscribes to the store in `hooks/use-toast.ts`,',
          'and renders whatever is in it. It takes no props: everything is',
          'driven by calling `toast()` from anywhere in the tree.',
          '',
          '`ToasterProvider` mounts one in the root layout, so a page never',
          'needs its own. No page calls `toast()` yet, which is why the site',
          'ships the host without ever showing a toast.',
          '',
          'Two numbers in `hooks/use-toast.ts` shape the behaviour, and both',
          'differ from what most people expect. `TOAST_LIMIT` is **1**, so a',
          'second `toast()` replaces the first instead of stacking under it.',
          '`TOAST_REMOVE_DELAY` is 3000ms, and it is the delay between',
          'dismissal and removal from the store, not an auto-dismiss timer:',
          'the countdown to closing is Radix `duration`, 5000ms by default.',
          '',
          '**The close button has no accessible name.** `toaster.tsx` renders',
          'a bare `<ToastClose />`, and `ToastClose` contains nothing but an',
          '`X` icon, so the only way to dismiss a toast is announced as',
          '"button". Passing `aria-label="Close notification"` in `toaster.tsx`',
          'fixes it; until then the play functions below have to reach for the',
          'unnamed button on purpose.',
          '',
          'The store is a module level singleton, not React state. It survives',
          'unmounting the `Toaster`, which is why the stories below dismiss',
          'what they open.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Finds the dismiss button of the open toast by its accessible name. */
function getCloseButton(canvasElement: HTMLElement): HTMLElement {
  const toast = within(canvasElement).getByRole('status');
  return within(toast).getByRole('button', { name: /dismiss notification/i });
}

/**
 * The pairing a real page would use: a `Toaster` mounted once, and a control
 * somewhere else calling `toast()`.
 */
export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() =>
          toast({
            title: 'Copied',
            description: 'npm i telegram-bot-api is on your clipboard.',
          })
        }
      >
        Copy the install command
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Copy the install command' }));

    await expect(await canvas.findByText('Copied')).toBeInTheDocument();
    await expect(
      canvas.getByText('npm i telegram-bot-api is on your clipboard.'),
    ).toBeInTheDocument();

    // The store outlives this story, so put it back the way it was found.
    await userEvent.click(getCloseButton(canvasElement));
    await waitFor(async () => {
      await expect(canvas.queryByText('Copied')).not.toBeInTheDocument();
    });
  },
};

/**
 * `variant: 'destructive'` for something that failed. The description carries
 * the recovery step, since the colour is not readable to everyone and says
 * nothing about what to do.
 */
export const Destructive: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        onClick={() =>
          toast({
            variant: 'destructive',
            title: 'Could not load the GitHub projects',
            description: 'The API rate limit was hit. Try again in a minute.',
          })
        }
      >
        Reload projects
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Reload projects' }));

    await expect(await canvas.findByText('Could not load the GitHub projects')).toBeInTheDocument();

    await userEvent.click(getCloseButton(canvasElement));
    await waitFor(async () => {
      await expect(
        canvas.queryByText('Could not load the GitHub projects'),
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * A toast carrying an action. `altText` is required and is not decoration: it
 * is the instruction a screen reader gets for reaching the same action outside
 * the toast, which may be gone by the time the announcement finishes.
 */
export const WithAction: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Draft saved',
            description: 'The talk proposal was saved locally.',
            action: <ToastAction altText="Undo saving the draft">Undo</ToastAction>,
          })
        }
      >
        Save draft
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }));

    await expect(await canvas.findByText('Draft saved')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Undo' })).toBeInTheDocument();

    await userEvent.click(getCloseButton(canvasElement));
    await waitFor(async () => {
      await expect(canvas.queryByText('Draft saved')).not.toBeInTheDocument();
    });
  },
};

/**
 * Title with no description, which is enough for a plain confirmation. The
 * `Toaster` skips `ToastDescription` entirely when there is nothing to put in
 * it, so no empty line is left behind.
 */
export const TitleOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button variant="outline" onClick={() => toast({ title: 'Link copied' })}>
        Copy post link
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Copy post link' }));

    const status = await canvas.findByRole('status');
    await expect(within(status).getByText('Link copied')).toBeInTheDocument();

    await userEvent.click(getCloseButton(canvasElement));
    await waitFor(async () => {
      await expect(canvas.queryByText('Link copied')).not.toBeInTheDocument();
    });
  },
};

/**
 * `TOAST_LIMIT` is 1, so firing a second toast replaces the first rather than
 * stacking below it. Anything that could fire twice in quick succession loses
 * the earlier message.
 */
export const SecondToastReplacesTheFirst: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        onClick={() => toast({ title: 'Post link copied', description: 'First notification.' })}
      >
        Copy post link
      </Button>
      <Button
        variant="outline"
        onClick={() => toast({ title: 'RSS link copied', description: 'Second notification.' })}
      >
        Copy RSS link
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Copy post link' }));
    await expect(await canvas.findByText('Post link copied')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Copy RSS link' }));

    await expect(await canvas.findByText('RSS link copied')).toBeInTheDocument();
    await expect(canvas.queryByText('Post link copied')).not.toBeInTheDocument();
    await expect(canvas.getAllByRole('status')).toHaveLength(1);

    await userEvent.click(getCloseButton(canvasElement));
    await waitFor(async () => {
      await expect(canvas.queryByText('RSS link copied')).not.toBeInTheDocument();
    });
  },
};

/**
 * The dismiss control is icon-only, so its name comes from an `aria-label` on
 * `ToastClose` rather than from its content. Without one it would reach the
 * accessibility tree unnamed, failing the WCAG AA baseline this site holds
 * itself to.
 */
export const CloseButtonIsNamed: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button variant="outline" onClick={() => toast({ title: 'Link copied' })}>
        Copy post link
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Copy post link' }));

    const status = await canvas.findByRole('status');
    const buttons = within(status).getAllByRole('button');

    await expect(buttons).toHaveLength(1);
    await expect(buttons[0]).toHaveAccessibleName('Dismiss notification');

    await userEvent.click(buttons[0]);
    await waitFor(async () => {
      await expect(canvas.queryByText('Link copied')).not.toBeInTheDocument();
    });
  },
};

/**
 * Keyboard operation. Once a toast is up, Tab reaches the toast itself and then
 * its close button, so a notification can be dismissed without a pointer even
 * though that button has no name.
 */
export const KeyboardDismiss: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        onClick={() => toast({ title: 'Draft saved', description: 'Saved locally.' })}
      >
        Save draft
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Save draft' });

    await userEvent.click(trigger);
    await expect(await canvas.findByText('Draft saved')).toBeInTheDocument();

    trigger.focus();

    await userEvent.tab();
    await expect(canvas.getByRole('status')).toHaveFocus();

    await userEvent.tab();
    await expect(getCloseButton(canvasElement)).toHaveFocus();

    await userEvent.keyboard('{Enter}');

    await waitFor(async () => {
      await expect(canvas.queryByText('Draft saved')).not.toBeInTheDocument();
    });
  },
};
