import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent, within } from 'storybook/test';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

/**
 * Radix Accordion with the shadcn/ui chrome. Unused in production today, kept
 * here as the documented answer for the next FAQ-shaped block.
 */
const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'Zero modules import it, so everything below is a proposal for how an',
          'FAQ or a "what is included" block would be built, not a screenshot of',
          'production.',
          '',
          '`AccordionContent` is unmounted while the item is closed, so its text',
          'is absent from the DOM rather than hidden. Anything that must stay',
          'indexable by a crawler cannot live inside a closed panel.',
          '',
          'The trigger is a real `<button>` inside an `<h3>`-level header, which',
          'is what makes the whole thing keyboard operable without extra work:',
          'Tab reaches it, Enter and Space toggle it, and arrow keys move',
          'between triggers.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      description:
        '`single` closes the open panel when another opens. `multiple` lets several stay open.',
      table: { defaultValue: { summary: 'single' } },
    },
    collapsible: {
      control: 'boolean',
      description:
        'Only meaningful with `type="single"`. When false the open panel can never be closed, so one answer is always showing.',
    },
    defaultValue: {
      control: false,
      description:
        'Item value open on first render. A string for `single`, an array for `multiple`.',
    },
    disabled: {
      control: 'boolean',
      description: 'Freezes every trigger in the group.',
    },
  },
  args: {
    type: 'single',
    collapsible: true,
    className: 'w-[34rem] max-w-[90vw]',
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const faq = [
  {
    value: 'freelance',
    question: 'Do you take on freelance mobile work?',
    answer:
      'Yes, for Flutter and React Native work, usually in blocks of a few weeks. The fastest way to start is a short call about the scope and the deadline you already have.',
  },
  {
    value: 'stack',
    question: 'Which stack do you actually ship with?',
    answer:
      'Flutter and React Native on the client, Node and TypeScript around it. The published npm packages and the GitHub repositories on this site are the same code, not a separate portfolio.',
  },
  {
    value: 'talks',
    question: 'Are the conference talks available to watch?',
    answer:
      'Every recorded talk is linked from the talks page, with slides where the event allows it. Talks given in Portuguese keep their original audio and are listed under the Portuguese route.',
  },
  {
    value: 'license',
    question: 'Can I reuse the open source projects commercially?',
    answer:
      'Check the LICENSE file in each repository. Most are MIT, a few are Apache 2.0, and the license shown on each project page is read straight from GitHub rather than typed by hand.',
  },
];

const items = faq.map((item) => (
  <AccordionItem key={item.value} value={item.value}>
    <AccordionTrigger>{item.question}</AccordionTrigger>
    <AccordionContent>{item.answer}</AccordionContent>
  </AccordionItem>
));

/**
 * Every panel closed on first paint. The play function opens one with the mouse
 * and checks the answer reached the DOM, since a closed panel is unmounted
 * rather than visually hidden.
 */
export const Default: Story = {
  args: { children: items },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /freelance mobile work/i });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      await canvas.findByText(/usually in blocks of a few weeks/i)
    ).toBeVisible();
  },
};

/**
 * Opening the second question closes the first, because `type="single"` keeps
 * exactly one panel open. This is the behaviour to prefer for an FAQ: the
 * reader never has to scroll past four expanded answers to find the fifth.
 */
export const OnlyOneOpenAtATime: Story = {
  args: { children: items, defaultValue: 'freelance' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: /freelance mobile work/i });
    const second = canvas.getByRole('button', { name: /which stack/i });

    await expect(first).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(second);

    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  },
};

/**
 * Keyboard path, which is the WCAG AA baseline for this component. Tab reaches
 * the first trigger, Space toggles it, and ArrowDown moves to the next one
 * without the pointer ever being used.
 */
export const KeyboardOperated: Story = {
  args: { children: items },
  parameters: {
    docs: {
      description: {
        story:
          'Drives the accordion with Tab, Space and ArrowDown, then asserts both the open state and where focus landed.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: /freelance mobile work/i });
    const second = canvas.getByRole('button', { name: /which stack/i });

    await userEvent.tab();
    await expect(first).toHaveFocus();

    await userEvent.keyboard(' ');
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{ArrowDown}');
    await expect(second).toHaveFocus();
  },
};

/**
 * `type="multiple"` lets a reader keep two answers side by side, which suits a
 * changelog or a spec list better than an FAQ. Note that `collapsible` does not
 * apply here, so this story builds its own root instead of inheriting the args.
 */
export const MultipleOpen: Story = {
  args: { children: items },
  render: () => (
    <Accordion
      type="multiple"
      defaultValue={['stack', 'talks']}
      className="w-[34rem] max-w-[90vw]"
    >
      {items}
    </Accordion>
  ),
};

/**
 * A single item is the honest empty-ish state: the chevron and the border still
 * read as an accordion, so the reader knows there is something to open.
 */
export const SingleItem: Story = {
  args: {
    children: (
      <AccordionItem value="license">
        <AccordionTrigger>{faq[3].question}</AccordionTrigger>
        <AccordionContent>{faq[3].answer}</AccordionContent>
      </AccordionItem>
    ),
  },
};

/**
 * Long questions wrap and push the chevron down, because the trigger is a flex
 * row with `items-center` rather than a fixed-height bar. Worth checking before
 * shipping copy that runs past one line.
 */
export const LongQuestion: Story = {
  args: {
    children: (
      <AccordionItem value="long">
        <AccordionTrigger>
          Why does the site keep the English and the Portuguese versions of a
          post on separate routes instead of switching the text in place?
        </AccordionTrigger>
        <AccordionContent>
          Because each language gets its own URL, its own canonical tag and its
          own entry in the sitemap. A search engine can rank the Portuguese post
          for Portuguese queries, which is the whole point of publishing it.
        </AccordionContent>
      </AccordionItem>
    ),
  },
};
