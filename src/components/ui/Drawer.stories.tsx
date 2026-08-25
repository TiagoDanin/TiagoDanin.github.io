import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * It is the only overlay here not built on Radix: the implementation wraps
 * `vaul`, which adds the drag to dismiss gesture the grabber handle hints at.
 */
const meta = {
  title: 'UI/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Bottom anchored, drag dismissable panel built on `vaul`. Ships with',
          'the shadcn/ui install; no page currently renders it and nothing in',
          '`src/` imports it. `Sheet` covers the one overlay the site does use.',
          '',
          'Two details are specific to this wrapper. `DrawerContent` prepends the',
          'grabber pill, so a composition never draws its own. And `Drawer`',
          'defaults `shouldScaleBackground` to `true`, which asks vaul to shrink',
          'the page behind the panel: that only shows if an ancestor carries',
          '`data-vaul-drawer-wrapper`, which this site never sets, so the effect',
          'is inert here.',
          '',
          'Unlike `Sheet`, the content has no built in close button. Give every',
          'drawer an explicit `DrawerClose`, because the drag gesture is not',
          'available to keyboard or screen reader users.',
          '',
          'Content is portalled, so tests query it with `screen`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    open: { control: 'boolean', description: 'Controlled open state.' },
    shouldScaleBackground: {
      control: 'boolean',
      description:
        'Scales the page behind the drawer. Requires an ancestor with `data-vaul-drawer-wrapper`.',
      table: { defaultValue: { summary: 'true' } },
    },
    dismissible: {
      control: 'boolean',
      description: 'Allows drag and outside click dismissal. Set `false` to force an explicit choice.',
      table: { defaultValue: { summary: 'true' } },
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
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The mobile shape this primitive exists for: a short list of actions on a
 * project card, reachable with a thumb.
 */
export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Project actions</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>telegram-bot-api</DrawerTitle>
            <DrawerDescription>
              Node.js client for the Telegram Bot API. 320 stars, published on npm.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Open on GitHub</Button>
            <Button variant="outline">Copy install command</Button>
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Project actions' }));

    const drawer = await screen.findByRole('dialog', { name: 'telegram-bot-api' });
    await expect(drawer).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await expect(within(drawer).getByRole('button', { name: 'Open on GitHub' })).toBeVisible();

    await userEvent.click(within(drawer).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

/**
 * `dismissible={false}` removes the drag and the outside click, so the drawer
 * can only be closed through a control it renders. Use it when leaving without
 * choosing would lose work, and never without a visible way out.
 */
export const NotDismissible: Story = {
  args: { dismissible: false },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Choose a language</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Read this post in</DrawerTitle>
            <DrawerDescription>
              This post exists in both languages. The choice sets which URL you land on.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Portugues</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">English</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Choose a language' }));

    const drawer = await screen.findByRole('dialog', { name: 'Read this post in' });
    await expect(within(drawer).getByRole('button', { name: 'English' })).toBeVisible();

    await userEvent.click(within(drawer).getByRole('button', { name: 'English' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

/**
 * A body long enough to need its own scroll container. `DrawerContent` is a
 * flex column pinned to the bottom, so the scrolling belongs on the body, not
 * on the content itself.
 */
export const LongContent: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Browse tags</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Browse by tag</DrawerTitle>
            <DrawerDescription>Every tag used across the blog and the talks.</DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[40vh] overflow-y-auto px-4">
            <ul className="space-y-1 text-sm">
              {[
                'flutter',
                'react-native',
                'android',
                'ios',
                'lua',
                'nodejs',
                'typescript',
                'open-source',
                'security',
                'reverse-engineering',
                'ci-cd',
                'career',
              ].map((tag) => (
                <li key={tag}>
                  <a
                    href={`/blog/tags/${tag}/`}
                    className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    #{tag}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Browse tags' }));

    const drawer = await screen.findByRole('dialog', { name: 'Browse by tag' });
    await expect(within(drawer).getAllByRole('link')).toHaveLength(12);
    await expect(within(drawer).getByRole('link', { name: '#flutter' })).toBeVisible();
  },
};
