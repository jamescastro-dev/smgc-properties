import type { Metadata } from "next";

/** Must match `title.template` in app/layout.tsx. */
const TITLE_SUFFIX = " | Broker Shella — SMGC Properties";

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
  /** Bare page title — the layout template appends the brand to <title>. */
  title: string;
  description: string;
  /** Canonical path, e.g. "/about". */
  path: string;
  images?: (string | Image)[];
}): Metadata {
  const socialTitle = `${title}${TITLE_SUFFIX}`;
  const socialImages = images?.length
    ? images.map((img) => (typeof img === "string" ? { url: img, alt: title } : img))
    : [DEFAULT_IMAGE];

  return {
    title,
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
