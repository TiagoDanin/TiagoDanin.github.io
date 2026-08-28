import { TechBadge } from '@/components/ui/TechBadge';

export interface BusinessStackGroup {
  category: string;
  items: Array<{ name: string; icon: string; color: string }>;
}

export interface BusinessStackProps {
  title: string;
  note: string;
  groups: BusinessStackGroup[];
}

export function BusinessStack({ title, note, groups }: BusinessStackProps) {
  return (
    <section className="bg-secondary/30 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">{note}</p>
        </div>

        <dl className="mt-10 space-y-8">
          {groups.map((group) => (
            <div
              key={group.category}
              className="grid gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-6"
            >
              <dt className="pt-1 text-sm font-semibold text-foreground">{group.category}</dt>
              <dd className="flex min-w-0 flex-wrap gap-2">
                {group.items.map((item) => (
                  <TechBadge
                    key={item.name}
                    icon={item.icon}
                    name={item.name}
                    color={item.color}
                  />
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
