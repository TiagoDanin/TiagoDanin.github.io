import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent } from 'storybook/test';

import FeedbackForm from './FeedbackForm';

const TALK = 'Model Context Protocol (MCP) na prática';
const EMAIL = 'ana.souza@exemplo.com.br';

/**
 * The talk feedback flow at `/links/talk/`, the QR code destination shown on the
 * last slide of a talk. The page is `noindex`, and the form is the whole page.
 */
const meta = {
  title: 'Sections/FeedbackForm',
  component: FeedbackForm,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        query: { talk: TALK },
      },
    },
    docs: {
      description: {
        component: [
          'Three steps in Portuguese: email, then four star ratings plus three',
          'optional comment fields, then a thank-you screen.',
          '',
          '**It takes no props.** Both of its inputs come from the query string,',
          'read with `useSearchParams`: `talk` is the title shown at the top and',
          'sent with the submission, and `bonus` is a URL unlocked on the last',
          'step. A link with `?talk=...&bonus=...` is how the same page serves',
          'every talk. In these stories those values come from',
          '`parameters.nextjs.navigation.query`.',
          '',
          'Both validations are client-side and both refuse to advance rather',
          'than warning and continuing. Step one rejects anything that fails a',
          'basic email shape. Step two requires all four ratings, marks the',
          'missing rows in the destructive tone, writes "Selecione de 1 a 5',
          'estrelas." under each, scrolls the first one into view and shakes it.',
          'The shake is suppressed under `prefers-reduced-motion`; the border,',
          'the message and the scroll are not, so the error survives without it.',
          '',
          '**The play functions stop before submission, on purpose.** A real',
          'submit POSTs to `NEXT_PUBLIC_FEEDBACK_API_URL`, and a story must not',
          'send anything to it. Everything up to the submit button is covered;',
          'step three is not reachable here.',
          '',
          'Two things depend on build-time environment variables, so what you',
          'see in Storybook depends on the shell that started it. Without',
          '`NEXT_PUBLIC_TURNSTILE_SITE_KEY` the Cloudflare Turnstile widget is',
          'replaced by a yellow "captcha não configurado" notice, which is a',
          'developer warning that should never appear in production. Without',
          '`NEXT_PUBLIC_FEEDBACK_API_URL` a valid submission fails with',
          '"Endpoint de feedback não configurado.".',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-background p-8 shadow-xs">
          <h1 className="mb-6 text-2xl font-bold tracking-tight">Feedback da talk</h1>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof FeedbackForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Step one, as the audience finds it after scanning the QR code. The talk title
 * comes from the query string, and the box above the field explains why the
 * email is being asked for.
 */
export const EmailStep: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Passo 1 de 3')).toBeVisible();
    await expect(canvas.getByRole('heading', { name: TALK })).toBeVisible();
    await expect(canvas.getByText('Seu feedback importa')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Continuar' })).toBeVisible();
  },
};

/**
 * With `bonus` in the query string the framing changes: the reader is told up
 * front that finishing the form unlocks material, and the submit button on step
 * two says so too.
 */
export const WithBonus: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          talk: TALK,
          bonus: 'https://github.com/TiagoDanin/mcp-na-pratica',
        },
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Bônus no final')).toBeVisible();
    await expect(
      canvas.getByText(
        'Avalie a talk e ganhe acesso ao material complementar no final.'
      )
    ).toBeVisible();
  },
};

/**
 * An empty or malformed email does not advance. The form carries `noValidate`,
 * so this message is the component's own, not the browser bubble, which means
 * it is readable, translated and stays on screen.
 */
export const RejectsInvalidEmail: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText('Seu email'), 'ana.souza@');
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));

    await expect(
      canvas.getByText('Informe um email válido para continuar.')
    ).toBeVisible();
    await expect(canvas.getByLabelText('Seu email')).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // Still on step one.
    await expect(canvas.getByText('Passo 1 de 3')).toBeVisible();
  },
};

/**
 * Typing again clears the error before the next submit, so the message tracks
 * the current value rather than the last attempt.
 */
