"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

// Newest first — the grid's first row is what most visitors see. Years are
// as printed on each certificate.
const AWARDS = [
  {
    title: "Vice President",
    organization: "PAREB – Bulacan Real Estate Board, Inc.",
    year: "2026",
    src: "/BRB-VicePresident-2026.jpg",
  },
  {
    title: "BPI Prime Partner",
    organization: "Bank of the Philippine Islands",
    year: "2026",
    src: "/BPI-Prime-Partner.jpg",
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
    title: "Secretary Recognition",
    organization: "PAREB – Bulacan Real Estate Board, Inc.",
    year: "2023 – 2025",
    src: "/BRB-Secretary-Recognition-2023-2025.jpg",
  },
  {
    title: "Top Real Estate Broker",
    organization: "Archer Realty & Development Corporation",
    year: "2024",
    src: "/Top-RealEstate-Broker-2024.jpg",
  },
  {
    title: "Top Loan Referrer",
    organization: "Bank of the Philippine Islands",
    year: "2022",
    src: "/Top-Loan-Referrer.jpg",
  },
  {
    title: "Top Sales Performer",
    organization: "Archer Realty & Development Corporation",
    year: "2020 – 2021",
    src: "/Top-Sales-Performer-2020-2021.jpg",
  },
];

/**
 * All awards at once — the old one-at-a-time carousel hid seven of eight
 * behind arrow clicks most visitors never make. Grid on tablet/desktop, a
 * swipeable row on phones (a 2-column grid of 8 was a full screen of
 * scrolling); any award opens full size in a lightbox.
 */
export default function AwardsCarousel({
  sectionClassName = "bg-luxury-900",
}: {
  sectionClassName?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(0);
  const n = AWARDS.length;
  const award = AWARDS[open];

  const show = (i: number) => {
    setOpen(i);
    dialog.current?.showModal();
  };
  const step = (d: number) => setOpen((i) => (i + d + n) % n);

  // Phone swipe row: which award is in view, so the counter shows there are 8.
  const [slide, setSlide] = useState(0);
  const onRowScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const row = e.currentTarget;
    const card = row.firstElementChild as HTMLElement;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    setSlide(atEnd ? n - 1 : Math.round(row.scrollLeft / (card.offsetWidth + 16)));
  };

  return (
    <section className={`${sectionClassName} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <div className="text-center mb-10">
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
            Recognized by developers, banks and the Bulacan real estate board
            across 20+ years in the industry.
          </p>
        </div>

        {/* ── Awards ── */}
        <ul
          onScroll={onRowScroll}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-px-4 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
          {AWARDS.map((a, i) => (
            <li key={a.src} className="shrink-0 w-[78%] sm:w-auto snap-start">
              <button
                type="button"
                onClick={() => show(i)}
                className="group w-full h-full flex flex-col text-left bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 rounded-2xl overflow-hidden transition-colors cursor-zoom-in">
                <span className="relative block w-full aspect-3/2 bg-luxury-900 overflow-hidden">
                  <Image
                    src={a.src}
                    alt={`${a.title} — ${a.organization}, ${a.year}`}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-luxury-900/80 backdrop-blur-sm border border-luxury-700 flex items-center justify-center text-luxury-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" aria-hidden="true" />
                  </span>
                </span>
                <span className="flex flex-col flex-1 p-4">
                  <span className="self-start text-[10px] font-bold tracking-[0.12em] uppercase text-luxury-900 bg-gold-500 rounded-full px-2.5 py-0.5 mb-2.5 tabular-nums">
                    {a.year}
                  </span>
                  <span className="font-display text-base font-semibold text-luxury-50 leading-snug">
                    {a.title}
                  </span>
                  <span className="text-luxury-400 text-xs mt-1 leading-snug">{a.organization}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Phones only: dots + "1 / 8" so visitors know to swipe. Visual hint
            only — screen readers already hear the list's item count. */}
        <div aria-hidden="true" className="sm:hidden mt-4 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5">
            {AWARDS.map((a, i) => (
              <span
                key={a.src}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? "w-5 bg-gold-500" : "w-1.5 bg-luxury-600"}`}
              />
            ))}
          </span>
          <span className="text-luxury-400 text-xs tabular-nums">
            {slide + 1} / {n} · swipe
          </span>
        </div>
      </div>

      {/* ── Lightbox ── native <dialog>: focus trap, Esc and backdrop for free. */}
      <dialog
        ref={dialog}
        aria-label={`${award.title}, ${award.year}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        className="m-auto p-0 bg-luxury-900/95 backdrop-blur-sm max-w-none max-h-none w-full h-full backdrop:bg-transparent">
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 px-4 py-16 pointer-events-none">
          <div className="relative w-full max-w-5xl h-[min(70vh,720px)] pointer-events-auto">
            <Image
              key={award.src}
              src={award.src}
              alt={`${award.title} — ${award.organization}, ${award.year}`}
              fill
              sizes="(max-width: 1100px) 92vw, 1024px"
              className="object-contain animate-fade-in"
            />
          </div>
          <div className="text-center pointer-events-auto">
            <span className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase text-luxury-900 bg-gold-500 rounded-full px-3 py-1 mb-2 tabular-nums">
              {award.year}
            </span>
            <p className="font-display text-xl sm:text-2xl font-semibold text-luxury-50 leading-tight">
              {award.title}
            </p>
            <p className="text-luxury-300 text-sm mt-1">{award.organization}</p>
            <p className="text-luxury-500 text-xs mt-2 tabular-nums">
              {open + 1} / {n}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label="Close"
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-luxury-800 border border-luxury-700 text-luxury-50 hover:text-gold-500 flex items-center justify-center transition-colors">
          <X className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous award"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-luxury-50 text-luxury-900 hover:bg-gold-500 flex items-center justify-center shadow-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next award"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-luxury-50 text-luxury-900 hover:bg-gold-500 flex items-center justify-center shadow-lg transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </dialog>
    </section>
  );
}
