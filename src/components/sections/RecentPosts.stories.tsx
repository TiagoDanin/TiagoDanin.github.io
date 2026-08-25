import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { RecentPosts } from './RecentPosts';

const post = (
  title: string,
  slug: string,
  date: string,
  description: string,
  originalUrl = ''
) => ({ title, slug, date, description, originalUrl });

const posts = [
  post(
    'Android Splash Screen in Jetpack Compose',
    'android-splash-screen-in-jetpack-compose',
    '2024-02',
    'The splash screen is the first thing a user sees. This video builds one with the modern Android APIs and Jetpack Compose, without the old theme hacks.',
    'https://www.youtube.com/watch?v=GLBY4YHoVFk'
  ),
  post(
    'Improving keyboard handling on iOS with Keyboard Actions',
    'improving-keyboard-handling-on-ios-with-keyboard-actions',
    '2023-11',
    'Keyboards cover fields, forms jump, and users give up. How Keyboard Actions fixes the layout without a custom scroll view.',
    'https://www.linkedin.com/in/tiagodanin/'
  ),
  post(
    'Arrow function vs normal function',
    'arrow-function-vs-normal-function',
    '2023-08',
    'What actually changes when you swap `function` for `=>`: the binding of `this`, the missing `arguments` object, and why it matters inside a React component.'
  ),
  post(
    'Clean code: making your code readable',
    'clean-code-making-your-code-readable',
    '2023-05',
    'Naming, function size and early returns. Small habits that survive the moment a second developer opens the file.'
  ),
  post(
    'Reporting an XSS on HackerOne, start to finish',
    'reporting-an-xss-on-hackerone-start-to-finish',
    '2023-02',
    'A walkthrough of a stored XSS report: how it was found, how the proof of concept was written, and what the triage conversation looked like.'
  ),
  post(
    'Flutter and Bonfire: shipping a small game',
    'flutter-and-bonfire-shipping-a-small-game',
    '2022-11',
    'Bonfire turns Flutter into a usable 2D game engine. Tile maps, collision and a joystick, in one weekend.'
  ),
  post(
    'React Native native modules in Kotlin',
    'react-native-native-modules-in-kotlin',
    '2022-07',
    'When the bridge is unavoidable: writing a Kotlin module, exposing it to JavaScript and keeping the types honest on both sides.'
  ),
  post(
    'Firebase Test Lab in a GitLab pipeline',
    'firebase-test-lab-in-a-gitlab-pipeline',
    '2022-03',
    'Running instrumented Android tests on real devices from CI, and failing the pipeline when they break.'
  ),
  post(
    'Publishing a Flutter app on Google Play',
    'publishing-a-flutter-app-on-google-play',
    '2021-10',
    'Signing, tracks, and the review questions nobody warns you about the first time.'
  ),
  post(
    'Translating the Node.js docs to Portuguese',
    'translating-the-nodejs-docs-to-portuguese',
    '2021-06',
    'How the translation workflow works, and why terminology decisions are the hard part.'
  ),
  post(
    'Polybar modules written in JavaScript',
    'polybar-modules-written-in-javascript',
    '2021-01',
    'Awesome-Polybar started as a list and turned into a set of modules. This is how one of them is built.'
  ),
  post(
    'A Telegram bot test toolkit',
    'a-telegram-bot-test-toolkit',
    '2020-09',
    'Telegraf-Test fakes the Telegram API so a bot can be tested offline, in Mocha, without a token.'
  ),
];

/**
 * The "Writing" block on the home page, between Recognition and Experience.
 *
 * It shows the four most recent English posts in a carousel and links to the
 * blog index. The count in that link is deliberately vague, and the way it is
 * computed has a sharp edge worth knowing about.
 */
