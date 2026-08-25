import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useForm } from 'react-hook-form';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { z } from 'zod';

import { Button } from './button';
import { Checkbox } from './checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';
import { Textarea } from './textarea';

/**
 * Ships with the shadcn/ui install; no page currently renders it. The site is a
 * static export with no API routes, so there is nothing yet for a form to post
 * to.
 *
 * `satisfies Meta<typeof Form>` is deliberately not used here. `Form` is
 * react-hook-form's `FormProvider`, so its props are an entire `useForm()`
 * result, and inferring the meta would make every one of them a required story
 * arg. The stories build the form inside `render` instead, so the annotation
 * keeps args optional.
 */
const meta: Meta<typeof Form> = {
  title: 'UI/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'The shadcn wrapper around react-hook-form. Ships with the',
          'shadcn/ui install; no page currently renders it.',
          '',
          '`Form` is react-hook-form `FormProvider` under a different name, so',
          'it needs a real `useForm()` result passed through: there is no',
          'useful story for it without one.',
          '',
          'What the wrapper buys is the wiring nobody remembers to do by hand.',
          '`FormItem` mints an id, `FormLabel` points `htmlFor` at the control',
          'and turns red when the field is invalid, and `FormControl` clones',
          'its child with that id plus `aria-invalid` and an `aria-describedby`',
          'listing the description and, once there is one, the error. So the',
          'error is announced as part of the field rather than as loose text',
          'somewhere near it.',
          '',
          '`FormControl` renders through Radix `Slot`, which means it must have',
          'exactly one element child and that child has to forward its props',
          'and ref. Wrapping the input in a `<div>` moves the id onto the div',
          'and quietly breaks the label.',
          '',
          '`FormMessage` renders nothing when the field is valid and has no',
          'children, so it takes no space until it has something to say.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const feedbackSchema = z.object({
  name: z.string().min(2, 'Tell me who you are, at least two characters.'),
  email: z.string().email('That does not look like an email address.'),
  feedback: z
    .string()
    .min(10, 'A sentence or two helps more than a rating. At least 10 characters.'),
  followUp: z.boolean(),
});

type FeedbackValues = z.infer<typeof feedbackSchema>;

// Declared once at module scope so the render function and the play function
// are looking at the same mock.
const onValidSpy = fn<(values: FeedbackValues) => void>();
const onSubscribeSpy = fn<(values: { email: string }) => void>();

const EMPTY_FEEDBACK: FeedbackValues = {
  name: '',
  email: '',
  feedback: '',
  followUp: false,
};

function TalkFeedbackForm({ onValid }: { onValid: (values: FeedbackValues) => void }) {
  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: EMPTY_FEEDBACK,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="flex w-96 flex-col gap-6" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your name</FormLabel>
              <FormControl>
                <Input placeholder="Ana Ribeiro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ana@exemplo.com.br" {...field} />
              </FormControl>
              <FormDescription>Only used to reply to this feedback.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What did you think of the talk?</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="The live demo landed, the slides were dense." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="followUp"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal">Send me the slides and the repository</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit">Send feedback</Button>
      </form>
    </Form>
  );
}

/**
 * The full round trip: submit empty to surface the validation messages, then
 * fill the fields and submit again. Nothing is submitted until every field
 * passes, and `onValid` receives the parsed values, not raw form data.
 */
export const TalkFeedback: Story = {
  render: () => <TalkFeedbackForm onValid={onValidSpy} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole('button', { name: 'Send feedback' });

    await userEvent.click(submit);

    await expect(
      await canvas.findByText('Tell me who you are, at least two characters.'),
    ).toBeInTheDocument();
    await expect(canvas.getByText('That does not look like an email address.')).toBeInTheDocument();

    // The message is wired into the field, not just printed underneath it.
    const name = canvas.getByRole('textbox', { name: 'Your name' });
    await expect(name).toBeInvalid();
    await expect(name).toHaveAccessibleDescription(/at least two characters/);

    await userEvent.type(name, 'Ana Ribeiro');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), 'ana@exemplo.com.br');
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'What did you think of the talk?' }),
      'The Flutter demo landed well. More on the profiler next time.',
    );
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Send me the slides and the repository' }),
    );

    await userEvent.click(submit);

    await waitFor(async () => {
      await expect(
        canvas.queryByText('Tell me who you are, at least two characters.'),
      ).not.toBeInTheDocument();
    });
    await expect(name).toBeValid();
  },
};

/**
 * The same form, with the submit handler asserted. This is the shape a real
 * page would use: the resolver parses, and the handler only ever sees values
 * that already match the schema.
 */
export const SubmitsParsedValues: Story = {
  render: () => <TalkFeedbackForm onValid={onValidSpy} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onValidSpy.mockClear();

    await userEvent.type(canvas.getByRole('textbox', { name: 'Your name' }), 'Ana Ribeiro');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), 'ana@exemplo.com.br');
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'What did you think of the talk?' }),
      'Clearest explanation of platform channels I have seen.',
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Send feedback' }));

    await waitFor(async () => {
      await expect(onValidSpy).toHaveBeenCalledWith(
        {
          name: 'Ana Ribeiro',
          email: 'ana@exemplo.com.br',
          feedback: 'Clearest explanation of platform channels I have seen.',
          followUp: false,
        },
        expect.anything(),
      );
    });
  },
};

/**
 * Keyboard operation end to end: Tab walks the fields in order and Enter inside
 * a text input submits the form, which is how most people finish a short form.
 */
export const KeyboardSubmission: Story = {
  render: () => <TalkFeedbackForm onValid={onValidSpy} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Your name' })).toHaveFocus();

    await userEvent.keyboard('Ana Ribeiro');

    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toHaveFocus();

    // Enter in a text input submits, so the still empty fields fail validation.
    await userEvent.keyboard('{Enter}');

    await expect(
      await canvas.findByText('That does not look like an email address.'),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toBeInvalid();
  },
};

/**
 * The error state on its own. `FormLabel` turns `text-destructive`, the control
 * gets `aria-invalid`, and `aria-describedby` grows to cover both the
 * description and the message, in that order.
 */
export const InvalidField: Story = {
  render: () => <TalkFeedbackForm onValid={onValidSpy} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), 'ana@');
    await userEvent.click(canvas.getByRole('button', { name: 'Send feedback' }));

    const email = await canvas.findByRole('textbox', { name: 'Email' });

    await expect(email).toBeInvalid();
    await expect(email).toHaveAccessibleDescription(
      'Only used to reply to this feedback. That does not look like an email address.',
    );
  },
};

/**
 * A single field, which is the smallest useful arrangement. `FormMessage`
 * renders nothing while the field is valid, so no space is reserved for an
 * error that has not happened.
 */
export const SingleField: Story = {
  render: () => {
    const SingleFieldForm = () => {
      const form = useForm<{ email: string }>({
        resolver: zodResolver(z.object({ email: z.string().email('Enter a valid email address.') })),
        defaultValues: { email: '' },
      });

      return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubscribeSpy)}
            className="flex w-80 items-end gap-2"
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Newsletter</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ana@exemplo.com.br" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </Form>
      );
    };

    return <SingleFieldForm />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByRole('textbox', { name: 'Newsletter' });

    await expect(canvas.queryByText('Enter a valid email address.')).not.toBeInTheDocument();
    await expect(email).toHaveAccessibleDescription('');

    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }));

    await expect(await canvas.findByText('Enter a valid email address.')).toBeInTheDocument();
    await expect(email).toBeInvalid();
  },
};
