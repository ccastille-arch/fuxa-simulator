"use client";
import { SystemState, fmt } from "@/lib/simulator";

export default function WellheadDataScreen({ state, onNav }: { state: SystemState; onNav: (s: string) => void }) {
  const { wellheads } = state;

  const statusColor = (s: string) => {
    if (s === "online") return "#00b050";
    if (s === "alarm") return "#c00000";
    if (s === "comms_fault") return "#ff8c00";
    return "#888";
  };

  return (
    <div style={{ background: "#2b2b2b", width: 1024, height: 700, position: "relative", overflow: "hidden", fontFamily: "Roboto, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#333", borderBottom: "3px solid #595959", padding: "6px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Wellhead Data</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onNav("overview")} style={{ background: "#0B5CD5", border: "1px solid #5A9CFE", color: "#fff", padding: "4px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>Overview</button>
          <button onClick={() => onNav("settings")} style={{ background: "#444", border: "1px solid #666", color: "#fff", padding: "4px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>Settings</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: "8px 6px", overflowY: "auto", height: 640 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ ...thStyle, width: 80 }}>Flow ID</th>
              <th style={{ ...thStyle, width: 110 }}>Inj. Flow (MSCFD)</th>
              <th style={{ ...thStyle, width: 110 }}>Static Prs (PSI)</th>
              <th style={{ ...thStyle, width: 110 }}>Diff Prs (PSI)</th>
              <th style={{ ...thStyle, width: 90 }}>Temp (°F)</th>
              <th style={{ ...thStyle, width: 120 }}>PLC Setpoint</th>
              <th style={{ ...thStyle, width: 120 }}>Yesterday Flow</th>
              <th style={{ ...thStyle, width: 80 }}>Status</th>
              <th style={{ ...thStyle, width: 80 }}>Mode</th>
            </tr>
          </thead>
          <tbody>
            {wellheads.map((wh, i) => {
              const rowBg = i % 2 === 0 ? "#a5a5a5" : "#c0c0c0";
              const online = wh.status === "online";
              return (
                <tr key={wh.id} style={{ background: rowBg, borderBottom: "1px solid #7f7f7f" }}>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{wh.unitId}</td>
                  <td style={{ ...tdStyle, color: online ? "#000" : "#666" }}>{online ? fmt(wh.actualFlow) : "---"}</td>
                  <td style={{ ...tdStyle }}>{online ? fmt(wh.gasPress, 0) : "---"}</td>
                  <td style={{ ...tdStyle }}>{online ? fmt(wh.oilPress, 0) : "---"}</td>
                  <td style={{ ...tdStyle }}>{online ? fmt(wh.temp, 1) : "---"}</td>
                  <td style={{ ...tdStyle }}>{fmt(wh.plcSetpoint)}</td>
                  <td style={{ ...tdStyle }}>{fmt(wh.yesterdayFlow)}</td>
                  <td style={{ ...tdStyle }}>
                    <span style={{ color: statusColor(wh.status), fontWeight: 700, fontSize: 12 }}>
                      {wh.status.toUpperCase().replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12 }}>
                    {wh.manAuto === 0 ? "AUTO" : "MANUAL"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals bar */}
        <div style={{ marginTop: 14, background: "#1d1d1d", borderRadius: 8, padding: "10px 16px", display: "flex", gap: 40 }}>
          <div>
            <div style={{ fontSize: 11, color: "#aaa" }}>TOTAL WH FLOW</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#00b050" }}>{fmt(state.totalWhFlow)} <span style={{ fontSize: 13 }}>MSCFD</span></div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#aaa" }}>TOTAL COMP FLOW</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#5A9CFE" }}>{fmt(state.totalCompFlow)} <span style={{ fontSize: 13 }}>MSCFD</span></div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#aaa" }}>COMP w/ OFFSET</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#F9F9F9" }}>{fmt(state.compWithOffset)} <span style={{ fontSize: 13 }}>MSCFD</span></div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#aaa" }}>PRIORITY MODE</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#FFD700" }}>{state.priorityMode === 0 ? "GAS" : "OIL"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "right",
  color: "#757575",
  fontSize: 14,
  fontWeight: 700,
  borderBottom: "1px solid #7f7f7f",
  background: "#f0f0f0",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "right",
  fontSize: 15,
  color: "#000",
};
