"use client";

import { useState, useEffect } from "react";
import { generateQRCodeSVG } from "@/lib/qrcode";
import { X, Printer, Download, Copy, Check, ShieldCheck, QrCode } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: {
    id: string;
    name: string;
    slug: string;
    locality: string;
    city: string;
    safetyScore: number;
    verificationStatus: string;
    fssaiNumber?: string | null;
  };
}

export default function QRCodeModal({ isOpen, onClose, restaurant }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [svgContent, setSvgContent] = useState("");

  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/restaurants/${restaurant.slug}`
    : `https://kitchenproof.vercel.app/restaurants/${restaurant.slug}`;

  useEffect(() => {
    if (isOpen) {
      try {
        const svg = generateQRCodeSVG(profileUrl, {
          size: 260,
          color: "#143D2B",
          bgColor: "#FFFFFF",
          margin: 3,
        });
        setSvgContent(svg);
      } catch (e) {
        console.error("Failed to generate QR code SVG:", e);
      }
    }
  }, [isOpen, profileUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kitchenproof-qr-${restaurant.slug}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0 print:static">
      <div className="bg-white rounded-2xl border border-[#E7E7DE] max-w-md w-full p-6 sm:p-8 shadow-elevated relative space-y-6 print:border-0 print:shadow-none print:max-w-none print:w-full print:p-8">
        {/* Close Button - hidden in print */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#868A85] hover:text-[#161815] p-1 print:hidden"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Poster Container */}
        <div className="text-center space-y-4 print:space-y-6">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F6F2] text-[#143D2B] border border-[#B8D4C2] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>KitchenProof™ Official Transparency Seal</span>
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-[#161815] tracking-tight">
              {restaurant.name}
            </h2>
            <p className="text-xs text-[#5E635D] mt-0.5">
              {restaurant.locality}, {restaurant.city}
              {restaurant.fssaiNumber ? ` • FSSAI #${restaurant.fssaiNumber}` : ""}
            </p>
          </div>

          {/* Safety Score Highlight */}
          <div className="inline-block bg-[#FBFBF9] border border-[#E7E7DE] rounded-xl px-5 py-2.5">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#868A85] block">
              Certified Safety Index
            </span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-3xl font-black font-serif text-[#143D2B]">
                {restaurant.safetyScore}
              </span>
              <span className="text-xs text-[#5E635D]">/100</span>
            </div>
          </div>

          {/* QR Code SVG Display */}
          <div className="p-4 bg-white rounded-xl border-2 border-dashed border-[#D0D0C3] inline-block shadow-sm">
            {svgContent ? (
              <div
                className="w-56 h-56 mx-auto flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-[#868A85]">
                Generating QR code...
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#161815]">
              Scan with any smartphone camera
            </p>
            <p className="text-[11px] text-[#5E635D] max-w-xs mx-auto">
              Inspect live temperature monitoring logs, potable water lab tests, and pest control audit certificates.
            </p>
          </div>
        </div>

        {/* Action Controls - hidden during print */}
        <div className="pt-2 border-t border-[#EFEFE9] flex flex-col sm:flex-row gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#143D2B] text-white hover:bg-[#0D281C] transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Counter Poster</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold bg-[#F5F5F0] text-[#161815] hover:bg-[#EFEFE9] transition-colors border border-[#D0D0C3]"
            title="Download SVG vector file"
          >
            <Download className="w-4 h-4" />
            <span>SVG</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold bg-[#F5F5F0] text-[#161815] hover:bg-[#EFEFE9] transition-colors border border-[#D0D0C3]"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
