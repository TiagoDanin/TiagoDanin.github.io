import type { Meta, StoryObj } from '@storybook/nextjs';
import { ChevronsUpDown } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Button } from './button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';

/**
 * Unstyled show and hide primitive, re-exported from Radix with no shadcn
 * chrome at all. Every class in these stories is written by the caller.
 */
const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'The file is three re-exports with no styling of its own, so anything',
          'built on it supplies its own layout.',
          '',
          'Unlike the accordion this is a single region rather than a group, and',
          'the trigger is whatever element you hand it. Wrap a `Button` in',
          '`CollapsibleTrigger asChild` so one accessible control ends up in the',
          'tree instead of a button inside a button.',
          '',
          'The content is unmounted while closed. If the hidden text needs to',
          'stay in the DOM for search or for in-page find, pass `forceMount` and',
          'hide it with CSS instead.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description:
        'Controlled state. Pair with `onOpenChange`. Leave undefined to let the primitive manage itself.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Uncontrolled starting state.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Blocks the trigger and locks the current state.',
    },
    onOpenChange: {
      action: 'openChange',
      description: 'Fires with the next open state on every toggle.',
    },
  },
  args: {
    defaultOpen: false,
    disabled: false,
    onOpenChange: fn(),
    className: 'w-104 max-w-[90vw] space-y-2',
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

const dependencies = [
  'flutter_bloc 8.1.6',
  'freezed_annotation 2.4.4',
  'go_router 14.2.0',
  'dio 5.5.0',
  'get_it 7.7.0',
  'shared_preferences 2.2.3',
];

/**
 * The pattern this component is actually for: a summary line that is always
 * readable, with the full list one click away. The play function opens it and
 * checks a hidden entry reached the DOM, then closes it and checks the entry
 * left again.
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-2">
          <span className="text-sm font-medium">
            6 direct dependencies
          </span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Show all dependencies">
              <ChevronsUpDown />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-1">
          {dependencies.map((dependency) => (
            <div
              key={dependency}
              className="rounded-md border px-4 py-2 font-mono text-sm text-muted-foreground"
            >
              {dependency}
            </div>
          ))}
        </CollapsibleContent>
      </>
    ),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Show all dependencies' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('go_router 14.2.0')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(await canvas.findByText('go_router 14.2.0')).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);

    await userEvent.click(trigger);

    await expect(canvas.queryByText('go_router 14.2.0')).not.toBeInTheDocument();
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};

/**
 * Starting open, for a region whose contents matter more than the space they
 * cost. The trigger still works, it just starts in the other state.
 */
export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
    children: (
      <>
        <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-2">
          <span className="text-sm font-medium">Talk abstract</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              Hide
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="rounded-md border px-4 py-3 text-sm text-muted-foreground">
          A walk through what actually breaks when a Flutter design system grows
          past forty components, and why documenting it in Widgetbook changed
          how the team reviewed pull requests.
        </CollapsibleContent>
      </>
    ),
  },
};

/**
 * A text trigger rather than an icon. With a visible label the control needs no
 * `aria-label`, and the label itself should say what happens next rather than
 * describe the current state.
 */
export const TextTrigger: Story = {
  args: {
    children: (
      <>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Show the build output
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded-md border bg-muted p-4 font-mono text-xs text-muted-foreground">
          <div>Running Gradle task assembleRelease</div>
          <div>Built build/app/outputs/flutter-apk/app-release.apk (18.4MB)</div>
        </CollapsibleContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: /Show the build output/i,
    });

    // Keyboard reach and toggle, the WCAG AA baseline for a disclosure.
    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(await canvas.findByText(/app-release.apk/i)).toBeVisible();
  },
};

/**
 * Disabled. The trigger keeps its place in the layout but no longer responds,
 * and `aria-disabled` tells assistive technology why nothing happened.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Source unavailable
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded-md border p-4 text-sm">
          This repository is private.
        </CollapsibleContent>
      </>
    ),
  },
};
