import type { Meta, StoryObj } from '@storybook/nextjs';
import { Info, Rss, Share2 } from 'lucide-react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

/**
 * One importer, and it is not a page: `sidebar.tsx`, which no route renders.
 *
 * The stories cover the case a portfolio does hit, which is naming an icon only
 * control and explaining a number that has no room for a caption.
 */
const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Short hover and focus hint built on `@radix-ui/react-tooltip`. The',
          'only importer is `src/components/ui/sidebar.tsx`, which is itself',
          'unused, so no page on the site renders a tooltip today.',
          '',
          'Every tooltip needs a `TooltipProvider` above it. It owns the shared',
          'delay, which is what makes the second tooltip in a toolbar open',
          'instantly after the first. Wrap the toolbar, or the app, not each',
          'trigger.',
          '',
          'A tooltip is a supplement, never the only label. Radix wires it',
          'through `aria-describedby`, so an icon only button still needs its own',
          '`aria-label`: the description is announced after the name, and some',
          'screen reader modes skip it. `IconButton` below asserts both.',
          '',
          'Radix renders the accessible copy in a `role="tooltip"` node, which is',
          'what the tests query, and the visible bubble alongside it. Query by',
          'role rather than by text, because the text exists twice in the DOM.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    delayDuration: {
      control: { type: 'number' },
      description:
        'Milliseconds of hover before opening. Set on the provider for a shared delay, or per tooltip to override it.',
      table: { defaultValue: { summary: '700' } },
    },
    open: { control: 'boolean', description: 'Controlled open state.' },
    disableHoverableContent: {
      control: 'boolean',
      description:
        'Closes as soon as the cursor leaves the trigger, instead of letting it travel into the bubble.',
      table: { defaultValue: { summary: 'false' } },
    },
    onOpenChange: { description: 'Fires with the next open state.' },
  },
  args: {
    delayDuration: 0,
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The icon only control. The `aria-label` is the accessible name and the
 * tooltip is the description, so the button is usable with the tooltip never
 * opening at all.
 */
export const IconButton: Story = {
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Subscribe to the blog feed">
            <Rss />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Subscribe to the blog feed</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Subscribe to the blog feed' });

    await expect(trigger).toHaveAccessibleName('Subscribe to the blog feed');

    await userEvent.hover(trigger);
    const tip = await screen.findByRole('tooltip');
    await expect(tip).toHaveTextContent('Subscribe to the blog feed');
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);

    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  },
};

/**
 * Explaining a metric. The number carries the tooltip, so the label beside it
 * stays short enough to fit a stat row.
 */
export const MetricHint: Story = {
  render: (args) => (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-semibold">12.4k</span>
        <span className="text-sm text-muted-foreground">weekly downloads</span>
        <Tooltip {...args}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="How weekly downloads are counted">
              <Info />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            Summed across every npm package, refreshed when yarn data:npm runs.
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.hover(
      canvas.getByRole('button', { name: 'How weekly downloads are counted' }),
    );
    const tip = await screen.findByRole('tooltip');
    await expect(tip).toHaveTextContent('Summed across every npm package');
  },
};

/**
 * A tooltip opens on keyboard focus, not only on hover. Tabbing to the trigger
 * is the path a keyboard user takes, and it has to produce the same hint.
 */
export const OpensOnFocus: Story = {
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Share this project">
            <Share2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy the canonical project URL</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Share this project' });

    // Focus directly rather than tabbing: on the docs page every story shares
    // one document, so tab order reaches across stories.
    trigger.focus();
    await expect(trigger).toHaveFocus();

    const tip = await screen.findByRole('tooltip');
    await expect(tip).toHaveTextContent('Copy the canonical project URL');
  },
};

/**
 * Several triggers under one provider. After the first tooltip opens, the
 * others skip the delay, so a toolbar does not feel like it stutters.
 */
export const SharedProvider: Story = {
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'One `TooltipProvider` above a row of icon controls.' } },
  },
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center gap-1">
        {[
          { label: 'Subscribe to the blog feed', hint: 'RSS, updated on every deploy', icon: Rss },
          { label: 'Share this project', hint: 'Copy the canonical project URL', icon: Share2 },
          { label: 'About these numbers', hint: 'Counted at build time from contents/', icon: Info },
        ].map(({ label, hint, icon: Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={label}>
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.hover(canvas.getByRole('button', { name: 'About these numbers' }));
    const tip = await screen.findByRole('tooltip');
    await expect(tip).toHaveTextContent('Counted at build time from contents/');
  },
};
