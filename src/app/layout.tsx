import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import ThemeProvider from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://brokershella.com"),
  title: {
    default: "Broker Shella | SMGC Properties — Buy, Sell & Rent in Bulacan",
    template: "%s | Broker Shella",
  },
  description:
    "Find your dream home with Broker Shella Castro — PRC Licensed Real Estate Broker specializing in properties across Bulacan and Metro Manila. Buy, sell, or rent with confidence.",
  keywords: [
    "real estate broker Philippines",
    "house for sale Bulacan",
    "house for sale San Jose del Monte",
    "property for rent Bulacan",
    "licensed real estate broker",
    "SJDM properties",
    "Broker Shella",
    "SMGC Properties",
  ],
  authors: [{ name: "Broker Shella Castro" }],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://brokershella.com",
    siteName: "Broker Shella | SMGC Properties",
    title: "Broker Shella | SMGC Properties — Buy, Sell & Rent in Bulacan",
    description:
      "Find your dream home with Broker Shella Castro — PRC Licensed Real Estate Broker in Bulacan and Metro Manila.",
    images: [
      {
        url: "/shella.jpg",
        width: 600,
        height: 800,
        alt: "Broker Shella Castro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Broker Shella | SMGC Properties",
    description:
      "Find your dream home with Broker Shella Castro — PRC Licensed Real Estate Broker in Bulacan and Metro Manila.",
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
      <body className={inter.className}>
        <ThemeProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}