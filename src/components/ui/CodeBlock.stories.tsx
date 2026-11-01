import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { CodeBlock } from './CodeBlock';

/**
 * The `pre` override in `src/lib/render-mdx.tsx`: every fenced block in a post,
 * talk or legal document renders through it and gets a copy button in its
 * top-right corner.
 *
 * The copied text is read from the rendered tree, not from the MDX source, so
 * it is exactly what Shiki shows: the line breaks between `span.line`s are text
 * nodes and survive. The trailing newline of the last line is dropped.
 */
const meta = {
  title: 'UI/CodeBlock',
  component: CodeBlock,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="prose prose-zinc max-w-2xl"><Story /></div>],
  args: {
    className: 'shiki github-light',
    children: (
      <code>
        <span className="line">brew install zsh-autosuggestions</span>
        {'\n'}
        <span className="line">source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh</span>
        {'\n'}
      </code>
    ),
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The two commands from the zsh-autosuggestions post, the most visited tutorial. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Copy code' })).toBeVisible();
  },
};
