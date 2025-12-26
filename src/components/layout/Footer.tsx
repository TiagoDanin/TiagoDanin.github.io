'use client'

import { Code, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 gap-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/" className="hover:text-primary min-h-[44px] flex items-center">Home</Link>
            {!isHome && (
              <>
                <Link href="/projects" className="hover:text-primary min-h-[44px] flex items-center">Projects</Link>
              </>
            )}
            <Link href="/blog" className="hover:text-primary min-h-[44px] flex items-center">Blog</Link>
            <Link href="/talks" className="hover:text-primary min-h-[44px] flex items-center">Talks</Link>
            <Link href="/sitemap" className="hover:text-primary min-h-[44px] flex items-center">Site Map</Link>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground mb-4">Follow me on social media:</h3>
            <div className="flex justify-center">
              <SocialLinks />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground text-center">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-blue-500" />
            <span>with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by</span>
            <span className="font-medium">Tiago Danin</span>
          </div>
          <span className="hidden md:inline">|</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>Built with</span>
            <span className="font-medium">React</span>
            <span>and</span>
            <span className="font-medium">Tailwind</span>
          </div>
          <span className="hidden md:inline">|</span>
          <div>
            <span>Hosted on</span>
            <span className="font-medium ml-1">GitHub Pages</span>
          </div>
        </div>
      </div>
    </footer>
  );
}