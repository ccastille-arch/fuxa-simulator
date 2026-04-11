"use client";
import { SystemState, fmt } from "@/lib/simulator";

// Colors matching actual FUXA panel
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
};

function WellheadRow({ wh, y, svgH }: { wh: SystemState["wellheads"][0]; y: number; svgH: number }) {
  const isOnline = wh.status === "online";
  const isAlarm = wh.status === "alarm";
  const rowH = svgH / 10;
  const panelY = y + 2;
  const panelH = rowH - 4;

  return (
    <g>
      {/* Background panel */}
      <rect x="462" y={panelY} width="556" height={panelH} rx="14" ry="14"
        fill={isAlarm ? "#3a0000" : C.panel} stroke="#000" />

      {/* Unit ID white box */}
      <rect x="461" y={panelY} width="182" height="18" rx="8" ry="8" fill={C.white} stroke="#000" />
      <text x="471" y={panelY + 14} fontSize="14" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#000">{wh.unitId}</text>

      {/* Local flow label + value */}
      <text x="469" y={panelY + 32} fontSize="14" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Local flow:</text>
      <text x="469" y={panelY + 50} fontSize="18" fontFamily="Roboto, sans-serif" fontWeight="700" fill={isOnline ? C.white : "#888"}>
        {isOnline ? fmt(wh.localFlow) : "---"}
      </text>

      {/* Remote flow indicator (blue) */}
      <rect x="464" y={panelY + 19} width="140" height="20" rx="8" ry="8" fill={C.blue} stroke={C.blueDark} />
      <text x="534" y={panelY + 33} fontSize="13" fontFamily="Roboto, sans-serif" fontWeight="700"
        textAnchor="middle" fill="#F9F9F9">Remote flow</text>

      {/* Controlled flow box (gray) */}
      <rect x="645" y={panelY + 2} width="162" height={panelH - 4} rx="8" ry="8" fill={C.lightGray} />
      <text x="659" y={panelY + 22} fontSize="14" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Controlled flow:</text>
      <text x="659" y={panelY + 44} fontSize="18" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>
        {isOnline ? fmt(wh.controlledFlow) : "---"}
      </text>

      {/* Actual flow */}
      <text x="822" y={panelY + 22} fontSize="14" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Actual flow:</text>
      <text x="822" y={panelY + 44} fontSize="18" fontFamily="Roboto, sans-serif" fontWeight="700"
        fill={isAlarm ? C.red : C.white}>
        {isOnline ? fmt(wh.actualFlow) : "---"}
      </text>

      {/* GP / OP box */}
      <rect x="892" y={panelY} width="122" height="18" rx="8" ry="8" fill={C.white} />
      <text x="912" y={panelY + 13} fontSize="13" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#000">G.P.:</text>
      <text x="974" y={panelY + 13} fontSize="13" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#000">O.P.:</text>
      <text x="932" y={panelY + 13} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#000">
        {isOnline ? fmt(wh.gasPress, 0) : "--"}
      </text>
      <text x="994" y={panelY + 13} fontSize="12" fontFamily="Roboto, sans-serif" fontWeight="700" fill="#000">
        {isOnline ? fmt(wh.oilPress, 0) : "--"}
      </text>
    </g>
  );
}

function CompressorPanel({ comp, x, y }: { comp: SystemState["compressors"][0]; x: number; y: number }) {
  const running = comp.status === "running";
  const capH = 152;
  const capFill = (comp.capacity / 100) * capH;

  return (
    <g>
      <rect x={x} y={y} width="238" height="158" rx="16" ry="16" fill={C.panel} stroke="#000" />
      {/* Unit ID */}
      <rect x={x - 2} y={y} width="150" height="24" rx="8" ry="8" fill={C.white} stroke="#000" />
      <text x={x + 6} y={y + 17} fontSize="16" fontFamily="Roboto, sans-serif" fontWeight="500" fill="#000">{comp.unitId}</text>
      {/* Desired flow */}
      <text x={x + 6} y={y + 40} fontSize="16" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Desired flow:</text>
      <text x={x + 6} y={y + 60} fontSize="17" fontFamily="Roboto, sans-serif" fill={C.white}>{running ? fmt(comp.desiredFlow) : "---"}</text>
      {/* Actual flow */}
      <rect x={x - 2} y={y + 65} width="148" height="44" rx="8" ry="8" fill="#000" />
      <text x={x + 6} y={y + 83} fontSize="14" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Actual flow:</text>
      <text x={x + 6} y={y + 103} fontSize="17" fontFamily="Roboto, sans-serif" fill={C.white}>{running ? fmt(comp.actualFlow) : "---"}</text>
      {/* Max flow */}
      <text x={x + 6} y={y + 128} fontSize="14" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>Max flow:</text>
      <text x={x + 6} y={y + 148} fontSize="17" fontFamily="Roboto, sans-serif" fill={C.white}>{fmt(comp.maxFlow)}</text>
      {/* Capacity bar */}
      <rect x={x + 162} y={y + 2} width="22" height={capH} fill={C.white} stroke="#000" />
      <rect x={x + 162} y={y + 2 + (capH - capFill)} width="22" height={capFill} fill={running ? C.green : "#555"} stroke="#000" />
      <text x={x + 196} y={y + 20} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>C</text>
      <text x={x + 196} y={y + 35} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>A</text>
      <text x={x + 196} y={y + 50} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>P</text>
      <text x={x + 196} y={y + 65} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>A</text>
      <text x={x + 196} y={y + 80} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>C</text>
      <text x={x + 196} y={y + 95} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>I</text>
      <text x={x + 196} y={y + 110} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>T</text>
      <text x={x + 196} y={y + 125} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.textMuted}>Y</text>
      <text x={x + 178} y={y + 155} fontSize="11" fontFamily="Roboto, sans-serif" fontWeight="700" fill={C.white}>{fmt(comp.capacity)}%</text>
    </g>
  );
}

