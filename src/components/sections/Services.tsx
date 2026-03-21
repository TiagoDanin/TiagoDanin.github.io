import { Code, Smartphone, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';

import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Code,
  Smartphone,
  Shield,
  Zap,
};

export function Services() {
  const expertiseData = queryCollection('expertise');
  return (
    <section id="skills" className="relative py-16 sm:py-20 bg-secondary/30 overflow-hidden">
      {/* Blur effect circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My Expertise</h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Areas where I excel and can help bring your ideas to life.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {expertiseData.map((item) => {
            const Icon = iconMap[item.icon];
            const content = (
              <>
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-5">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <h3 className={`text-lg sm:text-xl font-semibold mb-3 ${item.link ? "group-hover:text-primary transition-colors" : ""}`}>
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {item.description}
                </p>
              </>
            );

            if (item.link) {
              return (
                <Link
                  key={item.title}
                  href={item.link}
                  className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={item.title} className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
