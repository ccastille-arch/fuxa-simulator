/**
 * SC footer — red geometric accent ribbon + navy information grid.
 *
 * Structure mirrors the servicecompression.com footer:
 *   - Full-bleed red strip above the navy block (stand-in for sc-pattern-red.svg)
 *   - Tri-column: product / contact / legal
 *   - Thin white-on-navy copyright baseline
 *
 * Safe under copyright: we do NOT fabricate a "Built by Slant" credit or
 * reuse the Slant wordmark. The user can re-enable `showAgencyCredit` once
 * the real SVG is in /public/brand.
 */
import Link from "next/link";
import SCLogo from "./SCLogo";

export default function SCFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ marginTop: 80 }}>
      {/* Red geometric accent ribbon */}
      <div
        aria-hidden="true"
        style={{
          height: 56,
          position: "relative",
          background:
            "linear-gradient(135deg, #D32028 0%, #B01A20 50%, #8A1519 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
            backgroundSize: "14px 14px",
            opacity: 0.5,
          }}
        />
      </div>

      <div style={{ background: "var(--sc-navy)", color: "var(--sc-white)" }}>
        <div className="sc-container" style={{ paddingBlock: 60 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 40,
              alignItems: "start",
            }}
            className="sc-footer-grid"
          >
            <div>
              <SCLogo tone="light" />
              <p
                style={{
                  marginTop: 20,
                  maxWidth: 380,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                Field-tested gas lift compression. Real-world logic, not just theory.
                Simulator tools for wellhead optimization, built on live field data.
              </p>
            </div>

            <FooterCol title="Product">
              <FooterLink href="/">Overview</FooterLink>
              <FooterLink href="/wellhead-v1">Wellhead Simulator</FooterLink>
              <FooterLink href="https://servicecompression.com/fieldtune/" external>FieldTune</FooterLink>
              <FooterLink href="https://servicecompression.com/ask-ricky/" external>Ask Ricky</FooterLink>
            </FooterCol>

            <FooterCol title="Company">
              <FooterLink href="https://servicecompression.com/" external>servicecompression.com</FooterLink>
              <FooterLink href="https://servicecompression.com/#contact" external>Contact</FooterLink>
              <FooterLink href="https://servicecompression.com/insights/" external>Insights</FooterLink>
            </FooterCol>

            <FooterCol title="Support">
              <FooterLink href="/WH_2.0_SOO_01Apr2026_R0.pdf" external>Wellhead 2.0 SOO (PDF)</FooterLink>
              <FooterLink href="mailto:info@servicecompression.com" external>info@servicecompression.com</FooterLink>
            </FooterCol>
          </div>

          <div
            style={{
              marginTop: 60,
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              fontSize: 12,
              letterSpacing: 0.6,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            <div>© {year} Service Compression. All rights reserved.</div>
            <div style={{ display: "flex", gap: 20 }}>
              <span>Internal demo build</span>
              <span>•</span>
              <span>v0.1.0</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sc-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .sc-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "var(--sc-cyan)",
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0, margin: 0 }}>
        {children}
      </ul>
    </div>
  );
}

function FooterLink({
  href, children, external,
}: { href: string; children: React.ReactNode; external?: boolean }) {
  const style: React.CSSProperties = {
    color: "rgba(255,255,255,0.78)",
    textDecoration: "none",
    fontSize: 14,
    transition: "color 180ms",
  };
  return (
    <li>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={style}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sc-cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.78)")}
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          style={style}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--sc-cyan)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.78)")}
        >
          {children}
        </Link>
      )}
    </li>
  );
}
