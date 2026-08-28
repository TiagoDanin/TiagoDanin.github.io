import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent } from 'storybook/test';

import { CopyButton } from './CopyButton';

const SHORT_BIO =
  'Tiago Danin is a mobile developer. He works with Flutter and React Native, and develops the native apps and modules in Kotlin and Swift.';

/**
 * The copy affordance on `/press-kit/`. `BioBrowser` renders one per bio length,
 * so a journalist can lift the short, medium or long bio without selecting text
 * by hand.
 */
const meta = {
  title: 'UI/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Writes `value` to the clipboard and confirms it in place, swapping the',
          'copy icon for a check and the label for `copiedLabel` for two seconds.',
          '',
          'The confirmation is text, not just a green icon, and the timer is',
          'cleared on unmount so a fast navigation cannot set state on a gone',
          'component.',
          '',
          'Failure is silent by design. `navigator.clipboard.writeText` rejects',
          'in an insecure context or when the document is not focused, and the',
          'component swallows that and leaves the label alone, rather than',
          'claiming a copy that did not happen.',
          '',
          '**About the interaction tests below**: the browser only grants',
          'clipboard writes to a focused, trusted document, which a Storybook',
          'run cannot guarantee. The play functions therefore install a spy in',
          'place of `navigator.clipboard` for the duration of the click, assert',
          'the exact string handed to it, and assert the visible label swap.',
          'The original clipboard is restored afterwards.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The string written to the clipboard. Never rendered.',
    },
    label: {
      control: 'text',
      description: 'Resting label.',
      table: { defaultValue: { summary: 'Copy' } },
    },
    copiedLabel: {
      control: 'text',
      description: 'Label shown for two seconds after a successful write.',
      table: { defaultValue: { summary: 'Copied' } },
    },
    srLabel: {
      control: 'text',
      description:
        'Sets `aria-label`, which becomes the whole accessible name. Needed when several buttons on the page share the label "Copy", as on the press kit.',
    },
  },
  args: {
    value: SHORT_BIO,
    label: 'Copy',
    copiedLabel: 'Copied',
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Resting state, then the confirmation. The button keeps a 36px minimum height
 * so it stays a comfortable target next to the bio heading.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Copy' });

    const writeText = fn();
    const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    try {
      await userEvent.click(button);
      await expect(writeText).toHaveBeenCalledWith(SHORT_BIO);
      await expect(await canvas.findByText('Copied')).toBeVisible();
    } finally {
      if (original) {
        Object.defineProperty(navigator, 'clipboard', original);
      } else {
        Reflect.deleteProperty(navigator, 'clipboard');
      }
    }
  },
};

/**
 * How `BioBrowser` renders it in Portuguese. `srLabel` disambiguates the three
 * buttons stacked down the page, which would otherwise all announce as
 * "Copiar".
 */
export const PortugueseWithScreenReaderLabel: Story = {
  args: {
    label: 'Copiar',
    copiedLabel: 'Copiado',
    srLabel: 'Copiar bio: Curta',
    value:
      'Tiago Danin e um desenvolvedor mobile. Trabalha com Flutter e React Native, e desenvolve os apps e modulos nativos em Kotlin e Swift.',
  },
  play: async ({ canvas, args }) => {
    // aria-label wins over the visible text, so the accessible name is the
    // disambiguated one and the visible label stays short.
    const button = canvas.getByRole('button', { name: 'Copiar bio: Curta' });
    await expect(canvas.getByText('Copiar')).toBeVisible();

    const writeText = fn();
    const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    try {
      await userEvent.click(button);
      await expect(writeText).toHaveBeenCalledWith(args.value);
      await expect(await canvas.findByText('Copiado')).toBeVisible();
    } finally {
      if (original) {
        Object.defineProperty(navigator, 'clipboard', original);
      } else {
        Reflect.deleteProperty(navigator, 'clipboard');
      }
    }
  },
};

/**
 * A rejected write leaves the button untouched. Denied permission, an insecure
 * origin and an unfocused document all land here, and none of them should read
 * as success.
 */
export const CopyDenied: Story = {
  play: async ({ canvas }) => {
    const writeText = fn(() => Promise.reject(new Error('Document is not focused')));
    const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    try {
      await userEvent.click(canvas.getByRole('button', { name: 'Copy' }));
      await expect(writeText).toHaveBeenCalled();
      await expect(canvas.queryByText('Copied')).not.toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Copy' })).toBeVisible();
    } finally {
      if (original) {
        Object.defineProperty(navigator, 'clipboard', original);
      } else {
        Reflect.deleteProperty(navigator, 'clipboard');
      }
    }
  },
};

/**
 * The label is free text, so the button can name what it copies. Useful outside
 * the press kit, where "Copy" alone would be ambiguous.
 */
export const CustomLabel: Story = {
  args: {
    label: 'Copy install command',
    copiedLabel: 'Command copied',
    value: 'npm install telegram-bot-api',
  },
};

/**
 * `shrink-0` keeps the control at its natural width when it sits in a flex row
 * next to prose that wants all the space, which is the press kit layout.
 */
export const BesideHeading: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: { story: 'The press kit arrangement: heading, hint, button.' },
    },
  },
  render: (args) => (
    <div className="max-w-xl rounded-xl border bg-background p-6 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">Short</h3>
          <p className="text-sm text-muted-foreground">
            50 to 75 words, for programs and social posts
          </p>
        </div>
        <CopyButton {...args} />
      </div>
      <p className="mt-4 leading-relaxed text-foreground/90">{args.value}</p>
    </div>
  ),
  args: {
    srLabel: 'Copy bio: Short',
  },
};
