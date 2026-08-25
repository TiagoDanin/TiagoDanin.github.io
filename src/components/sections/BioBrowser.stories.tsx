import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import { BioBrowser } from './BioBrowser';
import {
  BIO_FOCUSES,
  BIO_LANGUAGES,
  type BioFocus,
  type BioLang,
  type BioTable,
} from '@/lib/bios';

/**
 * Lead sentence per angle. Everything after it is shared, which is how the real
 * `bios` collection is written too: one opening claim, then the same career
 * facts behind it.
 */
const LEAD: Record<BioFocus, Record<BioLang, string>> = {
  general: {
    en: 'Tiago Danin is a mobile developer.',
    pt: 'Tiago Danin é um desenvolvedor mobile.',
  },
  mobile: {
    en: 'Tiago Danin builds Android and iOS apps, from architecture to release pipeline.',
    pt: 'Tiago Danin constrói apps Android e iOS, da arquitetura ao pipeline de release.',
  },
  flutter: {
    en: 'Tiago Danin is a Flutter developer, and writes the platform channels the apps depend on.',
    pt: 'Tiago Danin é desenvolvedor Flutter, e escreve os platform channels de que os apps dependem.',
  },
  programming: {
    en: 'Tiago Danin moves across the stack, from Kotlin and Swift to Elixir, Phoenix and Next.js.',
    pt: 'Tiago Danin transita pela stack inteira, de Kotlin e Swift a Elixir, Phoenix e Next.js.',
  },
  security: {
    en: 'Tiago Danin is an independent security researcher.',
    pt: 'Tiago Danin é pesquisador independente de segurança.',
  },
  ai: {
    en: 'Tiago Danin builds products on top of language models and the Model Context Protocol.',
    pt: 'Tiago Danin constrói produtos sobre modelos de linguagem e o Model Context Protocol.',
  },
  career: {
    en: 'Tiago Danin has been shipping software professionally for over 10 years.',
    pt: 'Tiago Danin entrega software profissionalmente há mais de 10 anos.',
  },
};

const TAIL: Record<BioLang, { short: string; medium: string; long: string }> = {
  en: {
    short:
      ' He works with Flutter and React Native, and develops the native modules in Kotlin and Swift they depend on.',
    medium:
      ' He has been speaking since 2019 and organizing developer events in Belém, such as Devs Norte, GDG Belém and DevOpsDays Belém.',
    long:
      ' Since 2018 he has reported cross-site scripting, CSRF and open redirect findings through HackerOne, and he maintains open source packages on npm. He studied Systems Analysis and Development at IFPA.',
  },
  pt: {
    short:
      ' Trabalha com Flutter e React Native, e desenvolve os módulos nativos em Kotlin e Swift de que eles dependem.',
    medium:
      ' Palestra desde 2019 e organiza eventos de desenvolvimento em Belém, como Devs Norte, GDG Belém e DevOpsDays Belém.',
    long:
      ' Desde 2018 reporta falhas de cross-site scripting, CSRF e open redirect pelo HackerOne, e mantém pacotes open source no npm. Estudou Análise e Desenvolvimento de Sistemas no IFPA.',
  },
};

/**
 * Builds a table covering every language and every focus, the way `buildBios`
 * does on the press kit page. The chips come from the `BIO_LANGUAGES` and
 * `BIO_FOCUSES` constants, not from the table keys, so a partial table would
 * render a chip that crashes the component when clicked.
 */
function makeBios(): BioTable {
  const table = {} as BioTable;

  for (const language of BIO_LANGUAGES) {
    const lang = language.key;
    const tail = TAIL[lang];
    table[lang] = {} as BioTable[BioLang];

    for (const focus of BIO_FOCUSES) {
      const lead = LEAD[focus.key][lang];
      const short = lead + tail.short;
      const medium = short + tail.medium;

      table[lang][focus.key] = {
        short,
        medium,
        long: medium + tail.long,
      };
    }
  }

  return table;
}

const bios = makeBios();

/**
 * The bio picker on `/press-kit/`, its only consumer. An event organizer picks
 * a language and an angle, then copies the length that fits their page.
 */
