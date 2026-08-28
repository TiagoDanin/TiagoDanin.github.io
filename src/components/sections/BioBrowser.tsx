'use client'

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";
import {
  BIO_FOCUSES,
  BIO_LANGUAGES,
  BIO_LENGTHS,
  BIO_UI,
  type BioFocus,
  type BioLang,
  type BioTable,
} from "@/lib/bios";

interface BioBrowserProps {
  bios: BioTable;
}

const chipClass = (selected: boolean) =>
  cn(
    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors min-h-[36px]",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    selected
      ? "border-transparent bg-primary text-primary-foreground"
      : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  );

export function BioBrowser({ bios }: BioBrowserProps) {
  const [lang, setLang] = useState<BioLang>('en');
  const [focus, setFocus] = useState<BioFocus>('general');

  const ui = BIO_UI[lang];
  const selected = bios[lang][focus];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
        <fieldset>
          <legend className="text-sm font-medium text-muted-foreground">
            {ui.language}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {BIO_LANGUAGES.map(option => (
              <button
                key={option.key}
                type="button"
                onClick={() => setLang(option.key)}
                aria-pressed={lang === option.key}
                className={chipClass(lang === option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-muted-foreground">
            {ui.focus}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {BIO_FOCUSES.map(option => (
              <button
                key={option.key}
                type="button"
                onClick={() => setFocus(option.key)}
                aria-pressed={focus === option.key}
                className={chipClass(focus === option.key)}
              >
                {option.label[lang]}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-5">
        {BIO_LENGTHS.map(length => (
          <div
            key={length.key}
            className="rounded-xl border bg-background p-6 shadow-xs"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{length.title[lang]}</h3>
                <p className="text-sm text-muted-foreground">{length.hint[lang]}</p>
              </div>
              <CopyButton
                value={selected[length.key]}
                label={ui.copy}
                copiedLabel={ui.copied}
                srLabel={`${ui.copyAria}: ${length.title[lang]}`}
              />
            </div>
            <p className="mt-4 leading-relaxed text-foreground/90 whitespace-pre-line">
              {selected[length.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
