import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

/**
 * The primitives behind `Toaster`. Two files import this one: `toaster.tsx`,
 * which composes them into the host mounted in the root layout, and
 * `hooks/use-toast.ts`, which imports its types. No page renders these
 * primitives directly, and nothing in the app calls `toast()`, so no toast has
 * ever appeared on the live site.
 */
const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radix `Toast` with the shadcn skin: `ToastProvider`,',
          '`ToastViewport`, `Toast`, `ToastTitle`, `ToastDescription`,',
          '`ToastAction` and `ToastClose`.',
          '',
          'Three pieces are mandatory and easy to forget. A `ToastProvider`',
          'has to wrap everything, a `ToastViewport` has to exist somewhere',
          'inside it, and each `Toast` portals itself into that viewport',
          'rather than rendering where it was written. A toast with no',
          'viewport in scope renders nothing at all.',
          '',
          'Most code should reach for `Toaster` and the `toast()` helper',
          'instead, which own the provider and the viewport already. Use these',
          'primitives only when the toast needs to be controlled by hand.',
          '',
          'The toast itself is a tab stop, and Radix binds F8 as a hotkey that',
          'jumps focus to the viewport, so a keyboard user can reach the',
          'action or the close button without hunting for it.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description:
        '`destructive` fills the toast with the destructive token. Reserve it for something that actually failed.',
      table: { defaultValue: { summary: 'default' } },
    },
    open: {
      control: 'boolean',
      description: 'Controlled visibility. Pair it with `onOpenChange` so swipe and Escape still work.',
    },
    duration: {
      control: 'number',
      description:
        'Milliseconds before the toast closes itself. Set a long value for anything holding an action.',
      table: { defaultValue: { summary: '5000' } },
    },
    type: {
      control: 'select',
      options: ['foreground', 'background'],
      description:
        '`foreground` interrupts a screen reader, `background` waits its turn. Use `background` for anything the user did not just trigger.',
      table: { defaultValue: { summary: 'foreground' } },
    },
    onOpenChange: { description: 'Fires when the toast opens or closes, whatever caused it.' },
  },
  args: {
    variant: 'default',
    duration: 100000,
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The whole arrangement: provider, trigger, toast, viewport. The trigger is
 * part of the story because a toast with no way to fire it documents nothing.
 */
export const Default: Story = {
  render: (args) => {
    const ToastDemo = () => {
      const [open, setOpen] = React.useState(false);

      return (
        <ToastProvider>
          <Button onClick={() => setOpen(true)}>Copy the install command</Button>
          <Toast
            {...args}
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              args.onOpenChange?.(next);
            }}
          >
            <div className="grid gap-1">
              <ToastTitle>Copied</ToastTitle>
              <ToastDescription>npm i telegram-bot-api is on your clipboard.</ToastDescription>
            </div>
            <ToastClose aria-label="Close" />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    };

    return <ToastDemo />;
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByText('Copied')).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Copy the install command' }));

    await expect(await canvas.findByText('Copied')).toBeInTheDocument();
    await expect(
      canvas.getByText('npm i telegram-bot-api is on your clipboard.'),
    ).toBeInTheDocument();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
  },
};

/**
 * Dismissing with the close button. It is icon only, so it carries an
 * `aria-label`: it is invisible until the toast is hovered or the button is
 * focused, and without a name it is announced as a bare button.
 */
export const Dismissible: Story = {
  render: (args) => {
    const ToastDemo = () => {
      const [open, setOpen] = React.useState(true);

      return (
        <ToastProvider>
          <Button onClick={() => setOpen(true)}>Copy the install command</Button>
          <Toast
            {...args}
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              args.onOpenChange?.(next);
            }}
          >
            <div className="grid gap-1">
              <ToastTitle>Copied</ToastTitle>
              <ToastDescription>npm i telegram-bot-api is on your clipboard.</ToastDescription>
            </div>
            <ToastClose aria-label="Close notification" />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    };

    return <ToastDemo />;
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    const close = await canvas.findByRole('button', { name: 'Close notification' });
    await userEvent.click(close);

    await waitFor(async () => {
      await expect(canvas.queryByText('Copied')).not.toBeInTheDocument();
    });
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};

