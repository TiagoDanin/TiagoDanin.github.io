import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

/**
 * Radix tabs with the shadcn pill styling. Unused today, and the obvious
 * candidate for anything that has an English and a Portuguese side.
 */
const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          '',
          'Worth being careful before reaching for it on this site. The English',
          'and Portuguese versions of a post live at separate URLs on purpose,',
          'each with its own canonical tag and its own sitemap entry. Collapsing',
          'them into two tabs on one page would undo that. Tabs are the right',
          'tool for two views of the same resource, such as a readme beside its',
          'install instructions, not for two documents that each deserve to be',
          'found on their own.',
          '',
          'Activation is automatic by default: moving between triggers with the',
          'arrow keys switches the panel as focus lands. Pass',
          '`activationMode="manual"` when the panel is expensive to render, so',
          'the reader arrows to a tab and then presses Enter.',
          '',
          'Panels are unmounted while inactive unless `forceMount` is set, so',
          'their content is absent from the DOM rather than hidden.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Value of the tab open on first render, when uncontrolled.',
    },
    value: {
      control: false,
      description: 'Controlled active tab. Pair with `onValueChange`.',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Decides which arrow keys move between triggers. The shipped styles only lay the list out horizontally.',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    activationMode: {
      control: 'inline-radio',
      options: ['automatic', 'manual'],
      description:
        '`automatic` switches the panel as focus moves. `manual` waits for Enter or Space.',
      table: { defaultValue: { summary: 'automatic' } },
    },
    onValueChange: {
      action: 'valueChange',
      description: 'Fires with the value of the newly selected tab.',
    },
  },
  args: {
    defaultValue: 'en',
    onValueChange: fn(),
    className: 'w-[32rem] max-w-[90vw]',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const bilingualAbstract = (
  <>
    <TabsList>
      <TabsTrigger value="en">English</TabsTrigger>
      <TabsTrigger value="pt">Portugues</TabsTrigger>
    </TabsList>
    <TabsContent value="en" className="rounded-md border p-4 text-sm">
      <h4 className="mb-1 font-medium">Documenting a Flutter design system</h4>
      <p className="text-muted-foreground">
        What actually breaks once a design system passes forty components, and
        why moving the catalog into Widgetbook changed how the team reviewed
        pull requests.
      </p>
    </TabsContent>
    <TabsContent value="pt" className="rounded-md border p-4 text-sm">
      <h4 className="mb-1 font-medium">
        Documentando um design system em Flutter
      </h4>
      <p className="text-muted-foreground">
        O que realmente quebra quando um design system passa de quarenta
        componentes, e por que levar o catalogo para o Widgetbook mudou a forma
        como o time revisava pull requests.
      </p>
    </TabsContent>
  </>
);

/**
 * Two language versions of the same abstract. The play function switches tabs
 * with the mouse and checks the panel swapped, not just that the pill moved.
 */
export const Default: Story = {
  args: { children: bilingualAbstract },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const english = canvas.getByRole('tab', { name: 'English' });
    const portuguese = canvas.getByRole('tab', { name: 'Portugues' });

    await expect(english).toHaveAttribute('aria-selected', 'true');
    await expect(
      canvas.getByText(/passes forty components/i)
    ).toBeVisible();

    await userEvent.click(portuguese);

    await expect(portuguese).toHaveAttribute('aria-selected', 'true');
    await expect(english).toHaveAttribute('aria-selected', 'false');
    await expect(
      await canvas.findByText(/passa de quarenta componentes/i)
    ).toBeVisible();
    // The English panel is unmounted, not hidden.
    await expect(
      canvas.queryByText(/passes forty components/i)
    ).not.toBeInTheDocument();
    await expect(args.onValueChange).toHaveBeenCalledWith('pt');
  },
};

/**
 * Keyboard path, which is the WCAG AA baseline here. A tab list is a single
 * stop in the tab order: Tab reaches the selected trigger, and the arrow keys
 * move between triggers inside it. With automatic activation the panel changes
 * as focus lands.
 */
