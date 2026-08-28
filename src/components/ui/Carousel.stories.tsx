import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';
import { Card, CardContent } from './card';

/**
 * Embla carousel wrapped in a context so the arrows can live anywhere inside
 * the root. One module on the site imports it.
 */
const meta = {
  title: 'UI/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Used in one place on the site. Everything else here is documentation',
          'for the next time a set of screenshots needs to be scrolled.',
          '',
          'The arrows are positioned outside the track, at `-left-12` and',
          '`-right-12`, so the parent has to reserve horizontal room for them or',
          'they are clipped. Every story below wraps the carousel in a container',
          'with that padding.',
          '',
          'Slide width comes from the item, not the root. `CarouselItem`',
          'defaults to `basis-full`, so a multi-slide view means overriding it',
          'with something like `md:basis-1/2`.',
          '',
          'Accessibility is handled by the primitive: the root is a',
          '`role="region"` with `aria-roledescription="carousel"`, each item is a',
          'labelled slide group, and left and right arrow keys scroll the track',
          'while focus is inside it.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Scroll axis. Vertical moves the arrows above and below the track and rotates them.',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    opts: {
      control: false,
      description:
        'Embla options, passed straight through. `{ loop: true }` and `{ align: "start" }` are the useful ones here.',
    },
    setApi: {
      control: false,
      description:
        'Receives the Embla instance so a parent can drive the track or render its own dot indicators.',
    },
    plugins: {
      control: false,
      description: 'Embla plugins, such as autoplay. None are installed in this project.',
    },
  },
  args: {
    orientation: 'horizontal',
  },
  decorators: [
    (Story) => (
      // The arrows sit outside the track, so the frame needs room for them.
      <div className="w-104 max-w-[80vw] px-14 py-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const screenshots = [
  {
    title: 'Cam Covers',
    caption: 'Flutter image editor, cover picker screen',
  },
  {
    title: 'Widgetbook catalog',
    caption: 'Design system components with live knobs',
  },
  {
    title: 'Wear OS companion',
    caption: 'Jetpack Compose watch face settings',
  },
  {
    title: 'GitLab pipeline',
    caption: 'React Native build and sign stages',
  },
];

const slides = screenshots.map((shot) => (
  <CarouselItem key={shot.title}>
    <Card>
      <CardContent className="flex aspect-video flex-col items-center justify-center gap-1 p-6 text-center">
        <span className="text-lg font-semibold">{shot.title}</span>
        <span className="text-sm text-muted-foreground">{shot.caption}</span>
      </CardContent>
    </Card>
  </CarouselItem>
));

/**
 * One screenshot at a time, with both arrows. The play function advances the
 * track and checks the previous arrow woke up, which is the observable proof
 * that Embla moved rather than just repainted.
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <CarouselContent>{slides}</CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole('button', { name: 'Next slide' });
    const previous = canvas.getByRole('button', { name: 'Previous slide' });

    // Embla measures the track on mount, so the arrows settle a tick late.
    await waitFor(() => expect(next).toBeEnabled());
    await expect(previous).toBeDisabled();

    await userEvent.click(next);

    await waitFor(() => expect(previous).toBeEnabled());
  },
};

/**
 * Two slides visible at once, set on the item with `basis-1/2`. This is the
 * shape a project gallery would use on a wide screen.
 */
export const TwoPerView: Story = {
  args: {
    opts: { align: 'start' },
    children: (
      <>
        <CarouselContent>
          {screenshots.map((shot) => (
            <CarouselItem key={shot.title} className="basis-1/2">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-4 text-center text-sm font-medium">
                  {shot.title}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
};

/**
 * Looping. With `loop` on, the previous arrow is enabled from the first slide,
 * because there is always something behind you. That removes the only visual
 * cue the reader had for where the track starts and ends.
 */
export const Looping: Story = {
  args: {
    opts: { loop: true },
    children: (
      <>
        <CarouselContent>{slides}</CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previous = canvas.getByRole('button', { name: 'Previous slide' });

    await waitFor(() => expect(previous).toBeEnabled());
  },
};

/**
 * A single slide. Both arrows stay disabled, so the control row reads as inert
 * rather than broken. Worth considering whether to render the arrows at all
 * when the collection has one item.
 */
export const SingleSlide: Story = {
  args: {
    children: (
      <>
        <CarouselContent>
          <CarouselItem>
            <Card>
              <CardContent className="flex aspect-video items-center justify-center p-6 text-sm font-medium">
                Cam Covers
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Next slide' })).toBeDisabled()
    );
    await expect(
      canvas.getByRole('button', { name: 'Previous slide' })
    ).toBeDisabled();
  },
};

/**
 * Vertical axis. The track needs a fixed height, since a column of slides has
 * no intrinsic one, and the arrows rotate to sit above and below it.
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    opts: { align: 'start' },
    children: (
      <>
        <CarouselContent className="h-64">
          {screenshots.map((shot) => (
            <CarouselItem key={shot.title} className="basis-1/2">
              <Card>
                <CardContent className="flex h-full items-center justify-center p-4 text-sm font-medium">
                  {shot.title}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-88 max-w-[80vw] py-14">
        <Story />
      </div>
    ),
  ],
};
