import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Trophy,
  Award,
  Users,
  Home,
  KeyRound,
  FileText,
  Landmark,
  ArrowRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import AwardsCarousel from "@/components/sections/AwardsCarousel";

export const metadata: Metadata = {
  title: "About Broker Shella | SMGC Properties",
  description:
    "Learn about Broker Shella Castro — a licensed real estate broker with 10+ years of experience helping families find their dream homes in Bulacan and Metro Manila.",
};

const STATS = [
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Properties Sold" },
];

const AWARD_BADGES = [
  { icon: BadgeCheck, label: "PRC Licensed" },
  { icon: Trophy,    label: "Top Seller"   },
  { icon: Award,     label: "Company Awardee" },
];

const SERVICES = [
  {
    icon: Home,
    title: "Property Buying",
    description:
      "Find the perfect home within your budget. Broker Shella handles the search, negotiations, and paperwork for you.",
  },
  {
    icon: KeyRound,
    title: "Property Selling",
    description:
      "Get the best value for your property with proven marketing strategies and a wide network of buyers.",
  },
  {
    icon: Users,
    title: "Property Rental",
    description:
      "Whether you're looking to rent or lease out your property, Broker Shella connects the right tenants and landlords.",
  },
  {
    icon: FileText,
    title: "Documentation",
    description:
      "Full assistance with titles, contracts, deed of sale, and all legal documents needed for your transaction.",
  },
  {
    icon: Landmark,
    title: "Bank Loan Assistance",
    description:
      "Broker Shella guides you through bank financing options, loan applications, and connects you with lenders to secure the best rates for your property.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[89px]">

      {/* ── Hero ── */}
      <section className="relative bg-luxury-900 py-16 lg:py-20 overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-gold-500) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold-500) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-900/60 via-transparent to-luxury-900 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 xl:gap-20 items-center">

            {/* Left: Text */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2.5 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-gold-500 text-[11px] tracking-[0.15em] uppercase font-semibold">
                  About Broker Shella
                </span>
              </div>
              <h1 className="text-[clamp(2.2rem,4vw,3.25rem)] font-extrabold text-luxury-50 leading-[1.08] tracking-tight mb-5">
                A Broker Who Truly{" "}
                <span className="text-gold-500">Cares</span>
              </h1>
              <p className="text-luxury-400 text-base max-w-xl mb-8 leading-relaxed">
                With over 20 years of experience in the real estate industry,
                Broker Shella Castro has helped hundreds of Filipino families
                find their dream homes across{" "}
                <span className="text-luxury-50 font-medium">Bulacan</span> and{" "}
                <span className="text-luxury-50 font-medium">Metro Manila</span>.
              </p>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-10">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center lg:items-start">
                    <p className="text-[2rem] font-black text-luxury-50 leading-none mb-1 tabular-nums">
                      {stat.value}
                    </p>
                    <p className="text-gold-500 text-[11px] tracking-[0.12em] uppercase font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Photo — matches hero style */}
            <div className="flex flex-col items-center gap-4 lg:items-end">
              <div className="relative w-full max-w-72 sm:max-w-sm lg:max-w-110">

                {/* Depth shadow — desktop only */}
                <div
                  className="hidden lg:block absolute -bottom-3 -right-3 w-full rounded-3xl bg-luxury-700 pointer-events-none"
                  style={{ aspectRatio: "3/4", zIndex: 0 }}
                />

                {/* Photo card */}
                <div className="relative w-full rounded-3xl overflow-hidden border border-luxury-700 z-10">
                  <div className="relative w-full aspect-3/4">
                    <Image
                      src="/shella.jpg"
                      alt="Broker Shella Castro - Licensed Real Estate Broker"
                      fill
                      sizes="(max-width: 768px) 90vw, 440px"
                      className="object-cover object-[center_top]"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none bg-linear-to-t from-luxury-900 to-transparent" />
                  </div>

                  {/* Name card overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                    <div className="bg-luxury-800/90 backdrop-blur-md border border-luxury-700 rounded-2xl px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-luxury-50 text-xl font-bold tracking-tight leading-none mb-1">
                          Broker Shella
                        </p>
                        <p className="text-gold-500 text-[11px] tracking-[0.15em] uppercase font-semibold">
                          SMGC Properties
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-4 h-4 text-gold-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating award badges — desktop only */}
                <div className="hidden lg:flex absolute -right-3 top-6 flex-col gap-2.5 z-20">
                  {AWARD_BADGES.map((badge) => (
                    <div
                      key={badge.label}
                      className="flex items-center gap-2 bg-luxury-800 border border-luxury-700 rounded-xl px-3.5 py-2.5"
                    >
                      <badge.icon className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span className="text-luxury-50 text-[11px] font-semibold whitespace-nowrap tracking-wide">
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Availability chip — desktop only */}
                <div className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 bg-luxury-800 border border-luxury-700 rounded-2xl px-4 py-3 z-20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                    <span className="text-gold-500 text-[10px] font-bold tracking-widest uppercase">
                      Available Now
                    </span>
                  </div>
                  <p className="text-luxury-400 text-[10px] leading-snug max-w-22.5">
                    Ready to help you find your home
                  </p>
                </div>
              </div>

              {/* Award badges row — mobile only */}
              <div className="flex lg:hidden items-center justify-center gap-2 flex-wrap">
                {AWARD_BADGES.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 bg-luxury-800 border border-luxury-700 rounded-xl px-3.5 py-2"
                  >
                    <badge.icon className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span className="text-luxury-50 text-[11px] font-semibold tracking-wide">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Personal Message ── */}
      <section className="bg-luxury-800 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-luxury-900 border border-luxury-700 rounded-3xl p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute top-8 left-8 text-gold-500/10 text-[120px] font-serif leading-none select-none">
              &ldquo;
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-8">
                <span className="w-8 h-px bg-gold-500" />
                <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
                  A message from Shella
                </span>
              </div>
              <blockquote className="text-luxury-50 text-xl sm:text-2xl font-medium leading-relaxed mb-8 italic">
                &ldquo;My goal has never been just to close a deal. It&rsquo;s to make sure
                that every family I work with ends up in a home that truly fits
                their needs, their budget, and their dreams. That&rsquo;s what gets me
                up every morning.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500/30 shrink-0 relative">
                  <Image
                    src="/shella.jpg"
                    alt="Broker Shella Castro"
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-luxury-50 font-bold">Shella Castro</p>
                  <p className="text-gold-500 text-xs tracking-widest uppercase">
                    Licensed Real Estate Broker
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Awards ── */}
      <AwardsCarousel />

      {/* ── Services ── */}
      <section className="bg-luxury-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
                What Broker Shella offers
              </span>
              <span className="w-8 h-px bg-gold-500" />
            </div>
            <h2 className="text-4xl font-extrabold text-luxury-50 tracking-tight mb-4">
              Services Offered
            </h2>
            <p className="text-luxury-400 text-base max-w-xl mx-auto leading-relaxed">
              From finding the perfect property to completing all the paperwork
              — she handles it all.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group flex flex-col bg-luxury-900 border border-luxury-700 hover:border-gold-500/40 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5 group-hover:bg-gold-500/20 transition-colors">
                  <service.icon className="w-5 h-5 text-gold-500" />
                </div>
                <h3 className="text-luxury-50 font-bold text-base mb-2 group-hover:text-gold-500 transition-colors">
                  {service.title}
                </h3>
                <p className="text-luxury-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-luxury-900 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-luxury-50 tracking-tight mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-luxury-400 text-base leading-relaxed mb-10">
            Let Broker Shella guide you through every step of the process. Free
            consultation, no obligations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-8 py-4 rounded-lg tracking-wide transition-colors"
            >
              Book a Free Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/properties"
              className="flex items-center gap-2 border border-luxury-600 hover:border-gold-500 text-luxury-50 hover:text-gold-500 text-sm font-bold px-8 py-4 rounded-lg tracking-wide transition-all duration-300"
            >
              Browse Properties
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="text-luxury-400 text-sm hover:text-gold-500 transition-colors"
            >
              {SITE_CONFIG.phone}
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-luxury-400 text-sm hover:text-gold-500 transition-colors"
            >
              {SITE_CONFIG.email}
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
