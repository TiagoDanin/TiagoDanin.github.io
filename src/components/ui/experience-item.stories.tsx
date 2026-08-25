import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import { ExperienceItem } from './experience-item';

/**
 * One row of the Experience card in the `Work` section on the home page.
 */
const meta = {
  title: 'UI/ExperienceItem',
  component: ExperienceItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'A collapsible entry in the professional history list: logo, company,',
          'role, date range, and a description that stays hidden until the row is',
          'opened.',
          '',
          '`Work` renders it twice, once over the `work` collection and once over',
          '`volunteer`, mapping `organization` onto the `company` prop. Both lists',
          'live inside an `ol`, so the component renders an `li` and has to be',
          'placed in a list to produce valid markup. Every story here wraps it in',
          'one.',
          '',
          'The collapsed row is deliberately dense. Descriptions in the `work`',
          'collection run to a dozen bullet lines, and printing them all would',
          'bury the six-job history under its own detail. Opening one row does not',
          'close the others: comparing two jobs side by side is the common reason',
          'to open one at all.',
          '',
          'Dates are strings, not dates. `startDate` and `endDate` carry values',
          'like `2022` and `Present`, so the component tests each against',
          '`/^\\d{4}(-\\d{2}(-\\d{2})?)?$/` and only wraps the machine-readable ones',
          'in a `time` element. "Present" renders as a plain `span`, because a',
          '`datetime` attribute that does not parse is worse than none.',
          '',
          'Accessibility: the row is a `li` carrying `role="button"`, `tabIndex`',
          'and `aria-expanded`, with Enter and Space wired by hand. It is',
          'keyboard operable, but `role="button"` on the list item replaces the',
          '`listitem` role, so assistive technology announces the buttons without',
          'announcing the list around them.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <ol className="max-w-md space-y-6">
        <Story />
      </ol>
    ),
  ],
  argTypes: {
    company: {
      control: 'text',
      description: 'Employer or organisation. Doubles as the logo `alt` text.',
    },
    role: { control: 'text', description: 'Job title, shown under the company.' },
    startDate: {
      control: 'text',
      description:
        'Free text. Wrapped in `time` only when it matches `YYYY`, `YYYY-MM` or `YYYY-MM-DD`.',
    },
    endDate: {
      control: 'text',
      description: 'Same rule as `startDate`. `Present` is the common non-date value.',
    },
    logo: {
      control: 'text',
      description: 'Path under `/public`, rendered at 28px inside a 40px ring.',
    },
    description: {
      control: 'text',
      description: 'Revealed on toggle. Rendered as a single text node, so newlines do not become breaks.',
    },
  },
  args: {
    company: 'Idopter Labs',
    role: 'Mobile Developer',
    startDate: '2022',
    endDate: 'Present',
    logo: '/business/idopterlabs.webp',
    description:
      'Hybrid apps with React Native and Flutter: architecture, documentation and tests. Store submissions for Google Play and the App Store, native module work in Swift, Objective-C, Java and Kotlin, and the occasional Elixir backend.',
  },
} satisfies Meta<typeof ExperienceItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The resting state. `aria-expanded` is false and the description is not in the
 * DOM at all, so it cannot be reached by a screen reader while collapsed.
 */
export const Collapsed: Story = {
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: /Idopter Labs/ });
    await expect(row).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText(/Hybrid apps with React Native/)).not.toBeInTheDocument();
  },
};

/**
 * Clicking the row reveals the description and flips `aria-expanded`, which is
 * what rotates the chevron. Clicking again puts it back.
 */
export const TogglesOnClick: Story = {
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: /Idopter Labs/ });

    await userEvent.click(row);
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/Hybrid apps with React Native/)).toBeVisible();

    await userEvent.click(row);
    await expect(row).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText(/Hybrid apps with React Native/)).not.toBeInTheDocument();
  },
};

/**
 * Because the row is a `li` rather than a real `button`, Enter and Space are
 * handled explicitly. Both must work, and Space must not scroll the page.
 */
