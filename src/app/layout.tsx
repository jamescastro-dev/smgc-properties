import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import ThemeProvider from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://smgcproperties.com"),
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
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://smgcproperties.com",
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
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}