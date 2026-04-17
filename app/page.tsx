"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { initState, tickState, SystemState } from "@/lib/simulator";
import SCHeader from "@/components/brand/SCHeader";
import SCFooter from "@/components/brand/SCFooter";
import SCSection from "@/components/brand/SCSection";

// Analytics loaded client-only (recharts needs the window object).
const AnalyticsDashboard = dynamic(
  () => import("@/components/AnalyticsDashboard"),
  { ssr: false, loading: () => <DashboardSkeleton /> }
);

/**
 * Landing page — SC-branded demo surface.
 *
 * Deliberate separation of concerns, per the brand guidance:
 *   Hero / pitch / cards  → SC brand standard (navy + cyan + red CTA)
 *   Live analytics block  → SC framing + palette, but keeps the underlying
 *                           recharts canvas (operator-legible)
 *   Simulator screens     → routed to /wellhead-v1, preserved as-is inside
 *                           the SC chrome (technical canvas is simulator-native)
 */

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: "LIVE" | "IN DEVELOPMENT" | "ROADMAP";
  screens: string[];
};

const projects: Project[] = [
  {
    id: "wellhead-v1",
    title: "Wellhead Panel V1",
    subtitle: "Altronic DE-4000",
    description:
      "10-wellhead gas injection control panel. DE-4000 safety shutdown, flow distribution, compressor coordination, and priority-based allocation.",
    tags: ["Gas Injection", "10 Wellheads", "4 Compressors", "DE-4000"],
    status: "LIVE",
    screens: ["Main Overview", "Wellhead Data", "Settings"],
  },
];

