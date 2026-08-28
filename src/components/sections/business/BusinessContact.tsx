import { Linkedin, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface BusinessContactProps {
  title: string;
  detail: string;
  note: string;
  email: string;
  emailLabel: string;
  linkedInUrl?: string;
  linkedInLabel: string;
}

export function BusinessContact({
  title,
  detail,
  note,
  email,
  emailLabel,
  linkedInUrl,
  linkedInLabel,
}: BusinessContactProps) {
  return (
    <section className="bg-primary px-4 py-16 text-primary-foreground md:py-24">
      <div className="container mx-auto max-w-4xl">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-primary-foreground/80 md:text-lg">
          {detail}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="secondary" asChild>
            <a href={`mailto:${email}`}>
              <Mail className="mr-2 h-4 w-4" />
              {emailLabel}
            </a>
          </Button>
          {linkedInUrl && (
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                {linkedInLabel}
              </a>
            </Button>
          )}
        </div>

        <p className="mt-8 border-t border-primary-foreground/20 pt-6 text-sm text-primary-foreground/70">
          {note}
        </p>
      </div>
    </section>
  );
}