export const ErrorClearsWhileTyping: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Seu email');

    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    await expect(
      canvas.getByText('Informe um email válido para continuar.')
    ).toBeVisible();

    await userEvent.type(field, 'a');
    await expect(
      canvas.queryByText('Informe um email válido para continuar.')
    ).not.toBeInTheDocument();
    await expect(field).toHaveAttribute('aria-invalid', 'false');
  },
};

/** A valid email moves the flow to the ratings step. */
export const AdvancesToRatings: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText('Seu email'), EMAIL);
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));

    await expect(await canvas.findByText('Passo 2 de 3')).toBeVisible();

    // Four criteria, five stars each.
    await expect(canvas.getByText('Slides')).toBeVisible();
    await expect(canvas.getByText('Apresentação / Fala')).toBeVisible();
    await expect(canvas.getByText('Conteúdo')).toBeVisible();
    await expect(canvas.getByText('Aplicabilidade')).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Slides: 5 estrelas' })
    ).toBeVisible();

    // The three comment fields are explicitly optional.
    await expect(canvas.getByLabelText(/O que mais gostou\?/)).toBeVisible();
    await expect(canvas.getByLabelText(/O que pode melhorar\?/)).toBeVisible();
    await expect(canvas.getByLabelText(/Sugestão de talks futuras/)).toBeVisible();
  },
};

/**
 * Submitting with ratings missing marks every unanswered row and stays on step
 * two. Only Slides is answered here, so three messages appear. Nothing is sent:
 * the guard runs before the captcha check and before `fetch`.
 */
export const RequiresAllRatings: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText('Seu email'), EMAIL);
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    await canvas.findByText('Passo 2 de 3');

    await userEvent.click(canvas.getByRole('button', { name: 'Slides: 5 estrelas' }));
    await userEvent.click(canvas.getByRole('button', { name: /^Enviar/ }));

    await expect(canvas.getAllByText('Selecione de 1 a 5 estrelas.')).toHaveLength(3);
    await expect(canvas.getByText('Passo 2 de 3')).toBeVisible();

    // The answered row is not marked, and the error tone reaches the labels of
    // the ones that are, so the state is not carried by the star colour alone.
    await expect(canvas.getByText('Slides')).not.toHaveClass('text-destructive');
    await expect(canvas.getByText('Conteúdo')).toHaveClass('text-destructive');
  },
};

/**
 * All four criteria answered, which is everything the form asks for. The story
 * stops at the enabled submit button rather than pressing it, since pressing it
 * would POST to the live feedback endpoint.
 */
export const AllRatingsAnswered: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText('Seu email'), EMAIL);
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    await canvas.findByText('Passo 2 de 3');

    await userEvent.click(canvas.getByRole('button', { name: 'Slides: 5 estrelas' }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Apresentação / Fala: 4 estrelas' })
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Conteúdo: 5 estrelas' }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Aplicabilidade: 4 estrelas' })
    );

    await expect(
      canvas.getByRole('button', { name: 'Conteúdo: 5 estrelas' })
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      canvas.getByRole('button', { name: 'Aplicabilidade: 5 estrelas' })
    ).toHaveAttribute('aria-pressed', 'false');

    await expect(canvas.queryByText('Selecione de 1 a 5 estrelas.')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /^Enviar/ })).toBeEnabled();
  },
};

/**
 * Optional comments carry the useful part of the feedback. Each accepts 2000
 * characters and none of them blocks the submit.
 */
export const WithWrittenFeedback: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText('Seu email'), EMAIL);
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    await canvas.findByText('Passo 2 de 3');

    const liked = canvas.getByLabelText(/O que mais gostou\?/);
    await userEvent.type(liked, 'A demo ao vivo do servidor MCP fechando o loop.');
    await expect(liked).toHaveValue('A demo ao vivo do servidor MCP fechando o loop.');
    await expect(liked).toHaveAttribute('maxlength', '2000');
  },
};

/**
 * The form is designed for a phone, since it is reached by scanning a QR code
 * from the audience. Both step buttons are full width at 48px, and the rating
 * rows keep their stars on one line.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