export default function HomePage() {
  const [state, setState] = useState<SystemState | null>(null);

  useEffect(() => {
    setState(initState());
    const iv = setInterval(
      () => setState((p) => (p ? tickState(p) : p)),
      2000
    );
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--sc-navy)", color: "var(--sc-white)" }}>
      <SCHeader
        statusBadge={
          state ? (
            <span
              className={
                state.panelStatus === "RUNNING"
                  ? "sc-pill sc-pill--running"
                  : state.panelStatus === "ALARM"
                  ? "sc-pill sc-pill--alarm"
                  : state.panelStatus === "COMM FAULT"
                  ? "sc-pill sc-pill--fault"
                  : "sc-pill sc-pill--idle"
              }
            >
              <span className="sc-pulse" /> {state.panelStatus}
            </span>
          ) : null
        }
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── Projects ─────────────────────────────────────────────────── */}
      <SCSection
        id="simulators"
        eyebrow="Simulators"
        headline="Real-world logic, not just theory."
        lede="Live-data demo environments for field operators and customer sales reviews. Each simulator wraps the same control logic that runs on the actual Altronic DE-4000 panel — no synthetic shortcuts."
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: 24,
          }}
        >
          {projects.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
          <ComingSoonCard />
        </div>
      </SCSection>

      {/* ── Live analytics ───────────────────────────────────────────── */}
      {state && (
        <SCSection
          id="live"
          eyebrow="Live Data"
          headline="Flow is a signal, not a snapshot."
          lede="Injection totals, compressor output, and per-wellhead trends update on a 2-second tick. The same stream drives the operator panel, the foreman dashboard, and this demo surface."
        >
          <div style={{ background: "var(--sc-navy-light)", padding: 24, borderRadius: 2, border: "1px solid rgba(255,255,255,0.06)" }}>
            <AnalyticsDashboard state={state} />
          </div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.65)", fontSize: 13, letterSpacing: 0.6 }}>
              <span className="sc-pulse" />
              Simulated live feed · 2s update · Altronic DE-4000 control logic
            </div>
            <Link href="/wellhead-v1" className="sc-btn-primary">
              Open Operator View →
            </Link>
          </div>
        </SCSection>
      )}

      {/* ── Process / capability strip ───────────────────────────────── */}
      <SCSection
        eyebrow="Capability"
        headline="Built for the field. Tuned for your fleet."
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          <Capability
            title="Field-tested solutions"
            body="Every control loop in the simulator is derived from production panels, not a textbook PID."
          />
          <Capability
            title="Context-aware triage"
            body="Comm loss, discharge override, and priority switching fire under the same conditions your field sees."
          />
          <Capability
            title="Continuous learning"
            body="The simulator is a living artifact — every customer site we tune, we fold the learning back in."
          />
          <Capability
            title="Available anywhere"
            body="Runs in any modern browser. Suited to customer calls, internal review, and engineering drills."
          />
        </div>
      </SCSection>

      <SCFooter />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Local components (kept co-located — single-use at the landing surface)
   ───────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 30% 20%, #0F3C64 0%, #05233E 55%, #03172A 100%)",
      }}
    >
      {/* Hex pattern nod (no real SC photograph embedded — brand-safe) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(73,208,226,0.10) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent 70%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -120, top: 40,
          width: 520, height: 520,
          background:
            "conic-gradient(from 210deg at 50% 50%, rgba(211,32,40,0.24), rgba(211,32,40,0) 35%, rgba(211,32,40,0) 65%, rgba(211,32,40,0.18))",
          filter: "blur(30px)",
          opacity: 0.8,
        }}
      />

      <div
        className="sc-container"
        style={{
          position: "relative",
          zIndex: 1,
          paddingBlock: "clamp(80px, 12vw, 165px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
          gap: 60,
          alignItems: "center",
        }}
      >
        <div>
          <div className="sc-eyebrow" style={{ marginBottom: 18 }}>Service Compression · FieldTune</div>
          <span className="sc-rule" aria-hidden="true" />
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(34px, 5.4vw, 56px)",
              lineHeight: 1.02,
              letterSpacing: "-0.5px",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Gas lift, <span style={{ color: "var(--sc-cyan)" }}>tuned to your fleet</span> — not to a spec sheet.
          </h1>
          <p
            style={{
              marginTop: 24,
              maxWidth: 640,
              fontSize: 19.632,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            A live wellhead simulator built on the same control logic that runs on the
            Altronic DE-4000 panel in the field. Explore the operator view, review the
            compressor coordination, and see how we prioritize flow when the math gets tight.
          </p>
          <div style={{ marginTop: 36, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/wellhead-v1" className="sc-btn-primary">Launch Simulator →</Link>
            <a
              href="#live"
              className="sc-btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("live")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See Live Data
            </a>
          </div>
        </div>

        <HeroMini />
      </div>
    </section>
  );
}

function HeroMini() {
  /** Decorative mini-telemetry card — not a real data feed, just a visual
   *  anchor for the hero. Uses neutral bars with SC palette, no fake KPIs. */
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        background: "rgba(15, 60, 100, 0.5)",
        border: "1px solid rgba(73, 208, 226, 0.25)",
        padding: 24,
        borderRadius: 2,
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <span className="sc-eyebrow">System State</span>
        <span className="sc-pill sc-pill--running"><span className="sc-pulse" /> Running</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { label: "WH Total",  value: "4,397.8", unit: "MSCFD", accent: "var(--sc-cyan)" },
          { label: "Comp Out",  value: "4,321.2", unit: "MSCFD", accent: "#FFFFFF" },
          { label: "Priority",  value: "GAS",     unit: "Mode",  accent: "var(--sc-cyan)" },
          { label: "Suct Hdr",  value: "19.2",    unit: "PSI",   accent: "#FFFFFF" },
        ].map((s) => (
          <div key={s.label} style={{ borderLeft: "3px solid var(--sc-red)", paddingLeft: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.accent, lineHeight: 1.05, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{s.unit}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, height: 6, background: "rgba(0,0,0,0.35)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: "74%", height: "100%", background: "linear-gradient(90deg, var(--sc-cyan), var(--sc-red))" }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: 0.6 }}>
        Injection vs. compressor capacity — 74% utilization
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <Link href={`/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        className="sc-card"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          minHeight: 320,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div className="sc-eyebrow" style={{ marginBottom: 10 }}>{p.subtitle}</div>
            <h3
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: 24,
                lineHeight: 1.15,
                margin: 0,
                color: "#FFFFFF",
              }}
            >
              {p.title}
            </h3>
          </div>
          <span
            className={
              p.status === "LIVE" ? "sc-pill sc-pill--running" : "sc-pill sc-pill--idle"
            }
          >
            {p.status === "LIVE" ? <span className="sc-pulse" /> : null}
            {p.status}
          </span>
        </div>

        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.78)", margin: 0 }}>
          {p.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {p.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase",
                padding: "4px 10px",
                background: "rgba(73, 208, 226, 0.1)",
                color: "var(--sc-cyan)",
                border: "1px solid rgba(73, 208, 226, 0.25)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, color: "rgba(255,255,255,0.55)" }}>
          {p.screens.map((s) => (
            <span
              key={s}
              style={{
                fontSize: 11,
                padding: "3px 8px",
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 700,
            color: "var(--sc-red)",
          }}
        >
          Open Simulator
          <span aria-hidden="true" style={{ fontSize: 18 }}>→</span>
        </div>
      </article>
    </Link>
  );
}

function ComingSoonCard() {
  return (
    <article
      style={{
        background: "transparent",
        border: "1px dashed rgba(255,255,255,0.18)",
        padding: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: 320,
        color: "rgba(255,255,255,0.5)",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>+</div>
      <div
        style={{
          fontSize: 16, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", color: "rgba(255,255,255,0.75)",
        }}
      >
        Add a Simulator
      </div>
      <div style={{ fontSize: 13, marginTop: 10, maxWidth: 260, lineHeight: 1.5 }}>
        Drop in a FUXA JSON export or a new panel spec. The simulator scaffold adapts to it.
      </div>
    </article>
  );
}

function Capability({ title, body }: { title: string; body: string }) {
  return (
    <div>
      {/* Cyan bar treatment mirrors FieldTune feature cards */}
      <div
        style={{
          width: 40, height: 3, background: "var(--sc-cyan)", marginBottom: 16,
        }}
        aria-hidden="true"
      />
      <h3
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.25,
          color: "#FFFFFF",
          margin: 0,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", margin: "10px 0 0" }}>
        {body}
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ background: "var(--sc-navy-light)", padding: 24, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, minHeight: 420 }}>
      <div className="sc-eyebrow">Loading live data…</div>
      <div style={{ height: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ height: 72, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }} />
        ))}
      </div>
      <div style={{ height: 220, marginTop: 16, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }} />
    </div>
  );
}
