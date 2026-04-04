"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Star,
  Share2,
  ArrowLeft,
  Phone,
  Send,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";
import { Property } from "@/types";
import { formatPrice } from "@/lib/utils";
import PropertyCard from "@/components/ui/PropertyCard";
import { SITE_CONFIG } from "@/lib/constants";

interface Props {
  property: Property;
  similar: Property[];
}

export default function PropertyDetailClient({ property, similar }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: `I'm interested in ${property.title}. Please contact me.`,
  });
  const [consent, setConsent] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInquiryError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          type: "buy",
          location: property.location,
          property_id: property.id,
          property_name: property.title,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setInquiryError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setInquiryError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const prevImage = useCallback(
    () =>
      setActiveImage((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1,
      ),
    [property.images.length],
  );

  const nextImage = useCallback(
    () =>
      setActiveImage((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1,
      ),
    [property.images.length],
  );

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  // Touch swipe state for lightbox
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) delta < 0 ? nextImage() : prevImage();
    touchStartX.current = null;
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, prevImage, nextImage]);

  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[89px]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-xs text-luxury-400">
          <Link href="/" className="hover:text-gold-500 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/properties"
            className="hover:text-gold-500 transition-colors">
            Properties
          </Link>
          <span>/</span>
          <span className="text-luxury-50 truncate max-w-[200px]">
            {property.title}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Back button + Share */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/properties"
            className="flex items-center gap-2 text-luxury-400 hover:text-gold-500 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-luxury-400 hover:text-gold-500 text-sm font-medium transition-colors border border-luxury-700 hover:border-gold-500/50 rounded-lg px-4 py-2">
            <Share2 className="w-4 h-4" />
            {copied ? "Link Copied!" : "Share"}
          </button>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* LEFT: Images + Details */}
          <div className="flex flex-col gap-8">
            {/* Image gallery */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-luxury-800 border border-luxury-700">
              <button
                onClick={openLightbox}
                className="absolute inset-0 z-10 cursor-zoom-in group/zoom"
                aria-label="View full size image"
              >
                <Image
                  src={property.images[activeImage]}
                  alt={property.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
                {/* Zoom hint — always visible on mobile, hover-only on desktop */}
                <span className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-luxury-900/80 backdrop-blur-sm text-luxury-300 text-xs px-3 py-1.5 rounded-lg border border-luxury-700 opacity-100 lg:opacity-0 lg:group-hover/zoom:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Click</span>
                  <span className="sm:hidden">Tap</span>
                  &nbsp;to expand
                </span>
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg ${
                    property.type === "sale"
                      ? "bg-gold-500 text-luxury-900"
                      : "bg-luxury-900 text-gold-500 border border-gold-500/50"
                  }`}>
                  For {property.type === "sale" ? "Sale" : "Rent"}
                </span>
                {property.featured && (
                  <span className="flex items-center gap-1.5 bg-luxury-900/90 backdrop-blur-sm text-gold-500 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border border-gold-500/30">
                    <Star className="w-3 h-3 fill-gold-500" />
                    Featured
                  </span>
                )}
              </div>

              {/* Navigation arrows — only show if multiple images */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-luxury-900/80 backdrop-blur-sm border border-luxury-700 flex items-center justify-center text-luxury-50 hover:border-gold-500/50 hover:text-gold-500 transition-all z-10">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-luxury-900/80 backdrop-blur-sm border border-luxury-700 flex items-center justify-center text-luxury-50 hover:border-gold-500/50 hover:text-gold-500 transition-all z-10">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-luxury-900/80 backdrop-blur-sm text-luxury-50 text-xs font-medium px-3 py-1.5 rounded-lg border border-luxury-700">
                {activeImage + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnail strip */}
            {property.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-gold-500"
                        : "border-luxury-700 hover:border-gold-500/50"
                    }`}>
                    <Image
                      src={img}
                      alt={`Photo ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Video Tour */}
            {property.video_url && (() => {
              const url = property.video_url;
              const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
              if (!ytMatch) return null;
              const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
              return (
                <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
                  <div className="relative aspect-video">
                    <iframe
                      src={embedUrl}
                      title="Property Video Tour"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              );
            })()}

            {/* Property details */}
            <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-8">
              {/* Title + Price */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-luxury-50 leading-tight mb-2">
                    {property.title}
                  </h1>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-luxury-400 text-sm">
                      <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                      {property.location}
                    </div>
                    {property.subdivision && (
                      <p className="text-luxury-500 text-xs pl-6">
                        {property.subdivision}
                      </p>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="text-3xl font-black text-gold-500 leading-none">
                    {formatPrice(property.price, property.type)}
                  </p>
                  {property.type === "rent" && (
                    <p className="text-luxury-400 text-xs mt-1 text-right">
                      per month
                    </p>
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap gap-3 mb-8">
                {property.bedrooms > 0 && (
                  <div className="flex flex-col items-center gap-2 bg-luxury-900 border border-luxury-700 rounded-xl py-4 flex-1 min-w-20">
                    <Bed className="w-5 h-5 text-gold-500" />
                    <p className="text-luxury-50 text-sm font-bold">
                      {property.bedrooms}
                    </p>
                    <p className="text-luxury-400 text-xs">{property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</p>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex flex-col items-center gap-2 bg-luxury-900 border border-luxury-700 rounded-xl py-4 flex-1 min-w-20">
                    <Bath className="w-5 h-5 text-gold-500" />
                    <p className="text-luxury-50 text-sm font-bold">
                      {property.bathrooms}
                    </p>
                    <p className="text-luxury-400 text-xs">{property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}</p>
                  </div>
                )}
                {property.area > 0 && (
                  <div className="flex flex-col items-center gap-2 bg-luxury-900 border border-luxury-700 rounded-xl py-4 flex-1 min-w-20">
                    <Maximize2 className="w-5 h-5 text-gold-500" />
                    <p className="text-luxury-50 text-sm font-bold">
                      {Number.isInteger(property.area) ? property.area : property.area.toFixed(2)}
                    </p>
                    <p className="text-luxury-400 text-xs">sqm</p>
                  </div>
                )}
                {(property.garage ?? 0) > 0 && (
                  <div className="flex flex-col items-center gap-2 bg-luxury-900 border border-luxury-700 rounded-xl py-4 flex-1 min-w-20">
                    <Car className="w-5 h-5 text-gold-500" />
                    <p className="text-luxury-50 text-sm font-bold">
                      {property.garage}
                    </p>
                    <p className="text-luxury-400 text-xs">Garage</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-luxury-50 text-lg font-bold mb-3">
                  About this property
                </h2>
                <p className="text-luxury-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-luxury-700">
                <h2 className="text-luxury-50 text-lg font-bold">Location</h2>
                <div className="flex items-center gap-1.5 text-luxury-400 text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />
                  {property.location}
                </div>
              </div>
              <iframe
                src={property.map_url || `https://maps.google.com/maps?q=${encodeURIComponent([property.subdivision, property.location].filter(Boolean).join(", "))}&output=embed`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>

          {/* RIGHT: Sticky inquiry form */}
          <div className="lg:sticky lg:top-[97px] lg:max-h-[calc(100vh-97px)] lg:overflow-y-auto h-fit flex flex-col gap-6 scrollbar-hide">
            {/* Quick contact buttons */}
            <div className="flex gap-3">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-luxury-900 font-bold py-3.5 rounded-xl transition-colors text-sm">
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={`viber://chat?number=${SITE_CONFIG.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-luxury-900 font-bold py-3.5 rounded-xl transition-all text-sm">
                Viber
              </a>
            </div>

            {/* Inquiry form */}
            <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6">
              <h3 className="text-luxury-50 text-lg font-bold mb-1">
                Inquire About This Property
              </h3>
              <p className="text-luxury-400 text-xs mb-6">
                Send a message and Broker Shella will get back to you within 24
                hours.
              </p>

              {submitted ? (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-gold-500" />
                  </div>
                  <p className="text-luxury-50 font-bold mb-1">Inquiry Sent!</p>
                  <p className="text-luxury-400 text-xs mb-4">
                    Expect a reply within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-gold-500 text-xs hover:text-gold-400 transition-colors">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                      setForm((prev) => ({ ...prev, phone: digits }));
                    }}
                    required
                    pattern="\d{11}"
                    inputMode="numeric"
                    placeholder="09XXXXXXXXX"
                    className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                  />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={`I'm interested in ${property.title}. Please contact me.`}
                    className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors resize-none"
                  />
                  {/* Consent */}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-gold-500 shrink-0"
                    />
                    <span className="text-luxury-500 text-xs leading-relaxed">
                      I agree to be contacted regarding this inquiry. See the{" "}
                      <Link href="/privacy" className="text-gold-500 hover:text-gold-400 underline underline-offset-2">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  {inquiryError && (
                    <p className="text-red-400 text-xs">{inquiryError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !consent}
                    className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-70 disabled:cursor-not-allowed text-luxury-900 text-sm font-bold px-6 py-3.5 rounded-lg tracking-wide transition-colors">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-luxury-900/30 border-t-luxury-900 rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Broker card */}
            <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                  <span className="text-gold-500 font-bold text-lg">S</span>
                </div>
                <div>
                  <p className="text-luxury-50 font-bold text-sm">
                    Shella Castro
                  </p>
                  <p className="text-gold-500 text-xs tracking-widest uppercase">
                    Licensed Broker
                  </p>
                </div>
              </div>
              <p className="text-luxury-400 text-xs leading-relaxed">
                With 20+ years of experience in Bulacan and Metro Manila real
                estate, Broker Shella will guide you through every step.
              </p>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-8 h-px bg-gold-500" />
                  <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
                    You might also like
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-luxury-50">
                  Similar Properties
                </h2>
              </div>
              <Link
                href="/properties"
                className="text-gold-500 hover:text-gold-400 text-sm font-semibold transition-colors">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          onClick={closeLightbox}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white/70 text-sm font-medium">
              {activeImage + 1} / {property.images.length}
            </div>
            <button
              onClick={closeLightbox}
              className="w-10 h-10 rounded-full bg-white/10 active:bg-white/20 flex items-center justify-center text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image area — swipeable */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={property.images[activeImage]}
              alt={property.title}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />

            {/* Prev / Next — hidden on mobile (swipe instead), visible on sm+ */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip + swipe hint */}
          <div
            className="shrink-0 pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Swipe hint on mobile */}
            {property.images.length > 1 && (
              <p className="sm:hidden text-center text-white/40 text-xs pb-2">
                Swipe left or right to navigate
              </p>
            )}

            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-4 pb-4 justify-start sm:justify-center">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-gold-500"
                        : "border-white/20 active:border-white/50"
                    }`}
                  >
                    <Image src={img} alt={`Photo ${i + 1}`} fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