export default function OverviewScreen({ state, onNav }: { state: SystemState; onNav: (screen: string) => void }) {
  const { wellheads, compressors, totalCompFlow, totalWhFlow, compWithOffset, whFlowPercent, compCapacityPercent } = state;
  const maxCap = 6000;
  const totalBar = 672;
  const whFill = Math.min((totalWhFlow / maxCap) * totalBar, totalBar);
  const compFill = Math.min((totalCompFlow / maxCap) * totalBar, totalBar);

  return (
    <svg
      width="1024" height="700"
      viewBox="0 0 1024 700"
      style={{ background: C.bg, display: "block" }}
      fontFamily="Roboto, sans-serif"
    >
      {/* ── Header bar ── */}
      <rect x="-10" y="0" width="1044" height="7" fill={C.darkGray} stroke={C.gray} />

      {/* ── TOTAL FLOW center bar ── */}
      {/* Background (white) */}
      <rect x="414" y="8" width="29" height="672" fill={C.white} stroke="#000" />
      {/* WH fill (green) */}
      <rect x="414" y={8 + totalBar - whFill} width="29" height={whFill} fill={C.green} />
      {/* Comp fill overlay (darker) */}
      <rect x="414" y={8 + totalBar - compFill} width="29" height={compFill} fill="rgba(192,0,0,0.3)" />
      {/* "TOTAL" vertical label */}
      {["T","O","T","A","L"].map((ch, i) => (
        <text key={i} x="428" y={170 + i*38} fontSize="30" fontFamily="Roboto, sans-serif" fontWeight="700"
          textAnchor="middle" fill={C.textMuted}>{ch}</text>
      ))}
      {/* "FLOW" vertical label */}
      {["F","L","O","W"].map((ch, i) => (
        <text key={i} x="428" y={408 + i*38} fontSize="30" fontFamily="Roboto, sans-serif" fontWeight="700"
          textAnchor="middle" fill={C.textMuted}>{ch}</text>
      ))}
      {/* Total value at bottom */}
      <text x="428" y="692" fontSize="16" fontFamily="Roboto, sans-serif" fontWeight="700"
        textAnchor="middle" fill={C.white}>{fmt(whFlowPercent)}%</text>

      {/* ── Left panel: Totals ── */}
      {/* Comp with Offset */}
      <text x="397" y="215" fontSize="16" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill={C.white}>Comp w/ Offset</text>
      <text x="397" y="254" fontSize="33" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill="#F9F9F9">{fmt(compWithOffset)}</text>
      {/* Divider */}
      <line x1="290" y1="350" x2="396" y2="350" stroke="#F9F9F9" strokeWidth="11" strokeLinecap="round" />
      {/* COMP total */}
      <text x="397" y="303" fontSize="16" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill={C.white}>COMP total</text>
      <text x="397" y="339" fontSize="33" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill="#F9F9F9">{fmt(totalCompFlow)}</text>
      {/* WH total */}
      <text x="307" y="372" fontSize="16" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="start" fill={C.white}>WH total</text>
      <text x="397" y="409" fontSize="33" fontFamily="Roboto, sans-serif" fontWeight="700" textAnchor="end" fill="#F9F9F9">{fmt(totalWhFlow)}</text>

      {/* ── Compressor panels (left) ── */}
      {compressors.map((comp, i) => (
        <CompressorPanel key={comp.id} comp={comp} x={4} y={8 + i * 173} />
      ))}

      {/* ── Wellhead rows (right) ── */}
      {wellheads.map((wh, i) => (
        <WellheadRow key={wh.id} wh={wh} y={i * 70} svgH={700} />
      ))}

      {/* ── Nav buttons ── */}
      <g onClick={() => onNav("data")} style={{ cursor: "pointer" }}>
        <rect x="2" y="652" width="130" height="44" rx="8" fill={C.blueDark} stroke={C.blue} />
        <text x="67" y="679" fontSize="15" fontWeight="700" textAnchor="middle" fill={C.white}>Wellhead Data</text>
      </g>
      <g onClick={() => onNav("settings")} style={{ cursor: "pointer" }}>
        <rect x="140" y="652" width="100" height="44" rx="8" fill="#444" stroke="#666" />
        <text x="190" y="679" fontSize="15" fontWeight="700" textAnchor="middle" fill={C.white}>Settings</text>
      </g>
    </svg>
  );
}
