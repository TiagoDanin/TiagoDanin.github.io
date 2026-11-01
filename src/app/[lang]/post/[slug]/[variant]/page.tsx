import { queryCollection } from 'nextjs-studio/server';

import type { PostVariant } from '@/components/ui/AdaptivePost';
import { contentLang } from '@/lib/i18n/locales';
import { resolveLocale } from '@/lib/i18n/server';

// One page per version of an adaptive post; the parent page reads `variant`.
export { default, generateMetadata } from '../page';

export const dynamicParams = false;

// `[slug]` has no layout, so its params never reach this function: it is called
// once per language with only `lang`, and has to emit `slug` itself. With
// `output: export` an empty list fails the build, so every language needs at
// least one adaptive post while this route exists.
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return queryCollection('posts')
    .where({ lang: contentLang(resolveLocale(params.lang)) })
    .flatMap((post: { slug: string; variants?: PostVariant[] }) =>
      (post.variants ?? []).map((variant) => ({ slug: post.slug, variant: variant.id }))
    );
}
