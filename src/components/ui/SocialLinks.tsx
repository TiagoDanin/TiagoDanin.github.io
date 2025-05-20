import { Github, Linkedin, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialLinks() {
  return (
    <div className="flex gap-4">
      <Button variant="ghost" size="icon" className="h-12 w-12" asChild>

        <a href="https://linkedin.com/in/tiagodanin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <Linkedin className="h-6 w-6" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" className="h-12 w-12" asChild>
        <a href="https://instagram.com/tiagodanin" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <Instagram className="h-6 w-6" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" className="h-12 w-12" asChild>
        <a href="https://www.youtube.com/channel/UCC2wpNWwPLPq0vjpOtGcajw" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <Youtube className="h-6 w-6" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" className="h-12 w-12" asChild>
        <a href="https://github.com/tiagodanin" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <Github className="h-6 w-6" />
        </a>
      </Button>
    </div>
  );
}