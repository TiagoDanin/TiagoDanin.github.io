import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getRandomColorWithDarkMode, titleToSlug } from '@/utils/parse';

interface TagFilterProps {
  posts: Array<{ tags: string[] }>;
  basePath?: string;
}

export function TagFilter({ posts, basePath = '/blog/tags' }: TagFilterProps) {
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  if (allTags.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex flex-wrap justify-center gap-2">
        {allTags.map((tag) => (
          <Link key={tag} href={`${basePath}/${titleToSlug(tag)}`}>
            <Badge
              variant="outline"
              className={`text-xs ${getRandomColorWithDarkMode(tag)}`}
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
