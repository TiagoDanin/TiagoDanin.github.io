import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { Badge } from './badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

/**
 * Plain HTML table elements with Tailwind on them. No sorting, no virtualising,
 * no state of any kind.
 */
const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'The project and package lists on the site are card grids instead,',
          'which read better on a phone but lose the column alignment that makes',
          'numbers comparable.',
          '',
          'Everything here is presentational. There is no data layer, no column',
          'model and no sorting: the caller writes the rows.',
          '',
          '`TableCaption` is the accessible name of the table. Without it a',
          'screen reader announces "table with 5 rows and 4 columns" and nothing',
          'about what is in it, so the caption is not decoration. It renders',
          'below the table by default, via `caption-bottom`.',
          '',
          'The root wraps the table in an `overflow-auto` div, so a wide table',
          'scrolls inside its own box rather than pushing the page sideways.',
          'That scroll container has no keyboard focus of its own, which is a',
          'real gap on a narrow screen.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description:
        'Compose from `TableCaption`, `TableHeader`, `TableBody` and `TableFooter`.',
    },
  },
  args: {},
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const packages = [
  {
    name: 'telegram-bot-api',
    version: '4.2.1',
    downloads: 18420,
    license: 'MIT',
  },
  {
    name: 'flutter-widget-scan',
    version: '1.6.0',
    downloads: 6180,
    license: 'MIT',
  },
  {
    name: 'eslint-config-tiago',
    version: '3.0.2',
    downloads: 3940,
    license: 'MIT',
  },
  {
    name: 'rn-keyboard-actions',
    version: '2.4.4',
    downloads: 2170,
    license: 'Apache 2.0',
  },
  {
    name: 'mdx-frontmatter-lint',
    version: '0.9.1',
    downloads: 860,
    license: 'MIT',
  },
];

const total = packages.reduce((sum, item) => sum + item.downloads, 0);

/**
 * Published npm packages with their weekly download counts. Numbers are right
 * aligned and set in tabular figures so the digits line up column to column,
 * which is the only reason to prefer a table over cards here.
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <TableCaption>
          Weekly npm downloads, refreshed at build time
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>License</TableHead>
            <TableHead className="text-right">Downloads</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="font-mono text-muted-foreground">
                {item.version}
              </TableCell>
              <TableCell>{item.license}</TableCell>
              <TableCell className="text-right tabular-nums">
                {item.downloads.toLocaleString('en-US')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The caption is what gives the table an accessible name.
    const table = canvas.getByRole('table', {
      name: /Weekly npm downloads/i,
    });
    await expect(table).toBeVisible();

    // Header row plus one row per package.
    await expect(canvas.getAllByRole('row')).toHaveLength(packages.length + 1);

    await expect(
      canvas.getByRole('columnheader', { name: 'Downloads' })
    ).toBeVisible();
    await expect(canvas.getByRole('cell', { name: '18,420' })).toBeVisible();
  },
};

/**
 * With a footer holding the total. `TableFooter` is a `tfoot`, so the total
 * stays attached to the table for assistive technology instead of being a
 * paragraph that happens to sit underneath it.
 */
export const WithFooter: Story = {
  args: {
    children: (
      <>
        <TableCaption>
          Weekly npm downloads across every published package
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead className="text-right">Downloads</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right tabular-nums">
                {item.downloads.toLocaleString('en-US')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell className="text-right tabular-nums">
              {total.toLocaleString('en-US')}
            </TableCell>
          </TableRow>
        </TableFooter>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('cell', { name: total.toLocaleString('en-US') })
    ).toBeVisible();
  },
};

/**
 * Cells holding components rather than text. Badges work because a cell is a
 * plain `td` with padding, so anything inline fits without extra layout.
 */
export const WithBadges: Story = {
  args: {
    children: (
      <>
        <TableCaption>Repository status by project</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Repository</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Language</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">telegram-bot-api</TableCell>
            <TableCell>
              <Badge>Active</Badge>
            </TableCell>
            <TableCell>TypeScript</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">cam-covers</TableCell>
            <TableCell>
              <Badge variant="secondary">Maintenance</Badge>
            </TableCell>
            <TableCell>Dart</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">wear-compose-lab</TableCell>
            <TableCell>
              <Badge variant="outline">Archived</Badge>
            </TableCell>
            <TableCell>Kotlin</TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
  },
};

/**
 * A single row, which is what a filter with one match produces. The header
 * still carries its weight, so the row is readable without context.
 */
export const SingleRow: Story = {
  args: {
    children: (
      <>
        <TableCaption>Packages matching "keyboard"</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Downloads</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">rn-keyboard-actions</TableCell>
            <TableCell className="font-mono text-muted-foreground">
              2.4.4
            </TableCell>
            <TableCell className="text-right tabular-nums">2,170</TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
  },
};

/**
 * No rows at all. A `tbody` with a single full width cell keeps the table valid
 * and gives the reader a sentence instead of an empty frame. Never render the
 * header over nothing.
 */
export const EmptyState: Story = {
  args: {
    children: (
      <>
        <TableCaption>Packages matching "kotlin"</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Downloads</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={3}
              className="py-10 text-center text-muted-foreground"
            >
              No published package matches that filter.
            </TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
  },
};

/**
 * More columns than the frame can hold. The wrapper scrolls horizontally on its
 * own, leaving the page layout intact. Check this on a phone width before
 * adding a seventh column to anything.
 */
export const WideTable: Story = {
  args: {
    className: 'min-w-[52rem]',
    children: (
      <>
        <TableCaption>Full package index with registry metadata</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Last publish</TableHead>
            <TableHead>Dependents</TableHead>
            <TableHead>Unpacked size</TableHead>
            <TableHead className="text-right">Downloads</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((item, index) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="font-mono text-muted-foreground">
                {item.version}
              </TableCell>
              <TableCell>{item.license}</TableCell>
              <TableCell>{`2025-0${index + 1}-1${index}`}</TableCell>
              <TableCell className="tabular-nums">{index * 7}</TableCell>
              <TableCell className="tabular-nums">{`${18 + index * 3} kB`}</TableCell>
              <TableCell className="text-right tabular-nums">
                {item.downloads.toLocaleString('en-US')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    ),
  },
};
