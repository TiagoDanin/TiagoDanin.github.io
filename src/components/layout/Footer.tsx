import { Code, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto space-y-8">
        <div className="grid grid-cols-1 gap-8 text-center">
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            {!isHome && (
              <>
                <Link href="/about" className="hover:text-primary">About</Link>
                <Link href="/projects" className="hover:text-primary">Projects</Link>
              </>
            )}
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <Link href="/timeline" className="hover:text-primary">Timeline</Link>
            <Link href="/sitemap" className="hover:text-primary">Site Map</Link>
          </div>
          
          <div>
            <h3 className="text-sm text-muted-foreground mb-4">Follow me on social media:</h3>
            <div className="flex justify-center">
              <SocialLinks />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
          <Code className="h-4 w-4 text-blue-500" />
          <span>with</span>
          <Heart className="h-4 w-4 text-red-500" />
          <span>by</span>
          <span className="font-medium">Tiago Danin</span>
          <span>|</span>
          <span>Built with</span>
          <span className="font-medium">React</span>
          <span>and</span>
          <span className="font-medium">Tailwind</span>
          <span>|</span>
          <span>Hosted on</span>
          <span className="font-medium">GitHub Pages</span>
        </div>
      </div>
    </footer>
  );
}