"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Award,
  BadgeCheck,
  Trophy,
  ArrowRight,
} from "lucide-react";
import SearchBar from "@/components/layout/SearchBar";

const STATS = [
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Properties Sold" },
];

const AWARDS = [
  { icon: BadgeCheck, label: "PRC Licensed" },
  { icon: Trophy, label: "Top Seller" },
  { icon: Award, label: "Company Awardee" },
];

export default function HeroSection() {
  return (
    <section className="relative flex flex-col bg-luxury-900">
      {/* Search Bar */}
      <div className="relative z-[50]">
        <SearchBar />
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex items-start z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 xl:gap-20 items-center">

            {/* Left: Copy — centered on mobile, left on desktop */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2.5 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-gold-500 text-[11px] tracking-[0.15em] uppercase font-semibold">
                  Licensed Real Estate Broker · Philippines
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-[clamp(2.2rem,4vw,3.25rem)] font-extrabold text-luxury-50 leading-[1.08] tracking-tight mb-5">
                Find Your<br className="hidden lg:block" />{" "}
                <span className="text-gold-500">Dream Home</span>
                <br />
                <span className="text-luxury-300">with Broker Shella</span>
              </h1>

              {/* Subheadline */}
              <p className="text-luxury-400 text-base max-w-120 mb-8 leading-relaxed">
                Expert guidance for buying, selling, and renting properties
                across{" "}
                <span className="text-luxury-50 font-medium">Bulacan</span> and{" "}
                <span className="text-luxury-50 font-medium">Metro Manila</span>
                . Your trusted partner in real estate.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10">
                <Link
                  href="/properties"
                  className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-7 py-3.5 rounded-lg tracking-wide transition-colors">
                  Browse Properties
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 border border-luxury-600 hover:border-gold-500 text-luxury-50 hover:text-gold-500 text-sm font-semibold px-7 py-3.5 rounded-lg tracking-wide transition-all duration-300">
                  Book a Consultation
                </Link>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-10">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center lg:items-start">
                    <p className="text-[2rem] font-black text-luxury-50 leading-none mb-1 tabular-nums">
                      {stat.value}
                    </p>
                    <p className="text-gold-500 text-[11px] tracking-[0.12em] uppercase font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Photo */}
            <div className="flex flex-col items-center gap-4 lg:items-end">

              {/* Photo card — clean centered on mobile, floating badges only on lg+ */}
              <div className="relative w-full max-w-72 sm:max-w-sm lg:max-w-110">
                {/* Depth shadow block — desktop only */}
                <div
                  className="hidden lg:block absolute -bottom-3 -right-3 w-full rounded-3xl bg-luxury-700 pointer-events-none"
                  style={{ aspectRatio: "3/4", zIndex: 0 }}
                />

                {/* Photo */}
                <div className="relative w-full rounded-3xl overflow-hidden border border-luxury-700 z-10">
                  <div className="relative w-full aspect-3/4">
                    <Image
                      src="/shella.jpg"
                      alt="Broker Shella Castro - Licensed Real Estate Broker"
                      fill
                      sizes="(max-width: 768px) 90vw, 440px"
                      className="object-cover object-[center_top]"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none bg-linear-to-t from-luxury-900 to-transparent" />
                  </div>

                  {/* Name card */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                    <div className="bg-luxury-800/90 backdrop-blur-md border border-luxury-700 rounded-2xl px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-luxury-50 text-xl font-bold tracking-tight leading-none mb-1">
                          Broker Shella
                        </p>
                        <p className="text-gold-500 text-[11px] tracking-[0.15em] uppercase font-semibold">
                          SMGC Properties
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-4 h-4 text-gold-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges — desktop only */}
                <div className="hidden lg:flex absolute -right-3 top-6 flex-col gap-2.5 z-20">
                  {AWARDS.map((award) => (
                    <div
                      key={award.label}
                      className="flex items-center gap-2 bg-luxury-800 border border-luxury-700 rounded-xl px-3.5 py-2.5">
                      <award.icon className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span className="text-luxury-50 text-[11px] font-semibold whitespace-nowrap tracking-wide">
                        {award.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Availability chip — desktop only */}
                <div className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 bg-luxury-800 border border-luxury-700 rounded-2xl px-4 py-3 z-20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-gold-500" />
                    <span className="text-gold-500 text-[10px] font-bold tracking-widest uppercase">
                      Available Now
                    </span>
                  </div>
                  <p className="text-luxury-400 text-[10px] leading-snug max-w-22.5">
                    Ready to help you find your home
                  </p>
                </div>
              </div>

              {/* Award badges row — mobile only, below photo */}
              <div className="flex lg:hidden items-center justify-center gap-2 flex-wrap">
                {AWARDS.map((award) => (
                  <div
                    key={award.label}
                    className="flex items-center gap-2 bg-luxury-800 border border-luxury-700 rounded-xl px-3.5 py-2">
                    <award.icon className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span className="text-luxury-50 text-[11px] font-semibold tracking-wide">
                      {award.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
