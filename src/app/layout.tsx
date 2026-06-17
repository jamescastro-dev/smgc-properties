import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.smgcproperties.com"),
  title: {
    default: "Broker Shella | SMGC Properties — Buy, Sell & Rent in Bulacan & Luzon",
    template: "%s | Broker Shella — SMGC Properties",
  },
  description:
    "Find your dream home with Broker Shella Castro — PRC Licensed Real Estate Broker specializing in properties across Bulacan, North and South Luzon. Buy, sell, or rent today.",
  keywords: [
    "real estate broker Philippines",
    "Bulacan real estate",
    "house for sale Bulacan",
    "house for sale North Luzon",
    "house for sale South Luzon",
    "house for sale San Jose del Monte",
    "property for rent Bulacan",
    "property for sale Philippines",
    "property for rent Luzon",
    "licensed real estate broker",
    "PRC licensed broker",
    "SJDM properties",
    "Broker Shella",
    "SMGC Properties",
  ],
  authors: [{ name: "Broker Shella Castro" }],
  verification: {
    google: "V0PS9A4H3DvQnXQ2hukGBzT__A67y_LFxhQKrnjgzRs",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://www.smgcproperties.com",
    siteName: "Broker Shella | SMGC Properties",
    title: "Broker Shella | SMGC Properties — Buy, Sell & Rent in Bulacan & Luzon",
    description:
      "Find your dream home with Broker Shella Castro — PRC Licensed Real Estate Broker specializing in Bulacan, North and South Luzon.",
    images: [
      {
        url: "/shella.jpg",
        width: 600,
        height: 800,
        alt: "Broker Shella Castro — SMGC Properties",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Broker Shella | SMGC Properties",
    description:
      "Find your dream home with Broker Shella Castro — PRC Licensed Real Estate Broker specializing in Bulacan, North and South Luzon.",
    images: ["/shella.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${fraunces.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}