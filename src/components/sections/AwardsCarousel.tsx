"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AWARDS = [
  {
    title: "Top Sales Performer",
    organization: "Archer Realty & Development Corporation",
    year: "2020 – 2021",
    src: "/Top-Sales-Performer-2020-2021.jpg",
  },
  {
    title: "Top Real Estate Broker",
    organization: "Archer Realty & Development Corporation",
    year: "2024",
    src: "/Top-RealEstate-Broker-2024.jpg",
  },
  {
    title: "Top Real Estate Broker",
    organization: "Archer Realty & Development Corporation",
    year: "2025",
    src: "/Top2-RealEstate-Broker-2025.jpg",
  },
  {
    title: "Top Broker",
    organization: "Evara Residences",
    year: "2025",
    src: "/Top-Broker-Evara-2025.jpg",
  },
  {
    title: "Top Loan Referrer",
    organization: "Bank of the Philippine Islands",
    year: "2025",
    src: "/Top-Loan-Referrer.jpg",
  },
  {
    title: "BPI Prime Partner",
    organization: "Bank of the Philippine Islands",
    year: "2025",
    src: "/BPI-Prime-Partner.jpg",
  },
  {
    title: "Secretary Recognition",
    organization: "BRB (Bulacan Realt Estate Boards)",
    year: "2023 – 2025",
    src: "/BRB-Secretary-Recognition-2023-2025.jpg",
  },
  {
    title: "Vice President",
    organization: "BRB (Bulacan Realt Estate Boards)",
    year: "2026",
    src: "/BRB-VicePresident-2026.jpg",
  },
];

export default function AwardsCarousel({
  sectionClassName = "bg-luxury-900",
}: {
  sectionClassName?: string;
}) {
  const [current, setCurrent] = useState(0);
  const n = AWARDS.length;

  const prev = useCallback(() => setCurrent((i) => (i === 0 ? n - 1 : i - 1)), [n]);
  const next = useCallback(() => setCurrent((i) => (i === n - 1 ? 0 : i + 1)), [n]);

  const award = AWARDS[current];
  const prevIdx = (current - 1 + n) % n;
  const nextIdx = (current + 1) % n;

  return (
    <section className={`${sectionClassName} py-12`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-gold-500" />
            <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
              Recognition
            </span>
            <span className="w-8 h-px bg-gold-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-luxury-50 tracking-tight mb-3">
            Awards &amp; Recognition
          </h2>
          <p className="text-luxury-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            A decade of excellence, recognized by industry leaders and clients
            alike.
          </p>
        </div>

        {/* ── Coverflow (wide frame, height-capped, caption on image) ── */}
        <div className="relative">
          {/* Stage */}
          <div className="relative flex items-center justify-center overflow-hidden">
            {/* Prev peek */}
            <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[40%] w-[58%] h-[260px] sm:h-[380px] rounded-xl overflow-hidden opacity-25 pointer-events-none">
              <Image src={AWARDS[prevIdx].src} alt="" fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-luxury-900/50" />
            </div>

            {/* Next peek */}
            <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-[40%] w-[58%] h-[260px] sm:h-[380px] rounded-xl overflow-hidden opacity-25 pointer-events-none">
              <Image src={AWARDS[nextIdx].src} alt="" fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-luxury-900/50" />
            </div>

            {/* Center slide + caption overlay */}
            <div
              key={current}
              className="relative w-full sm:w-[66%] aspect-3/2 sm:aspect-auto sm:h-[440px] rounded-2xl overflow-hidden bg-luxury-800 border border-luxury-700 shadow-2xl shadow-black/50 z-10 animate-fade-in"
            >
              <Image
                src={award.src}
                alt={award.title}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-contain"
                priority
              />
              {/* Caption on image */}
              <div className="absolute inset-x-0 bottom-0 px-5 py-4 sm:px-7 sm:py-5 bg-linear-to-t from-luxury-900 via-luxury-900/85 to-transparent">
                <span className="inline-block text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase text-luxury-900 bg-gold-500 rounded-full px-3 py-1 mb-2.5 shadow-md">
                  {award.year}
                </span>
                <h3 className="font-display text-lg sm:text-2xl font-semibold text-luxury-50 leading-tight">
                  {award.title}
                </h3>
                <p className="text-luxury-300 text-xs sm:text-sm mt-0.5">
                  {award.organization}
                </p>
              </div>
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Previous award"
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-luxury-50 text-luxury-900 hover:bg-gold-500 flex items-center justify-center shadow-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next award"
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-luxury-50 text-luxury-900 hover:bg-gold-500 flex items-center justify-center shadow-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Dots ── */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {AWARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to award ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === current
                  ? "w-6 bg-gold-500"
                  : "w-1.5 bg-luxury-600 hover:bg-luxury-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
