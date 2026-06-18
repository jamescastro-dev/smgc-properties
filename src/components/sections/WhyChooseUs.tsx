import Link from "next/link";
import {
  ShieldCheck,
  HandshakeIcon,
  MapPin,
  Clock,
  Award,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "PRC Licensed Broker",
    description:
      "Fully licensed and accredited by the Professional Regulation Commission. Your transaction is always legal and protected.",
  },
  {
    icon: Award,
    title: "Top Awarded Agent",
    description:
      "Consistent top seller and company awardee with over a decade of proven excellence in real estate.",
  },
  {
    icon: MapPin,
    title: "Local Market Expert",
    description:
      "Deep knowledge of Bulacan and Luzon property markets — pricing, trends, and the best locations for your budget.",
  },
  {
    icon: HandshakeIcon,
    title: "End-to-End Assistance",
    description:
      "From property search to contract signing and turnover, Broker Shella guides you through every step of the process.",
  },
  {
    icon: Clock,
    title: "Fast & Reliable",
    description:
      "Quick response times and no-nonsense communication. Your time is valuable and she respects that.",
  },
  {
    icon: HeartHandshake,
    title: "Client-First Approach",
    description:
      "Broker Shella listens to your needs first. The goal is not just a sale — it's finding the perfect home for your family.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-luxury-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* Left — heading (sticky on desktop) */}
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-8 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
                Why work with Broker Shella
              </span>
            </div>
            <h2 className="text-4xl lg:text-[2.75rem] font-display font-semibold text-luxury-50 tracking-tight leading-[1.1] mb-5">
              Why Choose Broker Shella?
            </h2>
            <p className="text-luxury-400 text-base leading-relaxed mb-8 max-w-md">
              With 20+ years of experience and hundreds of happy clients, Broker
              Shella delivers results you can trust.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-6 py-3.5 rounded-lg tracking-wide transition-colors">
              Book a Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — numbered reasons */}
          <div className="border-t border-luxury-700">
            {REASONS.map((reason, i) => (
              <div
                key={reason.title}
                className="group flex items-start gap-5 sm:gap-7 py-7 border-b border-luxury-700">
                <span className="font-display text-3xl text-luxury-500 group-hover:text-gold-500 transition-colors leading-none tabular-nums pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    <reason.icon className="w-4 h-4 text-gold-500 shrink-0" />
                    <h3 className="text-luxury-50 font-semibold text-lg group-hover:text-gold-500 transition-colors">
                      {reason.title}
                    </h3>
                  </div>
                  <p className="text-luxury-400 text-sm leading-relaxed max-w-xl">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
