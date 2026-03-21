import { compile, run, type RunOptions } from '@mdx-js/mdx';
import { Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed';

const mdxComponents = {
  YouTubeEmbed,
};

const runOptions: RunOptions = {
  Fragment,
  jsx,
  jsxs,
  baseUrl: import.meta.url,
};

export async function renderMdx(source: string): Promise<React.ReactElement> {
  const code = String(await compile(source, { outputFormat: 'function-body' }));
  const { default: MdxContent } = await run(code, runOptions);
  return <MdxContent components={mdxComponents} />;
}
