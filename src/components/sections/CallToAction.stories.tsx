import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { CallToAction } from './CallToAction';

/**
 * Closing block on six pages: home, about, and every post and talk in both
 * languages. It is the last thing a recruiter sees, so both actions have to be
 * reachable and unambiguous.
 */
const meta = {
  title: 'Sections/CallToAction',
  component: CallToAction,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Contact section rendered on the inverted slate surface, closing every',
          'long-form page.',
          '',
          'Data arrives as props. The page calls `getCallToActionData()` from',
          '`@/lib/sections`, which reads the `about` and `sociallinks`',
          'collections. Keeping the query outside the component is what lets it',
          'render here at all, since `queryCollection` reads the filesystem.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    email: {
      control: 'text',
      description: 'Address behind the "Send me an email" action.',
    },
    linkedInUrl: {
      control: 'text',
      description:
        'LinkedIn profile URL. Leave empty to drop the LinkedIn action entirely.',
    },
  },
  args: {
    email: 'tiago@tiagodanin.com',
    linkedInUrl: 'https://linkedin.com/in/tiagodanin',
  },
} satisfies Meta<typeof CallToAction>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both actions available, as rendered in production. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const linkedIn = canvas.getByRole('link', { name: /connect on linkedin/i });
    await expect(linkedIn).toHaveAttribute('href', 'https://linkedin.com/in/tiagodanin');
    // Opening a third-party profile in a new tab without rel=noopener would
    // hand that tab a reference back to this window.
    await expect(linkedIn).toHaveAttribute('rel', expect.stringContaining('noopener'));

    await expect(
      canvas.getByRole('link', { name: /send me an email/i })
    ).toHaveAttribute('href', 'mailto:tiago@tiagodanin.com');
  },
};

/**
 * With no LinkedIn entry in the collection the section falls back to the email
 * action alone, rather than rendering a link to nowhere.
 */
export const WithoutLinkedIn: Story = {
  args: { linkedInUrl: undefined },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('link', { name: /connect on linkedin/i })
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: /send me an email/i })
    ).toBeVisible();
  },
};

/**
 * The two actions stack below `sm`, where the viewport cannot hold them side by
 * side. Both keep the 44px minimum touch target.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
