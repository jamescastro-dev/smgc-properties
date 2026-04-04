"use client";

import Link from "next/link";
import { useRef, useEffect, useCallback } from "react";

const SUBDIVISIONS = [
  "St. Agatha Homes",
  "Evara Residences",
  "Santa Clara",
  "Alegria",
  "Amihana",
  "SMDC",
  "Plaridel Heights",
  "Robinsons Homes",
  "Serene Townhomes",
  "Cross Roads","SMDC",
  "Polaris",
  "Camella",
  "Asian Land",
  "DMCI Homes",
  "Demeterland",
  "Filinvest Land",
  "Avida",
  "Landco Pacific",
  "MiraVerde",
  "Amaia",
  "Manhattan Residences",
];

export default function AccreditedDevelopers() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const xRef = useRef(0);
  const halfWidthRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0 });
  const pausedRef = useRef(false);
  const didDragRef = useRef(false);

  const tick = useCallback(() => {
    const el = trackRef.current;
    if (el) {
      if (halfWidthRef.current === 0) {
        halfWidthRef.current = el.scrollWidth / 2;
      }
      if (!pausedRef.current && halfWidthRef.current > 0) {
        const speed = window.innerWidth < 640 ? 0.55 : 0.4;
        xRef.current += speed;
        if (xRef.current >= halfWidthRef.current) {
          xRef.current = 0;
        }
        el.style.transform = `translateX(-${xRef.current}px)`;
      }
    }
    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick]);

  const onDragStart = (clientX: number) => {
    pausedRef.current = true;
    didDragRef.current = false;
    dragRef.current = { active: true, startX: clientX, startOffset: xRef.current };
  };

  const onDragMove = (clientX: number) => {
    if (!dragRef.current.active || !trackRef.current) return;
    if (Math.abs(clientX - dragRef.current.startX) > 5) didDragRef.current = true;
    const half = halfWidthRef.current;
    let next = dragRef.current.startOffset - (clientX - dragRef.current.startX);
    if (next < 0) next = half + next;
    if (next >= half) next = next - half;
    xRef.current = next;
    trackRef.current.style.transform = `translateX(-${xRef.current}px)`;
  };

  const onDragEnd = () => {
    dragRef.current.active = false;
    pausedRef.current = false;
  };

  return (
    <section className="bg-luxury-800 border-y border-luxury-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <div className="inline-flex items-center gap-2">
          <span className="w-8 h-px bg-gold-500" />
          <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
            Partnered Subdivisions
          </span>
          <span className="w-8 h-px bg-gold-500" />
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-linear-to-r from-luxury-800 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-linear-to-l from-luxury-800 to-transparent pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform cursor-grab active:cursor-grabbing select-none py-1"
        >
          {[...SUBDIVISIONS, ...SUBDIVISIONS].map((name, i) => (
            <Link
              key={i}
              href={`/properties?keyword=${encodeURIComponent(name)}`}
              onClick={(e) => { if (didDragRef.current) e.preventDefault(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-luxury-700 bg-luxury-900 text-luxury-300 text-sm font-medium tracking-wide shrink-0 hover:border-gold-500/50 hover:text-gold-500 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
              {name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