const meta = {
  title: 'Sections/BioBrowser',
  component: BioBrowser,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Two rows of chips over three bio cards. Language and focus are local',
          'state; changing either swaps all three cards at once, so short,',
          'medium and long always describe the same person from the same angle.',
          '',
          'The chips are plain buttons with `aria-pressed`, grouped in a',
          '`fieldset` whose `legend` names the axis. That is what tells a screen',
          'reader which set a chip belongs to, since "Flutter" on its own says',
          'nothing about being a focus rather than a language.',
          '',
          'The UI strings follow the selected bio language, not the site locale:',
          'pick Português and the legends, the card titles and the copy buttons',
          'all switch with it. Those strings live in `BIO_UI` in',
          '`src/lib/bios.ts`.',
          '',
          '**The `bios` table must cover every focus in `BIO_FOCUSES`.** The',
          'chips are rendered from the constant, so a table missing an entry',
          'still shows the chip and then throws on `selected[length.key]` when it',
          'is clicked. On the site `buildBios` fills the table from the `bios`',
          'collection, which means an incomplete collection is a runtime error',
          'rather than a missing option.',
          '',
          'Numbers inside the text are already interpolated by the time they get',
          'here: the collection stores `{years}` and `{firstTalkYear}`, and',
          '`buildBios` fills them from the work and talk collections.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    bios: {
      description:
        'language to focus to length lookup, built by `buildBios`. Must be complete for both languages and all seven focuses.',
    },
  },
  args: { bios },
  decorators: [
    (Story) => (
      <div className="container mx-auto px-4 py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BioBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opens on English and the general angle, the defaults in the component. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Language')).toBeVisible();
    await expect(canvas.getByText('Focus')).toBeVisible();

    await expect(canvas.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(canvas.getByRole('button', { name: 'General' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );

    // Three lengths, and the short bio is a prefix of the other two, so its
    // lead sentence shows up in all three cards.
    await expect(canvas.getByText('Short')).toBeVisible();
    await expect(canvas.getByText('Medium')).toBeVisible();
    await expect(canvas.getByText('Long')).toBeVisible();
    await expect(canvas.getAllByText(/Tiago Danin is a mobile developer\./)).toHaveLength(3);
  },
};

/**
 * Switching language swaps the bios and the interface around them. The focus
 * selection survives, so an organizer who already picked "Security" does not
 * lose it when they switch to Portuguese.
 */
export const SwitchesLanguage: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Português' }));

    // The bios switched.
    await expect(
      canvas.getAllByText(/Tiago Danin é um desenvolvedor mobile\./)
    ).toHaveLength(3);
    await expect(
      canvas.queryByText(/Tiago Danin is a mobile developer\./)
    ).not.toBeInTheDocument();

    // And so did the interface: legends, card titles, focus chips and the copy
    // buttons all follow the bio language.
    await expect(canvas.getByText('Idioma')).toBeVisible();
    await expect(canvas.getByText('Foco')).toBeVisible();
    await expect(canvas.getByText('Curta')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Segurança' })).toBeVisible();
    await expect(canvas.getAllByRole('button', { name: /^Copiar bio: / })).toHaveLength(3);

    await expect(canvas.getByRole('button', { name: 'Português' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(canvas.getByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  },
};

/**
 * Switching focus replaces all three cards at once, so the reader never sees a
 * short bio about security next to a long one about Flutter.
 */
export const SwitchesFocus: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Security' }));

    await expect(
      canvas.getAllByText(/Tiago Danin is an independent security researcher\./)
    ).toHaveLength(3);
    await expect(
      canvas.queryByText(/Tiago Danin is a mobile developer\./)
    ).not.toBeInTheDocument();

    await expect(canvas.getByRole('button', { name: 'Security' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(canvas.getByRole('button', { name: 'General' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  },
};

/**
 * Focus first, then language: the two selections are independent, and the
 * combination is what decides the text. This is the path an organizer running a
 * Portuguese-language security track would take.
 */
export const FocusThenLanguage: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Security' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Português' }));

    // The focus chip is now labelled in Portuguese and still selected.
    await expect(canvas.getByRole('button', { name: 'Segurança' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(
      canvas.getAllByText(/Tiago Danin é pesquisador independente de segurança\./)
    ).toHaveLength(3);
  },
};

/**
 * The chip rows wrap at narrow widths, and each card stacks its copy button
 * beside the heading rather than under it. Seven focus chips is the worst case
 * for this layout.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
