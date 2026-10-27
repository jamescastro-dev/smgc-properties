import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Home, Banknote, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import {
  getSubdivisions,
  getSubdivisionBySlug,
} from "@/lib/supabase/properties";
import { formatPriceCompact, propertySlug } from "@/lib/utils";
import PropertyCard from "@/components/ui/PropertyCard";
import { pageMetadata } from "@/lib/seo";
import MobileContactBar from "@/components/layout/MobileContactBar";
import type { Subdivision } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = "https://www.smgcproperties.com";

export const revalidate = 60;

export async function generateStaticParams() {
  const subdivisions = await getSubdivisions();
  return subdivisions.map((s) => ({ slug: s.slug }));
}

/** "Malolos, Bulacan" + "Guiguinto, Bulacan" → "Malolos and Guiguinto, Bulacan" */
function locationLabel(locations: string[]): string {
  if (locations.length === 0) return "Bulacan";
  if (locations.length === 1) return locations[0];
  const towns = locations.map((l) => l.split(",")[0].trim());
  const province = locations[0].split(",")[1]?.trim();
  const joined =
    towns.slice(0, -1).join(", ") + " and " + towns[towns.length - 1];
  return province ? `${joined}, ${province}` : joined;
}

function priceRange(s: Subdivision): string {
  const min = formatPriceCompact(s.minPrice, "sale");
  const max = formatPriceCompact(s.maxPrice, "sale");
  return min === max ? min : `${min} – ${max}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subdivision = await getSubdivisionBySlug(slug);
  if (!subdivision) return { title: "Development Not Found" };

  const where = locationLabel(subdivision.locations);
  const count = subdivision.properties.length;

  return pageMetadata({
    title: `${subdivision.name} — House and Lot for Sale in ${where}`,
    description: `${subdivision.name} in ${where}: ${count} house and lot units for sale from ${priceRange(
      subdivision
    )}. Official pricing, floor plans and site viewing with Broker Shella, PRC-licensed real estate broker.`,
    path: `/subdivisions/${subdivision.slug}`,
    images: subdivision.properties[0]?.images?.slice(0, 1),
  });
}

export default async function SubdivisionPage({ params }: Props) {
  const { slug } = await params;
  const subdivision = await getSubdivisionBySlug(slug);
  if (!subdivision) notFound();

  const where = locationLabel(subdivision.locations);
  const count = subdivision.properties.length;
  const range = priceRange(subdivision);
  const url = `${BASE_URL}/subdivisions/${subdivision.slug}`;

  const bedroomCounts = [
    ...new Set(
      subdivision.properties.map((p) => p.bedrooms).filter((b) => b > 0)
    ),
  ].sort((a, b) => a - b);

  // Answer the questions people actually type into Google about a development.
  // Rendered as visible copy *and* FAQPage JSON-LD so it can win a rich result.
  const faqs = [
    {
      q: `How much is a house and lot in ${subdivision.name}?`,
      a: `Units at ${subdivision.name} in ${where} currently range from ${range}. Pricing depends on the model, lot area and whether the unit is pre-selling or ready for occupancy. Contact Broker Shella for the latest official price list and available payment terms.`,
    },
    {
      q: `Where is ${subdivision.name} located?`,
      a: `${subdivision.name} is located in ${where}. Message Broker Shella to schedule a site viewing or request a location map and directions.`,
    },
    {
      q: `What house models are available at ${subdivision.name}?`,
      a: `There ${count === 1 ? "is" : "are"} currently ${count} available ${
        count === 1 ? "unit" : "units"
      } at ${subdivision.name}${
        bedroomCounts.length
          ? `, with ${bedroomCounts.join(" and ")} bedroom layouts`
          : ""
      }. Each model is listed below with its floor area, lot area and complete price details.`,
    },
    {
      q: `Is bank or Pag-IBIG financing available at ${subdivision.name}?`,
      a: `Yes. Bank financing and Pag-IBIG housing loans are typically available for units at ${subdivision.name}. Broker Shella is a PRC-licensed real estate broker and can walk you through the requirements, computation and full application process.`,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Properties",
          item: `${BASE_URL}/properties`,
        },
        { "@type": "ListItem", position: 3, name: subdivision.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Available units at ${subdivision.name}`,
      numberOfItems: count,
      itemListElement: subdivision.properties.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: `${BASE_URL}/properties/${propertySlug(p)}`,
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-luxury-900 pt-16 sm:pt-[89px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-luxury-400">
            <li>
              <Link href="/" className="hover:text-gold-500 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/properties"
                className="hover:text-gold-500 transition-colors">
                Properties
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-luxury-300">{subdivision.name}</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-luxury-50 leading-tight">
            {subdivision.name}
          </h1>
          <p className="flex items-center gap-2 mt-3 text-luxury-300">
            <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
            <span>House and lot for sale in {where}</span>
          </p>
          <p className="mt-5 text-luxury-300 leading-relaxed">
            {subdivision.name} is a residential development in {where} with{" "}
            {count} {count === 1 ? "unit" : "units"} currently available through
            Broker Shella Castro, a PRC-licensed real estate broker. Prices
            range from {range}. Browse every available model below, or get in
            touch to schedule a site viewing.
          </p>
        </header>

        {/* Key facts */}
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-5">
            <dt className="flex items-center gap-2 text-luxury-400 text-xs uppercase tracking-widest">
              <Banknote className="w-4 h-4 text-gold-500" />
              Price range
            </dt>
            <dd className="mt-2 text-luxury-50 text-xl font-bold">{range}</dd>
          </div>
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-5">
            <dt className="flex items-center gap-2 text-luxury-400 text-xs uppercase tracking-widest">
              <Home className="w-4 h-4 text-gold-500" />
              Available units
            </dt>
            <dd className="mt-2 text-luxury-50 text-xl font-bold">
              {count} {count === 1 ? "model" : "models"}
            </dd>
          </div>
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-5">
            <dt className="flex items-center gap-2 text-luxury-400 text-xs uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-gold-500" />
              Location
            </dt>
            <dd className="mt-2 text-luxury-50 text-xl font-bold">{where}</dd>
          </div>
        </dl>

        {/* Units */}
        <section className="mt-14">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-luxury-50">
            Available units at {subdivision.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {subdivision.properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-luxury-50">
            Frequently asked questions
          </h2>
          <div className="mt-6 flex flex-col gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-luxury-800 border border-luxury-700 rounded-2xl p-5">
                <summary className="cursor-pointer list-none text-luxury-50 font-semibold flex items-start justify-between gap-4">
                  <h3 className="text-base">{faq.q}</h3>
                  <span
                    aria-hidden="true"
                    className="text-gold-500 shrink-0 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-luxury-300 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 bg-luxury-800 border border-gold-500/30 rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-luxury-50">
            Interested in {subdivision.name}?
          </h2>
          <p className="mt-3 text-luxury-300 max-w-xl mx-auto">
            Get the official price list, floor plans and financing computation —
            or schedule a site viewing in {where}.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 mt-6 bg-gold-500 text-luxury-900 font-bold px-6 py-3 rounded-xl hover:bg-gold-400 transition-colors">
            Talk to Broker Shella
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
      <MobileContactBar />
    </main>
  );
}
