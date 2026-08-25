import type { Meta, StoryObj } from '@storybook/nextjs';
import { toast } from 'sonner';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import { Toaster } from './sonner';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * The repository also carries the older Radix `toast.tsx` and `toaster.tsx`
 * pair, so there are two unused toast systems side by side. Neither is mounted
 * in `src/app/layout.tsx`.
 */
const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Toast host, a thin wrapper around `sonner`. Ships with the shadcn/ui',
          'install; no page currently renders it and nothing in `src/` imports',
          'it. `layout.tsx` mounts no toaster at all.',
          '',
          'The component renders nothing on its own. It is a host: mount one',
          '`Toaster` near the root, then call `toast()` from anywhere. Every',
          'story below pairs the host with a button that fires one, because a',
          'host with no toast is an empty story.',
          '',
          'Two things about this copy are worth knowing. It reads the theme from',
          '`next-themes`, which the site does not provide: there is no dark mode',
          'here, so `useTheme()` returns nothing and the value falls back to',
          "`'system'`. And unlike the Radix overlays in this folder, sonner",
          'renders in place rather than in a portal, which is why the tests query',
          'through `within(canvasElement)` and not `screen`.',
          '',
          'A toast is announced through an `aria-live` region and then it is',
          'gone. Never put the only copy of an outcome in one, and never put a',
          'control there that has no equivalent on the page.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Corner the stack grows from.',
      table: { defaultValue: { summary: 'bottom-right' } },
    },
    closeButton: {
      control: 'boolean',
      description: 'Renders a dismiss button on each toast, labelled "Close toast".',
      table: { defaultValue: { summary: 'false' } },
    },
    richColors: {
      control: 'boolean',
      description: 'Tints success, error and warning toasts instead of using the neutral surface.',
      table: { defaultValue: { summary: 'false' } },
    },
    expand: {
      control: 'boolean',
      description: 'Keeps the stack expanded instead of collapsing it until hover.',
      table: { defaultValue: { summary: 'false' } },
    },
    duration: {
      control: { type: 'number' },
      description: 'Milliseconds before a toast dismisses itself.',
      table: { defaultValue: { summary: '4000' } },
    },
    visibleToasts: {
      control: { type: 'number' },
      description: 'How many toasts stay on screen before the oldest is dropped.',
      table: { defaultValue: { summary: '3' } },
    },
  },
  args: {
    position: 'bottom-right',
    closeButton: false,
    richColors: false,
    expand: false,
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The plain confirmation. A copy action is the honest example: the outcome is
 * already visible in the clipboard, so the toast only confirms it.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="outline"
        onClick={() => toast('Install command copied to the clipboard')}
      >
        Copy install command
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Sonner keeps its queue in a module level store that outlives a remount,
    // so clear anything an earlier story left behind.
    toast.dismiss();

    await userEvent.click(canvas.getByRole('button', { name: 'Copy install command' }));
    await expect(
      await canvas.findByText('Install command copied to the clipboard'),
    ).toBeVisible();
  },
};

/**
 * A toast with a description. The title carries the outcome and the
 * description the detail, which is the only shape worth two lines.
 */
export const WithDescription: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={() =>
          toast.success('Subscribed to the blog feed', {
            description: 'New posts appear in your reader within a few minutes of a deploy.',
          })
        }
      >
        Subscribe
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Sonner keeps its queue in a module level store that outlives a remount,
    // so clear anything an earlier story left behind.
    toast.dismiss();

    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }));
    await expect(await canvas.findByText('Subscribed to the blog feed')).toBeVisible();
    await expect(
      canvas.getByText('New posts appear in your reader within a few minutes of a deploy.'),
    ).toBeVisible();
  },
};

/**
 * The failure case, with an action. The action label is a button inside the
 * toast, so it has to be short enough to read at a glance and duplicated
 * somewhere permanent.
 */
export const ErrorWithAction: Story = {
  args: { richColors: true },
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Could not load the GitHub projects', {
            description: 'The API answered 403. The rate limit resets in a few minutes.',
            action: { label: 'Retry', onClick: () => toast('Retrying') },
          })
        }
      >
        Load projects
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Sonner keeps its queue in a module level store that outlives a remount,
    // so clear anything an earlier story left behind.
    toast.dismiss();

    await userEvent.click(canvas.getByRole('button', { name: 'Load projects' }));
    await expect(await canvas.findByText('Could not load the GitHub projects')).toBeVisible();

    await userEvent.click(await canvas.findByRole('button', { name: 'Retry' }));
    await expect(await canvas.findByText('Retrying')).toBeVisible();
  },
};

/**
 * `closeButton` gives every toast a labelled dismiss control, so the toast is
 * not only dismissible by waiting. Turn it on whenever `duration` is long or
 * set to `Infinity`.
 */
export const Dismissible: Story = {
  args: { closeButton: true, duration: 60_000 },
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="outline"
        onClick={() => toast('Draft saved to contents/posts', { description: 'Not published yet.' })}
      >
        Save draft
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Sonner keeps its queue in a module level store that outlives a remount,
    // so clear anything an earlier story left behind.
    toast.dismiss();
    await waitFor(() => expect(canvas.queryAllByRole('listitem')).toHaveLength(0));

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }));
    await expect(await canvas.findByText('Draft saved to contents/posts')).toBeVisible();

    await userEvent.click(await canvas.findByRole('button', { name: 'Close toast' }));
    await waitFor(() =>
      expect(canvas.queryByText('Draft saved to contents/posts')).not.toBeInTheDocument(),
    );
  },
};

/**
 * Several toasts at once. `visibleToasts` caps the stack at three by default,
 * and the rest queue behind it rather than filling the corner.
 */
export const Stacked: Story = {
  args: { expand: true },
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="outline"
        onClick={() => {
          toast('GitHub projects synced');
          toast('npm packages synced');
          toast('RSS feeds regenerated');
        }}
      >
        Run data sync
      </Button>
      <Toaster {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Sonner keeps its queue in a module level store that outlives a remount,
    // so clear anything an earlier story left behind.
    toast.dismiss();

    await userEvent.click(canvas.getByRole('button', { name: 'Run data sync' }));
    await expect(await canvas.findByText('RSS feeds regenerated')).toBeVisible();
    await expect(canvas.getByText('npm packages synced')).toBeVisible();
    await expect(canvas.getByText('GitHub projects synced')).toBeVisible();
  },
};
