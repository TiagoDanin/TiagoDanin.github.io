"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { formatDate } from "@/utils/parse";
import { entryPath, localePath, type Locale } from "@/lib/i18n/locales";
import { Trans, useLingui } from "@lingui/react/macro";

interface PostsEntry {
  date: string;
  title: string;
  description: string;
  slug: string;
  originalUrl: string;
}

interface RecentPostsProps {
  posts: PostsEntry[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  const { t, i18n } = useLingui();
  // The catalog locale is the page locale, so links stay in the language the
  // reader is already in instead of dropping them into the English post.
  const locale = i18n.locale as Locale;
  const recentPosts = posts.slice(0, 4);
  const totalPosts = `${Math.floor(posts.length / 5) * 5}+`;

  return (
    <section id="blog" className="relative py-16 sm:py-20 overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"><Trans>Writing</Trans></h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            <Trans>Notes from building, breaking, and shipping things.</Trans>
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {recentPosts.map((post, index) => (
                <CarouselItem key={index} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                  <Card className="h-full group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base sm:text-lg">
                        <Link href={entryPath(locale, "post", post.slug)}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        <Link href={entryPath(locale, "post", post.slug)}>{formatDate(post.date, i18n.locale)}</Link>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        <Link href={entryPath(locale, "post", post.slug)}>
                          {post.description}
                        </Link>
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={entryPath(locale, "post", post.slug)}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline min-h-[44px] min-w-[44px]"
                        aria-label={t`Read article about ${post.title}`}
                      >
                        <Trans>Read article</Trans> <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4 lg:hidden">
              <CarouselPrevious
                className="relative translate-y-0 left-0 min-h-[44px] min-w-[44px]"
                aria-label={t`Previous posts`}
              />
              <CarouselNext
                className="relative translate-y-0 right-0 min-h-[44px] min-w-[44px]"
                aria-label={t`Next posts`}
              />
            </div>
          </Carousel>
        </div>

        <div className="flex justify-center mt-10">
          <Button size="lg" variant="outline" asChild>
            <Link href={localePath(locale, "/blog")}>
              <Trans>See all {totalPosts} posts</Trans>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
