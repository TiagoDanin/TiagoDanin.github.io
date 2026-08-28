import type { Meta, StoryObj } from '@storybook/nextjs';
import { ExternalLink, Mic, Package } from 'lucide-react';
import { expect } from 'storybook/test';

import { Badge } from './badge';
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

/**
 * The surface primitive behind most boxed content: 17 modules import it.
 */
const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A compound component, not a single element. `Card` is the white',
          'surface with `rounded-lg border shadow-xs`; `CardHeader`,',
          '`CardTitle`, `CardDescription`, `CardContent` and `CardFooter` are',
          'the slots that give it its rhythm. All six are plain divs with',
          'forwarded refs and no state, so any of them can be skipped.',
          '',
          'The padding convention is the part worth learning. `CardHeader` is',
          '`p-6`, and `CardContent` and `CardFooter` are `p-6 pt-0`, so stacking',
          'them produces one continuous 24px inset with no doubled gap at the',
          'seams. Skipping the header means `CardContent` starts flush against',
          'the top border, which is why `ProjectCard` overrides both to `p-4`',
          'rather than dropping the header.',
          '',
          '`CardTitle` renders an `h3`. On a page whose headings already run to',
          '`h3`, pass a different level explicitly rather than accepting a broken',
          'outline, since a card grid full of `h3`s under an `h3` reads as a flat',
          'list to a screen reader.',
          '',
          'The card carries `shadow-xs` at rest. `DESIGN.md` allows',
          '`hover:shadow-md` or `hover:shadow-lg` on top, but only on a card that',
          'has somewhere to go.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description:
        'Merged through `cn`. Where hover elevation and `overflow-hidden` get added.',
    },
    children: {
      control: false,
      description: 'The header, content and footer slots.',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The full stack: header with title and description, content, footer with an
 * action. This is the shape `/services` and `/mobile` use.
 */
export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Mobile development</CardTitle>
        <CardDescription>
          Native and cross platform apps, from the first screen to the store listing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          React Native and Flutter for shared codebases, Kotlin and Swift when a
          feature needs the platform directly. Release pipelines included, because
          an app that cannot ship is not finished.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Talk about a project
        </Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    // CardTitle is an h3. A page that nests these under an h3 breaks its outline.
    const title = canvas.getByText('Mobile development');
    await expect(title.tagName).toBe('H3');
  },
};

/**
 * Header and content only, no footer. The most common composition on the site,
 * because most cards are read rather than acted on.
 */
export const WithoutFooter: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Security research</CardTitle>
        <CardDescription>HackerOne, since 2018</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Reported XSS, CSRF, open redirect and broken authentication findings to
          partner programmes, plus Android reverse engineering on shipped APKs.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Content only. `CardContent` is `pt-0`, so with no header above it the text
 * starts flush against the top border. Add back the top padding when dropping
 * the header, as `ProjectCard` does.
 */
export const ContentOnly: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-6 sm:flex-row">
      <Card className="flex-1">
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No header, default padding. The first line sits against the border.
          </p>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            No header, `pt-6` restored. This is the corrected version.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * With a link, so the hover elevation is honest. `transition-shadow
 * hover:shadow-lg` plus `cursor-pointer` is the pattern `DESIGN.md` reserves for
 * cards that have a real destination.
 */
export const Interactive: Story = {
  render: () => (
    <Card className="max-w-sm cursor-pointer transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-xl">locale-codes</CardTitle>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>ISO language and region code lookup, on npm.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Zero dependencies</Badge>
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * A three-up grid of equal cards, which is how `Recognition` and `Services` are
 * built. `DESIGN.md` keeps these grids symmetric on purpose: variation belongs
 * inside the card, through a different icon and different copy, not in the
 * layout.
 */
export const Grid: Story = {
  parameters: {
    docs: { description: { story: 'Reference layout: the symmetric home-page grid.' } },
  },
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <Mic className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl">Speaking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Talks at DevOpsDays Belém and Devs Norte on mobile release pipelines.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Package className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl">Open source</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            70+ packages published on npm, including telegraf and locale-codes.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <ExternalLink className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Disclosed findings through HackerOne partner programmes since 2018.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};
