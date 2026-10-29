import { contentLang } from '@/lib/i18n/locales';
import { resolveLocale } from '@/lib/i18n/server';
import { getPostBySlug } from '@/lib/mdx';

// One page per version of an adaptive post; the parent page reads `variant`.
export { default, generateMetadata } from '../page';

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string; slug: string } }) {
  const post = getPostBySlug(params.slug, contentLang(resolveLocale(params.lang)));
  return (post?.variants ?? []).map((variant) => ({ variant: variant.id }));
}
