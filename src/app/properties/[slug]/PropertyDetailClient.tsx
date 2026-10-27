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
  Phone,
  Send,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";
import { Property } from "@/types";
import { formatPriceExact, subdivisionName, unavailableLabel } from "@/lib/utils";
import { getLeadSource } from "@/lib/leadSource";
import PhoneInput from "@/components/ui/PhoneInput";
import PropertyCard from "@/components/ui/PropertyCard";
import { SITE_CONFIG } from "@/lib/constants";

interface Props {
  property: Property;
  similar: Property[];
  /** Slug of this development's hub page, when one exists. */
  subdivisionSlug?: string | null;
  /** Slug of this listing's town landing page, when one exists. */
  townSlug?: string | null;
}

export default function PropertyDetailClient({
  property,
  similar,
  subdivisionSlug,
  townSlug,
}: Props) {
  const offMarket = unavailableLabel(property);
  // Facebook-style titles end in "| Development, Town"; the header shows those
  // as links underneath, so the heading is just the model. <title>/OG keep the
  // full title.
  const shortTitle = property.title.split(" | ")[0];
  const development = property.subdivision ? subdivisionName(property.subdivision) : "";

  const sqm = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2)} sqm`;
  const specs = [
    property.bedrooms > 0 && { icon: Bed, value: String(property.bedrooms), label: property.bedrooms === 1 ? "Bedroom" : "Bedrooms" },
    property.bathrooms > 0 && { icon: Bath, value: String(property.bathrooms), label: property.bathrooms === 1 ? "Bathroom" : "Bathrooms" },
    property.area > 0 && { icon: Maximize2, value: sqm(property.area), label: "Floor area" },
    (property.lot_area ?? 0) > 0 && { icon: Maximize2, value: sqm(property.lot_area!), label: "Lot area" },
    (property.garage ?? 0) > 0 && { icon: Car, value: `${property.garage} ${property.garage === 1 ? "car" : "cars"}`, label: "Garage" },
  ].filter((x): x is { icon: typeof Bed; value: string; label: string } => Boolean(x));
  const [activeImage, setActiveImage] = useState(0);
  // Per photo: does its shape fill the 4:3 frame without losing content?
  const [fitsFrame, setFitsFrame] = useState<Record<string, boolean>>({});
  const activeSrc = property.images[activeImage];
  const fillsFrame = fitsFrame[activeSrc] ?? true;
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
  const honeypotRef = useRef<HTMLInputElement>(null);

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
          source: getLeadSource("listing"),
          company: honeypotRef.current?.value || "",
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
    if (Math.abs(delta) > 50) {
      if (delta < 0) nextImage();
      else prevImage();
    }
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
      {/* Breadcrumb + Share */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-luxury-400 min-w-0">
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
          <span className="text-luxury-50 truncate max-w-[200px] sm:max-w-md">
            {shortTitle}
          </span>
        </div>
        <button
          onClick={handleShare}
          className="shrink-0 flex items-center gap-2 text-luxury-400 hover:text-gold-500 text-sm font-medium transition-colors border border-luxury-700 hover:border-gold-500/50 rounded-lg px-4 h-10">
          <Share2 className="w-4 h-4" />
          {copied ? "Link Copied!" : "Share"}
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* LEFT: Images + Details */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {/* Image gallery — the same 4:3 frame on every listing. */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-luxury-800 border border-luxury-700">
                <button
                  onClick={openLightbox}
                  className="absolute inset-0 z-10 cursor-zoom-in group/zoom"
                  aria-label="View full size image"
                >
                  {/* Photos 4:3 or wider fill the frame. A square or portrait
                      flyer would lose its top and bottom (often the price) to
                      cropping, so those show whole over a blurred fill
                      instead. Same URL, so no extra download. */}
                  {!fillsFrame && (
                    <Image
                      src={activeSrc}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover scale-110 blur-2xl opacity-40"
                    />
                  )}
                  <Image
                    src={activeSrc}
                    alt={property.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className={fillsFrame ? "object-cover" : "object-contain"}
                    onLoad={(e) => {
                      const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                      // Wide photos only lose a little off the sides; square
                      // and tall flyers would lose their top and bottom.
                      const fits = w / h >= (4 / 3) * 0.85;
                      setFitsFrame((prev) => (prev[activeSrc] === fits ? prev : { ...prev, [activeSrc]: fits }));
                    }}
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
                  {(offMarket || property.type === "rent") && (
                    <span
                      className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg ${
                        offMarket
                          ? "bg-luxury-50 text-luxury-900"
                          : "bg-luxury-900/90 text-gold-500 border border-gold-500/50"
                      }`}>
                      {offMarket ?? "For Rent"}
                    </span>
                  )}
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
                      aria-label="Previous photo"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-luxury-900/80 backdrop-blur-sm border border-luxury-700 flex items-center justify-center text-luxury-50 hover:border-gold-500/50 hover:text-gold-500 transition-all z-10">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next photo"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-luxury-900/80 backdrop-blur-sm border border-luxury-700 flex items-center justify-center text-luxury-50 hover:border-gold-500/50 hover:text-gold-500 transition-all z-10">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 z-10 pointer-events-none bg-luxury-900/80 backdrop-blur-sm text-luxury-50 text-xs font-medium px-3 py-1.5 rounded-lg border border-luxury-700">
                    {activeImage + 1} / {property.images.length}
                  </div>
                )}
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
            </div>

            {/* Property details */}
            <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-5 sm:p-8">
              {/* Title, location and exact price — directly under the photos. */}
              <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 mb-6">
                <div className="min-w-0">
                  <h1 className="text-2xl font-display font-semibold text-luxury-50 leading-tight">
                    {shortTitle}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="flex items-center gap-1.5 text-luxury-400">
                      <MapPin className="w-4 h-4 text-gold-500 shrink-0" aria-hidden="true" />
                      {townSlug ? (
                        <Link
                          href={`/locations/${townSlug}`}
                          className="hover:text-gold-500 underline decoration-luxury-600 underline-offset-2 transition-colors">
                          {property.location}
                        </Link>
                      ) : (
                        property.location
                      )}
                    </span>
                    {development &&
                      (subdivisionSlug ? (
                        <Link
                          href={`/subdivisions/${subdivisionSlug}`}
                          className="text-gold-500 hover:text-gold-400 underline-offset-2 hover:underline">
                          {development} — see all units
                        </Link>
                      ) : (
                        <span className="text-luxury-400">{development}</span>
                      ))}
                  </div>
                </div>
                <p className="shrink-0 text-3xl font-black text-gold-500 leading-none tabular-nums">
                  {formatPriceExact(property.price, property.type)}
                </p>
              </header>
              {/* Specs — 2 per row on phones (an odd last item spans the row so
                  nothing is left orphaned), one row from sm up. */}
              {specs.length > 0 && (
                <ul className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mb-8">
                  {specs.map(({ icon: Icon, value, label }) => (
                    <li
                      key={label}
                      className="last:odd:col-span-2 sm:flex-1 sm:min-w-28 flex items-center gap-3 bg-luxury-900 border border-luxury-700 rounded-xl px-4 py-3.5">
                      <Icon className="w-5 h-5 text-gold-500 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-luxury-50 text-sm font-bold whitespace-nowrap">{value}</p>
                        <p className="text-luxury-400 text-xs">{label}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Description */}
              <div className="border-t border-luxury-700 pt-8">
                <h2 className="text-luxury-50 font-display text-2xl font-semibold mb-4">
                  About this property
                </h2>
                <p className="text-luxury-300 text-[15px] leading-[1.85] whitespace-pre-wrap max-w-2xl">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Video Tour — after the details: on a phone, buyers should see the
                price and specs before scrolling past a whole video. */}
            {property.video_url && (() => {
              const url = property.video_url;
              const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
              if (!ytMatch) return null;
              const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
              return (
                <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
                  <h2 className="px-6 py-4 border-b border-luxury-700 text-luxury-50 font-display text-xl font-semibold">
                    Video tour
                  </h2>
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

            {/* Google Maps */}
            <div className="bg-luxury-800 border border-luxury-700 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-luxury-700">
                <h2 className="text-luxury-50 font-display text-xl font-semibold truncate">
                  {property.subdivision || property.location}
                </h2>
                {property.subdivision && (
                  <div className="flex items-center gap-1.5 text-luxury-400 text-sm shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    {property.location}
                  </div>
                )}
              </div>
              <iframe
                src={property.map_url || `https://maps.google.com/maps?q=${encodeURIComponent([property.subdivision, property.location].filter(Boolean).join(", "))}&output=embed`}
                title={`Map of ${property.subdivision || property.location}`}
                width="100%"
                height="420"
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
            {/* Quick contact buttons — desktop only; phones have the fixed
                MobileContactBar, so showing these too was a duplicate. */}
            <div className="hidden lg:flex gap-3">
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

            {/* Off-market listings get no inquiry form — a lead asking about a
                unit that's gone just wastes a follow-up. Point them at what's
                still available instead; Call/Viber above stay for alternatives. */}
            {offMarket ? (
              <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6">
                <h3 className="text-luxury-50 text-lg font-bold mb-1">
                  This property has been {offMarket.toLowerCase()}
                </h3>
                <p className="text-luxury-400 text-xs mb-6">
                  Broker Shella may have similar units available — including
                  some not yet posted on the site.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/properties"
                    className="flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-6 py-3.5 rounded-lg tracking-wide transition-colors">
                    Browse available properties
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center border border-luxury-600 hover:border-gold-500/50 text-luxury-300 hover:text-gold-500 text-sm font-medium px-6 py-3.5 rounded-lg transition-all">
                    Ask about similar units
                  </Link>
                </div>
              </div>
            ) : (
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
                  {/* Honeypot — hidden from users, bait for bots; must stay empty */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                  />
                  <PhoneInput
                    onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
                    fieldClassName="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
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
                    <span className="text-luxury-400 text-xs leading-relaxed">
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
            )}

            {/* Broker card */}
            <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                {/* Her photo, not a letter avatar — buyers inquire with a person. */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold-500/30 shrink-0">
                  <Image
                    src="/shella.jpg"
                    alt="Broker Shella Castro"
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-luxury-50 font-bold text-sm">
                    Shella Castro
                  </p>
                  <p className="text-gold-500 text-xs tracking-widest uppercase">
                    Licensed Broker
                  </p>
                  <p className="text-luxury-400 text-xs mt-0.5">{SITE_CONFIG.prcLicense}</p>
                </div>
              </div>
              <p className="text-luxury-400 text-xs leading-relaxed">
                With 20+ years of experience in Bulacan and Luzon real
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
                <h2 className="text-2xl font-display font-semibold text-luxury-50">
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
