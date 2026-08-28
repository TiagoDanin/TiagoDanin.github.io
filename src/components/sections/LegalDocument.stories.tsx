import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';

import { LegalDocument } from './LegalDocument';

/**
 * The shell around one of the two documents on `/legal`.
 *
 * On the site the children come from `renderMdx`, which only runs on the
 * server. The stories pass the equivalent markup directly, so the shell can be
 * inspected without a filesystem behind it.
 */
const meta = {
  title: 'Sections/LegalDocument',
  component: LegalDocument,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof LegalDocument>;

export default meta;
type Story = StoryObj<typeof meta>;

const privacyBody = (
  <>
    <p>
      This site is a pile of static files. Nothing to sign up for, nothing to log into, no database
      of visitors.
    </p>
    <h3>What gets collected</h3>
    <h4>Audience measurement</h4>
    <p>
      Google Analytics counts page views so I know which articles are worth writing more of. Any
      content blocker stops it.
    </p>
    <h4>Hosting</h4>
    <p>
      The site runs on GitHub Pages. Those logs belong to GitHub and I never see them.
    </p>
  </>
);

/** The privacy document, the first of the two and the one without a border above it. */
export const Privacy: Story = {
  args: {
    id: 'privacy',
    title: 'Privacy',
    updatedLabel: 'Last updated',
    updatedAt: '28 August 2026',
    updatedIso: '2026-08-28',
    children: privacyBody,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 2, name: 'Privacy' })).toBeInTheDocument();
    // The anchor the hero's jump links point at.
    await expect(canvasElement.querySelector('#privacy')).toBeInTheDocument();
  },
};

/** The terms document, in Portuguese, with the date formatted for pt-BR. */
export const TermsInPortuguese: Story = {
  args: {
    id: 'terms',
    title: 'Termos de uso',
    updatedLabel: 'Atualizado em',
    updatedAt: '28 de agosto de 2026',
    updatedIso: '2026-08-28',
    children: (
      <>
        <p>
          Leia o que quiser aqui. Cite com crédito. Reaproveite o código sob a licença dele. O resto
          é detalhe.
        </p>
        <h3>O código</h3>
        <p>O código-fonte deste site é público no GitHub, sob licença MIT.</p>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The machine-readable date stays ISO whatever language the label is in.
    await expect(canvas.getByText('28 de agosto de 2026')).toHaveAttribute(
      'datetime',
      '2026-08-28'
    );
  },
};
