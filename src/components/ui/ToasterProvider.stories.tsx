import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { toast } from '@/hooks/use-toast';

import { Button } from './button';
import { ToastAction } from './toast';
import { ToasterProvider } from './toaster-provider';

/**
 * The toast host. Two lines of code, mounted once in the root layout, and the
 * reason any `toast()` call anywhere in the tree has somewhere to render.
 */
const meta = {
  title: 'UI/ToasterProvider',
  component: ToasterProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'The one component here that is genuinely in use: it is mounted in the',
          'root layout, `src/app/layout.tsx`, and nothing else imports it. It is',
          'a client wrapper around `Toaster` and exists purely so a server',
          'layout can mount a component that needs hooks.',
          '',
          'It renders nothing on its own. A toast appears only when some other',
          'module calls `toast()` from `@/hooks/use-toast`, which is why every',
          'story below pairs the host with a button that fires one.',
          '',
          'Three details of the store are worth knowing before using it:',
          '',
          '- **The state is module level, not React state.** There is one queue',
          '  for the whole application, shared across every mounted host. In this',
          '  catalog that means a toast raised in one story is still queued when',
          '  you navigate to the next one.',
          '- **`TOAST_LIMIT` is 1.** Raising a second toast replaces the first',
          '  rather than stacking it. A burst of notifications silently collapses',
          '  into whichever one came last.',
          '- **Dismissal is two stages.** Closing sets `open: false`, then the',
          '  entry is removed from the queue 3 seconds later.',
          '',
          'The viewport is `fixed` and pinned to the bottom right on anything',
          'wider than a phone, so a toast escapes the story frame and lands in',
          'the corner of the preview.',
        ].join('\n'),
      },
    },
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof ToasterProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The host on its own, which is exactly what the root layout renders. Nothing
 * is painted until something raises a toast, so this story is deliberately
 * empty.
 */
export const Mounted: Story = {
  render: () => (
    <div className="flex h-24 w-[24rem] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
      <ToasterProvider />
      Host mounted, queue empty
    </div>
  ),
};

/**
 * Raising a toast. The play function clicks the trigger and waits for the
 * notification, which is rendered into the viewport rather than beside the
 * button, so it is queried from the whole document.
 */
export const RaisingAToast: Story = {
  render: () => (
    <div className="flex w-[24rem] justify-center">
      <ToasterProvider />
      <Button
        onClick={() =>
          toast({
            title: 'Link copied',
            description: 'The post URL is on your clipboard.',
          })
        }
      >
        Copy post link
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Copy post link' }));

    // The toast is portalled into the fixed viewport, outside the story root.
    await waitFor(async () => {
      await expect(await screen.findByText('Link copied')).toBeVisible();
    });
    await expect(
      await screen.findByText('The post URL is on your clipboard.')
    ).toBeVisible();
  },
};

/**
 * Dismissing. The close control is icon only and carries no visible label, so
 * `sr-only` text is the only thing naming it. The play function closes the
 * toast through that name and checks it left the viewport.
 */
export const Dismissing: Story = {
  render: () => (
    <div className="flex w-[24rem] justify-center">
      <ToasterProvider />
      <Button
        onClick={() =>
          toast({
            title: 'Subscribed',
            description: 'You will get an email when a new post goes up.',
          })
        }
      >
        Subscribe
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }));
    await expect(await screen.findByText('Subscribed')).toBeVisible();

    // Radix names the close button "Close" through its own sr-only label.
    const close = await screen.findByRole('button', { name: /close/i });
    await userEvent.click(close);

    await waitFor(() =>
      expect(screen.queryByText('Subscribed')).not.toBeVisible()
    );
  },
};

/**
 * The destructive variant, for a failure the reader has to notice. Same host,
 * the variant travels on the `toast()` call rather than on the provider.
 */
export const DestructiveToast: Story = {
  render: () => (
    <div className="flex w-[24rem] justify-center">
      <ToasterProvider />
      <Button
        variant="outline"
        onClick={() =>
          toast({
            variant: 'destructive',
            title: 'Could not reach the registry',
            description:
              'Download counts are showing the last successful build instead.',
          })
        }
      >
        Refresh download counts
      </Button>
    </div>
  ),
};

/**
 * With an action. `ToastAction` needs an `altText`, which is what a screen
 * reader announces in place of the button: without it the notification says
 * there is an action but not what it does.
 */
export const WithAction: Story = {
  render: () => (
    <div className="flex w-[24rem] justify-center">
      <ToasterProvider />
      <Button
        onClick={() =>
          toast({
            title: 'Draft saved',
            description: 'The post was written to contents/posts.',
            action: (
              <ToastAction altText="Undo saving the draft">Undo</ToastAction>
            ),
          })
        }
      >
        Save draft
      </Button>
    </div>
  ),
};

/**
 * Two toasts in a row. Because `TOAST_LIMIT` is 1 the second one replaces the
 * first rather than stacking, which is the single most surprising thing about
 * this store and worth seeing before relying on it.
 */
export const LimitOfOne: Story = {
  render: () => (
    <div className="flex w-[24rem] justify-center gap-2">
      <ToasterProvider />
      <Button
        variant="outline"
        onClick={() => {
          toast({ title: 'First notification' });
          toast({ title: 'Second notification' });
        }}
      >
        Raise two toasts
      </Button>
    </div>
  ),
  play: async () => {
    await userEvent.click(
      await screen.findByRole('button', { name: 'Raise two toasts' })
    );

    await expect(await screen.findByText('Second notification')).toBeVisible();
    await expect(screen.queryByText('First notification')).not.toBeInTheDocument();
  },
};