const meta = {
  title: 'Sections/RecentPosts',
  component: RecentPosts,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Four-card carousel over green blur orbs, fed by the `posts`',
          'collection filtered to `lang: en` and sorted newest first by the page.',
          '',
          'The component does no sorting of its own: it takes `posts.slice(0, 4)`',
          'and trusts the order it was given. Passing an unsorted array shows',
          'whatever happens to sit at the front.',
          '',
          'The call to action rounds down to the nearest five:',
          '`Math.floor(posts.length / 5) * 5 + "+"`. With 12 posts that reads',
          '"See all 10+ posts", which understates the archive on purpose. With',
          'fewer than five posts it reads "See all 0+ posts", which is a real',
          'failure mode rather than a design choice.',
          '',
          'Every card links to `/post/[slug]`, so a post whose `slug` does not',
          'match a generated page produces a 404: the routes are static.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    posts: {
      control: 'object',
      description:
        'Posts in display order, newest first. Only the first four are rendered; the full length still drives the rounded count in the call to action.',
    },
  },
  args: {
    posts,
  },
} satisfies Meta<typeof RecentPosts>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Twelve posts in the collection: four on screen, and a call to action rounded
 * down to ten.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const seeAll = canvas.getByRole('link', { name: /see all 10\+ posts/i });
    await expect(seeAll).toHaveAttribute('href', '/blog');

    // Only the first four posts are rendered, newest first.
    const readLinks = canvas.getAllByRole('link', { name: /^read article about/i });
    await expect(readLinks).toHaveLength(4);
    await expect(readLinks[0]).toHaveAttribute(
      'href',
      '/post/android-splash-screen-in-jetpack-compose'
    );
  },
};

/**
 * Fewer than four posts fills fewer slides; the carousel does not pad the row.
 * Note the call to action: three posts round down to zero, so the label reads
 * "See all 0+ posts". A collection this small should not be rendering this
 * section at all.
 */
export const FewerThanFour: Story = {
  args: { posts: posts.slice(0, 3) },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link', { name: /^read article about/i })).toHaveLength(3);
    await expect(canvas.getByRole('link', { name: /see all 0\+ posts/i })).toBeVisible();
  },
};

/**
 * A single post. The carousel still loops, and the lone card keeps its quarter
 * width on desktop rather than stretching across the row.
 */
export const SinglePost: Story = {
  args: { posts: posts.slice(0, 1) },
};

/**
 * Exactly five posts, the smallest collection where the rounded count says
 * something true.
 */
export const RoundedCount: Story = {
  args: { posts: posts.slice(0, 5) },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /see all 5\+ posts/i })).toBeVisible();
  },
};

/**
 * No posts at all. The heading, the orbs and the call to action still render
 * over an empty carousel, and the label collapses to "See all 0+ posts".
 */
export const Empty: Story = {
  args: { posts: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('link', { name: /^read article about/i })).toHaveLength(0);
    await expect(canvas.getByRole('link', { name: /see all 0\+ posts/i })).toBeVisible();
  },
};

/**
 * Titles clamp at two lines and descriptions at three, so a long post title
 * cannot push the "Read article" footer out of alignment across the row. The
 * clamped text is still complete in the DOM, which is what screen readers and
 * search engines read.
 */
export const LongContent: Story = {
  args: {
    posts: [
      post(
        'Android Splash Screen in Jetpack Compose: building an impactful introduction for your app without the legacy theme workaround',
        'android-splash-screen-in-jetpack-compose',
        '2024-02',
        'In the world of mobile apps first impressions are decisive, and the splash screen is the very first thing anyone sees when they open your app. This walkthrough builds one with the modern Android 12 splash screen API and Jetpack Compose, covering the icon animation, the exit transition, the window background, and the compatibility path for older versions through the AndroidX core-splashscreen library, so the result looks the same from Android 6 upwards.'
      ),
      ...posts.slice(1, 4),
    ],
  },
};

/**
 * Below `lg` the previous and next controls appear under the carousel, each
 * labelled and sized to the 44px minimum touch target.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvas }) => {
    // aria-label wins over the shadcn sr-only text, so these are the names a
    // screen reader announces.
    await expect(canvas.getByRole('button', { name: 'Previous posts' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Next posts' })).toBeVisible();
  },
};
