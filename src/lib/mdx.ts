import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'contents', 'posts');

export interface PostContent {
  title: string;
  date: string;
  description: string;
  slug: string;
  originalUrl: string;
  lang: string;
  body: string;
}

export function getPostBySlug(slug: string, lang: string = 'en'): PostContent | null {
  const suffix = lang === 'en' ? '' : `.${lang}`;
  const filename = `${slug}${suffix}.mdx`;
  const filepath = path.join(POSTS_DIR, filename);

  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    title: data.title || '',
    date: data.date || '',
    description: data.description || '',
    slug: data.slug || slug,
    originalUrl: data.originalUrl || '',
    lang: data.lang || lang,
    body: content.trim(),
  };
}

export function postHasLocale(slug: string, lang: string): boolean {
  const suffix = lang === 'en' ? '' : `.${lang}`;
  const filename = `${slug}${suffix}.mdx`;
  return fs.existsSync(path.join(POSTS_DIR, filename));
}
