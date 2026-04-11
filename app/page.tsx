"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { initState, tickState, SystemState } from "@/lib/simulator";
import dynamic from "next/dynamic";

const AnalyticsDashboard = dynamic(() => import("@/components/AnalyticsDashboard"), { ssr: false });

const projects = [
  {
    id: "wellhead-v1",
    title: "Wellhead Panel V1",
    subtitle: "Altronic DE-4000",
    description: "10-wellhead gas injection control panel. DE-4000 safety shutdown, flow distribution, compressor coordination, and priority-based allocation.",
    tags: ["Gas Injection", "10 Wellheads", "4 Compressors", "DE-4000"],
    status: "live",
    screens: ["Main Overview", "Wellhead Data", "Settings"],
    color: "#00b050",
  },
];

export default function HomePage() {
  const [state, setState] = useState<SystemState | null>(null);

  useEffect(() => {
    setState(initState());
    const iv = setInterval(() => setState((p) => (p ? tickState(p) : p)), 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", fontFamily: "Roboto, sans-serif", color: "#fff" }}>
      {/* ── Header ── */}
      <header style={{ background: "#000", borderBottom: "3px solid #00b050", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#00b050", letterSpacing: 2 }}>FUXA SIMULATOR</div>
          <div style={{ fontSize: 13, color: "#888" }}>SCADA/HMI Panel Replicas — Altronic DE-4000 Series</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#555" }}>Service Compression | ccastille-arch</span>
          {state && (
            <span style={{ padding: "4px 14px", borderRadius: 20, background: "#00b050", color: "#fff", fontSize: 12, fontWeight: 700 }}>
              {state.panelStatus}
            </span>
          )}
        </div>
      </header>

      <main style={{ padding: "32px" }}>
        {/* ── Project Cards ── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#888", marginBottom: 20, letterSpacing: 1, textTransform: "uppercase" }}>
            Simulator Projects
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }}>
            {projects.map((p) => (
              <Link key={p.id} href={`/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#222", border: `1px solid ${p.color}33`, borderRadius: 12,
                  padding: 24, cursor: "pointer", transition: "all 0.2s",
                  boxShadow: `0 0 20px ${p.color}11`,
                  position: "relative", overflow: "hidden"
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${p.color}44`; (e.currentTarget as HTMLDivElement).style.borderColor = p.color; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${p.color}11`; (e.currentTarget as HTMLDivElement).style.borderColor = `${p.color}33`; }}
                >
                  {/* Status badge */}
                  <div style={{ position: "absolute", top: 16, right: 16, padding: "2px 10px", borderRadius: 10, background: p.color, fontSize: 11, fontWeight: 700 }}>
                    {p.status.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: "#aaa", marginBottom: 12 }}>{p.subtitle}</div>
                  <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6, marginBottom: 16 }}>{p.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {p.tags.map((t) => (
                      <span key={t} style={{ padding: "2px 10px", borderRadius: 20, background: "#333", color: "#aaa", fontSize: 12 }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {p.screens.map((s) => (
                      <span key={s} style={{ padding: "2px 10px", borderRadius: 4, background: "#1a1a1a", color: "#888", fontSize: 12, border: "1px solid #333" }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, padding: "8px 20px", background: p.color, borderRadius: 6, textAlign: "center", color: "#fff", fontWeight: 700, fontSize: 15 }}>
                    Open Simulator →
                  </div>
                </div>
              </Link>
            ))}

            {/* Coming soon card */}
            <div style={{ background: "#1d1d1d", border: "1px dashed #333", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, color: "#444" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>+</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Add New Project</div>
              <div style={{ fontSize: 13, marginTop: 8, textAlign: "center" }}>Upload a FUXA JSON export to create a new simulator</div>
            </div>
          </div>
        </section>

        {/* ── Analytics Dashboard ── */}
        {state && (
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#888", marginBottom: 20, letterSpacing: 1, textTransform: "uppercase" }}>
              Live Analytics — Wellhead Panel V1
            </h2>
            <AnalyticsDashboard state={state} />
          </section>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: "20px", color: "#444", fontSize: 12, borderTop: "1px solid #222" }}>
        FUXA Simulator • Service Compression • ccastille-arch • Built from Altronic DE-4000 FUXA JSON Export
      </footer>
    </div>
  );
}