/**
 * `destructive`, for something that failed rather than something that merely
 * happened. The description has to say what to do next, since the colour alone
 * is not information.
 */
export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => {
    const ToastDemo = () => {
      const [open, setOpen] = React.useState(true);

      return (
        <ToastProvider>
          <Toast {...args} open={open} onOpenChange={setOpen}>
            <div className="grid gap-1">
              <ToastTitle>Could not load the GitHub projects</ToastTitle>
              <ToastDescription>The API rate limit was hit. Try again in a minute.</ToastDescription>
            </div>
            <ToastClose aria-label="Close notification" />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    };

    return <ToastDemo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Could not load the GitHub projects')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Close notification' })).toBeInTheDocument();
  },
};

/**
 * A toast carrying a retry. `ToastAction` needs `altText`: it is the sentence a
 * screen reader is given so the same action can be reached without the toast,
 * which may already have timed out by the time it is announced.
 */
export const WithAction: Story = {
  args: { variant: 'destructive' },
  render: (args) => {
    const ToastDemo = () => {
      const [open, setOpen] = React.useState(true);
      const [retries, setRetries] = React.useState(0);

      return (
        <ToastProvider>
          <p className="text-sm text-muted-foreground">Retries: {retries}</p>
          <Toast {...args} open={open} onOpenChange={setOpen}>
            <div className="grid gap-1">
              <ToastTitle>Could not load the GitHub projects</ToastTitle>
              <ToastDescription>The API rate limit was hit.</ToastDescription>
            </div>
            <ToastAction altText="Retry loading the GitHub projects" onClick={() => setRetries((count) => count + 1)}>
              Retry
            </ToastAction>
            <ToastClose aria-label="Close notification" />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    };

    return <ToastDemo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', { name: 'Retry' }));

    await expect(canvas.getByText('Retries: 1')).toBeInTheDocument();
  },
};

/**
 * Keyboard reachability. Tab out of the page and focus lands on the toast
 * itself, then on its action and its close button, in that order. Radix also
 * binds F8 as a hotkey that jumps straight to the viewport, which matters once
 * focus has already moved past the toast.
 */
export const KeyboardReachable: Story = {
  render: (args) => {
    const ToastDemo = () => {
      const [open, setOpen] = React.useState(true);

      return (
        <ToastProvider>
          <Button>Somewhere else on the page</Button>
          <Toast {...args} open={open} onOpenChange={setOpen}>
            <div className="grid gap-1">
              <ToastTitle>Draft saved</ToastTitle>
              <ToastDescription>The talk proposal was saved locally.</ToastDescription>
            </div>
            <ToastAction altText="Undo saving the draft">Undo</ToastAction>
            <ToastClose aria-label="Close notification" />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    };

    return <ToastDemo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Draft saved');

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Somewhere else on the page' })).toHaveFocus();

    // The toast itself is a tab stop, so it is announced before its controls.
    await userEvent.tab();
    await expect(canvas.getByRole('status')).toHaveFocus();

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Undo' })).toHaveFocus();

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Close notification' })).toHaveFocus();
  },
};

/**
 * Title only. The description is optional, and a short confirmation reads
 * better without one padded out to fill the space.
 */
export const TitleOnly: Story = {
  render: (args) => {
    const ToastDemo = () => {
      const [open, setOpen] = React.useState(true);

      return (
        <ToastProvider>
          <Toast {...args} open={open} onOpenChange={setOpen}>
            <div className="grid gap-1">
              <ToastTitle>Link copied</ToastTitle>
            </div>
            <ToastClose aria-label="Close notification" />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
    };

    return <ToastDemo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('Link copied')).toBeInTheDocument();
  },
};