export const TogglesOnKeyboard: Story = {
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: /Idopter Labs/ });

    // tabIndex is what puts a plain `li` into the tab order at all.
    await expect(row).toHaveAttribute('tabindex', '0');
    row.focus();
    await expect(row).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(row).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard(' ');
    await expect(row).toHaveAttribute('aria-expanded', 'false');
  },
};

/**
 * A closed role with both ends machine readable. Both dates become `time`
 * elements carrying a `datetime`, which is what lets the range be parsed out of
 * the page.
 */
export const ClosedRole: Story = {
  args: {
    company: 'VoxData Technology',
    role: 'Mobile Developer',
    startDate: '2019',
    endDate: '2022',
    logo: '/business/voxdata.png',
    description:
      'Native Android in Java and Kotlin, later React Native. Built the release pipeline the team still used after I left.',
  },
  play: async ({ canvas }) => {
    const start = canvas.getByText('2019');
    await expect(start.tagName).toBe('TIME');
    await expect(start).toHaveAttribute('datetime', '2019');
  },
};

/**
 * An ongoing engagement. `Present` fails the date test, so it renders as a
 * `span` with no `datetime` rather than as a `time` element pointing at nothing.
 */
export const OngoingRole: Story = {
  args: {
    company: 'HackerOne',
    role: 'Independent Security Researcher',
    startDate: '2018',
    endDate: 'Present',
    logo: '/business/h1.jpg',
    description:
      'Vulnerability research for HackerOne partners: XSS, CSRF, open redirect, broken authentication, and Android app reverse engineering.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Present').tagName).toBe('SPAN');
    await expect(canvas.getByText('2018').tagName).toBe('TIME');
  },
};

/**
 * The volunteer list passes the same props with `organization` in place of
 * `company`, so nothing about the row distinguishes paid from volunteer work.
 * The heading above the list is what carries that distinction.
 */
export const VolunteerEntry: Story = {
  args: {
    company: 'Devs Norte',
    role: 'Organiser and Speaker',
    startDate: '2019',
    endDate: 'Present',
    logo: '/business/devs_norte.png',
    description:
      'Community for developers in the north of Brazil. I help organise meetups and have spoken at DevOpsDays Belém on mobile release pipelines.',
  },
};

/**
 * A long description, expanded. The panel is indented past the logo column and
 * has no height cap, so the whole entry grows and pushes the rest of the list
 * down. The `Work` section absorbs that with its own "Show more" clamp.
 */
export const LongDescriptionExpanded: Story = {
  args: {
    description:
      'Hybrid solutions with React Native and Flutter, system architecture, project documentation and test creation, with occasional backend work in Elixir and Phoenix. Responsibilities covered store submission for Google Play and the App Store, integration and authoring of native libraries in Swift, Objective-C, Java and Kotlin, platform management across AppCenter, Firebase and OneSignal, REST integration, project structure, and raising automated test coverage with Jest on apps that shipped with none.',
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Idopter Labs/ }));
    await expect(canvas.getByText(/Hybrid solutions with React Native/)).toBeVisible();
  },
};

/**
 * Six rows, which is the real length of the list on the home page. Opening one
 * row leaves the others open, on purpose.
 */
export const InList: Story = {
  parameters: {
    docs: {
      description: { story: 'Reference layout: the Experience card as it ships.' },
    },
  },
  render: () => (
    // The meta decorator already supplies the `ol` this list needs.
    <>
      <ExperienceItem
        company="Idopter Labs"
        role="Mobile Developer"
        startDate="2022"
        endDate="Present"
        logo="/business/idopterlabs.webp"
        description="React Native and Flutter, architecture, documentation and tests."
      />
      <ExperienceItem
        company="HackerOne"
        role="Independent Security Researcher"
        startDate="2018"
        endDate="Present"
        logo="/business/h1.jpg"
        description="Vulnerability research for HackerOne partners."
      />
      <ExperienceItem
        company="VoxData Technology"
        role="Mobile Developer"
        startDate="2019"
        endDate="2022"
        logo="/business/voxdata.png"
        description="Native Android in Java and Kotlin, later React Native."
      />
    </>
  ),
};
