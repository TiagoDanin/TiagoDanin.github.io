import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { YouTubeEmbed } from './YouTubeEmbed';

/**
 * The only custom component available inside MDX. `src/lib/render-mdx.tsx`
 * passes it in the `components` map, so any post or talk body can write
 * `<YouTubeEmbed videoId="..." />` and get a responsive player.
 */
const meta = {
  title: 'UI/YouTubeEmbed',
  component: YouTubeEmbed,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A 16:9 YouTube player for talk recordings embedded in MDX bodies.',
          '',
          'The aspect ratio comes from the `.youtube-embed` rule in',
          '`globals.css`, not from this file: the wrapper reserves height with',
          '`padding-bottom: 56.25%` and the iframe is absolutely positioned to',
          'fill it. That means the space is reserved before the frame loads, so',
          'the surrounding prose does not jump. Changing the ratio means editing',
          'that stylesheet, not the component.',
          '',
          'The embed URL asks YouTube for English captions',
          '(`cc_load_policy=1&cc_lang_pref=en&hl=en`), which is deliberate for a',
          'bilingual site whose recordings are mostly in Portuguese.',
          '',
          '`title` is the iframe accessible name. It defaults to the generic',
          '"YouTube video", so always pass the actual talk title: a page with two',
          'recordings would otherwise announce two identical frames.',
          '',
          'The frame loads from youtube.com, so this story reaches the network',
          'like the real page does. There is no `loading="lazy"` and no consent',
          'gate: the player is requested as soon as the page renders.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    videoId: {
      control: 'text',
      description:
        'The bare id, not a full URL. Talk frontmatter stores `youtubeUrl`, so the `v=` parameter is what goes here.',
    },
    title: {
      control: 'text',
      description:
        'Accessible name of the frame. Pass the talk title; the default is generic.',
      table: { defaultValue: { summary: 'YouTube video' } },
    },
  },
  args: {
    videoId: 'Z3-v01J9n0I',
    title: 'Building Performant Lists in React Native',
  },
} satisfies Meta<typeof YouTubeEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A real recording: the React Native performance talk. */
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const frame = canvas.getByTitle('Building Performant Lists in React Native');

    await expect(frame).toHaveAttribute(
      'src',
      `https://www.youtube.com/embed/${args.videoId}?cc_load_policy=1&cc_lang_pref=en&hl=en`
    );
    await expect(frame).toHaveAttribute('allowfullscreen');
  },
};

/**
 * The VuePress talk from Vuejs Norte, the other recording currently linked from
 * `contents/talks/`.
 */
export const VuePressTalk: Story = {
  args: {
    videoId: 'NZ_lBbi1gCw',
    title: 'How to Create Documentation with VuePress',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByTitle('How to Create Documentation with VuePress')
    ).toBeVisible();
  },
};

/**
 * Without `title` the frame announces as "YouTube video". Fine for a page with
 * one recording, ambiguous the moment there are two, which is why the MDX
 * bodies pass it.
 */
export const WithoutTitle: Story = {
  args: { title: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByTitle('YouTube video')).toBeInTheDocument();
  },
};

/**
 * In a post body, between paragraphs. Height is reserved by the wrapper before
 * YouTube responds, so nothing below shifts once the player appears.
 */
export const InProse: Story = {
  parameters: {
    docs: {
      description: {
        story: 'How the component lands in an MDX body, capped at prose width.',
      },
    },
  },
  render: (args) => (
    <div className="mx-auto max-w-prose">
      <p className="mb-6 leading-relaxed">
        A gravação da talk na Idopter Labs está abaixo. Os slides e o código de
        exemplo estão no repositório linkado no final do post.
      </p>
      <YouTubeEmbed {...args} />
      <p className="leading-relaxed">
        O ponto principal é que <code>FlatList</code> só recicla células quando a
        altura é previsível, então <code>getItemLayout</code> faz mais diferença
        que qualquer memoização.
      </p>
    </div>
  ),
};
