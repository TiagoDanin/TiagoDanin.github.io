import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { Button, buttonVariants } from './button';
import { cn } from '@/lib/utils';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * The site is a read only portfolio, so there is no destructive action to
 * confirm. The stories below imagine the maintenance surface such an action
 * would live on, which is the honest way to document an unused primitive.
 */
const meta = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Interruptive confirmation built on `@radix-ui/react-alert-dialog`.',
          'Ships with the shadcn/ui install; no page currently renders it, and',
          'nothing in `src/` imports it.',
          '',
          'It differs from `Dialog` in three ways that matter. The content has',
          'role `alertdialog`, not `dialog`. There is no close button and no',
          'dismiss on overlay click or Escape by default, so the user has to',
          'answer. And it exports `AlertDialogAction` and `AlertDialogCancel`,',
          'which are pre styled with `buttonVariants()` and `buttonVariants({',
          "variant: 'outline' })` respectively.",
          '',
          'For a destructive confirmation, pass',
          "`className={cn(buttonVariants({ variant: 'destructive' }))}` to the",
          'action so the red treatment wins over the default primary.',
          '',
          'Content is portalled, so tests query it with `screen`.',
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
    onOpenChange: { description: 'Fires with the next open state.' },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The destructive confirmation. Cancel is the safe default and is listed first
 * in the DOM, so the initial focus and the Escape path both land on it.
 */
export const Destructive: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Remove project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove telegram-bot-api from the site?</AlertDialogTitle>
          <AlertDialogDescription>
            The project page, its entry in the GitHub sitemap and the RSS item all disappear on
            the next deploy. The npm package itself is untouched.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction className={cn(buttonVariants({ variant: 'destructive' }))}>
            Remove project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Remove project' }));

    const dialog = await screen.findByRole('alertdialog', {
      name: 'Remove telegram-bot-api from the site?',
    });
    await expect(dialog).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);

    await userEvent.click(within(dialog).getByRole('button', { name: 'Keep it' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};

/**
 * The non destructive case. Without the `destructive` override the action keeps
 * the slate primary treatment, which reads as a normal confirmation rather than
 * a warning.
 */
export const Confirmation: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Regenerate llms.txt</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Regenerate the machine readable layer?</AlertDialogTitle>
          <AlertDialogDescription>
            Rewrites llms.txt, the four list files and every .md mirror under public. The files
            are git ignored, so nothing is lost if you run it again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Regenerate</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Regenerate llms.txt' }));

    const dialog = await screen.findByRole('alertdialog', {
      name: 'Regenerate the machine readable layer?',
    });
    await expect(within(dialog).getByRole('button', { name: 'Regenerate' })).toBeVisible();

    await userEvent.click(within(dialog).getByRole('button', { name: 'Regenerate' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  },
};

/**
 * Escape closes an alert dialog too. Radix blocks the outside click dismissal
 * but keeps the keyboard escape hatch, so a keyboard user is never trapped.
 */
export const DismissedWithEscape: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Clear cached GitHub data</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear the cached GitHub data?</AlertDialogTitle>
          <AlertDialogDescription>
            The next build refetches every repository from the GitHub API, which takes a few
            minutes and counts against the rate limit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Clear cache</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Clear cached GitHub data' }));
    await expect(await screen.findByRole('alertdialog')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  },
};
