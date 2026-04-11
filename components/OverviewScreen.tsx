"use client";
import { SystemState, fmt, STATE_NAMES } from "@/lib/simulator";

const C = {
  bg: "#2b2b2b",
  panel: "#4D4D4D",
  green: "#00b050",
  red: "#c00000",
  blue: "#5A9CFE",
  blueDark: "#0B5CD5",
  white: "#FFFFFF",
  gray: "#595959",
  darkGray: "#333333",
  lightGray: "#666666",
  textMuted: "rgba(77,77,77,0.5)",
  alarmBg: "#3a1200",
};

function WellheadRow({ wh, rowY, rowH }: {
  wh: SystemState["wellheads"][0];
  rowY: number;
  rowH: number;
}) {
  const isOnline = wh.status === "online";
  const isAlarm = wh.status === "alarm" || wh.flowStatus === "BAD";
  const isFault = wh.status === "comms_fault";
  const panelFill = isFault ? "#2a2000" : isAlarm ? C.alarmBg : C.panel;
  const ph = rowH - 4;

  return (
    <g>
      {/* Background */}
      <rect x="462" y={rowY + 2} width="556" height={ph} rx="12" ry="12" fill={panelFill} stroke={isAlarm ? C.red : "#000"} strokeWidth={isAlarm ? 1.5 : 1} />

      {/* Unit ID box */}
      <rect x="461" y={rowY + 1} width="174" height="17" rx="7" ry="7" fill={isFault ? "#888" : C.white} stroke="#000" />
      <text x="470" y={rowY + 14} fontSize="13" fontFamily="Roboto, sans-serif" fontWeight="700" fill={isFault ? "#eee" : "#000"}>{wh.unitId}</text>

      {/* Flow status badge */}
      {isOnline && (
        <rect x="637" y={rowY + 1} width="36" height="17" rx="6" fill={wh.flowStatus === "GOOD" ? C.green : C.red} />
      )}
      {isOnline && (
        <text x="655" y={rowY + 14} fontSize="10" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="middle" fill={C.white}>{wh.flowStatus}</text>
      )}

      {/* Local flow */}
      <text x="469" y={rowY + 33} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Local:</text>
      <text x="510" y={rowY + 33} fontSize="14" fontFamily="Roboto, sans-serif" fontWeight="700" fill={isOnline ? C.white : "#666"}>
        {isOnline ? fmt(wh.localFlow) : "---"}
      </text>

      {/* Mode indicator */}
      <rect x="464" y={rowY + 37} width="100" height="16" rx="6" fill={wh.manAuto === 0 ? C.blue : "#ff8c00"} opacity="0.9" />
      <text x="514" y={rowY + 49} fontSize="10" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="middle" fill={C.white}>
        {isFault ? "COMM FAULT" : wh.manAuto === 0 ? "AUTO" : "MANUAL"}
      </text>

      {/* Controlled flow (gray box) */}
      <rect x="645" y={rowY + 2} width="156" height={ph - 4} rx="7" fill={C.lightGray} />
      <text x="658" y={rowY + 20} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Controlled flow:</text>
      <text x="658" y={rowY + 41} fontSize="17" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>
        {isOnline ? fmt(wh.controlledFlow) : "---"}
      </text>
      <text x="658" y={rowY + 57} fontSize="10" fontFamily="Roboto, sans-serif" fill="#ccc">
        PID: {isOnline ? fmt(wh.pidOutput) : "--"}%
      </text>

      {/* Actual flow */}
      <text x="820" y={rowY + 20} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Actual flow:</text>
      <text x="820" y={rowY + 41} fontSize="17" fontFamily="Roboto, sans-serif" fontWeight="700"
        fill={wh.flowStatus === "BAD" ? C.red : C.white}>
        {isOnline ? fmt(wh.actualFlow) : "---"}
      </text>

      {/* GP / OP */}
      <rect x="892" y={rowY + 1} width="122" height="17" rx="7" fill={C.white} />
      <text x="903" y={rowY + 13} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#000">G.P.:</text>
      <text x="960" y={rowY + 13} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#000">O.P.:</text>
      <text x="926" y={rowY + 13} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#333">
        {isOnline ? fmt(wh.gasPress, 0) : "--"}
      </text>
      <text x="984" y={rowY + 13} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#333">
        {isOnline ? fmt(wh.oilPress, 0) : "--"}
      </text>

      {/* SP */}
      <text x="892" y={rowY + 35} fontSize="11" fontFamily="Roboto, sans-serif" fill="#ccc">SP:</text>
      <text x="913" y={rowY + 35} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>{fmt(wh.plcSetpoint)}</text>
      <text x="892" y={rowY + 52} fontSize="11" fontFamily="Roboto, sans-serif" fill="#ccc">Temp:</text>
      <text x="924" y={rowY + 52} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>{isOnline ? fmt(wh.temp, 0) + "°F" : "--"}</text>
    </g>
  );
}

