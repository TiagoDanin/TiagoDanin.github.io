import type { Meta, StoryObj } from '@storybook/nextjs';
import { Rss } from 'lucide-react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * Ships with the shadcn/ui install; no page currently renders it.
 *
 * Kept documented because it is the right primitive for the two panels this
 * site keeps almost needing: the RSS feed picker and the language switcher.
 */
const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Click triggered floating panel built on `@radix-ui/react-popover`.',
          'Ships with the shadcn/ui install; no page currently renders it and',
          'nothing in `src/` imports it.',
          '',
          'It exports only three parts: `Popover`, `PopoverTrigger` and',
          '`PopoverContent`. There is no header, footer or title subcomponent, so',
          'the panel is plain markup inside a fixed `w-72` box. Override the',
          'width through `className` when the content needs more room.',
          '',
          '`PopoverContent` portals itself and takes `align` and `sideOffset`,',
          'defaulted to `center` and `4`. Radix gives the panel role `dialog`,',
          'which is what tests query for.',
          '',
          'Reach for `Popover` when the panel holds focusable controls, and for',
          '`HoverCard` when it is preview text. A hover only affordance is not',
          'reachable by keyboard.',
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
    modal: {
      control: 'boolean',
      description: 'Traps focus and blocks outside interaction while open.',
      table: { defaultValue: { summary: 'false' } },
    },
    onOpenChange: { description: 'Fires with the next open state.' },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The feed picker. The site generates four RSS feeds, and a popover is a
 * better fit than a dropdown menu because each row is a link with a subtitle,
 * not a command.
 */
export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Rss />
          Subscribe
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold leading-none">Pick a feed</h3>
            <p className="text-sm text-muted-foreground">
              Four RSS feeds, one per collection. All of them carry both languages.
            </p>
          </div>
          <ul className="space-y-1 text-sm">
            {[
              ['Blog', '/rss/blog.xml'],
              ['Talks', '/rss/talks.xml'],
              ['Projects', '/rss/projects.xml'],
              ['Timeline', '/rss/timeline.xml'],
            ].map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="block rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }));

    const panel = await screen.findByRole('dialog');
    await expect(panel).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await expect(within(panel).getByRole('link', { name: 'Talks' })).toHaveAttribute(
      'href',
      '/rss/talks.xml',
    );

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

/**
 * A popover holding form controls. Radix moves focus into the panel on open,
 * so the first field is reachable without a pointer.
 */
export const WithForm: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">Newsletter</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold leading-none">Get new posts by email</h3>
            <p className="text-sm text-muted-foreground">
              One message per post. No tracking pixel, no sequence.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newsletter-email">Email</Label>
            <Input id="newsletter-email" type="email" placeholder="voce@exemplo.com.br" />
          </div>
          <Button type="submit" className="w-full">
            Subscribe
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Newsletter' }));

    const panel = await screen.findByRole('dialog');
    const email = within(panel).getByLabelText('Email');
    await userEvent.type(email, 'leitor@exemplo.com.br');
    await expect(email).toHaveValue('leitor@exemplo.com.br');
  },
};

/**
 * `align` decides which edge of the trigger the panel lines up with. `start`
 * keeps a wide panel inside the viewport when the trigger sits near the left
 * edge, which is where a sidebar control lives.
 */
export const AlignedToStart: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">Build info</Button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8}>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Framework</dt>
            <dd className="font-medium">Next.js 16</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Output</dt>
            <dd className="font-medium">Static export</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Host</dt>
            <dd className="font-medium">GitHub Pages</dd>
          </div>
        </dl>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Build info' }));

    const panel = await screen.findByRole('dialog');
    await expect(within(panel).getByText('Static export')).toBeVisible();
    await expect(panel).toHaveAttribute('data-align', 'start');
  },
};
