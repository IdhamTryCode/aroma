import Link from "next/link";
import { SiteLogo } from "./site-logo";

const IG = "https://www.instagram.com/idhammultazam";
const LINKEDIN = "https://www.linkedin.com/in/idham-multazam/";

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:scale-110 hover:border-primary/40 hover:text-primary"
    >
      {children}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border bg-secondary/60 px-6 py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <SiteLogo />

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/quiz" className="transition hover:text-foreground">
            Mulai kuis
          </Link>
          <Link href="/parfum" className="transition hover:text-foreground">
            Katalog
          </Link>
          <Link href="/dupe" className="transition hover:text-foreground">
            Dupe finder
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Social href={IG} label="Instagram Idham Multazam">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </Social>
          <Social href={LINKEDIN} label="LinkedIn Idham Multazam">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.24 8h4.52v14H.24V8zm7.5 0h4.33v1.92h.06c.6-1.14 2.08-2.35 4.28-2.35 4.58 0 5.43 3.01 5.43 6.93V22h-4.52v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.61-2.38 3.27V22H7.74V8z" />
            </svg>
          </Social>
        </div>

        <div className="text-sm text-muted-foreground">
          Dibuat oleh{" "}
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground underline-offset-2 hover:underline"
          >
            Idham Multazam
          </a>
        </div>
        <p className="text-xs text-muted-foreground">aroma.cfd · prototipe rekomendasi parfum</p>
      </div>
    </footer>
  );
}