function CompressorPanel({ comp, x, y, h }: { comp: SystemState["compressors"][0]; x: number; y: number; h: number }) {
  const running = comp.status === "running";
  const capH = h - 20;
  const capFill = running ? (comp.capacity / 100) * capH : 0;
  const dschHigh = comp.dischargePressure > 824; // 800 * 1.03

  return (
    <g>
      <rect x={x} y={y} width="218" height={h} rx="12" ry="12" fill={C.panel} stroke={running ? C.green : "#444"} strokeWidth={running ? 1.5 : 1} />

      {/* Header */}
      <rect x={x} y={y} width="148" height="22" rx="8" ry="8" fill={running ? "#1a3a1a" : "#222"} />
      <text x={x + 6} y={y + 16} fontSize="14" fontFamily="Roboto, sans-serif" fontWeight="700" fill={running ? C.green : "#888"}>{comp.unitId}</text>

      {/* Status badge */}
      <rect x={x + 154} y={y + 2} width="58" height="18" rx="6" fill={running ? C.green : "#555"} />
      <text x={x + 183} y={y + 15} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="middle" fill={C.white}>
        {running ? "RUNNING" : comp.status.toUpperCase()}
      </text>

      <text x={x + 6} y={y + 38} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Desired flow:</text>
      <text x={x + 6} y={y + 54} fontSize="15" fontFamily="Roboto, sans-serif" fill={C.white}>{running ? fmt(comp.desiredFlow) : "---"}</text>

      {/* Actual flow (black box) */}
      <rect x={x + 2} y={y + 60} width="140" height="40" rx="7" fill="#111" />
      <text x={x + 8} y={y + 76} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Actual flow:</text>
      <text x={x + 8} y={y + 95} fontSize="15" fontFamily="Roboto, sans-serif" fill={C.white}>{running ? fmt(comp.actualFlow) : "---"}</text>

      <text x={x + 6} y={y + 116} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Max: {fmt(comp.maxFlow)}</text>

      {/* Discharge pressure */}
      <rect x={x + 2} y={y + 122} width="140" height="28" rx="6" fill={dschHigh ? "#3a0000" : "#1a1a1a"} />
      <text x={x + 8} y={y + 135} fontSize="11" fontFamily="Roboto, sans-serif" fill="#aaa">Dsch Prs:</text>
      <text x={x + 8} y={y + 146} fontSize="13" fontFamily="Roboto, sans-serif" fontWeight="700" fill={dschHigh ? C.red : C.white}>
        {running ? fmt(comp.dischargePressure, 0) + " PSI" : "---"}
      </text>

      {/* Capacity bar */}
      <rect x={x + 148} y={y + 26} width="20" height={capH} fill={C.white} stroke="#000" rx="3" />
      <rect x={x + 148} y={y + 26 + (capH - capFill)} width="20" height={capFill} fill={running ? C.green : "#555"} rx="3" />
      <text x={x + 170} y={y + 42} fontSize="9" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>C</text>
      <text x={x + 170} y={y + 54} fontSize="9" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>A</text>
      <text x={x + 170} y={y + 66} fontSize="9" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>P</text>
      <text x={x + 170} y={y + 78} fontSize="9" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>%</text>
      <text x={x + 160} y={y + h - 2} fontSize="10" fontFamily="Roboto, sans-serif" fill={C.white}>{running ? fmt(comp.capacity, 0) : "0"}%</text>
    </g>
  );
}

