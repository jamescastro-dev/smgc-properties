"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { SITE_CONFIG, PROPERTY_TYPES as BASE_PROPERTY_TYPES } from "@/lib/constants";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const PROPERTY_TYPES = BASE_PROPERTY_TYPES.map((t) => ({
  label: t,
  href: `/properties?type=${encodeURIComponent(t)}`,
}));

export default function Footer() {
  return (
    <footer className="bg-luxury-900 border-t border-luxury-800">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col leading-tight mb-6">
              <span className="text-luxury-50 text-2xl font-bold tracking-wide">
                {SITE_CONFIG.name}
              </span>
              <span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-medium">
                {SITE_CONFIG.subtitle}
              </span>
            </Link>
            <p className="text-luxury-400 text-sm leading-relaxed mb-6">
              Your trusted licensed real estate broker in Bulacan and Metro
              Manila. Helping families find their dream home since 2004.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 flex items-center justify-center text-luxury-400 hover:text-gold-500 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 flex items-center justify-center text-luxury-400 hover:text-gold-500 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-luxury-50 text-sm font-bold tracking-widest uppercase mb-6">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-luxury-400 text-sm hover:text-gold-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property types */}
          <div>
            <h4 className="text-luxury-50 text-sm font-bold tracking-widest uppercase mb-6">
              Property Types
            </h4>
            <ul className="flex flex-col gap-3">
              {PROPERTY_TYPES.map((type) => (
                <li key={type.href}>
                  <Link
                    href={type.href}
                    className="text-luxury-400 text-sm hover:text-gold-500 transition-colors">
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-luxury-50 text-sm font-bold tracking-widest uppercase mb-6">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="flex items-start gap-3 text-luxury-400 text-sm hover:text-gold-500 transition-colors">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-start gap-3 text-luxury-400 text-sm hover:text-gold-500 transition-colors">
                  <Mail className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-luxury-400 text-sm">
                  <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  {SITE_CONFIG.address}
                </div>
              </li>
            </ul>

            {/* CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-8 bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-6 py-3 rounded-lg tracking-wide transition-colors">
              Free Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-luxury-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-luxury-500 text-xs">
            © {new Date().getFullYear()} SMGC Properties · Broker Shella Castro.
            All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-luxury-500">
            <span>Licensed Real Estate Broker · {SITE_CONFIG.prcLicense}</span>
            <Link href="/privacy" className="hover:text-gold-500 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
