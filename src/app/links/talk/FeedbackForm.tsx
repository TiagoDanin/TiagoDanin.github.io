"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_FEEDBACK_API_URL ?? "";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type RatingKey = "slides" | "fala" | "conteudo" | "aplicabilidade";

const RATING_LABELS: Record<RatingKey, string> = {
  slides: "Slides",
  fala: "Apresentação / Fala",
  conteudo: "Conteúdo",
  aplicabilidade: "Aplicabilidade",
};

const RATING_KEYS = Object.keys(RATING_LABELS) as RatingKey[];

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

export default function FeedbackForm() {
  const searchParams = useSearchParams();
  const talk = searchParams.get("talk") ?? "Talk";
  const bonus = searchParams.get("bonus") ?? "";

  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    slides: 0,
    fala: 0,
    conteudo: 0,
    aplicabilidade: 0,
  });
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [shake, setShake] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const ratingRefs = useRef<Record<RatingKey, HTMLDivElement | null>>({
    slides: null,
    fala: null,
    conteudo: null,
    aplicabilidade: null,
  });

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
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
  }, []);

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
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          talk,
          ratings,
          liked: liked.trim() || undefined,
          improve: improve.trim() || undefined,
          suggestions: suggestions.trim() || undefined,
          email: email.trim() || undefined,
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

      if (bonus) {
        window.location.href = bonus;
      } else {
        window.location.href = "/links/";
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.4s ease-in-out; }
      `}</style>

      <div>
        <h2 className="text-lg font-semibold mb-1">{talk}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Seu feedback me ajuda a melhorar as próximas talks. Após enviar, você terá acesso ao bônus.
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
                  ? `border-red-400 bg-red-50 dark:bg-red-950/40 ${shake ? "shake" : ""}`
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
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Selecione de 1 a 5 estrelas.</p>
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
        <div>
          <Label htmlFor="email">Email <span className="text-gray-400 text-xs">(opcional, para contato)</span></Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} />
        </div>
      </div>

      {TURNSTILE_SITE_KEY ? (
        <div ref={turnstileRef} className="flex justify-center" />
      ) : (
        <div className="rounded-md bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 p-3 text-sm text-yellow-800 dark:text-yellow-300">
          ⚠️ Captcha não configurado: defina <code>NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> no <code>.env.local</code>.
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-12" disabled={submitting}>
        {submitting ? "Enviando..." : "Enviar feedback e acessar bônus"}
      </Button>
      {allRatingsFilled && TURNSTILE_SITE_KEY && !turnstileToken && (
        <p className="text-xs text-gray-500 text-center">Aguardando verificação do captcha...</p>
      )}
    </form>
  );
}

function RatingRow({
  label,
  value,
  onChange,
  isError,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  isError?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`text-sm font-medium ${isError ? "text-red-700 dark:text-red-400" : ""}`}>{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-1 transition-transform hover:scale-110"
            aria-label={`${label}: ${n} estrelas`}
          >
            <Star
              className={`w-6 h-6 ${
                n <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : isError
                  ? "text-red-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
