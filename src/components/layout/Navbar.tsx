'use client'

import { Button } from "@/components/ui/button";
import { Linkedin, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-200 ${
      isScrolled ? "bg-background/80 backdrop-blur-sm shadow-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 min-h-[44px] min-w-[44px]" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-4">
              <div className="flex flex-col gap-4 pt-8">
                <Link href="/" className="font-medium hover:text-primary min-h-[44px] flex items-center">Home</Link>
                <Link href="/projects" className="font-medium hover:text-primary min-h-[44px] flex items-center">Projects</Link>
                <Link href="/blog" className="font-medium hover:text-primary min-h-[44px] flex items-center">Blog</Link>
                <Link href="/talks" className="font-medium hover:text-primary min-h-[44px] flex items-center">Talks</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-semibold absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
          <Image src="/images/logo.svg" alt="Tiago Danin Logo" width={24} height={24} />
          <span>Tiago Danin</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden md:flex gap-6">
            <Link href="/" className="font-medium hover:text-primary hover:scale-105 transition-all">Home</Link>
            <Link href="/projects" className="font-medium hover:text-primary hover:scale-105 transition-all">Projects</Link>
            <Link href="/blog" className="font-medium hover:text-primary hover:scale-105 transition-all">Blog</Link>
            <Link href="/talks" className="font-medium hover:text-primary hover:scale-105 transition-all">Talks</Link>
          </div>

          <Button asChild size="sm" className="min-h-[44px] sm:h-auto">
            <a
              href="https://linkedin.com/in/tiagodanin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}