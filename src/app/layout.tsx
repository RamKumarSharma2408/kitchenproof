import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KitchenProof — Know What's Cooking Behind Your Order",
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
    title: "KitchenProof — Know What's Cooking Behind Your Order",
    description:
      "Inspect verified kitchen hygiene, pest control, and food safety compliance before ordering food.",
    type: "website",
    locale: "en_IN",
    siteName: "KitchenProof",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FBFBF9] text-[#161815] font-sans antialiased selection:bg-[#DCE9E0] selection:text-[#0F2E1D]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
