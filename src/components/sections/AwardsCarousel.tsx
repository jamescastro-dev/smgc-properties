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

  const prev = useCallback(
    () => setCurrent((i) => (i === 0 ? AWARDS.length - 1 : i - 1)),
    []
  );
  const next = useCallback(
    () => setCurrent((i) => (i === AWARDS.length - 1 ? 0 : i + 1)),
    []
  );

  const award = AWARDS[current];

  return (
    <section className={`${sectionClassName} py-16`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-gold-500" />
            <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
              Recognition
            </span>
            <span className="w-8 h-px bg-gold-500" />
          </div>
          <h2 className="text-4xl font-extrabold text-luxury-50 tracking-tight mb-4">
            Awards &amp; Recognition
          </h2>
          <p className="text-luxury-400 text-base max-w-xl mx-auto leading-relaxed">
            A decade of excellence, recognized by industry leaders and
            clients alike.
          </p>
        </div>

        {/* ── Main slide ── */}
        <div className="relative group">
          <div
            key={current}
            className="relative aspect-video rounded-2xl overflow-hidden bg-luxury-800 animate-fade-in"
          >
            <Image
              src={award.src}
              alt={award.title}
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-contain"
              priority
            />

            {/* Info overlay — desktop only */}
            <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end justify-between gap-4">
                <div className="bg-black/60 rounded-xl px-4 py-3">
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-gold-400 mb-1">
                    {award.year}
                  </span>
                  <h3 className="text-white font-extrabold text-xl leading-tight mb-0.5">
                    {award.title}
                  </h3>
                  <p className="text-gold-400/90 text-xs font-semibold tracking-wide">
                    {award.organization}
                  </p>
                </div>
                <span className="text-white text-sm font-medium tabular-nums shrink-0 bg-black/60 rounded-lg px-2 py-1">
                  {current + 1} / {AWARDS.length}
                </span>
              </div>
            </div>
          </div>

          {/* Info below image — mobile only */}
          <div className="sm:hidden mt-3 flex items-start justify-between gap-3 px-1">
            <div>
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-gold-500 border border-gold-500/40 rounded-full px-3 py-0.5 mb-1.5">
                {award.year}
              </span>
              <h3 className="text-luxury-50 font-extrabold text-base leading-tight mb-0.5">
                {award.title}
              </h3>
              <p className="text-gold-500/80 text-xs font-semibold tracking-wide">
                {award.organization}
              </p>
            </div>
            <span className="text-luxury-400 text-sm font-medium tabular-nums shrink-0 mt-0.5">
              {current + 1} / {AWARDS.length}
            </span>
          </div>

          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous award"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 hover:border-gold-500/60 flex items-center justify-center text-white hover:text-gold-400 transition-all duration-200 opacity-70 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Next award"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 hover:border-gold-500/60 flex items-center justify-center text-white hover:text-gold-400 transition-all duration-200 opacity-70 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="flex gap-3 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {AWARDS.map((a, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to award ${i + 1}`}
              className={`relative aspect-video w-24 sm:w-32 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 bg-luxury-800 ${
                i === current
                  ? "border-gold-500 opacity-100 shadow-lg shadow-gold-500/20"
                  : "border-luxury-700 opacity-50 hover:opacity-75 hover:border-luxury-500"
              }`}
            >
              <Image
                src={a.src}
                alt={a.title}
                fill
                sizes="128px"
                className="object-contain"
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
