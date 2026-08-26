import { defineConfig } from "@lingui/cli";
import { formatter } from "@lingui/format-po";

/**
 * Message catalogs for the site's UI copy.
 *
 * Prose lives in `contents/` collections and is translated there, one
 * `index.<locale>.json` per locale. This file covers what cannot live in the
 * CMS: chrome labels, aria labels, and the strings inside `generateMetadata`.
 *
 * `sourceLocale` is `en`, so an untranslated message renders its English
 * source rather than an empty string.
 */
export default defineConfig({
  locales: ["en", "br"],
  sourceLocale: "en",
  /** Line numbers in the .po churn on every edit; the file path is enough context. */
  format: formatter({ lineNumbers: false }),

  /**
   * Emit the compiled catalogs as TypeScript ESM. The default `cjs` namespace
   * writes `module.exports`, which webpack hands back as an empty object when
   * imported from a Server Component.
   */
  compileNamespace: "ts",
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/node_modules/**", "**/*.stories.tsx"],
    },
  ],
});
