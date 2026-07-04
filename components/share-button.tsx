"use client";

import { useState } from "react";

/** Bagikan URL hasil: pakai Web Share API (mobile) atau fallback copy link. */
export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "DNA Aroma-ku", text: "Ini DNA aroma & parfum yang cocok buatku:", url });
      } catch {
        // user membatalkan — abaikan
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
    >
      {copied ? "Link disalin ✓" : "Bagikan hasil"}
    </button>
  );
}
