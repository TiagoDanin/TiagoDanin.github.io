"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Flag } from "lucide-react";
import posts from "@/data/posts.json";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";

export function RecentPosts() {
  const recentPosts = posts.slice(0, 4);
  
  return (
    <section id="blog" className="relative py-20 bg-secondary/30 overflow-hidden">
      {/* Blur effect circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>
  
      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-3xl font-bold tracking-tight">Recent Thoughts</h2>
            <Badge variant="outline" className="flex items-center gap-1">
              <Flag className="h-3 w-3" />
              PT-BR
            </Badge>
          </div>
          <p className="mt-4 text-muted-foreground">
            Some of my latest articles, insights, and ideas from the blog.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {recentPosts.map((post, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                  <Card className="h-full group hover:shadow-md transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription>{post.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        Read more <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious className="relative translate-y-0 left-0" />
              <CarouselNext className="relative translate-y-0 right-0" />
            </div>
          </Carousel>
        </div>
        
        <div className="flex justify-center mt-10">
          <Link 
            href="/blog"
            className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-all"
          >
            View all posts <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}