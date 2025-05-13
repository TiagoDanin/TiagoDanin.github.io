'use client'

import { Button } from "@/components/ui/button";
import { Linkedin, Menu } from "lucide-react";
import Link from "next/link";
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
      <div className="container mx-auto flex items-center justify-between">
        <div className="block md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-4">
              <div className="flex flex-col gap-4 pt-8">
                <Link href="/" className="font-medium hover:text-primary">Home</Link>
                <Link href="/projects" className="font-medium hover:text-primary">Projects</Link>
                <Link href="/blog" className="font-medium hover:text-primary">Blog</Link>
                <Link href="/talks" className="font-medium hover:text-primary">Talks</Link>
                <Link href="/timeline" className="font-medium hover:text-primary">Timeline</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="text-xl font-semibold">Tiago Danin</Link>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6">
            <Link href="/" className="font-medium hover:text-primary hover:scale-105 transition-all">Home</Link>
            <Link href="/projects" className="font-medium hover:text-primary hover:scale-105 transition-all">Projects</Link>
            <Link href="/blog" className="font-medium hover:text-primary hover:scale-105 transition-all">Blog</Link>
            <Link href="/talks" className="font-medium hover:text-primary hover:scale-105 transition-all">Talks</Link>
            <Link href="/timeline" className="font-medium hover:text-primary hover:scale-105 transition-all">Timeline</Link>
          </div>
          
          <Button asChild>
            <a
              href="https://linkedin.com/in/tiagodanin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}