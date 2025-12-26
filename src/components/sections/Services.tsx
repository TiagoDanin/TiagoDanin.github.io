"use client";

import { Code, Smartphone, Shield, Zap } from "lucide-react";
import Link from "next/link";

export function Services() {
  return (
    <section id="skills" className="relative py-16 sm:py-20 bg-secondary/30 overflow-hidden">
      {/* Blur effect circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 sm:opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 sm:opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My Expertise</h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Areas where I excel and can help bring your ideas to life.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {/* Mobile Development */}
          <Link
            href="/mobile"
            className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-5">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
              Mobile Development
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Native and cross-platform mobile apps using Flutter, React Native, Kotlin, Swift, and more.
            </p>
          </Link>

          {/* Full Stack Development */}
          <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-5">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Full Stack Development</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              End-to-end web solutions with modern frontend technologies and robust backend systems using React, Node.js, and various databases.
            </p>
          </div>

          {/* Security */}
          <Link
            href="/cybersecurity"
            className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-5">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
              Cybersecurity
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Implementation of security best practices, penetration testing, and secure coding principles to protect applications and data.
            </p>
          </Link>

          {/* DevOps & CI/CD */}
          <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-5">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3">DevOps & CI/CD</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Streamlined deployment processes, cloud infrastructure, continuous integration/deployment pipelines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}