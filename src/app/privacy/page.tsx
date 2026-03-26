import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | Broker Shella — SMGC Properties",
  description:
    "Learn how SMGC Properties collects, uses, and protects your personal information in accordance with the Data Privacy Act of 2012 (RA 10173).",
};

const SECTIONS = [
  {
    title: "1. Who We Are",
    content: `SMGC Properties, operating under Broker Shella (${SITE_CONFIG.prcLicense}), is a licensed real estate brokerage based in ${SITE_CONFIG.address}. We are the data controller responsible for your personal information collected through this website.`,
  },
  {
    title: "2. What Information We Collect",
    content: `When you submit an inquiry or contact form on this website, we collect the following personal information:

• Full name
• Phone number
• Email address (if provided)
• Your message and property preferences (location, budget, inquiry type)

We do not collect sensitive personal information as defined under RA 10173.`,
  },
  {
    title: "3. Why We Collect Your Information",
    content: `We collect your personal information solely for the following purposes:

• To respond to your property inquiries
• To provide you with property recommendations
• To contact you regarding your real estate needs
• To improve our services

Your information will not be used for any purpose other than those stated above without your consent.`,
  },
  {
    title: "4. How We Store and Protect Your Data",
    content: `Your personal information is stored securely using Supabase, a cloud-based database platform with industry-standard encryption and security measures. Access to your data is restricted to authorized personnel only (Broker Shella and authorized staff).

We retain your information only for as long as necessary to fulfill the purposes for which it was collected, or as required by law.`,
  },
  {
    title: "5. Sharing of Information",
    content: `We do not sell, trade, or share your personal information with third parties for marketing purposes. Your information may only be disclosed in the following circumstances:

• When required by law or by a government authority
• With your explicit consent

We do not transfer your data outside the Philippines without appropriate safeguards.`,
  },
  {
    title: "6. Your Rights Under RA 10173",
    content: `Under the Data Privacy Act of 2012, you have the following rights:

• Right to be informed — know how your data is being used
• Right to access — request a copy of your personal data we hold
• Right to correction — have inaccurate data corrected
• Right to erasure — request deletion of your personal data
• Right to object — withdraw consent and stop processing of your data
• Right to lodge a complaint — file a complaint with the National Privacy Commission (NPC)

To exercise any of these rights, contact us at the details below.`,
  },
  {
    title: "7. Cookies",
    content: `This website may use essential cookies to ensure proper functionality (e.g., theme preferences). We do not use tracking or advertising cookies. No personal data is collected through cookies.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date. Continued use of this website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "9. Contact Us",
    content: `If you have questions about this Privacy Policy or wish to exercise your data privacy rights, please contact us:

Broker Shella Castro
${SITE_CONFIG.prcLicense}
${SITE_CONFIG.address}
Phone: ${SITE_CONFIG.phone}
Email: ${SITE_CONFIG.email}

You may also file a complaint with the National Privacy Commission:
National Privacy Commission, Philippines
Website: www.privacy.gov.ph`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[89px]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-gold-500" />
            <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
              Legal
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-luxury-50 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-luxury-400 text-sm leading-relaxed">
            Effective date: March 2026. This policy applies to all personal information
            collected through{" "}
            <span className="text-luxury-300">brokershella.com</span> and is
            compliant with the{" "}
            <span className="text-luxury-300">
              Data Privacy Act of 2012 (Republic Act No. 10173)
            </span>{" "}
            of the Philippines.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="border-t border-luxury-800 pt-8">
              <h2 className="text-luxury-50 text-lg font-bold mb-4">
                {section.title}
              </h2>
              <p className="text-luxury-400 text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-luxury-800">
          <Link
            href="/"
            className="text-gold-500 hover:text-gold-400 text-sm font-semibold transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
