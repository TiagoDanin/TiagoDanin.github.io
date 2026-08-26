import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent, within } from 'storybook/test';

import { LanguageSuggestion } from './LanguageSuggestion';

/**
 * Storage is shared across stories, so each one starts from a clean slate.
 * Without this, opening the second story after the first would find the
 * "already seen" flag and render nothing.
 */
function clearFlags() {
  try {
    window.localStorage.removeItem('td.lang-suggestion.dismissed');
    window.sessionStorage.removeItem('td.lang-suggestion.seen');
  } catch {
    // Blocked site data: the component copes, and so does the story.
  }
}

const meta = {
  title: 'UI/LanguageSuggestion',
  component: LanguageSuggestion,
  parameters: { layout: 'fullscreen' },
  args: { languages: ['pt-BR', 'en-US'], href: '/br/' },
  decorators: [
    (Story) => {
      clearFlags();
      return <div className="min-h-[320px]">{<Story />}</div>;
    },
  ],
} satisfies Meta<typeof LanguageSuggestion>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A reader whose browser asks for Brazilian Portuguese, on the English home.
 * The copy is Portuguese on purpose: it is addressed to someone who may not
 * read the page behind it.
 */
export const BrazilianPortuguese: Story = {};

/** European Portuguese counts too: the test is the language, not the region. */
export const EuropeanPortuguese: Story = {
  args: { languages: ['pt-PT'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Ler em português' })).toHaveAttribute(
      'href',
      '/br/'
    );
  },
};

/** No Portuguese anywhere in the reader's preferences: nothing is rendered. */
export const EnglishOnly: Story = {
  args: { languages: ['en-US', 'es-ES'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('region')).not.toBeInTheDocument();
  },
};

/** "Agora não" closes it for this visit and leaves the decision open. */
export const DismissedForNow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Agora não' }));
    await expect(canvas.queryByRole('region')).not.toBeInTheDocument();
    await expect(window.localStorage.getItem('td.lang-suggestion.dismissed')).toBeNull();
  },
};

/** "Não mostrar de novo" is the one that persists past the tab closing. */
export const NeverAgain: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Não mostrar de novo' }));
    await expect(canvas.queryByRole('region')).not.toBeInTheDocument();
    await expect(window.localStorage.getItem('td.lang-suggestion.dismissed')).toBe('1');
  },
};
