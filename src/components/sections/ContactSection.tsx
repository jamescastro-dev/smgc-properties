"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Send, CheckCircle, MessageCircle } from "lucide-react";
import { SITE_CONFIG, LOCATIONS as BASE_LOCATIONS } from "@/lib/constants";
import { LeadForm } from "@/types";

const LOCATIONS = ["Any Location", ...BASE_LOCATIONS] as const;

const BUDGET_RANGES = [
  "Any Budget",
  "Below ₱1M",
  "₱1M – ₱3M",
  "₱3M – ₱5M",
  "₱5M – ₱10M",
  "Above ₱10M",
] as const;

const INITIAL_FORM: LeadForm & { location: string; budget: string } = {
  name: "",
  phone: "",
  message: "",
  type: "buy",
  location: "Any Location",
  budget: "Any Budget",
};

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Phone",
    value: SITE_CONFIG.phone,
    href: `tel:${SITE_CONFIG.phone}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: MapPin,
    label: "Address",
    value: SITE_CONFIG.address,
    href: null,
  },
];

export default function ContactSection() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          company: honeypotRef.current?.value || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-luxury-800 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header (leads the section) ── */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-gold-500" />
            <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
              Get in touch
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-semibold text-luxury-50 tracking-tight leading-[1.1] mb-4">
            Get Free Property Recommendations
          </h2>
          <p className="text-luxury-400 text-base leading-relaxed max-w-2xl">
            Tell Broker Shella what you're looking for and she will find the
            best options for you in Bulacan and Luzon.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Info rail (right on desktop) ── */}
          <div className="lg:sticky lg:top-28 lg:order-2">
            {/* Agent */}
            <div className="flex items-center gap-4 mb-7">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold-500/30 shrink-0">
                <Image
                  src="/shella.jpg"
                  alt="Broker Shella Castro"
                  fill
                  sizes="64px"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div>
                <p className="text-luxury-50 font-semibold text-base leading-tight">
                  Shella Castro
                </p>
                <p className="text-gold-500 text-[11px] tracking-widest uppercase font-semibold mt-1">
                  Licensed Broker · {SITE_CONFIG.prcLicense}
                </p>
              </div>
            </div>
            {/* Quick actions — Call + Viber */}
            <div className="flex gap-3">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-luxury-900 font-bold px-5 py-3.5 rounded-lg tracking-wide transition-colors">
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={`viber://chat?number=${SITE_CONFIG.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-luxury-900 font-bold px-5 py-3.5 rounded-lg tracking-wide transition-all duration-300">
                <MessageCircle className="w-4 h-4" />
                Viber
              </a>
            </div>

            {/* Contact methods */}
            <div className="flex flex-col divide-y divide-luxury-700 border-y border-luxury-700 mt-8">
              {CONTACT_INFO.map((item) => (
                <div key={item.label} className="flex items-center gap-4 py-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/25 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-luxury-400 text-[11px] tracking-widest uppercase font-semibold mb-0.5">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-luxury-50 text-sm font-medium hover:text-gold-500 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-luxury-50 text-sm font-medium">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8">
              {[
                "20+ Years Experience",
                "1000+ Properties Sold",
                "PRC Licensed Broker",
              ].map((signal) => (
                <div
                  key={signal}
                  className="flex items-center gap-2 text-xs text-gold-500 font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  {signal}
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3 bg-gold-500/10 border border-gold-500/25 rounded-xl px-4 py-3 mt-8">
              <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0" />
              <p className="text-luxury-300 text-xs leading-relaxed">
                <span className="text-luxury-50 font-semibold">Available now</span>{" "}
                · Mon–Sat, 6AM–8PM · replies within 24 hours
              </p>
            </div>

          </div>

          {/* ── Form (left on desktop) ── */}
          <div className="flex flex-col gap-5 lg:order-1">
            <div className="bg-luxury-900 border border-luxury-700/60 rounded-2xl p-7 sm:p-8 shadow-xl shadow-black/20">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-luxury-50 text-2xl font-bold mb-3">
                  You're All Set!
                </h3>
                <p className="text-luxury-400 text-sm max-w-sm leading-relaxed mb-8">
                  Thank you for reaching out. Broker Shella will contact you
                  within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-gold-500 text-sm font-semibold hover:text-gold-400 transition-colors">
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                      Full Name <span className="text-gold-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Juan dela Cruz"
                      className="bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                      Phone Number <span className="text-gold-500">*</span>
                    </label>
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
                      className="bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Inquiry type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                    I want to
                  </label>
                  <div className="flex gap-2">
                    {(["buy", "sell", "rent"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, type: t }))
                        }
                        className={`flex-1 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                          form.type === t
                            ? "bg-gold-500 text-luxury-900 border border-gold-500"
                            : "bg-luxury-800 text-luxury-400 border border-luxury-700 hover:border-gold-500/50 hover:text-gold-500"
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location + Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                      Preferred Location
                    </label>
                    <div className="relative">
                      <select
                        name="location"
                        aria-label="Preferred location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 text-sm outline-none appearance-none transition-colors pr-10">
                        {LOCATIONS.map((loc) => (
                          <option
                            key={loc}
                            value={loc}
                            className="bg-luxury-800 text-luxury-50">
                            {loc}
                          </option>
                        ))}
                      </select>
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                      Budget Range
                    </label>
                    <div className="relative">
                      <select
                        name="budget"
                        aria-label="Budget range"
                        value={form.budget}
                        onChange={handleChange}
                        className="w-full bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 text-sm outline-none appearance-none transition-colors pr-10">
                        {BUDGET_RANGES.map((b) => (
                          <option
                            key={b}
                            value={b}
                            className="bg-luxury-800 text-luxury-50">
                            {b}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500 text-xs font-bold pointer-events-none">
                        ₱
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell Broker Shella what you're looking for…"
                    className="bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-lg px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors resize-none"
                  />
                </div>

                {/* Consent */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-gold-500 shrink-0"
                  />
                  <span className="text-luxury-400 text-xs leading-relaxed">
                    I agree to be contacted by Broker Shella regarding my inquiry. My personal information will be handled in accordance with the{" "}
                    <Link href="/privacy" className="text-gold-500 hover:text-gold-400 underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {/* Submit */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading || !consent}
                  className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-70 disabled:cursor-not-allowed text-luxury-900 text-sm font-bold px-8 py-4 rounded-lg tracking-wide transition-colors duration-300">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-luxury-900/30 border-t-luxury-900 rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Get Free Recommendations
                    </>
                  )}
                </button>
              </form>
            )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
