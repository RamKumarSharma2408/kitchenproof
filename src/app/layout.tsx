import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kitchenproof.vercel.app"),
  title: {
    default: "KitchenProof – Know What's Cooking Behind Your Order",
    template: "%s | KitchenProof",
  },
  description:
    "Independent food safety and hygiene transparency ecosystem. Inspect verified kitchen audit reports, cold chain logs, pest management, and FSSAI licensing before placing your order.",
  keywords: [
    "food safety India",
    "cloud kitchen hygiene",
    "FSSAI license check",
    "restaurant inspection report",
    "kitchen transparency",
    "food delivery safety",
  ],
  authors: [{ name: "KitchenProof Technologies India" }],
  openGraph: {
    title: "KitchenProof – Know What's Cooking Behind Your Order",
    description:
      "Inspect verified kitchen hygiene, pest control, and food safety compliance before ordering food.",
    type: "website",
    locale: "en_IN",
    siteName: "KitchenProof",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KitchenProof – Kitchen Safety Transparency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KitchenProof – Know What's Cooking Behind Your Order",
    description: "Inspect verified kitchen hygiene, pest control, and food safety compliance before ordering food.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth ${fraunces.variable} ${sourceSans3.variable}`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text-base font-sans antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
