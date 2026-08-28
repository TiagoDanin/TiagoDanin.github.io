"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Gift, CheckCircle2, ExternalLink } from "lucide-react";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/i18n/locales';
import { RatingRow } from "@/components/ui/RatingRow";

const API_URL = process.env.NEXT_PUBLIC_FEEDBACK_API_URL ?? "";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RatingKey = "slides" | "delivery" | "content" | "applicability";

const RATING_LABELS: Record<RatingKey, string> = {
  slides: "Slides",
  delivery: "Apresentação / Fala",
  content: "Conteúdo",
  applicability: "Aplicabilidade",
};

const RATING_KEYS = Object.keys(RATING_LABELS) as RatingKey[];

/**
 * The feedback endpoint has stored these Portuguese keys since the form
 * shipped. The code speaks English, but the wire must not: renaming the keys
 * on the request body would orphan every record already saved under them.
 * Keep the order in sync with RATING_LABELS so the posted JSON is unchanged.
 */
const RATING_WIRE_KEYS: Record<RatingKey, string> = {
  slides: "slides",
  delivery: "fala",
  content: "conteudo",
  applicability: "aplicabilidade",
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: string | HTMLElement,
        opts: { sitekey: string; callback: (token: string) => void; "error-callback"?: () => void }
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

export interface FeedbackFormProps {
  /**
   * Language the links out of the form are built for. Defaults to English.
   *
   * The copy here is Portuguese on purpose, the way LanguageSuggestion's is:
   * the form is handed to people in the room at a talk. The links still follow
   * the page's locale rather than the copy's.
   */
  locale?: Locale;
}

export default function FeedbackForm({ locale = DEFAULT_LOCALE }: FeedbackFormProps) {
  const searchParams = useSearchParams();
  const talk = searchParams.get("talk") ?? "Talk";
  const bonus = searchParams.get("bonus") ?? "";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    slides: 0,
    delivery: 0,
    content: 0,
    applicability: 0,
  });
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [shake, setShake] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const ratingRefs = useRef<Record<RatingKey, HTMLDivElement | null>>({
    slides: null,
    delivery: null,
    content: null,
    applicability: null,
  });

  useEffect(() => {
    if (step !== 2 || !TURNSTILE_SITE_KEY) return;
    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTurnstileToken(token),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.head.appendChild(script);
  }, [step]);

  const setRating = (key: RatingKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const firstMissingRating = RATING_KEYS.find((k) => ratings[k] < 1);
  const allRatingsFilled = !firstMissingRating;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const focusFirstMissing = () => {
    if (!firstMissingRating) return;
    const el = ratingRefs.current[firstMissingRating];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError(true);
      triggerShake();
      return;
    }
    setEmailError(false);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allRatingsFilled) {
      setShowErrors(true);
      triggerShake();
      focusFirstMissing();
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Aguarde o captcha carregar e tente novamente.");
      return;
    }
    if (!API_URL) {
      setError("Endpoint de feedback não configurado.");
      return;
    }

    setSubmitting(true);
    // Translate the English rating keys back to the Portuguese ones the
    // endpoint has always stored. See RATING_WIRE_KEYS.
    const wireRatings = RATING_KEYS.reduce<Record<string, number>>((acc, key) => {
      acc[RATING_WIRE_KEYS[key]] = ratings[key];
      return acc;
    }, {});
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          talk,
          ratings: wireRatings,
          liked: liked.trim() || undefined,
          improve: improve.trim() || undefined,
          suggestions: suggestions.trim() || undefined,
          email: email.trim(),
          turnstileToken,
        }),
      });

      if (!resp.ok) {
        const data = (await resp.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Erro ao enviar. Tente novamente.");
        window.turnstile?.reset(turnstileWidgetId.current ?? undefined);
        setTurnstileToken("");
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      setStep(3);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.4s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .shake { animation: none; }
        }
      `}</style>

      <StepIndicator step={step} />

      {step === 1 && (
        <form onSubmit={handleContinue} className="space-y-6" noValidate>
          <div>
            <h2 className="text-lg font-semibold mb-1">{talk}</h2>
          </div>

          <div className="rounded-xl border bg-muted p-4 flex items-start gap-3">
            <Gift className="w-5 h-5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">
                {bonus ? "Bônus no final" : "Seu feedback importa"}
              </p>
              <p className="text-sm text-muted-foreground">
                {bonus
                  ? "Avalie a talk e ganhe acesso ao material complementar no final."
                  : "Leva menos de 1 minuto e me ajuda a melhorar as próximas talks."}
              </p>
            </div>
          </div>

          <div className={shake && emailError ? "shake" : ""}>
            <Label htmlFor="email">Seu email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(false);
              }}
              maxLength={200}
              required
              aria-invalid={emailError}
              className={emailError ? "border-red-400" : ""}
            />
            {emailError && (
              <p className="text-xs text-red-600 mt-1">Informe um email válido para continuar.</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12">
            Continuar
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <h2 className="text-lg font-semibold mb-1">{talk}</h2>
            <p className="text-sm text-muted-foreground">
              Seu feedback me ajuda a melhorar as próximas talks.
            </p>
          </div>

          <div className="space-y-3">
            {RATING_KEYS.map((key) => {
              const isError = showErrors && ratings[key] < 1;
              return (
                <div
                  key={key}
                  ref={(el) => { ratingRefs.current[key] = el; }}
                  className={`rounded-md border px-3 py-2 transition-colors ${
                    isError
                      ? `border-red-400 bg-red-50 ${shake ? "shake" : ""}`
                      : "border-transparent"
                  }`}
                >
                  <RatingRow
                    label={RATING_LABELS[key]}
                    value={ratings[key]}
                    onChange={(v) => setRating(key, v)}
                    isError={isError}
                  />
                  {isError && (
                    <p className="text-xs text-red-600 mt-1">Selecione de 1 a 5 estrelas.</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="liked">O que mais gostou? <span className="text-gray-400 text-xs">(opcional)</span></Label>
              <Textarea id="liked" value={liked} onChange={(e) => setLiked(e.target.value)} maxLength={2000} rows={3} />
            </div>
            <div>
              <Label htmlFor="improve">O que pode melhorar? <span className="text-gray-400 text-xs">(opcional)</span></Label>
              <Textarea id="improve" value={improve} onChange={(e) => setImprove(e.target.value)} maxLength={2000} rows={3} />
            </div>
            <div>
              <Label htmlFor="suggestions">Sugestão de talks futuras <span className="text-gray-400 text-xs">(opcional)</span></Label>
              <Textarea id="suggestions" value={suggestions} onChange={(e) => setSuggestions(e.target.value)} maxLength={2000} rows={3} />
            </div>
          </div>

          {TURNSTILE_SITE_KEY ? (
            <div ref={turnstileRef} className="flex justify-center" />
          ) : (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
              ⚠️ Captcha não configurado: defina <code>NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> no <code>.env.local</code>.
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12" disabled={submitting}>
            {submitting ? "Enviando..." : bonus ? "Enviar e liberar bônus" : "Enviar feedback"}
          </Button>
          {allRatingsFilled && TURNSTILE_SITE_KEY && !turnstileToken && (
            <p className="text-xs text-gray-500 text-center">Aguardando verificação do captcha...</p>
          )}
        </form>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center py-4">
          <CheckCircle2 className="w-12 h-12 mx-auto text-green-600" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold mb-1">Feedback enviado. Obrigado!</h2>
            <p className="text-sm text-muted-foreground">
              {bonus
                ? "Seu bônus está liberado."
                : "Isso me ajuda de verdade nas próximas talks."}
            </p>
          </div>
          {bonus ? (
            <div className="space-y-3">
              <Button asChild className="w-full h-12">
                <a href={bonus} target="_blank" rel="noopener noreferrer">
                  Acessar bônus
                  <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                O bônus abre em uma nova aba. Você também pode ver{" "}
                <a href={localePath(locale, "/links")} className="underline hover:text-primary">meus outros links</a>.
              </p>
            </div>
          ) : (
            <Button asChild className="w-full h-12">
              <a href={localePath(locale, "/links")}>Ver meus links</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
