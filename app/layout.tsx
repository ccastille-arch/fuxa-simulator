import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FUXA Simulator | Altronic DE-4000",
  description: "SCADA/HMI Simulator for Altronic DE-4000 Wellhead Control Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1a1a1a]">{children}</body>
    </html>
  );
}
