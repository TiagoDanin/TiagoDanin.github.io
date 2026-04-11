import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, basename } from 'path';

let slugToDirMap: Map<string, string> | null = null;

function buildSlugToDirMap(): Map<string, string> {
  if (slugToDirMap) return slugToDirMap;

  slugToDirMap = new Map();
  const postsDir = join(process.cwd(), 'contents', 'posts');

  if (!existsSync(postsDir)) return slugToDirMap;

  const files = readdirSync(postsDir).filter(
    (f) => f.endsWith('.mdx') && !f.endsWith('.pt.mdx')
  );

  for (const file of files) {
    const content = readFileSync(join(postsDir, file), 'utf-8');
    const slugMatch = content.match(/^slug:\s*"?([^"\n]+)"?/m);
    if (slugMatch) {
      const slug = slugMatch[1].trim();
      const dirName = basename(file, '.mdx');
      slugToDirMap.set(slug, dirName);
    }
  }

  return slugToDirMap;
}

const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
const JPG_HEADER = Buffer.from([0xff, 0xd8, 0xff]);

function isValidImage(filePath: string): boolean {
  const stat = statSync(filePath);
  if (stat.size < 1024) return false;

  const header = readFileSync(filePath).subarray(0, 4);
  return header.subarray(0, 4).equals(PNG_HEADER) || header.subarray(0, 3).equals(JPG_HEADER);
}

function findCoverInDir(dirName: string): string | null {
  const basePath = join(process.cwd(), 'public', 'images', 'posts', dirName);

  const pngPath = join(basePath, 'cover.png');
  if (existsSync(pngPath) && isValidImage(pngPath)) {
    return `/images/posts/${dirName}/cover.png`;
  }
  const jpgPath = join(basePath, 'cover.jpg');
  if (existsSync(jpgPath) && isValidImage(jpgPath)) {
    return `/images/posts/${dirName}/cover.jpg`;
  }
  return null;
}

export function getCoverImagePath(slug: string): string | null {
  // Try direct slug match first
  const direct = findCoverInDir(slug);
  if (direct) return direct;

  // Map slug to MDX filename directory
  const map = buildSlugToDirMap();
  const dirName = map.get(slug);
  if (dirName) {
    return findCoverInDir(dirName);
  }

  return null;
}
