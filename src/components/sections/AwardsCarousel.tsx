"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ── Replace src with your own landscape images when ready ── */
const AWARDS = [
  {
    title: "PRC Licensed Broker",
    organization: "Professional Regulation Commission",
    year: "Since 2014",
    src: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=1400&q=80",
  },
  {
    title: "Top Seller Award",
    organization: "SMGC Properties",
    year: "2019 – 2024",
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80",
  },
  {
    title: "Best Agent of the Year",
    organization: "SMGC Properties",
    year: "2022",
    src: "https://images.unsplash.com/photo-1560472355-536de3962603?w=1400&q=80",
  },
  {
    title: "5-Star Client Rating",
    organization: "Client Reviews",
    year: "2020 – 2024",
    src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=80",
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
          {/* Landscape image — 16 / 9 */}
          <div
            key={current}
            className="relative aspect-video rounded-2xl overflow-hidden bg-luxury-800 animate-fade-in"
          >
            <Image
              src={award.src}
              alt={award.title}
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-cover"
              priority
            />

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-luxury-900/90 via-luxury-900/20 to-transparent" />

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-gold-500 bg-luxury-900/80 backdrop-blur-sm border border-gold-500/30 rounded-full px-3 py-1 mb-3">
                    {award.year}
                  </span>
                  <h3 className="text-luxury-50 font-extrabold text-xl sm:text-2xl mb-1">
                    {award.title}
                  </h3>
                  <p className="text-gold-500/80 text-sm font-semibold tracking-wide">
                    {award.organization}
                  </p>
                </div>
                <span className="text-luxury-400 text-sm font-medium tabular-nums shrink-0">
                  {current + 1} / {AWARDS.length}
                </span>
              </div>
            </div>
          </div>

          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous award"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-luxury-900/80 backdrop-blur-sm border border-luxury-700 hover:border-gold-500/50 flex items-center justify-center text-luxury-300 hover:text-gold-500 transition-all duration-200 opacity-70 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Next award"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-luxury-900/80 backdrop-blur-sm border border-luxury-700 hover:border-gold-500/50 flex items-center justify-center text-luxury-300 hover:text-gold-500 transition-all duration-200 opacity-70 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="flex gap-3 mt-4 justify-center flex-wrap">
          {AWARDS.map((a, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to award ${i + 1}`}
              className={`relative aspect-video w-24 sm:w-32 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 ${
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
                className="object-cover"
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
