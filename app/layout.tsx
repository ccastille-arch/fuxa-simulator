import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://welllogicsim-dev-production.up.railway.app"),
  title: {
    default: "Service Compression — Wellhead Simulator",
    template: "%s | Service Compression",
  },
  description:
    "Real-world gas lift logic, not just theory. Service Compression's wellhead simulator: live field data, compressor coordination, and priority-based allocation.",
  applicationName: "Service Compression Simulator",
  authors: [{ name: "Service Compression" }],
  keywords: [
    "Service Compression",
    "FieldTune",
    "wellhead simulator",
    "gas lift",
    "Altronic DE-4000",
    "compressor coordination",
    "SCADA",
  ],
  openGraph: {
    type: "website",
    siteName: "Service Compression",
    title: "Service Compression — Wellhead Simulator",
    description:
      "Real-world gas lift logic, not just theory. Live wellhead + compressor coordination, built on field data.",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    // Internal review build — do not expose to search until sign-off.
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#05233E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
