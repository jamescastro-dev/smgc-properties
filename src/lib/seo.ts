import type { Metadata } from "next";

/** Must match `title.template` in app/layout.tsx. */
const TITLE_SUFFIX = " | Broker Shella — SMGC Properties";

// Google shows roughly the first 60 characters of a title. Past that, the
// brand suffix only pushes the listing's own words out of view — and Google
// already shows the site name above each result (WebSite JSON-LD on the home
// page) — so long titles go out bare.
const MAX_TITLE = 60;

type Image = { url: string; width?: number; height?: number; alt?: string };

const DEFAULT_IMAGE: Image = {
  url: "/shella.jpg",
  width: 600,
  height: 800,
  alt: "Broker Shella Castro — SMGC Properties",
};

/**
 * Metadata for a public page: canonical URL plus complete Open Graph and
 * Twitter cards. Next merges metadata shallowly per key, so a page that sets
 * no `openGraph` shares the home page's og:url/title (every Facebook share
 * looked like the home page), and one that sets a partial `openGraph` loses the
 * layout's siteName/locale. Always pass the whole set from here.
 */
export function pageMetadata({
  title,
  description,
  path,
  images,
}: {
  /** Bare page title — the brand is appended when the whole still fits. */
  title: string;
  description: string;
  /** Canonical path, e.g. "/about". */
  path: string;
  images?: (string | Image)[];
}): Metadata {
  const fits = title.length + TITLE_SUFFIX.length <= MAX_TITLE;
  const socialTitle = fits ? `${title}${TITLE_SUFFIX}` : title;
  const socialImages = images?.length
    ? images.map((img) => (typeof img === "string" ? { url: img, alt: title } : img))
    : [DEFAULT_IMAGE];

  return {
    title: fits ? title : { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_PH",
      siteName: "Broker Shella | SMGC Properties",
      url: path,
      title: socialTitle,
      description,
      images: socialImages,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: socialImages,
    },
  };
}
