import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { titleToSlug } from '@/utils/parse';

interface TagFilterProps {
  posts: Array<{ tags: string[] }>;
  basePath?: string;
}

export function TagFilter({ posts, basePath = '/tags' }: TagFilterProps) {
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-1.5 mt-4">
      {allTags.map((tag) => (
        <Link key={tag} href={`${basePath}/${titleToSlug(tag)}`}>
          <Badge
            variant="outline"
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
