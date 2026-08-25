import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect } from 'storybook/test';

import { ArticleCard } from './ArticleCard';

const COVER =
  '/images/posts/flutter-widgetbook-como-documentar-seu-design-system-do-jeito-certo/cover.png';

/**
 * The blog listing card. Five routes render it: `/blog`, `/blog/[page]`,
 * `/blog/pt`, `/blog/tags/[tag]` and `/tags/[tag]`.
 */
const meta = {
  title: 'UI/ArticleCard',
  component: ArticleCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'One post in the blog listing: cover, date, kind, title, description,',
          'tags and a read affordance.',
          '',
          'Two behaviours are driven by data rather than by props. The kind badge',
          'reads `originalUrl`: an address containing `youtube.com` is labelled',
          'Video, everything else is labelled Article. And `locale` decides both',
          'the destination (`/post/[slug]` or `/post/[slug]/pt`) and the four',
          'strings the card owns, since the site duplicates route segments per',
          'language instead of running i18n middleware.',
          '',
          'The card uses the overlay-link pattern: a single absolutely positioned',
          '`Link` covers the whole card and carries the accessible name, while the',
          'visible content is `pointer-events-none`. Screen readers get one link',
          'per card instead of one for the cover plus one for the title. The tag',
          'chips sit above it with `pointer-events-auto`, so they stay separately',
          'clickable and route to `/tags/[tag]`.',
          '',
          'Every post has a destination, so the permanent `cursor-pointer` here',
          'satisfies the "affordance honesta" rule in `DESIGN.md`. Compare with',
          '`ProjectCard`, where the destination is optional and the affordance is',
          'conditional.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    post: {
      control: 'object',
      description:
        'Post record from the `posts` collection. `cover`, `description` and `tags` may be empty; `slug`, `title` and `date` may not.',
    },
    locale: {
      control: 'inline-radio',
      options: ['en', 'pt'],
      description:
        'Language surface. Picks the `/pt` destination and swaps the card copy. It does not translate the post itself.',
      table: { defaultValue: { summary: 'en' } },
    },
  },
  args: {
    locale: 'en',
    post: {
      slug: 'flutter-widgetbook-como-documentar-seu-design-system-do-jeito-certo',
      title: 'Flutter Widgetbook: how to document your design system the right way',
      description:
        'Widgetbook gives a Flutter design system the same catalogue Storybook gives the web. Setting up knobs, addons and multi-device previews on a real production app.',
      date: '2024-11-12',
      originalUrl:
        'https://medium.com/@tiagodanin/flutter-widgetbook-como-documentar-seu-design-system',
      tags: ['Flutter', 'Design System', 'Documentation'],
      cover: COVER,
    },
  },
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The complete card: cover, Article badge, description and three tags. This is
 * what most of `/blog` looks like.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const card = canvas.getByRole('link', { name: /^Read Flutter Widgetbook/ });
    // trailingSlash is applied by the export, so match with or without it.
    await expect(card.getAttribute('href')).toMatch(
      /^\/post\/flutter-widgetbook-como-documentar-seu-design-system-do-jeito-certo\/?$/
    );

    await expect(canvas.getByText('Article')).toBeVisible();

    // Tags escape the overlay and route to the tag index, not to the post.
    const flutterTag = canvas.getByRole('link', { name: 'Flutter' });
    await expect(flutterTag.getAttribute('href')).toMatch(/^\/tags\/flutter\/?$/);
  },
};

/**
 * Posts published before covers were added have an empty `cover`. The image
 * block is dropped entirely rather than reserving blank space, so the card
 * collapses to text and the listing grid stays tight.
 */
export const WithoutCover: Story = {
  args: {
    post: {
      slug: 'arrow-function-vs-normal-function',
      title: 'Arrow function vs normal function',
      description:
        'What actually changes when you swap one for the other: `this` binding, hoisting, arguments, and when the shorter form costs you.',
      date: '2021-03-08',
      originalUrl: 'https://dev.to/tiagodanin/arrow-function-vs-normal-function',
      tags: ['JavaScript'],
      cover: '',
    },
  },
};

/**
 * A YouTube `originalUrl` flips the badge to Video. Nothing else about the card
 * changes, which is the point: recorded content sits in the same listing as
 * written content instead of in a separate feed.
 */
