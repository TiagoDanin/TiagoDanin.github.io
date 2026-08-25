import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

/**
 * Ships with the shadcn/ui install; no page currently renders it. Worth reading
 * before the first one does, because the listbox is portalled and that changes
 * how it has to be tested.
 */
const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Radix `Select` with the shadcn skin. Ships with the shadcn/ui',
          'install; no page currently renders it.',
          '',
          'It is not a `<select>`. The trigger is a `<button role="combobox">`',
          'and the list is a `role="listbox"` rendered through',
          '`SelectPrimitive.Portal` into `document.body`, outside whatever',
          'container it was declared in. Two consequences: `overflow: hidden`',
          'on an ancestor cannot clip it, and a test has to query the open',
          'list from `screen`, not from the story canvas.',
          '',
          'Every `SelectItem` needs a non-empty `value`. Radix reserves the',
          'empty string for "nothing selected" and throws if an item claims',
          'it, so an explicit "any" option needs a real value such as `all`.',
          '',
          'Label the trigger with `<Label htmlFor>` pointing at its `id`, the',
          'same as a native select. A trigger showing only a placeholder is',
          'otherwise announced as an unnamed combobox.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled value. Omit to let the select own its state.',
    },
    defaultValue: {
      control: 'text',
      description: 'Value selected on first render, for an uncontrolled select.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the trigger, so the list cannot be opened.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the hidden mirror input required inside a `<form>`.',
    },
    name: {
      control: 'text',
      description: 'Name of the hidden mirror input Radix renders inside a `<form>`.',
    },
    onValueChange: { description: 'Fires with the value of the chosen item.' },
    onOpenChange: { description: 'Fires when the listbox opens or closes.' },
  },
  args: {
    disabled: false,
    onValueChange: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const TOPICS = [
  { value: 'flutter', label: 'Flutter' },
  { value: 'react-native', label: 'React Native' },
  { value: 'mobile-security', label: 'Mobile security' },
  { value: 'open-source', label: 'Open source maintenance' },
];

/**
 * The full pattern: a label bound to the trigger by `id`, a placeholder while
 * nothing is chosen, and one item per option. The play function opens the list
 * from `screen`, since the portal puts it outside the canvas.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="talk-topic">Talk topic</Label>
      <Select {...args}>
        <SelectTrigger id="talk-topic">
          <SelectValue placeholder="Pick a topic" />
        </SelectTrigger>
        <SelectContent>
          {TOPICS.map((topic) => (
            <SelectItem key={topic.value} value={topic.value}>
              {topic.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Talk topic' });

    await expect(trigger).toHaveTextContent('Pick a topic');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);

    // The listbox is portalled into document.body, so it is only reachable
    // through `screen`. `findByRole` retries while the open animation runs.
    const option = await screen.findByRole('option', { name: 'React Native' });
    await userEvent.click(option);

    await waitFor(async () => {
      await expect(trigger).toHaveTextContent('React Native');
    });
    await expect(args.onValueChange).toHaveBeenCalledWith('react-native');
  },
};

/** A value chosen up front, so the trigger shows a real label rather than the placeholder. */
export const WithDefaultValue: Story = {
  args: { defaultValue: 'flutter' },
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="talk-topic-default">Talk topic</Label>
      <Select {...args}>
        <SelectTrigger id="talk-topic-default">
          <SelectValue placeholder="Pick a topic" />
        </SelectTrigger>
        <SelectContent>
          {TOPICS.map((topic) => (
            <SelectItem key={topic.value} value={topic.value}>
              {topic.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('combobox', { name: 'Talk topic' })).toHaveTextContent('Flutter');
  },
};

/**
 * Keyboard operation, the WCAG AA baseline. Tab reaches the trigger, Enter
 * opens the list, arrows move the highlight and Enter commits. Escape closes
 * without changing the value and returns focus to the trigger.
 */
export const KeyboardSelection: Story = {
  args: { defaultValue: 'flutter' },
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="talk-topic-keyboard">Talk topic</Label>
      <Select {...args}>
        <SelectTrigger id="talk-topic-keyboard">
          <SelectValue placeholder="Pick a topic" />
        </SelectTrigger>
        <SelectContent>
          {TOPICS.map((topic) => (
            <SelectItem key={topic.value} value={topic.value}>
              {topic.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Talk topic' });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(await screen.findByRole('listbox')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    await expect(trigger).toHaveFocus();
    await expect(args.onValueChange).not.toHaveBeenCalled();

    await userEvent.keyboard('{Enter}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('{ArrowDown}{Enter}');

    await waitFor(async () => {
      await expect(trigger).toHaveTextContent('React Native');
    });
    await expect(args.onValueChange).toHaveBeenCalledWith('react-native');
  },
};

/**
 * Options split into named groups with a separator between them. `SelectLabel`
 * is a group heading, not an option, so it is skipped by arrow navigation.
 */
export const Grouped: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="project-source">Project source</Label>
      <Select {...args}>
        <SelectTrigger id="project-source">
          <SelectValue placeholder="Every source" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Code hosting</SelectLabel>
            <SelectItem value="github">GitHub</SelectItem>
            <SelectItem value="private">Private repositories</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Package registries</SelectLabel>
            <SelectItem value="npm">npm</SelectItem>
            <SelectItem value="pypi">PyPI</SelectItem>
            <SelectItem value="luarocks">LuaRocks</SelectItem>
            <SelectItem value="aur">AUR</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox', { name: 'Project source' }));

    const listbox = await screen.findByRole('listbox');
    await expect(within(listbox).getByText('Package registries')).toBeInTheDocument();

    await userEvent.click(await screen.findByRole('option', { name: 'PyPI' }));

    await expect(args.onValueChange).toHaveBeenCalledWith('pypi');
  },
};

/**
 * A disabled option stays in the list and keeps its name, so the reason it is
 * unavailable can be read, but it cannot be chosen with pointer or keyboard.
 */
export const WithDisabledOption: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="talk-format">Talk format</Label>
      <Select {...args}>
        <SelectTrigger id="talk-format">
          <SelectValue placeholder="Pick a format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="keynote">Keynote</SelectItem>
          <SelectItem value="talk">Conference talk</SelectItem>
          <SelectItem value="workshop" disabled>
            Workshop (fully booked)
          </SelectItem>
          <SelectItem value="lightning">Lightning talk</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox', { name: 'Talk format' }));

    const disabledOption = await screen.findByRole('option', { name: 'Workshop (fully booked)' });
    await expect(disabledOption).toHaveAttribute('data-disabled');

    await userEvent.click(await screen.findByRole('option', { name: 'Lightning talk' }));

    await expect(args.onValueChange).toHaveBeenCalledWith('lightning');
  },
};

/** A disabled trigger cannot be opened and is skipped by Tab. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'flutter' },
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="talk-topic-disabled">Talk topic</Label>
      <Select {...args}>
        <SelectTrigger id="talk-topic-disabled">
          <SelectValue placeholder="Pick a topic" />
        </SelectTrigger>
        <SelectContent>
          {TOPICS.map((topic) => (
            <SelectItem key={topic.value} value={topic.value}>
              {topic.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Talk topic' });

    await expect(trigger).toBeDisabled();

    await userEvent.click(trigger);

    await expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};

/**
 * Enough options to overflow the 24rem cap on the content, which is what brings
 * the scroll buttons at the top and bottom of the list into play.
 */
export const LongList: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Every year the site has content for, as a scrolling list.',
      },
    },
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="timeline-year">Timeline year</Label>
      <Select {...args}>
        <SelectTrigger id="timeline-year">
          <SelectValue placeholder="Every year" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 16 }, (_, index) => String(2025 - index)).map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox', { name: 'Timeline year' }));

    await userEvent.click(await screen.findByRole('option', { name: '2019' }));

    await expect(args.onValueChange).toHaveBeenCalledWith('2019');
  },
};

/**
 * Inside a `<form>`, Radix renders a hidden native select mirroring the value so
 * the field is submitted and `required` is enforced by the browser.
 */
export const RequiredInForm: Story = {
  args: { required: true, name: 'topic' },
  render: (args) => (
    <form className="flex w-72 flex-col gap-2" onSubmit={(event) => event.preventDefault()}>
      <Label htmlFor="talk-topic-required">Talk topic</Label>
      <Select {...args}>
        <SelectTrigger id="talk-topic-required">
          <SelectValue placeholder="Pick a topic" />
        </SelectTrigger>
        <SelectContent>
          {TOPICS.map((topic) => (
            <SelectItem key={topic.value} value={topic.value}>
              {topic.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">Required. Used to route the proposal.</p>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox', { name: 'Talk topic' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Mobile security' }));

    await expect(args.onValueChange).toHaveBeenCalledWith('mobile-security');
  },
};
