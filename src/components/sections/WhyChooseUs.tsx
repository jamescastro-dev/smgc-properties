import {
  ShieldCheck,
  HandshakeIcon,
  MapPin,
  Clock,
  Award,
  HeartHandshake,
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
        {/* ── Why Choose Us ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-gold-500" />
            <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
              Why work with Broker Shella
            </span>
            <span className="w-8 h-px bg-gold-500" />
          </div>
          <h2 className="text-4xl font-extrabold text-luxury-50 tracking-tight mb-4">
            Why Choose Broker Shella?
          </h2>
          <p className="text-luxury-400 text-base max-w-xl mx-auto leading-relaxed">
            With over 10 years of experience and hundreds of happy clients,
            Broker Shella delivers results you can trust.
          </p>
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="group flex flex-col bg-luxury-900 border border-luxury-700 hover:border-gold-500/40 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5 group-hover:bg-gold-500/20 transition-colors">
                <reason.icon className="w-5 h-5 text-gold-500" />
              </div>
              <h3 className="text-luxury-50 font-bold text-base mb-2 group-hover:text-gold-500 transition-colors">
                {reason.title}
              </h3>
              <p className="text-luxury-400 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
