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
          color: "#0E1512",
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm print:bg-white print:p-0 print:static"
    >
      <div className="bg-surface rounded-2xl border border-border-strong max-w-md w-full p-6 sm:p-8 shadow-elevated relative space-y-6 print:border-0 print:shadow-none print:max-w-none print:w-full print:p-8">
        {/* Close Button - hidden in print */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-base p-1.5 rounded-md hover:bg-surface-raised transition-colors print:hidden"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Poster Container */}
        <div className="text-center space-y-4 print:space-y-6">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised text-accent border border-border-strong text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>KitchenProof™ Official Transparency Seal</span>
          </div>

          <div>
            <h2 id="qr-modal-title" className="text-2xl font-serif font-bold text-text-base tracking-tight">
              {restaurant.name}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {restaurant.locality}, {restaurant.city}
              {restaurant.fssaiNumber ? ` • FSSAI #${restaurant.fssaiNumber}` : ""}
            </p>
          </div>

          {/* Safety Score Highlight */}
          <div className="inline-block bg-surface-raised border border-border-subtle rounded-xl px-5 py-2.5">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
              Certified Safety Index
            </span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-3xl font-black font-serif text-accent">
                {restaurant.safetyScore}
              </span>
              <span className="text-xs text-text-muted">/100</span>
            </div>
          </div>

          {/* QR Code SVG Display - clean white background container for camera scan contrast */}
          <div className="p-4 bg-white rounded-xl border-2 border-dashed border-border-strong inline-block shadow-sm">
            {svgContent ? (
              <div
                className="w-56 h-56 mx-auto flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-text-muted">
                Generating QR code...
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-base">
              Scan with any smartphone camera
            </p>
            <p className="text-[11px] text-text-muted max-w-xs mx-auto">
              Inspect live temperature monitoring logs, potable water lab tests, and pest control audit certificates.
            </p>
          </div>
        </div>

        {/* Action Controls - hidden during print */}
        <div className="pt-2 border-t border-border-subtle flex flex-col sm:flex-row gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-accent text-bg hover:bg-accent-strong transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Counter Poster</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold bg-surface-raised text-text-base hover:bg-surface transition-colors border border-border-strong"
            title="Download SVG vector file"
          >
            <Download className="w-4 h-4" />
            <span>SVG</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold bg-surface-raised text-text-base hover:bg-surface transition-colors border border-border-strong"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
