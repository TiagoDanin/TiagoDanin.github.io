import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // Stories live next to the component they document, so a component and its
  // documentation move together. Standalone docs pages (the introduction, the
  // token reference) belong to no single component and live in src/docs.
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
  ],

  addons: [
    // Autodocs: prop tables generated from the TypeScript types.
    '@storybook/addon-docs',
    // WCAG AA is the quality baseline recorded in PRODUCT.md.
    '@storybook/addon-a11y',
    // Exposes this catalog to AI agents over MCP at /mcp.
    '@storybook/addon-mcp',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  // Serves /public so logo.svg, post covers and press images resolve in stories
  // exactly as they do on the site.
  staticDirs: ['../public'],

  typescript: {
    // Reads real prop types and JSDoc comments off the component source, which
    // is what makes the generated docs worth reading.
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Skip prop tables for third-party types (Radix, React) so the tables
      // show this project's API instead of the whole DOM surface.
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
