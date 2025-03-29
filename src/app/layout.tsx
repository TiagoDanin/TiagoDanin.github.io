import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import NextTopLoader from 'nextjs-toploader';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tiago Danin",
    template: "%s | Tiago Danin"
  },
  description: "I'm a Mobile Developer with expertise in Java, Kotlin, Obj-C, Swift, React Native, and Flutter, also experienced in front-end, back-end, and desktop development for macOS & Linux.",
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
      </body>
      <GoogleAnalytics gaId="G-4M6BE19CKV" />
    </html>
  );
}

