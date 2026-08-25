import type { Meta, StoryObj } from '@storybook/nextjs';
import { AlertTriangle, Archive, Info, Languages } from 'lucide-react';
import { expect, within } from 'storybook/test';

import { Alert, AlertDescription, AlertTitle } from './alert';

/**
 * Static notice block. Not wired into any page yet, so the stories below are
 * proposals for the three notices this site would plausibly need.
 */
const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          '',
          'The root carries `role="alert"`, which makes assistive technology',
          'announce the contents as soon as they appear. That is correct for a',
          'message that shows up in response to something the reader did, and',
          'wrong for a permanent banner that is part of the page: an always',
          'present notice interrupts the screen reader on every visit.',
          '',
          'Layout is driven entirely by sibling selectors. An `svg` placed as',
          'the first child is absolutely positioned in the top left corner and',
          'the following elements get left padding to clear it. Nothing needs to',
          'be passed for that to work, but it also means an icon wrapped in a',
          '`span` breaks the offset.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'destructive'],
      description:
        '`default` is the neutral bordered card. `destructive` recolours the border, the text and the icon with the destructive token.',
      table: { defaultValue: { summary: 'default' } },
    },
    children: {
      control: false,
      description:
        'Compose from `AlertTitle` and `AlertDescription`. An `svg` as the first child is positioned automatically.',
    },
  },
  args: {
    variant: 'default',
    className: 'max-w-2xl',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Title plus description, no icon. The title is an `h5`, so it participates in
 * the heading outline of whatever page it lands on. Check that against the
 * surrounding headings before dropping it into a post.
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <AlertTitle>This post was written in 2021</AlertTitle>
        <AlertDescription>
          React Native has changed since then. The pipeline described here still
          runs, but the GitLab syntax in the examples has moved on.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole('alert');

    await expect(alert).toHaveTextContent('This post was written in 2021');
  },
};

/**
 * With a leading icon. This is the shape most notices should use: the icon
 * gives the message a category at a glance before any of the text is read.
 */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Info />
        <AlertTitle>Portuguese version available</AlertTitle>
        <AlertDescription>
          This article was originally written in Portuguese. The English version
          is a translation and may lag one revision behind.
        </AlertDescription>
      </>
    ),
  },
};

/**
 * The destructive variant, for a state the reader should not ignore: a package
 * that no longer receives fixes, a repository that was archived.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <AlertTriangle />
        <AlertTitle>Repository archived</AlertTitle>
        <AlertDescription>
          This project is read only on GitHub. Issues and pull requests are
          closed, and the published npm version will not receive security
          patches.
        </AlertDescription>
      </>
    ),
  },
};

/**
 * Title only. Without a description the block collapses to a single line, which
 * is enough for a status label but loses the room to say what the reader should
 * do about it.
 */
export const TitleOnly: Story = {
  args: {
    children: (
      <>
        <Archive />
        <AlertTitle>Deprecated since v3.0.0</AlertTitle>
      </>
    ),
  },
};

/**
 * Description only. Useful when the alert sits directly under a heading that
 * already names the situation, so a second title would just repeat it.
 */
export const DescriptionOnly: Story = {
  args: {
    children: (
      <AlertDescription>
        The download counts on this page are refreshed at build time, so they can
        be up to a day behind the npm registry.
      </AlertDescription>
    ),
  },
};

/**
 * Long body text, to confirm the icon offset holds across several lines rather
 * than only clearing the first one.
 */
export const LongDescription: Story = {
  args: {
    children: (
      <>
        <Languages />
        <AlertTitle>How the bilingual routes work</AlertTitle>
        <AlertDescription>
          Every post exists at its own URL per language rather than switching
          text in place. The English article lives at the base path and the
          Portuguese one under a child segment, each with its own canonical tag
          and its own sitemap entry. When only one language exists, no alternate
          link is emitted at all, so a crawler is never pointed at a page that
          was never generated.
        </AlertDescription>
      </>
    ),
  },
};

/** Both variants side by side, for a quick contrast check against white. */
export const AllVariants: Story = {
  args: { children: null },
  parameters: {
    docs: { description: { story: 'Reference grid of the two shipped variants.' } },
  },
  render: () => (
    <div className="flex max-w-2xl flex-col gap-4">
      <Alert>
        <Info />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>
          Neutral border on the page background.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>
          Border, text and icon all take the destructive token.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
