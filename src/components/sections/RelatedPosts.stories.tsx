import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { RelatedPosts } from './RelatedPosts';

/**
 * The block between the end of a post and its comments. The post page picks the
 * posts with `relatedPosts(post, locale)` from `src/lib/mdx.ts`: other posts of
 * the same blog list, most shared tags first, newest first among ties. It renders
 * nothing when the list is empty.
 */
const meta = {
  title: 'Sections/RelatedPosts',
  component: RelatedPosts,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-2xl mx-auto"><Story /></div>],
  args: {
    locale: 'en',
    posts: [
      {
        slug: 'flutter-widgetbook-how-to-document-your-design-system-the-right-way',
        title: 'Flutter Widgetbook: How to Document your Design System the Right Way!',
        date: '2026-05',
        description: 'How Widgetbook solves the documentation problem in Flutter projects with a custom design system.',
      },
      {
        slug: 'liquid-glass-flutter-do-we-really-need-it',
        title: 'Liquid Glass in Flutter: Do We Really Need It?',
        date: '2025-06',
        description: 'A critical reflection on the Liquid Glass effect in Flutter and its real necessity in mobile applications.',
      },
      {
        slug: 'system-bars-anatomy-mobile',
        title: 'Anatomy of the System Bars: Status Bar and Navigation Bar in Flutter, Jetpack Compose and SwiftUI',
        date: '2026-10',
        description: 'How the status bar, the navigation bar and the home indicator work, and how to configure each bar in Flutter, Jetpack Compose and SwiftUI.',
      },
    ],
  },
} satisfies Meta<typeof RelatedPosts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Keep reading' })).toBeVisible();
    await expect(canvas.getAllByRole('link')).toHaveLength(3);
  },
};

/** No other post shares the list: the section is not rendered at all. */
export const Empty: Story = {
  args: { posts: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('section')).toBeNull();
  },
};
