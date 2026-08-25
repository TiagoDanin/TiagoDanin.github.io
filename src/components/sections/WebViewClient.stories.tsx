import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import WebViewClient from './WebViewClient';

/**
 * The whole of `/webview/`: a browser environment inspector Tiago uses for bug
 * bounty work, published so a proof of concept can be reproduced from a URL
 * instead of a pasted snippet.
 */
const meta = {
  title: 'Sections/WebViewClient',
  component: WebViewClient,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Three tools on one page, all client side and all operating on the',
          'window they are rendered in.',
          '',
          '**Property inspector.** On mount it walks `for (const topProp in',
          'window)` and records each property name, its `typeof`, and the names',
          'of its own properties. Access is wrapped in `try/catch` per property,',
          'and a throw is kept and shown as an error row rather than dropping',
          'the entry, which is the interesting result when the point is finding',
          'what a WebView blocks. Clicking a name logs the value and its',
          'descriptor to the console panel. The list is filtered live by the',
          'search field.',
          '',
          '**Console interceptor.** `console.log`, `console.error` and',
          '`console.warn` are replaced on mount so their output is mirrored into',
          'the panel, and restored on unmount. The originals are still called,',
          'so devtools keeps working. Anything the page itself logs while the',
          'story is open lands here too.',
          '',
          '**Code execution.** The textarea is `eval`ed, with Ctrl or Cmd plus',
          'Enter as the shortcut. Result and errors go to the console panel.',
          'That is the point of the page, not an oversight, but it does mean',
          'this story runs whatever is typed into it inside the Storybook frame.',
          '',
          'What you see here is genuinely the Storybook preview iframe: the',
          'property list is that frame window, so it carries Storybook internals',
          'that the deployed page would not have.',
          '',
          'Two details worth knowing before touching this file. It renders the',
          'entire property list at once with no virtualisation, which is several',
          'hundred rows plus their expandable sub-property lists. And its visual',
          'treatment predates `DESIGN.md`: the h1 uses gradient clipped text and',
          'the warning rows carry a `dark:` variant, both of which the design',
          'system bans elsewhere on the site.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof WebViewClient>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The page on load: properties enumerated, console empty, editor empty. The
 * count badge next to the panel title is the filtered count, which starts as
 * the total.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: 'WebView Inspector' })
    ).toBeVisible();

    // The enumeration runs in an effect, so the first row arrives after mount,
    // and there are around a thousand of them for the role query to walk.
    await expect(
      await canvas.findByRole('button', { name: 'document' }, { timeout: 15000 })
    ).toBeVisible();
    await expect(canvas.getByText(/\d+ properties/)).toBeVisible();

    await expect(canvas.getByText('Console output will appear here...')).toBeVisible();
  },
};

/**
 * The search field narrows the property list by substring, case insensitively.
 * It is the only practical way through a list this long.
 *
 * The field has a placeholder and no label, so there is no accessible name to
 * query it by. That is a real accessibility gap on this page, and the reason
 * this play function reaches for the placeholder.
 */
export const SearchesProperties: Story = {
  play: async ({ canvas }) => {
    await canvas.findByRole('button', { name: 'document' }, { timeout: 15000 });

    await userEvent.type(canvas.getByPlaceholderText('Search properties...'), 'navi');

    await expect(canvas.getByRole('button', { name: 'navigator' })).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: 'document' })
    ).not.toBeInTheDocument();
  },
};

/**
 * Clicking a property name inspects it: the value, its own property names and
 * its descriptor go to the console panel. This is how the page is meant to be
 * driven, one property at a time rather than by reading the whole dump.
 */
export const InspectsAProperty: Story = {
  play: async ({ canvas }) => {
    await canvas.findByRole('button', { name: 'document' }, { timeout: 15000 });
    await userEvent.type(canvas.getByPlaceholderText('Search properties...'), 'navi');

    await userEvent.click(canvas.getByRole('button', { name: 'navigator' }));

    await expect(await canvas.findByText(/Inspecting navigator:/)).toBeVisible();
    await expect(canvas.getByText(/Details:/)).toBeVisible();
  },
};

/**
 * Running code. The expression is evaluated in the page's own scope and the
 * result is logged through the intercepted console, so it lands in the panel
 * above. A deliberately harmless expression here, since the story really does
 * execute it.
 */
export const RunsCode: Story = {
  play: async ({ canvas }) => {
    const editor = canvas.getByPlaceholderText(/Enter your JavaScript code here/);
    await userEvent.type(editor, '1 + 1');

    await userEvent.click(canvas.getByRole('button', { name: /Run Code/ }));

    await expect(await canvas.findByText(/Code execution result: 2/)).toBeVisible();
  },
};

/**
 * A throwing expression is caught and reported as an error row rather than
 * breaking the page. Same path a failing proof of concept takes.
 */
export const ReportsExecutionErrors: Story = {
  play: async ({ canvas }) => {
    const editor = canvas.getByPlaceholderText(/Enter your JavaScript code here/);
    await userEvent.type(editor, 'undefinedGlobalForThisTest.value');

    await userEvent.click(canvas.getByRole('button', { name: /Run Code/ }));

    await expect(await canvas.findByText(/Code execution error:/)).toBeVisible();
  },
};

/**
 * Clear empties the panel back to its placeholder. It only clears the mirror,
 * not the real devtools console.
 */
export const ClearsConsole: Story = {
  play: async ({ canvas }) => {
    const editor = canvas.getByPlaceholderText(/Enter your JavaScript code here/);
    await userEvent.type(editor, '2 + 2');
    await userEvent.click(canvas.getByRole('button', { name: /Run Code/ }));
    await canvas.findByText(/Code execution result: 4/);

    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));

    await expect(
      await canvas.findByText('Console output will appear here...')
    ).toBeVisible();
  },
};

/**
 * Below `lg` the two panels stack, so the property list and the console are one
 * above the other rather than side by side. Both keep their fixed heights and
 * scroll internally.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
