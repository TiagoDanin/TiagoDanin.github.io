import type { Meta, StoryObj } from '@storybook/nextjs';
import Link from 'next/link';
import { Text, Video } from 'lucide-react';
import { expect } from 'storybook/test';

import { getRandomColorWithDarkMode, titleToSlug } from '@/utils/parse';
import { Badge } from './badge';

/**
 * The most reused non-control primitive on the site: 28 modules import it.
 */
const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Small pill for metadata: post tags, skill names, project types, talk',
          'events, press outlets.',
          '',
          'It renders a `div`, not a `span` and not a `button`. That matters in',
          'two ways. A badge cannot be nested inside a `p`, and it is not',
          'focusable, so the `focus:ring` classes in its base style never fire on',
          'their own. Where a badge needs to be actionable, the pattern used',
          'across the site is to wrap it in a `Link`: `ArticleCard` does exactly',
          'that for its tag chips, and the anchor carries the focus ring and the',
          'accessible name.',
          '',
          'The four variants differ only in colour, with one exception worth',
          'noting: `outline` is the only one that keeps a visible border, since',
          'the other three set `border-transparent` and rely on a filled',
          'background. `outline` is therefore the variant that survives being',
          'recoloured by a caller, which is why the tag chips use it and pass a',
          'hashed pastel through `className`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description:
        'Colour treatment. `secondary` carries the metadata chips, `outline` the recolourable tags.',
      table: { defaultValue: { summary: 'default' } },
    },
    children: {
      control: 'text',
      description: 'Badge content. Icons are passed as siblings of the text.',
    },
    className: {
      control: 'text',
      description:
        'Merged through `cn`, so a caller can override colours. Used for the hashed tag palette.',
    },
  },
  args: {
    children: 'Flutter',
    variant: 'default',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Filled slate. Used for counts and status pills. */
export const Default: Story = {};

/**
 * The metadata chip. `ArticleCard` uses it for the Article and Video markers,
 * `/talks` for the event name. Muted enough to sit beside a date without
 * competing with the title.
 */
export const Secondary: Story = {
  args: { variant: 'secondary', children: 'DevOpsDays Belém' },
};

/**
 * The only variant with a real border. Its transparent background is what lets a
 * caller supply the fill, which is how the tag palette works.
 */
export const Outline: Story = {
  args: { variant: 'outline', children: 'React Native' },
};

/**
 * Every variant side by side. `destructive` has nothing destructive to mark on a
 * portfolio and is unused in production.
 */
export const AllVariants: Story = {
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Reference grid of the four shipped variants.' } },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
};

/**
 * An icon as a sibling of the label, sized by hand. This is the exact pair
 * `ArticleCard` uses to mark a post as written or recorded.
 */
export const WithIcon: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="secondary" className="flex items-center gap-1">
        <Text className="h-3 w-3" />
        Article
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <Video className="h-3 w-3" />
        Video
      </Badge>
    </div>
  ),
};

/**
 * The tag chips from `ArticleCard`. The badge itself is inert, so the anchor
 * around it supplies the destination, the focus ring and the accessible name.
 * Colour comes from a hash of the tag text, so a tag looks the same everywhere
 * it appears without a colour map to maintain.
 */
export const AsTagLink: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {['Flutter', 'React Native', 'Security', 'Jetpack Compose'].map((tag) => (
        // Colour and slug both come from the production helpers, so the chips
        // here are the same ones the blog listing renders.
        <Link key={tag} href={`/tags/${titleToSlug(tag)}`}>
          <Badge variant="outline" className={`text-xs ${getRandomColorWithDarkMode(tag)}`}>
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const tag = canvas.getByRole('link', { name: 'React Native' });
    await expect(tag.getAttribute('href')).toMatch(/^\/tags\/react-native\/?$/);
  },
};

/**
 * A long label. The pill has no max width and does not wrap internally, so it
 * grows on one line and the flex row it lives in wraps around it. Long labels
 * are real: skill entries carry values like "Continuous Integration".
 */
export const LongLabel: Story = {
  args: { variant: 'secondary', children: 'Continuous Integration and Delivery' },
};
