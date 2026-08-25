import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArrowRight, Download, Linkedin } from 'lucide-react';

import { Button } from './button';

/**
 * The most reused control on the site: 39 modules import it.
 *
 * Two variants carry almost all of that usage. `default` is the slate-900
 * primary action, and `outline` is the "see everything" affordance at the end
 * of a section. The remaining variants exist because they ship with shadcn/ui,
 * and are documented here for completeness rather than because the site leans
 * on them.
 */
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Primary interactive control, built on shadcn/ui with Radix `Slot`',
          'support so it can delegate rendering to a child element.',
          '',
          'Set `asChild` when the button needs to *be* a link rather than',
          'contain one. That keeps a single accessible element in the tree',
          'instead of nesting an anchor inside a button, which assistive',
          'technology reports as two separate controls.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual treatment. `default` and `outline` cover site usage.',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Control height and padding. Use `icon` for square icon-only buttons.',
      table: { defaultValue: { summary: 'default' } },
    },
    asChild: {
      control: 'boolean',
      description:
        'Render the child element instead of a `<button>`, forwarding all styles to it. Use for links.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Blocks pointer events and drops opacity to 50%.',
    },
    children: {
      control: 'text',
      description: 'Button label. Icons are passed as siblings of the text.',
    },
  },
  args: {
    children: 'Get in touch',
    variant: 'default',
    size: 'default',
    asChild: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The slate-900 primary action. Every page ends on one of these. */
export const Default: Story = {};

/**
 * The section-level "see everything" control. `DESIGN.md` requires the count to
 * live inside the label rather than beside it, so the button carries the whole
 * message on its own.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'See all 250+ projects',
  },
};

/**
 * Icons sit as siblings of the label. The base class sizes any `svg` child to
 * 16px and disables its pointer events, so no per-icon styling is needed.
 */
export const WithIcon: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        See all 250+ projects
        <ArrowRight />
      </>
    ),
  },
};

/**
 * `asChild` hands the styling to the anchor, producing one accessible control
 * rather than a link nested inside a button. This is how the navbar renders its
 * LinkedIn action.
 */
export const AsLink: Story = {
  args: {
    asChild: true,
    children: (
      <a href="https://linkedin.com/in/tiagodanin" target="_blank" rel="noopener noreferrer">
        <Linkedin />
        LinkedIn
      </a>
    ),
  },
};

/**
 * Square control for toolbars and copy affordances. An icon-only button carries
 * no text, so it needs an `aria-label` to be announced at all.
 */
export const IconOnly: Story = {
  args: {
    size: 'icon',
    variant: 'ghost',
    children: <Download />,
    'aria-label': 'Download CV',
  },
};

/** Disabled controls keep their footprint so surrounding layout does not shift. */
export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Every variant side by side. `destructive` has no destructive action to attach
 * to on a portfolio site and is unused in production.
 */
export const AllVariants: Story = {
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Reference grid of the six shipped variants.' } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

/** The four sizes. `lg` is the hero and call-to-action size. */
export const AllSizes: Story = {
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Reference grid of the four shipped sizes.' } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Download CV">
        <Download />
      </Button>
    </div>
  ),
};
