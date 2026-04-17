"use client";
/**
 * SC top navigation — matches the sticky navy header on servicecompression.com.
 *
 * Patterns locked to the brand:
 *   - Sticky, full-width, #05233E navy
 *   - Uppercase Montserrat 600 links @ 13px / 2px letter-spacing
 *   - 2px red underline on the active route (SC red #D32028)
 *   - Hamburger fallback ≤ 768px (inline SVG, not a bitmap)
 *
 * Nav links default to the SC/FieldTune information architecture seen on the
 * public site, with the simulator routes appended. Override via `links` prop
 * once the final IA is ratified.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SCLogo from "./SCLogo";

export type NavLink = { label: string; href: string; external?: boolean };

const DEFAULT_LINKS: NavLink[] = [
  { label: "Overview",  href: "/" },
  { label: "Simulator", href: "/wellhead-v1" },
  { label: "FieldTune", href: "https://servicecompression.com/fieldtune/", external: true },
  { label: "Ask Ricky", href: "https://servicecompression.com/ask-ricky/", external: true },
  { label: "Contact",   href: "https://servicecompression.com/#contact",   external: true },
];

export default function SCHeader({
  links = DEFAULT_LINKS,
  statusBadge,
}: {
  links?: NavLink[];
  /** Optional status/live badge on the right (e.g., "LIVE DEMO"). */
  statusBadge?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    !href.startsWith("http") && (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--sc-navy)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "saturate(140%) blur(6px)",
      }}
    >
      <div className="sc-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <SCLogo href="/" tone="light" />

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          style={{ display: "flex", alignItems: "center", gap: 32 }}
          className="sc-nav-desktop"
        >
          {links.map((l) => {
            const active = !!isActive(l.href);
            const linkProps = l.external
              ? { href: l.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: l.href };
            return l.external ? (
              <a
                key={l.href}
                {...(linkProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                className="sc-nav-link"
                data-active={active}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="sc-nav-link"
                data-active={active}
              >
                {l.label}
              </Link>
            );
          })}
          {statusBadge}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="sc-nav-toggle"
          style={{
            background: "transparent",
            border: 0,
            padding: 8,
            cursor: "pointer",
            color: "#FFFFFF",
          }}
        >
          {/* Inline hamburger per the brand kit's exact SVG pattern */}
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <path
              stroke="#FFFFFF"
              strokeLinecap="round"
              strokeMiterlimit={10}
              strokeWidth={2}
              d={open ? "M6 6 L24 24 M6 24 L24 6" : "M4 7h22M4 15h22M4 23h22"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            background: "var(--sc-navy)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "12px 24px 20px",
          }}
          className="sc-nav-mobile"
        >
          <nav aria-label="Primary mobile" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {links.map((l) => {
              const active = !!isActive(l.href);
              return l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sc-nav-link"
                  data-active={active}
                  onClick={() => setOpen(false)}
                  style={{ padding: "10px 0" }}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="sc-nav-link"
                  data-active={active}
                  onClick={() => setOpen(false)}
                  style={{ padding: "10px 0" }}
                >
                  {l.label}
                </Link>
              );
            })}
            {statusBadge && <div style={{ marginTop: 8 }}>{statusBadge}</div>}
          </nav>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.sc-nav-desktop) { display: none !important; }
        }
        @media (min-width: 901px) {
          :global(.sc-nav-toggle) { display: none !important; }
          :global(.sc-nav-mobile) { display: none !important; }
        }
      `}</style>
    </header>
  );
}
