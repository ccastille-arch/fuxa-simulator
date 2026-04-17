/**
 * SC logo — responsible, placeholder-safe.
 *
 * Strategy:
 *   1. If /brand/service-compression-logo.svg is dropped into /public, this
 *      component will render it as the canonical mark (drop-in replacement,
 *      no code change needed).
 *   2. Until then, it renders an SC-styled text wordmark using Montserrat
 *      ExtraBold with the brand's typographic discipline. Avoids fabricating
 *      a trademark that could be mistaken for the real Slant-produced logo.
 *
 * The `variant` prop flips behavior for the FieldTune sub-brand surface.
 */
import Image from "next/image";

type LogoVariant = "sc" | "fieldtune";
type LogoTone    = "light" | "dark";

export default function SCLogo({
  variant = "sc",
  tone    = "light",
  className = "",
  href,
  useImage = false,
}: {
  variant?: LogoVariant;
  tone?: LogoTone;
  className?: string;
  href?: string;
  /** Set true once /public/brand/service-compression-logo.svg exists. */
  useImage?: boolean;
}) {
  const color = tone === "light" ? "#FFFFFF" : "#05233E";

  const mark = useImage ? (
    <Image
      src={
        variant === "fieldtune"
          ? "/brand/field_tune-logo.svg"
          : "/brand/service-compression-logo.svg"
      }
      alt={variant === "fieldtune" ? "FieldTune" : "Service Compression"}
      width={variant === "fieldtune" ? 180 : 220}
      height={variant === "fieldtune" ? 90 : 68}
      priority
    />
  ) : (
    <span
      className={`inline-flex items-baseline gap-[10px] ${className}`}
      aria-label={variant === "fieldtune" ? "FieldTune" : "Service Compression"}
    >
      {/* Stylized bolt glyph nods to the SC hex-bolt photography without
          reproducing the trademarked "Sc" vessel mark. */}
      <svg
        width="28" height="28" viewBox="0 0 28 28"
        aria-hidden="true"
        style={{ flex: "none" }}
      >
        <polygon
          points="14,2 25,8 25,20 14,26 3,20 3,8"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <polygon
          points="14,8 19.5,11 19.5,17 14,20 8.5,17 8.5,11"
          fill="#D32028"
        />
      </svg>
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 800,
          letterSpacing: "-0.5px",
          fontSize: 22,
          color,
          lineHeight: 1,
        }}
      >
        {variant === "fieldtune" ? "FieldTune" : "Service Compression"}
      </span>
    </span>
  );

  if (href) {
    return (
      <a href={href} className={`inline-flex items-center ${className}`}>
        {mark}
      </a>
    );
  }
  return <span className={`inline-flex items-center ${className}`}>{mark}</span>;
}
