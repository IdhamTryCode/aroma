"use client";

import { useRouter } from "next/navigation";

/** Kembali ke halaman sebelumnya (mis. hasil survey /hasil/[id]); fallback ke home. */
export function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(fallback))}
      className="text-sm text-muted-foreground hover:text-foreground"
    >
      ← Kembali
    </button>
  );
}
