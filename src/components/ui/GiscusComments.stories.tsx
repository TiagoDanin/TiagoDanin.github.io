import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, waitFor } from 'storybook/test';

import { GiscusComments } from './GiscusComments';

/**
 * Comment thread at the bottom of every post and talk, in both languages. Eight
 * call sites, all of them `page.tsx` files under `/post/` and `/talk/`.
 */
const meta = {
  title: 'UI/GiscusComments',
  component: GiscusComments,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          '**This component renders nothing on its own.** It mounts an empty',
          '`<div class="giscus">` and injects a `<script>` pointing at',
          '`https://giscus.app/client.js`, configured through `data-*`',
          'attributes. Everything a reader sees, the thread, the reaction bar,',
          'the GitHub sign-in, is an iframe that third-party script builds.',
          '',
          'So what you see in this story is whatever giscus decides to render',
          'for a Storybook origin, which is usually an error or nothing at all.',
          'The widget authenticates against the repository',
          '`TiagoDanin/TiagoDanin.github.io` and maps a thread by discussion',
          'title, and neither of those resolves outside the deployed site. The',
          'play function below therefore asserts on the injected script and its',
          'configuration, which is the part this component actually owns.',
          '',
          'The `useEffect` guards on `hasChildNodes()`, so a re-render cannot',
          'stack two scripts in the same container. It does not clean the script',
          'up on unmount, and the guard means changing `term` after mount will',
          'not re-point an already loaded widget: each page mounts it once with',
          'a stable term.',
          '',
          'The term is what separates the language variants of the same content:',
          'the pages pass `${slug}-en` and `${slug}-pt`, so an English post and',
          'its translation keep separate threads. Talks additionally override',
          '`category` to "Talk Comments".',
          '',
          'One thing to know: the script is configured with',
          '`data-theme="preferred_color_scheme"`, so on a reader whose system is',
          'set to dark the embedded widget renders dark inside an otherwise',
          'light-only site. That is a property of this component as shipped, not',
          'a Storybook artefact.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    term: {
      control: 'text',
      description:
        'Discussion title the thread maps to. Pages pass `${slug}-en` or `${slug}-pt` so translations do not share a thread.',
    },
    category: {
      control: 'text',
      description:
        'GitHub Discussions category. Posts use the default; talks pass "Talk Comments".',
      table: { defaultValue: { summary: 'Blog Comments' } },
    },
    categoryId: {
      control: 'text',
      description:
        'The category node id, which giscus needs alongside the name. Must be changed together with `category`.',
      table: { defaultValue: { summary: 'DIC_kwDONy7kws4C41WI' } },
    },
  },
  args: {
    term: 'construindo-listas-performaticas-no-react-native-en',
  },
} satisfies Meta<typeof GiscusComments>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A blog post thread in English. The assertions read the injected script rather
 * than the widget, since the widget belongs to giscus.app and does not load
 * here.
 */
export const BlogPost: Story = {
  play: async ({ canvasElement, args }) => {
    // A <script> has no role and no accessible name, so this is the one place
    // an attribute query is the only option.
    const script = await waitFor(() => {
      const el = canvasElement.querySelector('script[data-repo]');
      if (!el) throw new Error('giscus script was not injected');
      return el;
    });

    await expect(script).toHaveAttribute('src', 'https://giscus.app/client.js');
    await expect(script).toHaveAttribute('data-repo', 'TiagoDanin/TiagoDanin.github.io');
    await expect(script).toHaveAttribute('data-term', args.term);
    await expect(script).toHaveAttribute('data-category', 'Blog Comments');
    await expect(script).toHaveAttribute('data-mapping', 'specific');
    // Lazy loading keeps the third-party frame off the critical path of a post.
    await expect(script).toHaveAttribute('data-loading', 'lazy');
  },
};

/**
 * The Portuguese translation of the same post. Only the term suffix differs,
 * and that is enough to give it its own thread.
 */
export const PortuguesePost: Story = {
  args: { term: 'construindo-listas-performaticas-no-react-native-pt' },
  play: async ({ canvasElement, args }) => {
    const script = await waitFor(() => {
      const el = canvasElement.querySelector('script[data-repo]');
      if (!el) throw new Error('giscus script was not injected');
      return el;
    });

    await expect(script).toHaveAttribute('data-term', args.term);
  },
};

/**
 * A talk page. Talks live in their own Discussions category, so both `category`
 * and `categoryId` are overridden; passing one without the other points giscus
 * at a category that does not match its id.
 */
export const TalkThread: Story = {
  args: {
    term: 'model-context-protocol-mcp-na-pratica-pt',
    category: 'Talk Comments',
    categoryId: 'DIC_kwDONy7kws4C6oQH',
  },
  play: async ({ canvasElement }) => {
    const script = await waitFor(() => {
      const el = canvasElement.querySelector('script[data-repo]');
      if (!el) throw new Error('giscus script was not injected');
      return el;
    });

    await expect(script).toHaveAttribute('data-category', 'Talk Comments');
    await expect(script).toHaveAttribute('data-category-id', 'DIC_kwDONy7kws4C6oQH');
  },
};

/**
 * Where the thread sits on a post page: after the article, under a heading the
 * page owns. The component itself contributes only the `mt-12` gap.
 */
export const InPageContext: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The bottom of a post page. The empty area below the heading is where the giscus iframe would be on the deployed site.',
      },
    },
  },
  render: (args) => (
    <div className="mx-auto max-w-prose">
      <p className="text-muted-foreground">
        ...end of the article. Full source is on GitHub.
      </p>
      <hr className="mt-12 border-border" />
      <h2 className="mt-12 text-2xl font-bold tracking-tight">Comments</h2>
      <GiscusComments {...args} />
    </div>
  ),
};
