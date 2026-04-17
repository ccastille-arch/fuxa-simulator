"use client";
import { SystemState, fmt } from "@/lib/simulator";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { useEffect, useState } from "react";

/**
 * Analytics dashboard — SC-palette repaint.
 *
 * Chart types are preserved (line trend, bar, pie) so operators see the same
 * signal; only the chromatic language changes to match the brand. This keeps
 * data readability intact while making the marketing framing coherent.
 *
 * Palette mapping:
 *   Cyan   (#49D0E2) → primary live metric (WH flow)
 *   White  (#FFFFFF) → secondary metric (compressor output)
 *   Red    (#D32028) → alarm/alert category
 *   Muted white      → neutral capacity background
 */

const SC = {
  cyan:     "#49D0E2",
  red:      "#D32028",
  white:    "#FFFFFF",
  navy:     "#05233E",
  navyUp:   "#0F3C64",
  grid:     "rgba(255, 255, 255, 0.08)",
  axis:     "rgba(255, 255, 255, 0.45)",
  axisStr:  "rgba(255, 255, 255, 0.15)",
  label:    "rgba(255, 255, 255, 0.7)",
  success:  "#4ADE80",
};
const PIE_COLORS = [SC.cyan, "rgba(255,255,255,0.18)"];

export default function AnalyticsDashboard({ state }: { state: SystemState }) {
  const [history, setHistory] = useState<
    { time: string; totalWH: number; totalComp: number }[]
  >([]);

  useEffect(() => {
    const t = new Date();
    const label = t.toLocaleTimeString("en-US", {
      hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    setHistory((h) => [...h.slice(-29), {
      time: label,
      totalWH: state.totalWhFlow,
      totalComp: state.totalCompFlow,
    }]);
  }, [state]);

  const whFlowData = state.wellheads.map((wh) => ({
    name: wh.unitId,
    flow: parseFloat(fmt(wh.actualFlow)),
  }));
  const compData = state.compressors.map((c) => ({
    name: c.unitId,
    capacity: parseFloat(fmt(c.capacity, 1)),
    actual: parseFloat(fmt(c.actualFlow)),
  }));
  const pieData = [
    { name: "Injected",  value: Math.round(state.totalWhFlow) },
    { name: "Available", value: Math.max(0, Math.round(6000 - state.totalCompFlow)) },
  ];

  const tooltipStyle: React.CSSProperties = {
    background: SC.navy,
    border: `1px solid ${SC.axisStr}`,
    fontFamily: "Montserrat, sans-serif",
    fontSize: 12,
    color: SC.white,
    padding: 8,
    borderRadius: 2,
  };
  const legendStyle = { color: SC.label, fontFamily: "Montserrat, sans-serif", fontSize: 12 } as React.CSSProperties;

  return (
    <div style={{ color: SC.white, fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div className="sc-eyebrow" style={{ color: SC.cyan, marginBottom: 4 }}>System Analytics</div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: -0.2 }}>
            Live injection &amp; compressor coordination
          </div>
        </div>
        <div style={{ fontSize: 12, color: SC.label, letterSpacing: 0.6 }}>
          Updated {state.timestamp.toLocaleTimeString("en-US", { hour12: false })}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total WH Flow"   value={`${fmt(state.totalWhFlow)}`}  unit="MSCFD" accent={SC.cyan} />
        <StatCard label="Total Comp Flow" value={`${fmt(state.totalCompFlow)}`} unit="MSCFD" accent={SC.white} />
        <StatCard label="Comp w/ Offset"  value={`${fmt(state.compWithOffset)}`} unit="MSCFD" accent="rgba(255,255,255,0.85)" />
        <StatCard
          label="System Status"
          value={state.panelStatus}
          unit={`State ${state.systemState}`}
          accent={
            state.panelStatus === "RUNNING"    ? SC.success :
            state.panelStatus === "ALARM"      ? SC.red     :
            state.panelStatus === "COMM FAULT" ? "#FFB366"  : SC.label
          }
        />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 16, marginBottom: 16 }}>
        <ChartCard title="Flow Trend (live)" subtitle="2-second tick · last 30 samples">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={SC.grid} strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke={SC.axis} tick={{ fill: SC.label, fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis stroke={SC.axis} tick={{ fill: SC.label, fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: SC.white }} />
              <Legend wrapperStyle={legendStyle} />
              <Line type="monotone" dataKey="totalWH"   stroke={SC.cyan}  strokeWidth={2} dot={false} name="WH Flow (MSCFD)" />
              <Line type="monotone" dataKey="totalComp" stroke={SC.white} strokeWidth={2} dot={false} name="Comp Flow (MSCFD)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Capacity Utilization" subtitle="Injected vs. available headroom">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={78} dataKey="value" stroke="none" paddingAngle={1}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: SC.white }} />
              <Legend wrapperStyle={legendStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ChartCard title="Wellhead Flow Rates" subtitle="MSCFD per wellhead">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={whFlowData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={SC.grid} strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke={SC.axis} tick={{ fill: SC.label, fontSize: 10 }} />
              <YAxis stroke={SC.axis} tick={{ fill: SC.label, fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: SC.white }} />
              <Bar dataKey="flow" fill={SC.cyan} name="Flow (MSCFD)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Compressor Capacity" subtitle="Percent of maximum rated flow">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={compData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={SC.grid} strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke={SC.axis} tick={{ fill: SC.label, fontSize: 10 }} />
              <YAxis stroke={SC.axis} tick={{ fill: SC.label, fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: SC.white }} />
              <Bar dataKey="capacity" fill={SC.white} name="Capacity %" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({
  label, value, unit, accent,
}: { label: string; value: string; unit?: string; accent: string }) {
  return (
    <div style={{
      background: "rgba(0,0,0,0.25)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderLeft: `3px solid ${accent}`,
      padding: "14px 18px",
    }}>
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: accent, letterSpacing: -0.3 }}>{value}</span>
        {unit && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: 0.6, textTransform: "uppercase" }}>{unit}</span>}
      </div>
    </div>
  );
}

function ChartCard({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(0, 0, 0, 0.25)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      padding: 16,
    }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: SC.cyan, fontWeight: 600 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: SC.label, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}
