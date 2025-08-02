import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import NextTopLoader from 'nextjs-toploader';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { ToasterProvider } from "@/components/ui/toaster-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tiago Danin - Mobile Developer & Software Engineer",
    template: "%s | Tiago Danin"
  },
  description: "Mobile Developer with expertise in React Native, Flutter Java, Kotlin, Obj-C and Swift. Also experienced in front-end, back-end, and desktop development for macOS & Linux. Open source contributor and bug hunter.",
  keywords: [
    "Tiago Danin", "Mobile Developer", "Software Engineer", "Flutter", "React Native", 
    "iOS", "Android", "Swift", "Kotlin", "Java", "TypeScript", "Open Source",
    "Bug Hunter", "Frontend", "Backend", "DevOps", "Brasil", "Developer"
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
    url: 'https://tiagodanin.com',
    title: 'Tiago Danin - Mobile Developer & Software Engineer',
    description: 'Mobile Developer with expertise in Flutter, React Native, iOS, and Android development. Open source contributor and bug hunter.',
    siteName: 'Tiago Danin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiago Danin - Mobile Developer & Software Engineer',
    description: 'Mobile Developer with expertise in Flutter, React Native, iOS, and Android development.',
    creator: '@tiagodanin',
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