export const KeyboardOperated: Story = {
  args: { children: bilingualAbstract },
  parameters: {
    docs: {
      description: {
        story:
          'Tabs into the list, presses ArrowRight, and asserts both that focus moved and that the panel behind it changed.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const english = canvas.getByRole('tab', { name: 'English' });
    const portuguese = canvas.getByRole('tab', { name: 'Portugues' });

    await userEvent.tab();
    await expect(english).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');

    await expect(portuguese).toHaveFocus();
    await expect(portuguese).toHaveAttribute('aria-selected', 'true');
    await expect(
      await canvas.findByText(/passa de quarenta componentes/i)
    ).toBeVisible();
  },
};

/**
 * Manual activation. Focus moves without switching the panel, so the reader
 * arrows across the triggers and commits with Enter. Use this when a panel is
 * expensive enough that rendering it on the way past is wasteful.
 */
export const ManualActivation: Story = {
  args: {
    activationMode: 'manual',
    children: bilingualAbstract,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const english = canvas.getByRole('tab', { name: 'English' });
    const portuguese = canvas.getByRole('tab', { name: 'Portugues' });

    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');

    // Focus moved, selection did not.
    await expect(portuguese).toHaveFocus();
    await expect(english).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{Enter}');
    await expect(portuguese).toHaveAttribute('aria-selected', 'true');
  },
};

/**
 * Three tabs over one project. This is the case tabs are genuinely good at:
 * several views of a single resource, where only one URL is warranted.
 */
export const ProjectViews: Story = {
  args: {
    defaultValue: 'readme',
    children: (
      <>
        <TabsList>
          <TabsTrigger value="readme">Readme</TabsTrigger>
          <TabsTrigger value="install">Install</TabsTrigger>
          <TabsTrigger value="releases">Releases</TabsTrigger>
        </TabsList>
        <TabsContent value="readme" className="rounded-md border p-4 text-sm">
          <p className="text-muted-foreground">
            A typed client for the Telegram Bot API with no runtime dependencies.
          </p>
        </TabsContent>
        <TabsContent value="install" className="rounded-md border p-4">
          <pre className="font-mono text-xs text-muted-foreground">
            yarn add telegram-bot-api
          </pre>
        </TabsContent>
        <TabsContent value="releases" className="rounded-md border p-4 text-sm">
          <ul className="space-y-1 text-muted-foreground">
            <li>4.2.1, adds retry on 429</li>
            <li>4.2.0, webhook signature verification</li>
            <li>4.1.3, drops the polyfill for Node 16</li>
          </ul>
        </TabsContent>
      </>
    ),
  },
};

/**
 * A disabled trigger. It keeps its place in the list, is skipped by the arrow
 * keys, and carries `aria-disabled`, so the reason it cannot be reached is
 * announced rather than silent.
 */
export const WithDisabledTab: Story = {
  args: {
    defaultValue: 'en',
    children: (
      <>
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="pt" disabled>
            Portugues
          </TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="rounded-md border p-4 text-sm">
          <p className="text-muted-foreground">
            This post has no Portuguese translation yet, so the second tab is
            disabled rather than hidden. Hiding it would leave no hint that a
            translation is planned.
          </p>
        </TabsContent>
        <TabsContent value="pt" className="rounded-md border p-4 text-sm">
          Not translated yet.
        </TabsContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('tab', { name: 'Portugues' })).toBeDisabled();
  },
};

/**
 * Long labels. The list is `inline-flex` with no wrapping, so it grows past its
 * container instead of breaking onto a second line. Keep tab labels to one or
 * two words, or switch to a select on narrow screens.
 */
export const LongLabels: Story = {
  args: {
    defaultValue: 'overview',
    className: 'w-[24rem] max-w-[90vw]',
    children: (
      <>
        <TabsList>
          <TabsTrigger value="overview">Project overview</TabsTrigger>
          <TabsTrigger value="metrics">Download metrics</TabsTrigger>
          <TabsTrigger value="contrib">Contribution guide</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="rounded-md border p-4 text-sm">
          The list above overflows its container at this width.
        </TabsContent>
        <TabsContent value="metrics" className="rounded-md border p-4 text-sm">
          18,420 downloads in the last week.
        </TabsContent>
        <TabsContent value="contrib" className="rounded-md border p-4 text-sm">
          Open an issue before a pull request that changes public types.
        </TabsContent>
      </>
    ),
  },
};
