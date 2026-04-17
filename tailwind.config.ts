import type { Config } from "tailwindcss";

/**
 * Tailwind config — Service Compression brand system.
 * Source: context/01_brand_kit.md (extracted from servicecompression.com).
 *
 * Dual-namespace design on purpose:
 *   - `sc-*` = Service Compression brand tokens (shell, marketing surfaces,
 *     navigation, CTAs, footer, page backgrounds). Drive everything chrome.
 *   - `fuxa-*` = legacy SCADA/HMI palette kept intact for the simulator-native
 *     SVG canvases (Overview, WellheadData, Settings) so the operator/foreman
 *     view keeps the industrial HMI read that customers expect. Do NOT retheme
 *     the inside of those SVGs — the brand guidance explicitly marks them as
 *     simulator-native.
 */
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── Service Compression — primary ──────────────────────────────
        "sc-navy":        "#05233E", // primary navy — body bg, dark sections
        "sc-navy-light":  "#0F3C64", // hover states, lighter navy accent
        "sc-navy-muted":  "#293C5B", // secondary dark tone
        "sc-red":         "#D32028", // CTA / accent only — never body text
        "sc-cyan":        "#49D0E2", // FieldTune / Ask Ricky sub-brand accent

        // ── Neutrals ───────────────────────────────────────────────────
        "sc-white":       "#FFFFFF",
        "sc-offwhite":    "#EDEDED",
        "sc-light":       "#F2F2F2",
        "sc-gray-100":    "#D0D0D0",
        "sc-gray-200":    "#C1C1C1",
        "sc-gray-500":    "#474444",
        "sc-ink":         "#212121",
        "sc-ink-2":       "#2A2A2A",

        // ── Functional ─────────────────────────────────────────────────
        "sc-link":        "#1863DC",
        "sc-success":     "#008000",

        // ── Legacy SCADA palette — do not remove; powers simulator SVGs ─
        "fuxa-bg":        "#2b2b2b",
        "fuxa-panel":     "#4D4D4D",
        "fuxa-green":     "#00b050",
        "fuxa-red":       "#c00000",
        "fuxa-blue":      "#5A9CFE",
        "fuxa-gray":      "#595959",
      },
      fontFamily: {
        // SC primary — Montserrat, Google Fonts
        sans:       ["Montserrat", "system-ui", "sans-serif"],
        montserrat: ["Montserrat", "system-ui", "sans-serif"],
        // Legacy Roboto retained for inline <text> inside simulator SVGs
        roboto:     ["Roboto", "sans-serif"],
      },
      fontSize: {
        // SC-extracted scale. Preserved at exact px values because these are
        // load-bearing on the live site (1.227× / golden-ratio derived).
        "sc-eyebrow":  ["11px",    { lineHeight: "13.75px", letterSpacing: "0.167em" }], // 2px @ 12
        "sc-label":    ["12px",    { lineHeight: "15px",    letterSpacing: "0.167em" }],
        "sc-caption":  ["13.497px",{ lineHeight: "16.871px"                          }],
        "sc-body":     ["16px",    { lineHeight: "20px"                              }],
        "sc-body-lg":  ["17.178px",{ lineHeight: "21.473px"                          }],
        "sc-lead":     ["19.632px",{ lineHeight: "24.54px"                           }],
        "sc-h4":       ["20px",    { lineHeight: "25px"                              }],
        "sc-h3":       ["24px",    { lineHeight: "30px"                              }],
        "sc-h2":       ["33.129px",{ lineHeight: "36.074px", letterSpacing: "-0.01em" }],
        "sc-h1":       ["34.356px",{ lineHeight: "36.074px", letterSpacing: "-0.01em" }],
        "sc-hero":     ["41.718px",{ lineHeight: "43.804px", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        "sc-track":  "2px",       // uppercase labels, nav
        "sc-mid":    "0.6px",     // subheadings
        "sc-tight":  "-0.5px",    // large headlines
      },
      spacing: {
        // SC spacing tokens that don't collide with Tailwind's default scale.
        "sc-2":   "4px",
        "sc-3":   "8px",
        "sc-4":   "10px",
        "sc-5":   "12px",
        "sc-6":   "15px",
        "sc-7":   "16px",
        "sc-8":   "20px",
        "sc-9":   "22px",
        "sc-10":  "24px",
        "sc-11":  "27px",
        "sc-12":  "30px",
        "sc-14":  "40px",
        "sc-16":  "60px",
        "sc-20":  "100px",
        "sc-24":  "120px",
        "sc-32":  "165px",
      },
      boxShadow: {
        // From wp--preset--shadow--* — SC's shipped shadow presets
        "sc-natural":  "6px 6px 9px rgba(0, 0, 0, 0.2)",
        "sc-deep":     "12px 12px 50px rgba(0, 0, 0, 0.4)",
        "sc-sharp":    "6px 6px 0px rgba(0, 0, 0, 0.2)",
        "sc-crisp":    "6px 6px 0px rgb(0, 0, 0)",
      },
      backgroundImage: {
        // Reusable red geometric pattern hook. sc-pattern-red.svg lives in
        // /public/brand once the user supplies it; this class gives a graceful
        // fallback gradient if the SVG is missing.
        "sc-red-pattern":
          "url('/brand/sc-pattern-red.svg'), linear-gradient(135deg, #D32028 0%, #8A1519 100%)",
        "sc-navy-vignette":
          "radial-gradient(ellipse at top, #0F3C64 0%, #05233E 60%, #03172A 100%)",
      },
      borderRadius: {
        "sc-0":   "0",
        "sc-sm":  "2px",
        "sc-md":  "4px",
      },
      transitionTimingFunction: {
        "sc-out": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
