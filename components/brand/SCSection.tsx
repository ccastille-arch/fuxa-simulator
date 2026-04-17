/**
 * SCSection — the canonical "eyebrow → red rule → headline → lede" stacking
 * pattern seen on every SC/FieldTune page section. Having this as a primitive
 * keeps marketing rhythm consistent without re-writing the scaffold each time.
 */
import React from "react";

type Tone = "dark" | "light";

export default function SCSection({
  eyebrow,
  headline,
  lede,
  tone = "dark",
  align = "start",
  children,
  id,
  className = "",
}: {
  eyebrow?: string;
  headline?: React.ReactNode;
  lede?: React.ReactNode;
  tone?: Tone;
  align?: "start" | "center";
  children?: React.ReactNode;
  id?: string;
  className?: string;
}) {
  const bg      = tone === "dark" ? "var(--sc-navy)"      : "var(--sc-offwhite)";
  const fg      = tone === "dark" ? "var(--sc-white)"     : "var(--sc-ink)";
  const ledeFg  = tone === "dark" ? "rgba(255,255,255,0.78)" : "rgba(33,33,33,0.78)";

  return (
    <section
      id={id}
      className={`sc-section ${className}`}
      style={{ background: bg, color: fg }}
    >
      <div
        className="sc-container"
        style={{ textAlign: align }}
      >
        {(eyebrow || headline) && (
          <header style={{ marginBottom: 40, maxWidth: align === "center" ? 820 : 920, marginInline: align === "center" ? "auto" : undefined }}>
            {eyebrow && (
              <div className="sc-eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</div>
            )}
            {eyebrow && <span className="sc-rule" aria-hidden="true" />}
            {headline && (
              <h2 className="sc-headline" style={{ marginTop: eyebrow ? 4 : 0 }}>
                {headline}
              </h2>
            )}
            {lede && (
              <p style={{
                marginTop: 20,
                fontSize: 19.632,
                lineHeight: 1.5,
                letterSpacing: 0.2,
                color: ledeFg,
                maxWidth: 720,
                marginInline: align === "center" ? "auto" : undefined,
              }}>
                {lede}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
