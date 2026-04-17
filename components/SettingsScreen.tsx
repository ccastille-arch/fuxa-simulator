"use client";
import { SystemState, fmt } from "@/lib/simulator";

export default function SettingsScreen({ state, onNav }: { state: SystemState; onNav: (s: string) => void }) {
  return (
    <div style={{ background: "#2b2b2b", width: 1024, height: 700, fontFamily: "Roboto, sans-serif", overflow: "hidden" }}>
      {/* SC-branded header strip */}
      <div style={{
        background: "linear-gradient(180deg, #05233E 0%, #0F3C64 100%)",
        borderBottom: "2px solid #D32028",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#49D0E2",
            fontWeight: 600,
          }}>Operator · Configuration</div>
          <span style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 20, fontWeight: 800, letterSpacing: -0.3, color: "#fff",
          }}>Settings</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onNav("overview")}
            style={{
              background: "#D32028",
              border: 0,
              color: "#fff",
              padding: "6px 14px",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >← Home</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16 }}>
        {/* Compressor Settings */}
        <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16 }}>
          <h2 style={{ color: "#000", fontSize: 22, fontWeight: 700, margin: "0 0 16px 0", textAlign: "center" }}>Comp Settings</h2>
          {state.compressors.map((comp) => (
            <div key={comp.id} style={{ marginBottom: 12, background: "#ccc", borderRadius: 6, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 16, minWidth: 80 }}>{comp.unitId}</span>
                <span style={{ fontSize: 14 }}>Flow SP:</span>
                <input readOnly value={fmt(comp.flowSP)} style={{ width: 80, textAlign: "right", border: "none", background: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 14 }} />
                <span style={{ fontSize: 13 }}>MSCFD</span>
                <span style={{ marginLeft: 8, padding: "2px 10px", borderRadius: 4, background: comp.status === "running" ? "#00b050" : "#888", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                  {comp.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Flow Settings + Priority */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16 }}>
            <h2 style={{ color: "#000", fontSize: 22, fontWeight: 700, margin: "0 0 12px 0", textAlign: "center" }}>Flow Settings</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {state.wellheads.map((wh) => (
                <div key={wh.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#ddd", borderRadius: 4, padding: "4px 8px" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, minWidth: 60 }}>{wh.unitId}</span>
                  <input readOnly value={fmt(wh.plcSetpoint)} style={{ width: 70, textAlign: "right", border: "none", background: "#fff", padding: "1px 4px", borderRadius: 3, fontSize: 13 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Priority Adjust */}
          <div style={{ background: "#0D6EFD", borderRadius: 8, padding: 16, color: "#fff" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px 0", textAlign: "center" }}>Priority Adjust</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>Mode:</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: "#FFD700" }}>{state.priorityMode === 0 ? "GAS PRIORITY" : "OIL PRIORITY"}</span>
            </div>
            <table style={{ width: "100%", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ color: "#adf", textAlign: "left", padding: "2px 4px" }}>Wellhead</th>
                  <th style={{ color: "#adf", padding: "2px 4px" }}>Gas Pri</th>
                  <th style={{ color: "#adf", padding: "2px 4px" }}>Oil Pri</th>
                  <th style={{ color: "#adf", padding: "2px 4px" }}>Desired Flow</th>
                </tr>
              </thead>
              <tbody>
                {state.wellheads.map((wh) => (
                  <tr key={wh.id}>
                    <td style={{ color: "#fff", padding: "2px 4px" }}>{wh.unitId}</td>
                    <td style={{ color: "#fff", textAlign: "center", padding: "2px 4px" }}>{wh.gasPriority}</td>
                    <td style={{ color: "#fff", textAlign: "center", padding: "2px 4px" }}>{wh.oilPriority}</td>
                    <td style={{ color: "#fff", textAlign: "right", padding: "2px 4px" }}>{fmt(wh.controlledFlow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button style={{ background: "#05285B", color: "#fff", padding: "4px 16px", borderRadius: 4, border: "none", fontWeight: 700, cursor: "pointer" }}>Set</button>
              <button style={{ background: "#96242F", color: "#fff", padding: "4px 16px", borderRadius: 4, border: "none", fontWeight: 700, cursor: "pointer" }}>Clear</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
