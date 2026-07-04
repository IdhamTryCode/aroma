import Link from "next/link";
import Image from "next/image";

/** Logo droplet + wordmark, link ke home. Dipakai di header semua halaman. */
export function SiteLogo({ size = 30 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2 transition active:scale-95">
      <Image src="/aroma.png" alt="Aroma" width={size} height={size} priority />
      <span className="text-xl font-extrabold tracking-tight">aroma</span>
    </Link>
  );
}
