import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { ProjectCard } from './ProjectCard';

/**
 * The project tile. Three sections render it: `Projects` on the home page,
 * `FullProjects` on `/projects`, and `GitHubPages` on `/github-pages`.
 */
const meta = {
  title: 'UI/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'One project in a grid: optional 16:9 cover, title, optional archived',
          'flag, and a description.',
          '',
          '**Affordance honesta.** `href` is optional, and everything interactive',
          'is gated on it. With a destination the card takes `cursor-pointer`,',
          '`hover:shadow-lg`, an `ExternalLink` glyph next to the title, and an',
          '`onClick` that opens the address in a new tab. Without one it renders',
          'flat and inert: no cursor change, no lift, no click handler, and no',
          'placeholder toast. `DESIGN.md` treats a lying affordance as worse than',
          'no affordance, and roughly a third of the entries on `/projects` are',
          'private work with nothing public to link to.',
          '',
          'Two things are worth knowing before reusing it. The click target is a',
          '`div` with an `onClick`, not an anchor, so a linked card is not',
          'reachable by keyboard and exposes no href to a crawler; the title is',
          'plain text rather than a link. And the cover uses a bare `img`, not',
          '`next/image`, which is consistent with the static export (images are',
          'unoptimized anyway) but means no intrinsic size is reserved beyond the',
          'aspect-ratio box.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Project name. Rendered as a plain `h3`, never as a link.',
    },
    description: {
      control: 'text',
      description: 'One-line summary. Not clamped, so the card grows with it.',
    },
    imageUrl: {
      control: 'text',
      description: 'Cover image. Omit to drop the 16:9 block entirely.',
    },
    href: {
      control: 'text',
      description:
        'Destination. Presence of this prop is what turns the card interactive; omit it for private or offline work.',
    },
    archived: {
      control: 'boolean',
      description:
        'Marks a repository that is read-only upstream. Renders a red pill next to the title.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    title: 'telegraf',
    description:
      'Modern Telegram bot framework for Node.js. Middleware pipeline, typed context, and full Bot API coverage.',
    href: 'https://github.com/TiagoDanin/telegraf',
    archived: false,
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The linked card. A single anchor is stretched over the whole card by its own
 * `::after`, so a pointer can click anywhere while a keyboard still reaches one
 * real, focusable link. The `ExternalLink` glyph beside the title is the static
 * hint that the destination leaves the site.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /telegraf \(opens in a new tab\)/i });

    await expect(link).toHaveAttribute('href', 'https://github.com/TiagoDanin/telegraf');
    await expect(link).toHaveAttribute('target', '_blank');
    // Without rel=noopener the opened tab keeps a handle on this window.
    await expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));

    // Reachable by keyboard, which an onClick on a div never was.
    link.focus();
    await expect(link).toHaveFocus();
  },
};

/**
 * With a cover. `/projects` and the home grid pass one; the GitHub Pages list
 * does not, so both shapes are in production at the same time.
 */
export const WithCover: Story = {
  args: {
    title: 'Polybar Themes',
    description:
      'A collection of Polybar configurations for i3 and bspwm, packaged so a fresh install is one clone away.',
    imageUrl: '/images/section_bg.jpg',
    href: 'https://github.com/TiagoDanin/polybar-themes',
  },
};

/**
 * No `href`, so the card is inert: no pointer cursor, no hover lift, no
 * `ExternalLink` glyph, and no click handler at all. This is how the Private
 * section of `/projects` renders 55 entries that have nothing public behind
 * them.
 */
export const WithoutLink: Story = {
  args: {
    title: 'Banking app for a Brazilian fintech',
    description:
      'React Native app with biometric login, Pix transfers and offline statements. Under NDA, so there is nothing to link to.',
    href: undefined,
  },
  play: async ({ canvas }) => {
    // An inert card exposes no link at all, so there is nothing to click and
    // nothing for a keyboard to land on.
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('heading', { name: /Banking app for a Brazilian fintech/ })
    ).toBeVisible();
  },
};

/**
 * An archived repository. The pill sits beside the title rather than over the
 * cover, so it survives on cards that have no image. The card stays linked:
 * archived means read-only upstream, not gone.
 */
export const Archived: Story = {
  args: {
    title: 'Atom Language Nginx',
    description:
      'Nginx syntax highlighting for the Atom editor. Archived along with Atom itself in 2022.',
    href: 'https://github.com/TiagoDanin/atom-language-nginx',
    archived: true,
  },
};

/**
 * Long title plus long description. Neither is clamped, so the title wraps and
 * the card grows. In a CSS grid that means the whole row grows with it, which is
 * the intended trade: no project name is ever cut off mid-word.
 */
export const LongContent: Story = {
  args: {
    title: 'react-native-keyboard-actions-accessory-view',
    description:
      'An input accessory view for React Native on iOS that keeps the toolbar pinned above the keyboard through interactive dismissal, rotation and split keyboard, without the layout jump the community workarounds leave behind.',
    href: 'https://github.com/TiagoDanin/react-native-keyboard-actions',
  },
};

/**
 * The three-up grid from the home page, mixing a linked card, an archived one
 * and a private one. Side by side is the only way to see that the private card
 * genuinely reads as static rather than merely unstyled.
 */
export const InGrid: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Reference layout: `Projects` renders this as `sm:grid-cols-2 lg:grid-cols-3`.',
      },
    },
  },
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ProjectCard
        title="telegraf"
        description="Modern Telegram bot framework for Node.js, with a middleware pipeline and full Bot API coverage."
        href="https://github.com/TiagoDanin/telegraf"
      />
      <ProjectCard
        title="locale-codes"
        description="Lookup table for ISO language and region codes, published on npm and used by a few dozen packages downstream."
        href="https://github.com/TiagoDanin/locale-codes"
        archived
      />
      <ProjectCard
        title="Field service app for a utility company"
        description="Flutter app for offline inspections with photo capture and background sync. Private client work."
      />
    </div>
  ),
};
