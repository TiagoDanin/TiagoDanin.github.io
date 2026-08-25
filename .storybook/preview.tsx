import type { Preview } from '@storybook/nextjs';

// The real stylesheet, not a copy: tokens and utilities stay in sync with the
// site by construction.
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    // App Router hooks (usePathname, useRouter) resolve against the app dir.
    // Navbar and Footer read the active route through them.
    nextjs: {
      appDirectory: true,
    },

    // The site ships a single light theme; the background switcher would offer
    // surfaces that do not exist in production. See PRODUCT.md.
    backgrounds: {
      disable: true,
    },

    a11y: {
      // Report violations in the panel without failing the story. Flip to
      // 'error' once the catalog is audited.
      test: 'todo',
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    options: {
      // Groups read in the order a page is built: shell, then page blocks,
      // then the pieces they are made of.
      storySort: {
        order: [
          'Introduction',
          'Design Tokens',
          'Layout',
          'Sections',
          'UI',
        ],
      },
    },
  },

  // Every story renders on the site's own white surface.
  decorators: [
    (Story) => (
      <div className="bg-background text-foreground">
        <Story />
      </div>
    ),
  ],

  tags: ['autodocs'],
};

export default preview;
