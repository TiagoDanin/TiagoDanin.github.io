import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface TagEntryListItem {
  /** Stable across sources: two collections can hold the same slug. */
  key: string;
  title: string;
  description?: string;
  /** Already locale-prefixed by the page. */
  href: string;
  /** Right-hand label: the event for a talk, the platform for a project. */
  badge?: string;
  date?: string;
}

export interface TagEntryListProps {
  items: TagEntryListItem[];
  /** Accessible name for the list, since the heading sits outside it. */
  label: string;
  /** Composed by the caller so the title stays inside one translated string. */
  linkLabel: (title: string) => string;
}

/**
 * The talk, project and timeline lists on `/tags/[tag]`.
 *
 * Articles keep `ArticleCard`, which carries a cover image and a video badge
 * neither of the other three sources has. Everything else is a title, a line of
 * description and one label, so it renders the same way whatever collection it
 * came from.
 */
export function TagEntryList({ items, label, linkLabel }: TagEntryListProps) {
  if (items.length === 0) return null;

  return (
    <ul aria-label={label} className="space-y-8">
      {items.map((item) => (
        <li key={item.key}>
          <article className="group relative flex flex-col items-start">
            <Link
              href={item.href}
              className="absolute -inset-x-4 -inset-y-6 sm:-inset-x-6"
              aria-label={linkLabel(item.title)}
            />
            <div className="absolute -inset-x-4 -inset-y-6 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl pointer-events-none" />

            {(item.date || item.badge) && (
              <div className="relative pointer-events-none order-first mb-3 flex flex-wrap items-center gap-2">
                {item.date && (
                  <time className="flex items-center text-sm text-zinc-400 pl-3.5">
                    <span className="absolute inset-y-0 left-0 flex items-center">
                      <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                    </span>
                    {item.date}
                  </time>
                )}
                {item.badge && (
                  <Badge variant="secondary" className="shrink-0">
                    {item.badge}
                  </Badge>
                )}
              </div>
            )}

            <h3 className="relative pointer-events-none text-base font-semibold tracking-tight">
              {item.title}
            </h3>

            {item.description && (
              <p className="relative pointer-events-none mt-2 text-sm text-zinc-600">
                {item.description}
              </p>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