export default function OverviewScreen({ state, onNav }: { state: SystemState; onNav: (screen: string) => void }) {
  const { wellheads, compressors, totalCompFlow, totalWhFlow, compWithOffset,
    whFlowPercent, priorityMode, systemState, dischargePressureOverride,
    commLossOverride, alarms, suctionHeaderPressure } = state;

  const maxCap = 6000;
  const totalBar = 664;
  const whFill = Math.min((totalWhFlow / maxCap) * totalBar, totalBar);
  const compFill = Math.min((totalCompFlow / maxCap) * totalBar, totalBar);

  const rowH = 700 / 10;  // 70px per row
  const compH = 700 / 4;  // 175px per compressor

  const headerAlarmColor = commLossOverride ? "#ff8c00" : dischargePressureOverride ? C.red : alarms.length > 0 ? C.red : C.green;

  return (
    <svg width="1024" height="700" viewBox="0 0 1024 700" style={{ background: C.bg, display: "block" }}>
      {/* ── Top status bar ── */}
      <rect x="0" y="0" width="1024" height="24" fill={C.darkGray} />
      <text x="10" y="17" fontSize="13" fontFamily="Roboto, sans-serif" fontWeight="700" fill={headerAlarmColor}>
        {STATE_NAMES[systemState] ?? "Unknown"} | State {systemState}
      </text>
      <text x="280" y="17" fontSize="12" fontFamily="Roboto, sans-serif" fill={dischargePressureOverride ? C.red : "#888"}>
        {dischargePressureOverride ? "⚠ DSCH PRESSURE OVERRIDE ACTIVE" : ""}
      </text>
      <text x="530" y="17" fontSize="12" fontFamily="Roboto, sans-serif" fill={commLossOverride ? "#ff8c00" : "#888"}>
        {commLossOverride ? "⚠ COMM LOSS — OVERRIDE ACTIVE" : ""}
      </text>
      <text x="800" y="17" fontSize="12" fontFamily="Roboto, sans-serif" fill="#888">
        Priority: <tspan fill={priorityMode === 0 ? C.blue : "#FFD700"} fontWeight="700">{priorityMode === 0 ? "GAS" : "OIL"}</tspan>
      </text>
      <text x="940" y="17" fontSize="11" fontFamily="Roboto, sans-serif" fill="#555">
        Suct: {fmt(suctionHeaderPressure, 1)} PSI
      </text>

      {/* ── TOTAL FLOW center bar ── */}
      <rect x="414" y="25" width="29" height={totalBar} fill={C.white} stroke="#000" />
      <rect x="414" y={25 + totalBar - whFill} width="29" height={whFill} fill={C.green} />
      <rect x="414" y={25 + totalBar - compFill} width="29" height={compFill} fill="rgba(192,0,0,0.25)" />
      {/* TOTAL letters */}
      {["T","O","T","A","L"].map((ch, i) => (
        <text key={i} x="428" y={170 + i * 36} fontSize="28" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="middle" fill={C.textMuted}>{ch}</text>
      ))}
      {/* FLOW letters */}
      {["F","L","O","W"].map((ch, i) => (
        <text key={i} x="428" y={380 + i * 36} fontSize="28" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="middle" fill={C.textMuted}>{ch}</text>
      ))}
      <text x="428" y="698" fontSize="14" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="middle" fill={C.white}>{fmt(whFlowPercent)}%</text>

      {/* ── Left panel: Totals ── */}
      <text x="397" y="55" fontSize="13" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill={C.white}>Comp w/ Offset</text>
      <text x="397" y="90" fontSize="30" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill="#F9F9F9">{fmt(compWithOffset)}</text>
      <line x1="250" y1="118" x2="396" y2="118" stroke="#F9F9F9" strokeWidth="9" strokeLinecap="round" />
      <text x="397" y="148" fontSize="13" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill={C.white}>COMP total</text>
      <text x="397" y="182" fontSize="30" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill="#F9F9F9">{fmt(totalCompFlow)}</text>
      <text x="250" y="220" fontSize="13" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="start" fill={C.white}>WH total</text>
      <text x="397" y="252" fontSize="30" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill="#F9F9F9">{fmt(totalWhFlow)}</text>

      {/* ── Compressor panels (left, below totals) ── */}
      {compressors.map((comp, i) => (
        <CompressorPanel key={comp.id} comp={comp} x={4} y={28 + 168 * i} h={162} />
      ))}

      {/* ── Wellhead rows (right) ── */}
      {wellheads.map((wh, i) => (
        <WellheadRow key={wh.id} wh={wh} rowY={i * rowH} rowH={rowH} />
      ))}

      {/* ── Active alarms strip (bottom) ── */}
      {alarms.length > 0 && (
        <g>
          <rect x="0" y="678" width="460" height="22" fill="#3a0000" />
          <text x="8" y="693" fontSize="11" fontFamily="Roboto, sans-serif" fill={C.red} fontWeight="700">
            ⚠ {alarms[0].message} {alarms.length > 1 ? `(+${alarms.length - 1} more)` : ""}
          </text>
        </g>
      )}

      {/* ── Nav buttons ── */}
      <g onClick={() => onNav("data")} style={{ cursor: "pointer" }}>
        <rect x="248" y="678" width="100" height="22" rx="5" fill={C.blueDark} />
        <text x="298" y="693" fontSize="12" fontWeight="700" textAnchor="middle" fill={C.white}>Wellhead Data</text>
      </g>
      <g onClick={() => onNav("settings")} style={{ cursor: "pointer" }}>
        <rect x="354" y="678" width="58" height="22" rx="5" fill="#444" />
        <text x="383" y="693" fontSize="12" fontWeight="700" textAnchor="middle" fill={C.white}>Settings</text>
      </g>
    </svg>
  );
}
