import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

/**
 * Draggable split panes from `react-resizable-panels`, styled to match the rest
 * of the kit.
 */
const meta = {
  title: 'UI/Resizable',
  component: ResizablePanelGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Ships with the shadcn/ui install; no page currently renders it.',
          'A resizable pane is an editor affordance, and this site is a set of',
          'reading pages, so it may never be used here at all.',
          '',
          'The group is `h-full w-full`, which means it collapses to nothing',
          'inside a parent with no resolved height. Every story below pins a',
          'height on the group itself.',
          '',
          'Panel sizes are percentages, not pixels, and they must add up to 100',
          'across the group. `minSize` and `maxSize` are also percentages.',
          '',
          'The handle is a real `role="separator"` with `tabIndex=0`, so it is',
          'reachable by Tab and moved with the arrow keys. That is what makes',
          'the split keyboard operable rather than drag only, which would fail',
          'WCAG AA on its own.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Axis the panels are laid along. `vertical` stacks them and turns the handle into a horizontal bar.',
    },
    autoSaveId: {
      control: 'text',
      description:
        'Persists the layout to local storage under this key. Leave unset in stories so each run starts from the declared sizes.',
    },
    onLayout: {
      control: false,
      description: 'Fires with the panel sizes, as percentages, on every change.',
    },
  },
  args: {
    direction: 'horizontal',
    className: 'h-[22rem] w-full rounded-lg border',
  },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const sourcePane = (
  <div className="flex h-full flex-col gap-2 p-4">
    <span className="text-sm font-medium">Post source</span>
    <pre className="overflow-auto rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
      {[
        '---',
        'title: Liquid Glass no Flutter',
        'date: 2025-07-14',
        'tags: [flutter, ui]',
        '---',
        '',
        'O efeito chegou ao iOS 26 e a pergunta',
        'que sobra e se vale a pena reproduzir.',
      ].join('\n')}
    </pre>
  </div>
);

const previewPane = (
  <div className="flex h-full flex-col gap-2 p-4">
    <span className="text-sm font-medium">Preview</span>
    <h2 className="text-xl font-bold">Liquid Glass no Flutter</h2>
    <p className="text-sm text-muted-foreground">
      O efeito chegou ao iOS 26 e a pergunta que sobra e se vale a pena
      reproduzir.
    </p>
  </div>
);

/**
 * Two panes split down the middle, the shape an MDX editor would use. The play
 * function tabs to the handle and nudges it with an arrow key, then checks the
 * panel actually resized rather than only taking focus.
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <ResizablePanel defaultSize={50} minSize={25}>
          {sourcePane}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          {previewPane}
        </ResizablePanel>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getByRole('separator');

    await userEvent.tab();
    await expect(handle).toHaveFocus();

    // The library mirrors each panel's current size onto a data attribute, so
    // that is the observable result of a keyboard resize.
    const panel = canvasElement.querySelector('[data-panel]');
    const before = panel?.getAttribute('data-panel-size');

    await userEvent.keyboard('{ArrowRight}');

    await waitFor(() =>
      expect(panel?.getAttribute('data-panel-size')).not.toBe(before)
    );
  },
};

/**
 * Stacked panes. The handle becomes a full width bar and the grip icon rotates,
 * both driven by `data-panel-group-direction` rather than by a prop on the
 * handle.
 */
export const Vertical: Story = {
  args: {
    direction: 'vertical',
    children: (
      <>
        <ResizablePanel defaultSize={60} minSize={30}>
          {previewPane}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className="flex h-full flex-col gap-2 p-4">
            <span className="text-sm font-medium">Build output</span>
            <pre className="overflow-auto rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
              {[
                '$ yarn build',
                'Generating static pages (312/312)',
                'Exported to dist/ in 41.2s',
              ].join('\n')}
            </pre>
          </div>
        </ResizablePanel>
      </>
    ),
  },
};

/**
 * Three panes with two handles, plus `minSize` on each so no pane can be
 * squeezed to nothing. The middle pane is the one that loses room first.
 */
export const ThreePanels: Story = {
  args: {
    children: (
      <>
        <ResizablePanel defaultSize={22} minSize={15}>
          <div className="flex h-full flex-col gap-1 p-4 text-sm">
            <span className="font-medium">Collections</span>
            <span className="text-muted-foreground">posts</span>
            <span className="text-muted-foreground">talks</span>
            <span className="text-muted-foreground">timeline</span>
            <span className="text-muted-foreground">github</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={38} minSize={20}>
          {sourcePane}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          {previewPane}
        </ResizablePanel>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Two handles means two separators, each one addressing the split to its
    // left. Nothing distinguishes them by name, which is a real gap for a
    // screen reader user and an argument for labelling them by hand.
    await expect(canvas.getAllByRole('separator')).toHaveLength(2);
  },
};

/**
 * A handle with no grip. It stays the same one pixel line and keeps its four
 * pixel hit area, so it is still draggable, just harder to notice. Prefer
 * `withHandle` unless the split is obvious from the content.
 */
export const HandleWithoutGrip: Story = {
  args: {
    children: (
      <>
        <ResizablePanel defaultSize={50}>{sourcePane}</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>{previewPane}</ResizablePanel>
      </>
    ),
  },
};

/**
 * A collapsible side pane. With `collapsible` and `collapsedSize` the pane
 * snaps shut once it is dragged below `minSize`, instead of refusing to move
 * any further.
 */
export const CollapsiblePanel: Story = {
  args: {
    children: (
      <>
        <ResizablePanel
          defaultSize={25}
          minSize={15}
          collapsedSize={0}
          collapsible
        >
          <div className="flex h-full flex-col gap-1 p-4 text-sm">
            <span className="font-medium">Tags</span>
            <span className="text-muted-foreground">flutter</span>
            <span className="text-muted-foreground">react-native</span>
            <span className="text-muted-foreground">ci-cd</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>{previewPane}</ResizablePanel>
      </>
    ),
  },
};
