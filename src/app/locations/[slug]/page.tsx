import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, Banknote, Building2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTowns, getTownBySlug } from "@/lib/supabase/properties";
import { formatPriceCompact, propertySlug } from "@/lib/utils";
import PropertyCard from "@/components/ui/PropertyCard";
import MobileContactBar from "@/components/layout/MobileContactBar";
import { pageMetadata } from "@/lib/seo";
import type { Town } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = "https://www.smgcproperties.com";

export const revalidate = 60;

export async function generateStaticParams() {
  const towns = await getTowns();
  return towns.map((t) => ({ slug: t.slug }));
}

/**
 * Name what's actually for sale in town, the way buyers search for it.
 * Townhouses count as house and lot; condos are named separately so a town
 * with an SMDC tower isn't billed as house-and-lot only.
 */
function offering(t: Town) {
  const types = new Set(t.properties.map((p) => p.property_type));
  const condos = types.has("Condominium");
  const houses = types.has("House & Lot") || types.has("Townhouse");
  if (condos && houses) return { title: "Houses and Condos", noun: "house or condo", units: "homes" };
  if (condos) return { title: "Condos", noun: "condo unit", units: "condo units" };
  if (types.size === 1 && types.has("Townhouse"))
    return { title: "Townhouses", noun: "townhouse", units: "townhouses" };
  return { title: "House and Lot", noun: "house and lot", units: "house and lot units" };
}

function priceRange(t: Town): string {
  const min = formatPriceCompact(t.minPrice, "sale");
  const max = formatPriceCompact(t.maxPrice, "sale");
  return min === max ? min : `${min} – ${max}`;
}

/** "St. Agatha Homes, Evara Residences and Santa Clara Homes" */
function listNames(names: string[]): string {
  return names.length <= 1
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const town = await getTownBySlug(slug);
  if (!town) return { title: "Location Not Found" };

  const offer = offering(town);
  return pageMetadata({
    title: `${offer.title} for Sale in ${town.name}`,
    description: `${town.properties.length} ${offer.units} for sale in ${town.name} from ${priceRange(
      town
    )} — ${listNames(town.developments.map((d) => d.name))}. Viewing and financing help from Broker Shella, PRC-licensed broker.`,
    path: `/locations/${town.slug}`,
    images: town.properties[0]?.images?.slice(0, 1),
  });
}

export default async function TownPage({ params }: Props) {
  const { slug } = await params;
  const town = await getTownBySlug(slug);
  if (!town) notFound();

  const offer = offering(town);
  const count = town.properties.length;
  const range = priceRange(town);
  const townName = town.name.split(",")[0].trim();
  const devNames = town.developments.map((d) => d.name);
  const url = `${BASE_URL}/locations/${town.slug}`;

  // The questions people type into Google about buying in a town, answered
  // from live listings. Shown on the page and mirrored as FAQPage JSON-LD.
  const faqs = [
    {
      q: `How much is a ${offer.noun} in ${town.name}?`,
      a: `Available units in ${town.name} currently range from ${range}. The price depends on the development, model, lot area and whether the unit is pre-selling or ready for occupancy. Contact Broker Shella for the latest official price lists and payment terms.`,
    },
    {
      q: `Which developments have units for sale in ${townName}?`,
      a: `${listNames(devNames)} currently have units available in ${townName} through Broker Shella. Each development and its available models are listed on this page.`,
    },
    {
      q: `Is Pag-IBIG or bank financing available for homes in ${townName}?`,
      a: `Yes. Pag-IBIG housing loans and bank financing are typically available for units in ${town.name}, and in-house financing is offered by some developers. Broker Shella can compute your monthly amortization and guide you through the requirements.`,
    },
    {
      q: `Can I schedule a site viewing in ${townName}?`,
      a: `Yes. Message or call Broker Shella to schedule a site tripping to any of the developments in ${townName}. She can arrange visits to several projects in one trip so you can compare them.`,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Properties", item: `${BASE_URL}/properties` },
        { "@type": "ListItem", position: 3, name: town.name, item: url },
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
      name: `${offer.title} for sale in ${town.name}`,
      numberOfItems: count,
      itemListElement: town.properties.map((p, i) => ({
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
              <Link href="/properties" className="hover:text-gold-500 transition-colors">
                Properties
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-luxury-300">{town.name}</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-luxury-50 leading-tight">
            {offer.title} for Sale in {town.name}
          </h1>
          <p className="mt-5 text-luxury-300 leading-relaxed">
            {count} {offer.units} are available in {townName} through Broker
            Shella Castro, a PRC-licensed real estate broker — across{" "}
            {town.developments.length} developments: {listNames(devNames)}.
            Prices range from {range}. Compare every available unit below, or
            get in touch to schedule a site viewing.
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
            <dd className="mt-2 text-luxury-50 text-xl font-bold">{count}</dd>
          </div>
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-5">
            <dt className="flex items-center gap-2 text-luxury-400 text-xs uppercase tracking-widest">
              <Building2 className="w-4 h-4 text-gold-500" />
              Developments
            </dt>
            <dd className="mt-2 text-luxury-50 text-xl font-bold">
              {town.developments.length}
            </dd>
          </div>
        </dl>

        {/* Developments — links into the hub pages pass authority both ways. */}
        <section className="mt-14">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-luxury-50">
            Developments in {townName}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {town.developments.map((d) => {
              const body = (
                <>
                  <p className="text-luxury-50 font-semibold">{d.name}</p>
                  <p className="text-luxury-400 text-sm mt-1">
                    {d.count} {d.count === 1 ? "unit" : "units"} · from{" "}
                    {formatPriceCompact(d.minPrice, "sale")}
                  </p>
                  {d.hubSlug && (
                    <span className="inline-flex items-center gap-1 text-gold-500 text-xs font-semibold mt-3">
                      View all models <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </>
              );
              return (
                <li key={d.name}>
                  {d.hubSlug ? (
                    <Link
                      href={`/subdivisions/${d.hubSlug}`}
                      className="block h-full bg-luxury-800 border border-luxury-700 hover:border-gold-500/50 rounded-2xl p-5 transition-colors">
                      {body}
                    </Link>
                  ) : (
                    <div className="h-full bg-luxury-800 border border-luxury-700 rounded-2xl p-5">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Units */}
        <section className="mt-14">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-luxury-50">
            Available units in {townName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {town.properties.map((property) => (
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
                <p className="mt-3 text-luxury-300 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 bg-luxury-800 border border-gold-500/30 rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-luxury-50">
            Looking for a home in {townName}?
          </h2>
          <p className="mt-3 text-luxury-300 max-w-xl mx-auto">
            Get official price lists, a financing computation, and a site
            viewing of the developments that fit your budget.
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
