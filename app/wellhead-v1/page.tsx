"use client";
import { useEffect, useState } from "react";
import { initState, tickState, SystemState } from "@/lib/simulator";
import OverviewScreen from "@/components/OverviewScreen";
import WellheadDataScreen from "@/components/WellheadDataScreen";
import SettingsScreen from "@/components/SettingsScreen";

type Screen = "overview" | "data" | "settings";

export default function WellheadV1Page() {
  const [state, setState] = useState<SystemState | null>(null);
  const [screen, setScreen] = useState<Screen>("overview");

  useEffect(() => {
    setState(initState());
  }, []);

  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      setState((prev) => (prev ? tickState(prev) : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [!!state]);

  if (!state) return (
    <div style={{ background: "#2b2b2b", width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#00b050", fontSize: 24, fontFamily: "Roboto, sans-serif", fontWeight: 700 }}>Loading FUXA Panel…</div>
    </div>
  );

  return (
    <div style={{ background: "#1a1a1a", minHeight: "100vh", fontFamily: "Roboto, sans-serif" }}>
      {/* Top header bar */}
      <div style={{ background: "#000", padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #595959" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#eeece1", fontSize: 13, fontWeight: 700 }}>⚙</span>
          <span style={{ color: "#eeece1", fontSize: 16, fontWeight: 700 }}>Altronic DE-4000 | Wellhead Panel V1</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#888", fontSize: 12 }}>{state.timestamp.toLocaleTimeString()}</span>
          <span style={{
            padding: "2px 12px", borderRadius: 12,
            background: state.panelStatus === "RUNNING" ? "#00b050" : "#c00000",
            color: "#fff", fontSize: 12, fontWeight: 700
          }}>{state.panelStatus}</span>
          <a href="/" style={{ color: "#888", fontSize: 13, textDecoration: "none" }}>← Projects</a>
        </div>
      </div>

      {/* Screen tabs */}
      <div style={{ background: "#222", borderBottom: "1px solid #444", display: "flex", gap: 2, padding: "4px 16px" }}>
        {([["overview", "Main Overview"], ["data", "Wellhead Data"], ["settings", "Settings"]] as [Screen, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setScreen(id)} style={{
            padding: "6px 16px", borderRadius: "6px 6px 0 0", border: "1px solid #444", borderBottom: "none",
            background: screen === id ? "#2b2b2b" : "#1a1a1a",
            color: screen === id ? "#00b050" : "#888",
            fontWeight: screen === id ? 700 : 400,
            fontSize: 14, cursor: "pointer", transition: "all 0.15s"
          }}>{label}</button>
        ))}
      </div>

      {/* Panel display - 1024px centered */}
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0", overflowX: "auto" }}>
        <div style={{ border: "2px solid #444", borderRadius: 4, overflow: "hidden" }}>
          {screen === "overview" && <OverviewScreen state={state} onNav={(s) => setScreen(s as Screen)} />}
          {screen === "data" && <WellheadDataScreen state={state} onNav={(s) => setScreen(s as Screen)} />}
          {screen === "settings" && <SettingsScreen state={state} onNav={(s) => setScreen(s as Screen)} />}
        </div>
      </div>

      {/* Live data indicator */}
      <div style={{ textAlign: "center", padding: 8, color: "#555", fontSize: 12 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00b050", display: "inline-block", animation: "pulse 2s infinite" }} />
          Simulated live data • Updates every 2s • Altronic DE-4000 Wellhead Control Panel
        </span>
      </div>
    </div>
  );
}
