import { compile, run, type RunOptions } from '@mdx-js/mdx';
import rehypeShiki from '@shikijs/rehype';
import { Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed';

const mdxComponents = {
  YouTubeEmbed,
};

/**
 * Grammars loaded for fenced code blocks.
 *
 * Explicit instead of the whole bundle: every entry here is a grammar Shiki
 * parses at build time, and the default is all ~200 of them. The first eight
 * are the languages the posts and talks actually use; the rest are the ones a
 * next post is most likely to reach for.
 *
 * A fence in a language that is not on this list is not an error, it renders
 * through `fallbackLanguage` as plain text. So if a new code block comes out
 * unhighlighted, this list is the place to look.
 */
const codeLanguages = [
  'bash',
  'dart',
  'javascript',
  'json',
  'kotlin',
  'typescript',
  'xml',
  'yaml',
  'css',
  'diff',
  'html',
  'jsx',
  'markdown',
  'python',
  'sql',
  'text',
  'tsx',
];

const runOptions: RunOptions = {
  Fragment,
  jsx,
  jsxs,
  baseUrl: import.meta.url,
};

export async function renderMdx(source: string): Promise<React.ReactElement> {
  const code = String(
    await compile(source, {
      outputFormat: 'function-body',
      rehypePlugins: [
        [
          rehypeShiki,
          {
            /**
             * The site is light-only (PRODUCT.md), so a single light theme is
             * the whole story: no dual-theme CSS variables to carry around.
             *
             * Shiki writes the theme background into the `pre` as an inline
             * style, which would beat any stylesheet rule. Swapping its `#fff`
             * for the site token keeps code blocks on the same surface as the
             * rest of the prose without an `!important`.
             */
            theme: 'github-light',
            colorReplacements: { '#fff': 'hsl(var(--secondary))' },
            langs: codeLanguages,
            fallbackLanguage: 'text',
            addLanguageClass: true,
          },
        ],
      ],
    })
  );
  const { default: MdxContent } = await run(code, runOptions);
  return <MdxContent components={mdxComponents} />;
}
