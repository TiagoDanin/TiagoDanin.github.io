'use client'

import { Code, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialLinks } from "@/components/ui/SocialLinks";

interface FooterProps {
  socialLinks: { label: string; url: string; icon: string }[];
}

export function Footer({ socialLinks }: FooterProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 gap-8 text-center">
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/" className="hover:text-primary min-h-[44px] flex items-center">Home</Link>
            {!isHome && (
              <Link href="/projects" className="hover:text-primary min-h-[44px] flex items-center">Projects</Link>
            )}
            <Link href="/blog" className="hover:text-primary min-h-[44px] flex items-center">Blog</Link>
            <Link href="/talks" className="hover:text-primary min-h-[44px] flex items-center">Talks</Link>
            <Link href="/sitemap" className="hover:text-primary min-h-[44px] flex items-center">Sitemap</Link>
          </nav>

          <div>
            <h3 className="text-sm font-medium mb-4">Find me on</h3>
            <div className="flex justify-center">
              <SocialLinks socialLinks={socialLinks} />
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <Code className="h-4 w-4 text-blue-500" aria-hidden="true" />
            <span>with</span>
            <Heart className="h-4 w-4 fill-rose-500 stroke-rose-500" aria-hidden="true" />
            <span>by</span>
            <span className="font-medium text-foreground">Tiago Danin</span>
          </p>
          <p>
            Built with <span className="font-medium">Next.js</span> and <span className="font-medium">Tailwind</span>, hosted on <span className="font-medium">GitHub Pages</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
