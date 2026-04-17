"use client";
import { useEffect, useState } from "react";
import { initState, tickState, SystemState, STATE_NAMES } from "@/lib/simulator";
import OverviewScreen from "@/components/OverviewScreen";
import WellheadDataScreen from "@/components/WellheadDataScreen";
import SettingsScreen from "@/components/SettingsScreen";
import SCHeader from "@/components/brand/SCHeader";
import SCFooter from "@/components/brand/SCFooter";

type Screen = "overview" | "data" | "settings";

/**
 * Wellhead Panel V1 — SC-branded shell + simulator-native HMI canvas.
 *
 * Explicit contract with the brand guidance:
 *   - Chrome (SC header, screen tab strip, sub-status band, live indicator,
 *     footer) uses the full SC design system: navy #05233E, Montserrat,
 *     SC red #D32028 accents, FieldTune cyan #49D0E2 where appropriate.
 *   - The inner 1024×700 SVG (Overview) and the HMI table chrome inside
 *     WellheadDataScreen / SettingsScreen are simulator-native on purpose:
 *     they match the Altronic DE-4000 panel appearance operators know.
 *
 * Additional fix (per Phase 1 roadmap): a real RESET control that rewinds
 * simulation state, not just narration text. This closes a known credibility
 * gap called out in the meeting transcript.
 */
export default function WellheadV1Page() {
  const [state, setState] = useState<SystemState | null>(null);
  const [screen, setScreen] = useState<Screen>("overview");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setState(initState());
  }, []);

  useEffect(() => {
    if (!state || paused) return;
    const interval = setInterval(() => {
      setState((prev) => (prev ? tickState(prev) : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [!!state, paused]);

  if (!state) {
    return (
      <div
        style={{
          background: "var(--sc-navy)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--sc-cyan)",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontSize: 14,
        }}
      >
        <span className="sc-pulse" style={{ marginRight: 12 }} />
        Initializing Wellhead Panel…
      </div>
    );
  }

  const pillClass =
    state.panelStatus === "RUNNING"    ? "sc-pill sc-pill--running"  :
    state.panelStatus === "ALARM"      ? "sc-pill sc-pill--alarm"    :
    state.panelStatus === "COMM FAULT" ? "sc-pill sc-pill--fault"    :
    state.panelStatus === "STARTUP"    ? "sc-pill sc-pill--comm"     :
                                         "sc-pill sc-pill--idle";

  const handleReset = () => {
    // Full state reset — not just UI text. Fixes the Phase 1 credibility bug.
    setState(initState());
    setPaused(false);
  };

  return (
    <div style={{ background: "var(--sc-navy)", minHeight: "100vh", color: "var(--sc-white)" }}>
      <SCHeader
        statusBadge={
          <span className={pillClass}>
            <span className="sc-pulse" /> {state.panelStatus}
          </span>
        }
      />

      {/* ── Sub-status band ─────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--sc-navy-muted)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="sc-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingBlock: 14,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div className="sc-eyebrow" style={{ color: "var(--sc-cyan)", marginBottom: 2 }}>
                Altronic DE-4000
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.2 }}>
                Wellhead Panel V1 · State {state.systemState} · {STATE_NAMES[state.systemState] ?? "Unknown"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <SubStat label="Priority" value={state.priorityMode === 0 ? "GAS" : "OIL"} accent={state.priorityMode === 0 ? "var(--sc-cyan)" : "#FFD700"} />
            <SubStat label="Suct Hdr" value={`${state.suctionHeaderPressure.toFixed(1)} PSI`} />
            <SubStat label="Alarms" value={String(state.alarms.length)} accent={state.alarms.length ? "var(--sc-red)" : undefined} />
            <SubStat label="Clock" value={state.timestamp.toLocaleTimeString("en-US", { hour12: false })} mono />
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              className="sc-btn-ghost"
              style={{ padding: "8px 18px", fontSize: 11 }}
              aria-pressed={paused}
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="sc-btn-primary"
              style={{ padding: "8px 18px", fontSize: 11 }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Screen tabs (SC treatment, chrome only) ─────────────────── */}
      <div style={{ background: "var(--sc-navy)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="sc-container">
          <div role="tablist" style={{ display: "flex", gap: 4 }}>
            {([
              ["overview", "Main Overview"],
              ["data",     "Wellhead Data"],
              ["settings", "Settings"],
            ] as [Screen, string][]).map(([id, label]) => {
              const active = screen === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setScreen(id)}
                  style={{
                    padding: "14px 22px",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    background: "transparent",
                    color: active ? "var(--sc-white)" : "rgba(255,255,255,0.55)",
                    border: 0,
                    borderBottom: active ? "2px solid var(--sc-red)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "color 180ms",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--sc-white)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Simulator-native HMI canvas ─────────────────────────────── */}
      <div className="sc-container" style={{ paddingBlock: 30 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
              background: "#2b2b2b", // preserve HMI native background under 1024×700 canvas
              minWidth: 1024, // prevent clipping in Safari/Chrome — Phase 1 fix
            }}
          >
            {screen === "overview" && <OverviewScreen state={state} onNav={(s) => setScreen(s as Screen)} />}
            {screen === "data"     && <WellheadDataScreen state={state} onNav={(s) => setScreen(s as Screen)} />}
            {screen === "settings" && <SettingsScreen state={state} onNav={(s) => setScreen(s as Screen)} />}
          </div>
        </div>

        {/* Live data indicator band */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            color: "rgba(255,255,255,0.65)",
            fontSize: 13,
            letterSpacing: 0.6,
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span className="sc-pulse" />
            {paused
              ? "Simulation paused · state frozen for review"
              : "Simulated live feed · 2s tick · Altronic DE-4000 control logic"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase" }}>
            Operator View · V1
          </div>
        </div>
      </div>

      <SCFooter />
    </div>
  );
}

function SubStat({
  label, value, accent, mono,
}: { label: string; value: string; accent?: string; mono?: boolean }) {
  return (
    <div style={{ paddingLeft: 12, borderLeft: `2px solid ${accent ?? "rgba(255,255,255,0.25)"}` }}>
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
        {label}
      </div>
      <div style={{
        fontSize: 14, fontWeight: 700, color: accent ?? "#FFFFFF",
        fontFamily: mono ? "ui-monospace, Menlo, monospace" : "Montserrat, sans-serif",
        lineHeight: 1.1, marginTop: 2,
      }}>
        {value}
      </div>
    </div>
  );
}
