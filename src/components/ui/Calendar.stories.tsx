import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Calendar } from './calendar';

// Fixtures are pinned to a real conference week so the stories render the same
// grid on every run. Never build these from `new Date()`: the month, the
// "today" ring and the disabled weekends would all drift daily.
const SEPTEMBER_2024 = new Date(2024, 8, 1);
const TALK_DAY = new Date(2024, 8, 26);
const CFP_OPENS = new Date(2024, 8, 9);
const CFP_CLOSES = new Date(2024, 8, 20);

// `CalendarProps` is a union over `mode`, and only three of its four members
// carry `onSelect`, so `args.onSelect` is not reachable from a play function.
// The spy is declared at module scope instead and read directly. Every play
// clears it first, since all the stories share the one instance.
const onSelectSpy = fn();

/**
 * Ships with the shadcn/ui install; no page currently renders it. Talk dates on
 * the site are formatted strings from `contents/talks`, never a picker.
 */
const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '`react-day-picker` v8 with the shadcn class map. Ships with the',
          'shadcn/ui install; no page currently renders it.',
          '',
          '`mode` decides the shape of everything else. `single` gives',
          '`selected: Date` and an `onSelect` that receives one date or',
          '`undefined` when the day is clicked again. `range` gives',
          '`{ from, to }`, and `multiple` gives an array. Changing `mode`',
          'changes the callback signature, not just the highlight.',
          '',
          'The grid is not a table of buttons. Every day is a',
          '`<button role="gridcell">` whose accessible name is the day number',
          'alone, so a test queries `getByRole("gridcell", { name: "26" })`.',
          '',
          'Pin `defaultMonth` and `today` in tests and snapshots. Left to',
          'itself the component opens on the current month and rings the real',
          'today, which makes any stored output change overnight.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['default', 'single', 'multiple', 'range'],
      description:
        'Selection behaviour. Drives the type of `selected` and the signature of `onSelect`.',
    },
    defaultMonth: {
      control: 'date',
      description: 'Month shown on first render. Set it so the story is deterministic.',
    },
    today: {
      control: 'date',
      description:
        'Which day gets the `today` ring. Override it in tests, otherwise the highlight moves every day.',
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Fill the leading and trailing cells with days from the neighbouring months.',
      table: { defaultValue: { summary: 'true' } },
    },
    numberOfMonths: {
      control: 'number',
      description: 'How many months to render side by side. Two is the usual choice for a range.',
    },
    disabled: {
      description: 'A matcher for days that cannot be picked: a date, an array, a range, or a predicate.',
    },
  },
  args: {
    defaultMonth: SEPTEMBER_2024,
    today: TALK_DAY,
    showOutsideDays: true,
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `mode="single"`, the shape a date field would use. Clicking a day calls
 * `onSelect` with that date; clicking the selected day again clears it and calls
 * back with `undefined`.
 */
export const SingleDate: Story = {
  args: {
    mode: 'single',
    selected: TALK_DAY,
    onSelect: onSelectSpy,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onSelectSpy.mockClear();

    await expect(canvas.getByText('September 2024')).toBeInTheDocument();

    const selected = canvas.getByRole('gridcell', { name: '26' });
    await expect(selected).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(canvas.getByRole('gridcell', { name: '19' }));

    // onSelect(day, selectedDay, activeModifiers, event)
    await expect(onSelectSpy).toHaveBeenCalledWith(
      new Date(2024, 8, 19),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  },
};

/** Nothing selected yet. The grid still renders, with only the `today` ring set. */
export const NoSelection: Story = {
  args: {
    mode: 'single',
    selected: undefined,
    onSelect: onSelectSpy,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onSelectSpy.mockClear();

    await expect(canvas.queryByRole('gridcell', { selected: true })).not.toBeInTheDocument();
  },
};

/**
 * Keyboard operation. The grid is one tab stop; arrow keys move the focused day,
 * Enter picks it. Moving past the end of a month advances the caption, so a
 * keyboard user never needs the navigation buttons.
 */
export const KeyboardSelection: Story = {
  args: {
    mode: 'single',
    selected: TALK_DAY,
    onSelect: onSelectSpy,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onSelectSpy.mockClear();

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    await expect(canvas.getByRole('gridcell', { name: '26' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('gridcell', { name: '27' })).toHaveFocus();

    await userEvent.keyboard('{Enter}');

    await expect(onSelectSpy).toHaveBeenCalledWith(
      new Date(2024, 8, 27),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  },
};

/**
 * `mode="range"` across two months, which is how a call for papers window would
 * be shown. `onSelect` receives `{ from, to }` rather than a single date.
 */
export const DateRange: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
    selected: { from: CFP_OPENS, to: CFP_CLOSES },
    onSelect: onSelectSpy,
  },
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Call for papers window, 9 to 20 September 2024.' } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onSelectSpy.mockClear();

    await expect(canvas.getByText('September 2024')).toBeInTheDocument();
    await expect(canvas.getByText('October 2024')).toBeInTheDocument();
    await expect(canvas.getAllByRole('gridcell', { selected: true }).length).toBeGreaterThan(1);
  },
};

/**
 * A predicate `disabled` matcher, here blocking weekends. Disabled days keep
 * their place in the grid so the month keeps its shape, and they are skipped by
 * both pointer and keyboard.
 */
export const WeekendsDisabled: Story = {
  args: {
    mode: 'single',
    selected: undefined,
    onSelect: onSelectSpy,
    disabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onSelectSpy.mockClear();

    // 28 September 2024 is a Saturday.
    await expect(canvas.getByRole('gridcell', { name: '28' })).toBeDisabled();

    await userEvent.click(canvas.getByRole('gridcell', { name: '28' }));
    await expect(onSelectSpy).not.toHaveBeenCalled();

    // 27 September 2024 is a Friday.
    await userEvent.click(canvas.getByRole('gridcell', { name: '27' }));
    await expect(onSelectSpy).toHaveBeenCalled();
  },
};

/**
 * Moving between months with the navigation buttons. Both carry an `aria-label`
 * from `react-day-picker`, since they hold nothing but a chevron.
 */
export const MonthNavigation: Story = {
  args: { mode: 'single', selected: undefined, onSelect: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onSelectSpy.mockClear();

    await expect(canvas.getByText('September 2024')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Go to next month' }));
    await expect(canvas.getByText('October 2024')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Go to previous month' }));
    await expect(canvas.getByText('September 2024')).toBeInTheDocument();
  },
};

/**
 * `showOutsideDays={false}` leaves the leading and trailing cells empty. Useful
 * when the neighbouring greyed out days read as selectable and confuse people.
 */
export const WithoutOutsideDays: Story = {
  args: {
    mode: 'single',
    selected: TALK_DAY,
    onSelect: onSelectSpy,
    showOutsideDays: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onSelectSpy.mockClear();

    // September 2024 ends on a Monday, so 1 to 5 October would fill the last
    // row. With outside days off, "1" appears exactly once: September 1st.
    await expect(canvas.getAllByRole('gridcell', { name: '1' })).toHaveLength(1);
  },
};

/**
 * A hard boundary rather than a matcher: `startMonth` and `endMonth` restrict
 * the navigable range, so the previous month button disables itself at the
 * edge. They replace v8's `fromDate` / `toDate`, which also blocked selection,
 * hence the explicit `disabled` matcher alongside them.
 */
export const BoundedRange: Story = {
  args: {
    mode: 'single',
    selected: undefined,
    onSelect: onSelectSpy,
    startMonth: SEPTEMBER_2024,
    endMonth: new Date(2024, 8, 30),
    disabled: { before: SEPTEMBER_2024, after: new Date(2024, 8, 30) },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onSelectSpy.mockClear();

    await expect(canvas.getByRole('button', { name: 'Go to previous month' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Go to next month' })).toBeDisabled();
  },
};
