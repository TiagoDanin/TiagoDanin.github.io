import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { Separator } from './separator';

/**
 * Radix Separator. Available but not yet used by a shipped page.
 */
const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A one-pixel rule in `bg-border`, horizontal or vertical.',
          '',
          'The prop that matters is `decorative`, and it defaults to `true`. A',
          'decorative separator gets `role="none"`, so a screen reader skips it',
          'entirely; that is correct when the rule is drawing a boundary the',
          'surrounding headings already express. Pass `decorative={false}` when',
          'the rule is the only thing marking a boundary, and Radix emits',
          '`role="separator"` with `aria-orientation`, announcing it.',
          '',
          'Vertical separators need a parent with a resolved height. The',
          'component is `h-full w-[1px]`, so inside a plain block container with',
          'auto height it collapses to nothing. Give the row a fixed height or',
          '`items-stretch`.',
          '',
          'Nothing on the site renders this today. It is imported only by',
          '`ui/sidebar.tsx`, which is unused shadcn scaffolding left from the',
          'template. Treated here as a primitive that is available rather than one',
          'that is in production.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Sets the axis and the sizing classes. Vertical needs a parent with a real height.',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    decorative: {
      control: 'boolean',
      description:
        'True hides the rule from assistive technology (`role="none"`). False announces it as a separator.',
      table: { defaultValue: { summary: 'true' } },
    },
    className: {
      control: 'text',
      description: 'Merged through `cn`. Where spacing and any inset are applied.',
    },
  },
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default: horizontal, decorative, full width. The headings around it carry
 * the structure, so the rule itself is announced to nobody.
 */
export const Horizontal: Story = {
  render: (args) => (
    <div className="max-w-md">
      <div>
        <p className="text-sm font-medium">Open source</p>
        <p className="text-sm text-muted-foreground">
          70+ packages on npm, maintained in the open.
        </p>
      </div>
      <Separator {...args} className="my-4" />
      <div>
        <p className="text-sm font-medium">Security research</p>
        <p className="text-sm text-muted-foreground">
          HackerOne partner programmes since 2018.
        </p>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    // Decorative is the default, so there is nothing for a screen reader here.
    await expect(canvas.queryByRole('separator')).not.toBeInTheDocument();
  },
};

/**
 * `decorative={false}` puts the rule into the accessibility tree as a real
 * separator. Use it when the rule is the only signal that a boundary exists, for
 * example between two unlabelled groups.
 *
 * Radix only emits `aria-orientation` when the separator is vertical, since
 * horizontal is the implicit default for `role="separator"`. A horizontal
 * semantic separator therefore carries the role and nothing else.
 */
export const Semantic: Story = {
  args: { decorative: false },
  render: (args) => (
    <div className="max-w-md">
      <p className="text-sm text-muted-foreground">
        React Native, Flutter, Kotlin, Swift
      </p>
      <Separator {...args} className="my-4" />
      <p className="text-sm text-muted-foreground">
        Node.js, TypeScript, Elixir, PostgreSQL
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    const rule = canvas.getByRole('separator');
    await expect(rule).toBeVisible();
    // Horizontal is implicit for role="separator", so Radix omits the attribute.
    await expect(rule).not.toHaveAttribute('aria-orientation');
  },
};

/**
 * Vertical, inside a fixed-height row. Without `h-5` on the container the rule
 * would have no height to inherit and would not render at all, which is the most
 * common way this component appears broken.
 */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Blog</span>
      <Separator {...args} />
      <span>Talks</span>
      <Separator {...args} />
      <span>Projects</span>
    </div>
  ),
};

/**
 * The failure case, side by side with the fix. In a container with no resolved
 * height the vertical rule collapses; giving the row `items-stretch` and real
 * content restores it.
 */
export const VerticalWithoutHeight: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Left: no height to inherit, nothing renders. Right: `items-stretch` fixes it.',
      },
    },
  },
  render: () => (
    <div className="flex max-w-lg flex-col gap-6">
      <div className="flex items-center gap-4 border p-4 text-sm">
        <span>Collapsed</span>
        <Separator orientation="vertical" />
        <span>no rule between these</span>
      </div>
      <div className="flex items-stretch gap-4 border p-4 text-sm">
        <span>Stretched</span>
        <Separator orientation="vertical" />
        <span>rule is visible</span>
      </div>
    </div>
  ),
};
