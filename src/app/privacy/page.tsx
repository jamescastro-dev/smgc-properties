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
    title: "1. Who I Am",
    content: `SMGC Properties, operating under Broker Shella (${SITE_CONFIG.prcLicense}), is a licensed real estate brokerage based in ${SITE_CONFIG.address}. Broker Shella is the data controller responsible for your personal information collected through this website.`,
  },
  {
    title: "2. What Information Is Collected",
    content: `When you submit an inquiry or contact form on this website, the following personal information is collected:

• Full name
• Phone number
• Email address (if provided)
• Your message and property preferences (location, budget, inquiry type)

Sensitive personal information as defined under RA 10173 is not collected.`,
  },
  {
    title: "3. Why Your Information Is Collected",
    content: `Your personal information is collected solely for the following purposes:

• To respond to your property inquiries
• To provide you with property recommendations
• To contact you regarding your real estate needs
• To improve the service provided

Your information will not be used for any purpose other than those stated above without your consent.`,
  },
  {
    title: "4. How Your Data Is Stored and Protected",
    content: `Your personal information is stored securely using Supabase, a cloud-based database platform with industry-standard encryption and security measures. Access to your data is restricted to Broker Shella only.

Your information is retained only for as long as necessary to fulfill the purposes for which it was collected, or as required by law.`,
  },
  {
    title: "5. Sharing of Information",
    content: `Your personal information is never sold, traded, or shared with third parties for marketing purposes. Your information may only be disclosed in the following circumstances:

• When required by law or by a government authority
• With your explicit consent

Your data will not be transferred outside the Philippines without appropriate safeguards.`,
  },
  {
    title: "6. Your Rights Under RA 10173",
    content: `Under the Data Privacy Act of 2012, you have the following rights:

• Right to be informed — know how your data is being used
• Right to access — request a copy of your personal data on file
• Right to correction — have inaccurate data corrected
• Right to erasure — request deletion of your personal data
• Right to object — withdraw consent and stop processing of your data
• Right to lodge a complaint — file a complaint with the National Privacy Commission (NPC)

To exercise any of these rights, contact Broker Shella at the details below.`,
  },
  {
    title: "7. Cookies",
    content: `This website may use essential cookies to ensure proper functionality (e.g., theme preferences). Tracking or advertising cookies are not used. No personal data is collected through cookies.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `This Privacy Policy may be updated from time to time. Any changes will be posted on this page with the updated effective date. Continued use of this website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "9. Contact",
    content: `If you have questions about this Privacy Policy or wish to exercise your data privacy rights, please reach out:

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
            <span className="text-luxury-300">smgcproperties.com</span> and is
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
