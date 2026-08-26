import type { NextConfig } from "next";
import { withStudio } from "nextjs-studio/next";
import { linguiMacroSwcPlugin } from "@lingui/swc-plugin/options";
import { DEFAULT_LOCALE, LOCALIZED_PREFIXES, LOCALIZED_ROUTES } from "./src/lib/i18n/locales";

const isDev = process.env.NODE_ENV === "development";

/**
 * The default locale is served from the site root as well as from `/en`.
 *
 * In production `scripts/flattenDefaultLocale.ts` does it, moving `dist/en/**`
 * to the root after the build. There is no build in `next dev`, so without
 * these rewrites `/` 404s and `/about/` errors on a `[lang]` param that does
 * not exist, and the English site is only reachable at URLs it will never be
 * served from.
 *
 * Derived from the same lists `localePath()` reads, so a route cannot be
 * reachable in one and missing in the other. Rewrites and `output: "export"`
 * are mutually exclusive, which is why the export only applies to builds.
 */
const defaultLocaleRewrites = [
  ...LOCALIZED_ROUTES.map((route) => ({
    source: route,
    destination: route === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${route}`,
  })),
  // One segment only, so `/post/:slug/pt` still reaches the redirect page in
  // (legacy) rather than being rewritten to a page that does not exist.
  ...LOCALIZED_PREFIXES.map((prefix) => ({
    source: `${prefix}:slug`,
    destination: `/${DEFAULT_LOCALE}${prefix}:slug`,
  })),
];

const nextConfig: NextConfig = {
  /**
   * Enable static exports for the App Router. Dev skips it so the rewrites
   * above can run; `yarn build` is what enforces export compatibility.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  ...(isDev ? { rewrites: async () => defaultLocaleRewrites } : { output: "export" as const }),

  /**
   * Generate /page/index.html instead of /page.html to align with GitHub Pages
   * directory-based serving and avoid unnecessary redirects.
   */
  trailingSlash: true,

  /**
   * The directory where the build output is stored.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports#the-dist-directory
   */
    distDir: 'dist',

  /**
   * Set base path. This is usually the slug of your repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,

  /**
   * Transforms the Lingui macros (`<Trans>`, `t`) at build time. Reads
   * lingui.config.ts for the locale list, so the two never drift.
   */
  experimental: {
    swcPlugins: [linguiMacroSwcPlugin()],
  },

typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
};

/**
 * withStudio puts `contents/` under the dev watcher, so editing a collection
 * hot reloads the browser instead of waiting for a manual refresh.
 */
export default withStudio(nextConfig);
