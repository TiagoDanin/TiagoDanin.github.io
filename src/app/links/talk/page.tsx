import { Suspense } from "react";
import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback da Talk",
  description: "Compartilhe seu feedback sobre a talk e receba o bônus de acesso ao material complementar.",
  robots: { index: false, follow: false },
};

export default function TalkFeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Avalie a talk
            </h1>
            <Suspense fallback={<div className="text-gray-500">Carregando...</div>}>
              <FeedbackForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
