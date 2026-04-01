"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, Phone, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLinkActive = (href: string) => {
    if (href === "/buy") return pathname === "/properties" && searchParams.get("listing") === "For Sale";
    if (href === "/rent") return pathname === "/properties" && searchParams.get("listing") === "For Rent";
    if (href === "/properties") return pathname === "/properties" && !searchParams.get("listing");
    return pathname === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-luxury-900 shadow-lg">
      {/* Top Bar — hidden on mobile */}
      <div className="hidden sm:block bg-luxury-800 border-b border-gold-500/20 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-luxury-400 text-xs tracking-widest uppercase">
            Licensed Real Estate Broker
          </p>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="flex items-center gap-1.5 text-luxury-400 text-xs hover:text-gold-500 transition-colors">
              <Phone className="w-3 h-3" />
              {SITE_CONFIG.phone}
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-1.5 text-luxury-400 text-xs hover:text-gold-500 transition-colors">
              <Mail className="w-3 h-3" />
              {SITE_CONFIG.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight group">
            <span className="text-luxury-50 text-xl font-bold tracking-wide group-hover:text-gold-500 transition-colors">
              {SITE_CONFIG.name}
            </span>
            <span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-medium">
              {SITE_CONFIG.subtitle}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors group ${isActive ? "text-gold-500" : "text-luxury-300 hover:text-luxury-50"}`}>
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-gold-500 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-luxury-900 text-sm font-bold px-5 py-2.5 rounded-sm tracking-wide transition-all duration-300">
              Free Consultation
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="text-luxury-50 hover:text-gold-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu">
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-luxury-800">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors ${isActive ? "text-gold-500" : "text-luxury-300 hover:text-gold-500"}`}
                    onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-luxury-900 text-sm font-bold px-5 py-2.5 rounded-sm tracking-wide text-center mt-2 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}>
                Free Consultation
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
