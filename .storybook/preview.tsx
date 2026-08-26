import type { Preview } from '@storybook/nextjs';
import { I18nProvider } from '@lingui/react';
import { setupI18n } from '@lingui/core';

import { messages as en } from '../src/locales/en/messages';
import { messages as br } from '../src/locales/br/messages';

// The real stylesheet, not a copy: tokens and utilities stay in sync with the
// site by construction.
import '../src/app/globals.css';

// One instance per locale, built once. The catalogs are the compiled output of
// `yarn i18n:compile`, which the `storybook` script runs first.
const catalogs = { en, br };
const instances = {
  en: setupI18n({ locale: 'en', messages: { en } }),
  br: setupI18n({ locale: 'br', messages: { br } }),
};

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Message catalog a story renders with',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'br', title: 'Portugues (BR)' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    locale: 'en',
  },

  decorators: [
    // Components marked with <Trans> read their catalog from context. On the
    // site the server publishes it through initI18n; here the toolbar does.
    (Story, context) => {
      const locale = (context.globals.locale as keyof typeof catalogs) ?? 'en';
      return (
        <I18nProvider i18n={instances[locale]}>
          <Story />
        </I18nProvider>
      );
    },
  ],

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
