import type { Meta, StoryObj } from '@storybook/nextjs';
import { CalendarDays, Star } from 'lucide-react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * The obvious home for it would be the inline project links inside a blog post,
 * where a preview saves a round trip to the project page.
 */
const meta = {
  title: 'UI/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Preview panel that opens on hover, built on',
          '`@radix-ui/react-hover-card`. Ships with the shadcn/ui install; no',
          'page currently renders it and nothing in `src/` imports it.',
          '',
          'Hover is not an interaction every visitor has, so a hover card can',
          'only carry information that is also available somewhere else. Radix',
          'does open it on keyboard focus, but the panel is not focusable and',
          'holds no controls by design. Anything clickable belongs in a',
          '`Popover` instead.',
          '',
          '`HoverCardTrigger` renders an anchor by default, so it expects to wrap',
          'a link. Use `asChild` and supply the real `href`.',
          '',
          'Unlike the other overlays here, this file does not wrap the content in',
          'a portal, so the panel renders inside the trigger subtree. Tests still',
          'use `screen` for it, which works either way.',
          '',
          'The stories set `openDelay={0}` and `closeDelay={0}` so the',
          'interaction tests are deterministic. Production defaults are 700ms and',
          '300ms, which is what stops the panel firing on a passing cursor.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    openDelay: {
      control: { type: 'number' },
      description: 'Milliseconds of hover before the panel opens.',
      table: { defaultValue: { summary: '700' } },
    },
    closeDelay: {
      control: { type: 'number' },
      description: 'Milliseconds after the cursor leaves before the panel closes.',
      table: { defaultValue: { summary: '300' } },
    },
    open: { control: 'boolean', description: 'Controlled open state.' },
    onOpenChange: { description: 'Fires with the next open state.' },
  },
  args: {
    openDelay: 0,
    closeDelay: 0,
    onOpenChange: fn(),
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A repository preview behind an inline link, the way a post would mention one
 * of its own projects.
 */
export const ProjectPreview: Story = {
  render: (args) => (
    <p className="max-w-md text-sm">
      The polling loop is the part I rewrote twice in{' '}
      <HoverCard {...args}>
        <HoverCardTrigger asChild>
          <a
            href="/project/github/telegram-bot-api/"
            className="font-medium underline underline-offset-4"
          >
            telegram-bot-api
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-2">
            <h3 className="font-semibold leading-none">telegram-bot-api</h3>
            <p className="text-sm text-muted-foreground">
              Node.js client for the Telegram Bot API, typed end to end.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" aria-hidden="true" />
                320 stars
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                Updated May 2025
              </span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{' '}
      before it stopped dropping updates after a 429.
    </p>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('link', { name: 'telegram-bot-api' });

    await userEvent.hover(trigger);
    await expect(
      await screen.findByText('Node.js client for the Telegram Bot API, typed end to end.'),
    ).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);

    await userEvent.unhover(trigger);
    await waitFor(() =>
      expect(
        screen.queryByText('Node.js client for the Telegram Bot API, typed end to end.'),
      ).not.toBeInTheDocument(),
    );
  },
};

/**
 * The profile shape: avatar, handle, one line of bio, one metadata row. Keep
 * the panel to that, because at `w-64` anything longer wraps into a wall.
 */
export const AuthorPreview: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger asChild>
        <a href="/about/" className="font-medium underline underline-offset-4">
          @TiagoDanin
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="/logo.svg" alt="" />
            <AvatarFallback>TD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold leading-none">Tiago Danin</h3>
            <p className="text-sm text-muted-foreground">
              Mobile developer in Brazil. Flutter, React Native and a long tail of open source.
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              Publishing since 2016
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.hover(canvas.getByRole('link', { name: '@TiagoDanin' }));
    await expect(await screen.findByText('Tiago Danin')).toBeVisible();
    await expect(screen.getByText('Publishing since 2016')).toBeVisible();
  },
};

/**
 * A panel carrying a tag list. Badges render fine inside, but they are not
 * links here: a hover card that is only reachable by pointer must not be the
 * only route to a page.
 */
export const WithTags: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger asChild>
        <a href="/talk/flutter-ble-beacons/" className="font-medium underline underline-offset-4">
          Bluetooth beacons in Flutter
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h3 className="font-semibold leading-none">Bluetooth beacons in Flutter</h3>
          <p className="text-sm text-muted-foreground">
            Flutterando Conf 2024, Sao Paulo. Recorded, 38 minutes.
          </p>
          <div className="flex flex-wrap gap-1">
            {['flutter', 'bluetooth', 'android', 'ios'].map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.hover(canvas.getByRole('link', { name: 'Bluetooth beacons in Flutter' }));
    await expect(await screen.findByText('flutter')).toBeVisible();
    await expect(screen.getByText('Flutterando Conf 2024, Sao Paulo. Recorded, 38 minutes.')).toBeVisible();
  },
};
