"use client";
import { SystemState, fmt } from "@/lib/simulator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#00b050", "#5A9CFE", "#FFD700", "#c00000", "#ff8c00", "#a855f7"];

export default function AnalyticsDashboard({ state }: { state: SystemState }) {
  const [history, setHistory] = useState<{ time: string; totalWH: number; totalComp: number }[]>([]);

  useEffect(() => {
    const t = new Date();
    const label = t.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setHistory((h) => [...h.slice(-29), { time: label, totalWH: state.totalWhFlow, totalComp: state.totalCompFlow }]);
  }, [state]);

  const whFlowData = state.wellheads.map((wh) => ({ name: wh.unitId, flow: parseFloat(fmt(wh.actualFlow)) }));
  const compData = state.compressors.map((c) => ({ name: c.unitId, capacity: parseFloat(fmt(c.capacity, 1)), actual: parseFloat(fmt(c.actualFlow)) }));

  const pieData = [
    { name: "WH Flow", value: Math.round(state.totalWhFlow) },
    { name: "Available Cap", value: Math.max(0, Math.round(6000 - state.totalCompFlow)) },
  ];

  return (
    <div style={{ background: "#111", padding: 20, borderRadius: 12, color: "#fff", fontFamily: "Roboto, sans-serif" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#00b050" }}>System Analytics</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total WH Flow" value={`${fmt(state.totalWhFlow)} MSCFD`} color="#00b050" />
        <StatCard label="Total Comp Flow" value={`${fmt(state.totalCompFlow)} MSCFD`} color="#5A9CFE" />
        <StatCard label="Comp w/ Offset" value={`${fmt(state.compWithOffset)} MSCFD`} color="#F9F9F9" />
        <StatCard label="System Status" value={state.panelStatus} color={state.panelStatus === "RUNNING" ? "#00b050" : "#c00000"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Flow history chart */}
        <div style={{ background: "#1d1d1d", borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: "#aaa", marginBottom: 8 }}>Flow Trend (Live)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" tick={{ fill: "#888", fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#888", fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "#222", border: "1px solid #444" }} />
              <Legend />
              <Line type="monotone" dataKey="totalWH" stroke="#00b050" strokeWidth={2} dot={false} name="WH Flow" />
              <Line type="monotone" dataKey="totalComp" stroke="#5A9CFE" strokeWidth={2} dot={false} name="Comp Flow" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ background: "#1d1d1d", borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: "#aaa", marginBottom: 8 }}>Capacity Utilization</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" label>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#222", border: "1px solid #444" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* WH flow bar */}
        <div style={{ background: "#1d1d1d", borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: "#aaa", marginBottom: 8 }}>Wellhead Flow Rates (MSCFD)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={whFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 10 }} />
              <YAxis tick={{ fill: "#888", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#222", border: "1px solid #444" }} />
              <Bar dataKey="flow" fill="#00b050" name="Flow (MSCFD)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Compressor capacity bar */}
        <div style={{ background: "#1d1d1d", borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: "#aaa", marginBottom: 8 }}>Compressor Capacity (%)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={compData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 10 }} />
              <YAxis tick={{ fill: "#888", fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#222", border: "1px solid #444" }} />
              <Bar dataKey="capacity" fill="#5A9CFE" name="Capacity %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: "#1d1d1d", borderRadius: 8, padding: "12px 16px", borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
