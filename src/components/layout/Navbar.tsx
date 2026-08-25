'use client'

import { Button } from "@/components/ui/button";
import { Linkedin, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface MenuItem {
  title: string;
  href: string;
  navbar?: boolean;
  footer?: boolean;
  hideOnHome?: boolean;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ menu }: { menu: MenuItem[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const navItems = menu.filter((item) => item.navbar);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border/60 py-3"
          : "bg-background border-b border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Tiago Danin home"
          className="flex items-center gap-2 text-lg sm:text-xl font-semibold shrink-0"
        >
          <Image src="/images/logo.svg" alt="" width={24} height={24} aria-hidden />
          <span>Tiago Danin</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-7 lg:gap-9">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative font-medium transition-colors duration-200",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.title}
                  {active && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-blue-600"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <Button asChild size="sm" className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white">
            <a
              href="https://linkedin.com/in/tiagodanin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </Button>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 min-h-[44px] min-w-[44px]"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] p-4">
                {/* A sheet is a dialog and needs a name; the design has no room
                    for a visible one. */}
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex flex-col gap-1 pt-8">
                  {navItems.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "font-medium min-h-[44px] flex items-center px-3 rounded-md transition-colors",
                          active
                            ? "text-foreground bg-muted"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