export const VideoPost: Story = {
  args: {
    post: {
      slug: 'criando-um-agente-de-ia-no-claude-code-para-controlar-meu-smartphone',
      title: 'Building an AI agent in Claude Code that drives my phone over ADB',
      description:
        'Wiring Claude Code to a physical Android device: an MCP server over ADB, screen capture as context, and the guardrails that keep it from tapping the wrong thing.',
      date: '2025-06-21',
      originalUrl: 'https://www.youtube.com/watch?v=aBcD1234xyz',
      tags: ['AI', 'Android', 'Automation'],
      cover: '',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Video')).toBeVisible();
    await expect(canvas.queryByText('Article')).not.toBeInTheDocument();
  },
};

/**
 * The Portuguese surface. The destination gains `/pt`, the badge becomes
 * "Artigo", the footer reads "Ler artigo" and the accessible name becomes
 * "Ler ...". Both languages are equal weight, so this is not a fallback state.
 */
export const Portuguese: Story = {
  args: {
    locale: 'pt',
    post: {
      slug: 'como-criar-pipelines-poderosos-para-react-native-no-gitlab',
      title: 'Como criar pipelines poderosos para React Native no GitLab',
      description:
        'Build de Android e iOS, cache de dependências, assinatura e publicação nas lojas em um único arquivo de CI que roda em runner compartilhado.',
      date: '2023-04-17',
      originalUrl:
        'https://medium.com/@tiagodanin/como-criar-pipelines-poderosos-para-react-native-no-gitlab',
      tags: ['React Native', 'DevOps', 'GitLab'],
      cover: '',
    },
  },
  play: async ({ canvas }) => {
    const card = canvas.getByRole('link', { name: /^Ler Como criar pipelines/ });
    await expect(card.getAttribute('href')).toMatch(
      /^\/post\/como-criar-pipelines-poderosos-para-react-native-no-gitlab\/pt\/?$/
    );

    await expect(canvas.getByText('Artigo')).toBeVisible();
    await expect(canvas.getByText('Ler artigo')).toBeVisible();
  },
};

/**
 * Portuguese post titles run long, and the title has no line clamp. It wraps to
 * as many lines as it needs and pushes the description down; the card grows
 * instead of truncating, so nothing is hidden from a reader scanning the list.
 */
export const LongTitle: Story = {
  args: {
    post: {
      slug: 'android-splash-screen-em-jetpack-compose-construindo-uma-introducao-impactante-para-seu-app',
      title:
        'Android Splash Screen em Jetpack Compose: construindo uma introdução impactante para o seu app sem quebrar o cold start',
      description:
        'The SplashScreen API replaced the old launch-theme trick. Setting it up in Compose, keeping the icon animation, and measuring what it costs on a cold start.',
      date: '2023-09-05',
      originalUrl:
        'https://medium.com/@tiagodanin/android-splash-screen-em-jetpack-compose',
      tags: ['Android', 'Jetpack Compose', 'Performance', 'Kotlin'],
      cover: '',
    },
  },
};

/**
 * Imported posts sometimes arrive with no tags at all. The tag row renders as
 * an empty flex container, which contributes no height, so the read affordance
 * moves up against the description without a gap to explain.
 */
export const WithoutTags: Story = {
  args: {
    post: {
      slug: 'clean-code-dicas-para-tornar-o-seu-codigo-mais-legivel',
      title: 'Clean code: dicas para tornar o seu código mais legível',
      description:
        'Naming, function size, and early returns. The parts of Clean Code that survived contact with a real React Native codebase.',
      date: '2020-08-30',
      originalUrl:
        'https://medium.com/@tiagodanin/clean-code-dicas-para-tornar-o-seu-codigo-mais-legivel',
      tags: [],
      cover: '',
    },
  },
  play: async ({ canvas }) => {
    // The post link is the only link left once the tag chips are gone.
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
  },
};

/**
 * Six tags wrap to a second row. Each chip gets a colour derived from a hash of
 * its own name, so a given tag looks the same on every card it appears on
 * without anyone maintaining a colour map.
 */
export const ManyTags: Story = {
  args: {
    post: {
      slug: 'construindo-listas-performaticas-no-reactnative',
      title: 'Building performant lists in React Native',
      description:
        'FlashList, windowing, key stability and the memoisation that actually moves the frame budget on a mid range Android device.',
      date: '2022-05-19',
      originalUrl:
        'https://medium.com/@tiagodanin/construindo-listas-performaticas-no-react-native',
      tags: [
        'React Native',
        'Performance',
        'JavaScript',
        'Android',
        'iOS',
        'Mobile',
      ],
      cover: '',
    },
  },
};

/**
 * Two cards side by side, which is how `/blog` stacks them. Useful for checking
 * that a card with a cover and one without still read as the same component.
 */
export const InListing: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Reference layout: the listing alternates covered and text-only posts.',
      },
    },
  },
  render: (args) => (
    <div className="flex max-w-2xl flex-col gap-16">
      <ArticleCard {...args} />
      <ArticleCard
        locale="en"
        post={{
          slug: 'finalmente-o-segredo-dos-testes-no-react-native-foi-revelado',
          title: 'The secret of testing in React Native, finally',
          description:
            'Testing Library over Enzyme, what to mock, and why snapshot tests kept passing while the screen was broken.',
          date: '2022-01-24',
          originalUrl:
            'https://medium.com/@tiagodanin/finalmente-o-segredo-dos-testes-no-react-native',
          tags: ['React Native', 'Testing'],
          cover: '',
        }}
      />
    </div>
  ),
};
