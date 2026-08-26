'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

/** Remembers the reader said no. Survives the browser being closed. */
const DISMISSED_KEY = 'td.lang-suggestion.dismissed';
/** Remembers it was already shown. Cleared when the tab is. */
const SEEN_KEY = 'td.lang-suggestion.seen';

export interface LanguageSuggestionProps {
  /** Where "read in Portuguese" goes. */
  href?: string;
  /**
   * Languages to test instead of the browser's. Stories pass this; the site
   * never does.
   */
  languages?: readonly string[];
}

/** True when any of the reader's preferred languages is Portuguese, region aside. */
function prefersPortuguese(languages: readonly string[]): boolean {
  return languages.some((tag) => tag.toLowerCase().startsWith('pt'));
}

function readFlag(storage: Storage | undefined, key: string): boolean {
  try {
    return storage?.getItem(key) === '1';
  } catch {
    // Private mode and blocked site data both throw on access. Not knowing
    // whether it was dismissed is not a reason to fail the page.
    return false;
  }
}

function writeFlag(storage: Storage | undefined, key: string): void {
  try {
    storage?.setItem(key, '1');
  } catch {
    // Nothing to do: the banner simply asks again next time.
  }
}

/**
 * Offers the Portuguese site to a reader whose browser asks for Portuguese.
 *
 * Shown on the English home only, and never as a redirect. A static export has
 * no server to negotiate `Accept-Language`, and doing it in the browser would
 * move the reader before the page they asked for finished arriving. Asking is
 * both honest and reversible.
 *
 * The copy is written in Portuguese and stays that way. Translating it would
 * defeat the point: it exists for someone who may not read the page behind it.
 *
 * Anchored to the bottom rather than inserted at the top, so appearing after
 * hydration cannot push the page the reader is already looking at.
 */
export function LanguageSuggestion({ href = '/br/', languages }: LanguageSuggestionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const preferred = languages ?? navigator.languages ?? [navigator.language];
    if (!prefersPortuguese(preferred)) return;

    if (readFlag(window.localStorage, DISMISSED_KEY)) return;
    if (readFlag(window.sessionStorage, SEEN_KEY)) return;

    writeFlag(window.sessionStorage, SEEN_KEY);
    setVisible(true);
  }, [languages]);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Sugestão de idioma"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
    >
      <div className="pointer-events-auto w-full max-w-lg rounded-lg border bg-background p-4 shadow-lg sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm leading-relaxed text-foreground" lang="pt-BR">
            Este site também está em português. Quer ler a versão brasileira?
          </p>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Fechar"
            className="-m-1 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2" lang="pt-BR">
          <Button asChild size="sm" className="min-h-[44px] bg-blue-600 text-white hover:bg-blue-700">
            <Link href={href} onClick={() => writeFlag(window.localStorage, DISMISSED_KEY)}>
              Ler em português
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="min-h-[44px]"
            onClick={() => setVisible(false)}
          >
            Agora não
          </Button>

          <button
            type="button"
            onClick={() => {
              writeFlag(window.localStorage, DISMISSED_KEY);
              setVisible(false);
            }}
            className="ml-auto min-h-[44px] rounded-md px-2 text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Não mostrar de novo
          </button>
        </div>
      </div>
    </div>
  );
}
