import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import NextTopLoader from 'nextjs-toploader';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { ToasterProvider } from "@/components/ui/toaster-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://tiagodanin.com'),
  title: {
    default: "Tiago Danin - Mobile Developer & Software Engineer",
    template: "%s | Tiago Danin"
  },
  description: "Mobile Developer specializing in Flutter, React Native, iOS & Android. Open source contributor, bug hunter, and cybersecurity researcher.",
  keywords: [
    "Tiago Danin", "Mobile Developer", "Software Engineer", "Flutter", "React Native",
    "iOS", "Android", "Swift", "Kotlin", "TypeScript", "Cybersecurity",
    "Bug Hunter", "HackerOne", "Open Source", "Game Development", "Mentorship"
  ],
  authors: [{ name: "Tiago Danin", url: "https://tiagodanin.com" }],
  creator: "Tiago Danin",
  publisher: "Tiago Danin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['pt_BR'],
    url: 'https://tiagodanin.com',
    title: 'Tiago Danin - Mobile Developer & Software Engineer',
    description: 'Mobile Developer specializing in Flutter, React Native, iOS & Android. Open source contributor and cybersecurity researcher.',
    siteName: 'Tiago Danin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiago Danin - Mobile Developer & Software Engineer',
    description: 'Mobile Developer specializing in Flutter, React Native, iOS & Android. Open source contributor.',
    creator: '@tiagodanin',
    site: '@tiagodanin',
  },
  alternates: {
    canonical: 'https://tiagodanin.com',
    languages: {
      'en-US': 'https://tiagodanin.com',
      'pt-BR': 'https://tiagodanin.com',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleTagManager gtmId="GTM-WT3T53NB" />
        <NextTopLoader
          color="#1e56f0"
          speed={340}
        />
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <ToasterProvider />
      </body>
      <GoogleAnalytics gaId="G-4M6BE19CKV" />
    </html>
  );
}

