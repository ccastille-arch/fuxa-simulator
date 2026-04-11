// Wellhead simulation engine - Altronic DE-4000 Wellhead Control Panel
// Based on FUXA_WH__02272026_Final.json and WH 2.0 SOO (April 2026, R0)
//
// SOO-defined operating states:
//   State 0: Ready to Start | State 1-7: Startup sequence | State 8: Running | State 9: Advanced running
// Priority modes: 0=Gas priority, 1=Oil priority (switches when runningWells >= WellHead_Priority_Release)
// PID control per wellhead, flow offset correction, discharge pressure override

// ── SOO Default Parameters ──────────────────────────────────────────────
const SOO_PARAMS = {
  WellHead_Priority_Release: 4,        // wells running before switching to oil priority
  Flow_Offset_SP: 0.001,               // flow offset adjustment per tick
  Flow_Offset_SP_Max_Offset: 0.05,     // max flow offset (5%)
  Compressor_DSCH_Prs_SP: 800,         // psi discharge setpoint
  Compressor_DSCH_Prs_Deadband: 3,     // % deadband for discharge override
  WellHead_PID_Min: 50,                // min PID output %
  WellHead_PID_Flow_Release: 0.1,      // flow threshold to engage PID (MSCFD)
  Flow_Status_Percent_Deadband: 3,     // % deadband for flow status
  Comms_Debounce: 2000,               // ms
  Comms_Lose_Preset_Percent: 50,      // % safe fallback
  Suction_Header_Target_Pressure: 20, // psi
};

// ── Types ─────────────────────────────────────────────────────────────
export type WellheadState = {
  id: number;
  unitId: string;
  localFlow: number;       // MSCFD local flow meter
  actualFlow: number;      // MSCFD PLC injection flow feedback
  controlledFlow: number;  // MSCFD commanded/desired flow
  gasPress: number;        // PSI injection static pressure
  oilPress: number;        // PSI injection differential pressure
  temp: number;            // °F injection temperature
  plcSetpoint: number;     // MSCFD PLC setpoint
  yesterdayFlow: number;   // MSCFD yesterday total
  manAuto: number;         // 0=auto, 1=manual
  status: "online" | "offline" | "alarm" | "comms_fault";
  flowStatus: "GOOD" | "BAD" | "UNKNOWN";
  gasPriority: number;
  oilPriority: number;
  pidOutput: number;       // % 0-100
  enabled: boolean;
  commLoss: boolean;
};

export type CompressorState = {
  id: number;
  unitId: string;
  desiredFlow: number;     // MSCFD setpoint
  actualFlow: number;      // MSCFD actual
  maxFlow: number;         // MSCFD rated max
  capacity: number;        // % of max
  dischargePressure: number; // PSI
  suctionPressure: number;   // PSI
  status: "running" | "stopped" | "alarm" | "comms_fault";
  panelStatus: number;     // Murphy panel state (0=off, 8=running)
  flowSP: number;
  autoStartAllowed: boolean;
};

export type Alarm = {
  id: string;
  severity: "shutdown" | "warning" | "info";
  message: string;
  timestamp: Date;
  active: boolean;
};

export type SystemState = {
  wellheads: WellheadState[];
  compressors: CompressorState[];
  totalCompFlow: number;
  totalWhFlow: number;
  compWithOffset: number;
  flowOffset: number;
  whFlowPercent: number;
  compCapacityPercent: number;
  compCapacityPercent2: number;
  priorityMode: number;    // 0=gas, 1=oil
  systemState: number;     // 0-9 operating state per SOO
  dischargePressureOverride: boolean;
  commLossOverride: boolean;
  timestamp: Date;
  panelStatus: "RUNNING" | "IDLE" | "ALARM" | "STARTUP" | "COMM FAULT";
  alarms: Alarm[];
  suctionHeaderPressure: number; // PSI
  staggeringActive: boolean;
};

// ── Base wellhead values (realistic gas injection field) ───────────────
const BASE_WH = [
  { unitId: "WH-01", flow: 487.3, gasP: 1247, oilP: 312, temp: 94, sp: 490, ydFlow: 478.2, gasPri: 1, oilPri: 1 },
  { unitId: "WH-02", flow: 412.8, gasP: 1183, oilP: 298, temp: 91, sp: 415, ydFlow: 401.4, gasPri: 2, oilPri: 3 },
  { unitId: "WH-03", flow: 523.1, gasP: 1318, oilP: 335, temp: 97, sp: 525, ydFlow: 511.8, gasPri: 3, oilPri: 2 },
  { unitId: "WH-04", flow: 391.5, gasP: 1094, oilP: 281, temp: 88, sp: 395, ydFlow: 383.7, gasPri: 4, oilPri: 5 },
  { unitId: "WH-05", flow: 456.2, gasP: 1267, oilP: 318, temp: 93, sp: 460, ydFlow: 445.9, gasPri: 5, oilPri: 4 },
  { unitId: "WH-06", flow: 378.4, gasP: 1048, oilP: 267, temp: 86, sp: 380, ydFlow: 368.2, gasPri: 6, oilPri: 7 },
  { unitId: "WH-07", flow: 501.7, gasP: 1302, oilP: 329, temp: 95, sp: 505, ydFlow: 492.6, gasPri: 7, oilPri: 6 },
  { unitId: "WH-08", flow: 435.9, gasP: 1178, oilP: 294, temp: 90, sp: 440, ydFlow: 425.4, gasPri: 8, oilPri: 9 },
  { unitId: "WH-09", flow: 468.3, gasP: 1243, oilP: 308, temp: 92, sp: 470, ydFlow: 459.8, gasPri: 9, oilPri: 8 },
  { unitId: "WH-10", flow: 342.6, gasP: 983,  oilP: 252, temp: 84, sp: 345, ydFlow: 331.5, gasPri: 10, oilPri: 10 },
];

const BASE_COMP = [
  { unitId: "COMP-01", sp: 1250, max: 1500, cap: 83, dschPrs: 795, suctPrs: 18 },
  { unitId: "COMP-02", sp: 1180, max: 1500, cap: 79, dschPrs: 788, suctPrs: 19 },
  { unitId: "COMP-03", sp: 1320, max: 1500, cap: 88, dschPrs: 802, suctPrs: 17 },
  { unitId: "COMP-04", sp: 890,  max: 1500, cap: 59, dschPrs: 0,   suctPrs: 0  },
];

function jitter(val: number, pct = 0.01): number {
  return val * (1 + (Math.random() - 0.5) * 2 * pct);
}

export function initState(): SystemState {
  const wellheads: WellheadState[] = BASE_WH.map((b, i) => ({
    id: i + 1,
    unitId: b.unitId,
    localFlow: b.flow,
    actualFlow: b.flow * 0.988,
    controlledFlow: b.sp,
    gasPress: b.gasP,
    oilPress: b.oilP,
    temp: b.temp,
    plcSetpoint: b.sp,
    yesterdayFlow: b.ydFlow,
    manAuto: 0,
    status: i < 9 ? "online" : "comms_fault",
    flowStatus: i < 9 ? "GOOD" : "UNKNOWN",
    gasPriority: b.gasPri,
    oilPriority: b.oilPri,
    pidOutput: 72 + Math.random() * 20,
    enabled: i < 9,
    commLoss: i === 9,
  }));

  const compressors: CompressorState[] = BASE_COMP.map((b, i) => ({
    id: i + 1,
    unitId: b.unitId,
    desiredFlow: b.sp,
    actualFlow: i < 3 ? b.sp * 0.97 : 0,
    maxFlow: b.max,
    capacity: i < 3 ? b.cap : 0,
    dischargePressure: i < 3 ? b.dschPrs : 0,
    suctionPressure: i < 3 ? b.suctPrs : 0,
    status: i < 3 ? "running" : "stopped",
    panelStatus: i < 3 ? 8 : 0,
    flowSP: b.sp,
    autoStartAllowed: i < 3,
  }));

  const totalCompFlow = compressors.reduce((s, c) => s + c.actualFlow, 0);
  const totalWhFlow = wellheads.filter(w => w.enabled).reduce((s, w) => s + w.actualFlow, 0);
  const maxCap = compressors.filter(c => c.status === "running").reduce((s, c) => s + c.maxFlow, 0);

  return {
    wellheads,
    compressors,
    totalCompFlow,
    totalWhFlow,
    compWithOffset: totalCompFlow * 1.018,
    flowOffset: totalCompFlow * 0.018,
    whFlowPercent: maxCap > 0 ? Math.min((totalWhFlow / maxCap) * 100, 100) : 0,
    compCapacityPercent: compressors[0]?.capacity ?? 0,
    compCapacityPercent2: compressors[1]?.capacity ?? 0,
    priorityMode: 0, // gas priority default per SOO
    systemState: 8,  // State 8 = Running per SOO
    dischargePressureOverride: false,
    commLossOverride: false,
    timestamp: new Date(),
    panelStatus: "RUNNING",
    alarms: [],
    suctionHeaderPressure: 19.2,
    staggeringActive: false,
  };
}

export function tickState(prev: SystemState): SystemState {
  const now = new Date();
  const alarms: Alarm[] = [];

  // ── Simulate wellhead updates ──
  const wellheads: WellheadState[] = prev.wellheads.map((w, i) => {
    const b = BASE_WH[i];
    const online = w.status === "online";

    // Flow status per SOO §13: actual >= setpoint * (1 - deadband%)
    const minFlow = w.plcSetpoint * (1 - SOO_PARAMS.Flow_Status_Percent_Deadband / 100);
    const actualFlow = online ? Math.max(0, jitter(b.flow * 0.988, 0.015)) : 0;
    const flowStatus: WellheadState["flowStatus"] = online
      ? (actualFlow >= minFlow ? "GOOD" : "BAD")
      : "UNKNOWN";

    if (flowStatus === "BAD" && online) {
      alarms.push({ id: `flow_bad_${i}`, severity: "warning", message: `${w.unitId}: Flow BAD (${fmt(actualFlow)} < ${fmt(minFlow)} MSCFD)`, timestamp: now, active: true });
    }

    return {
      ...w,
      localFlow: online ? Math.max(0, jitter(b.flow, 0.012)) : 0,
      actualFlow,
      controlledFlow: online ? Math.max(0, jitter(b.sp, 0.005)) : 0,
      gasPress: online ? Math.max(0, jitter(b.gasP, 0.01)) : 0,
      oilPress: online ? Math.max(0, jitter(b.oilP, 0.01)) : 0,
      temp: online ? Math.max(60, jitter(b.temp, 0.008)) : 0,
      pidOutput: online ? Math.min(100, Math.max(SOO_PARAMS.WellHead_PID_Min, jitter(72 + i * 2, 0.02))) : 0,
      flowStatus,
    };
  });

  // ── Simulate compressor updates ──
  const compressors: CompressorState[] = prev.compressors.map((c, i) => {
    const b = BASE_COMP[i];
    const running = c.status === "running";

    const dischargePressure = running ? Math.max(0, jitter(b.dschPrs, 0.02)) : 0;
    const suctionPressure = running ? Math.max(0, jitter(b.suctPrs, 0.03)) : 0;

    // Check discharge pressure override per SOO §6-7
    if (running && dischargePressure > SOO_PARAMS.Compressor_DSCH_Prs_SP * (1 + SOO_PARAMS.Compressor_DSCH_Prs_Deadband / 100)) {
      alarms.push({ id: `dsch_${i}`, severity: "warning", message: `${c.unitId}: High Discharge Pressure (${fmt(dischargePressure, 0)} PSI)`, timestamp: now, active: true });
    }

    return {
      ...c,
      actualFlow: running ? Math.max(0, jitter(b.sp * 0.97, 0.02)) : 0,
      capacity: running ? Math.min(100, jitter(b.cap, 0.02)) : 0,
      dischargePressure,
      suctionPressure,
    };
  });

  // ── SOO §8: Priority mode switching ──
  const runningWells = wellheads.filter(w => w.enabled && w.status === "online").length;
  const priorityMode = runningWells >= SOO_PARAMS.WellHead_Priority_Release ? 1 : 0;

  // ── Flow totals ──
  const totalCompFlow = compressors.reduce((s, c) => s + c.actualFlow, 0);
  const totalWhFlow = wellheads.filter(w => w.enabled).reduce((s, w) => s + w.actualFlow, 0);
  const maxCap = compressors.filter(c => c.status === "running").reduce((s, c) => s + c.maxFlow, 0);

  // ── SOO §12: Flow offset control ──
  let flowOffset = prev.flowOffset;
  const flowDiff = totalWhFlow - totalCompFlow;
  if (Math.abs(flowDiff) > totalCompFlow * SOO_PARAMS.Flow_Offset_SP) {
    const adj = flowDiff > 0
      ? SOO_PARAMS.Flow_Offset_SP
      : -SOO_PARAMS.Flow_Offset_SP;
    flowOffset = Math.max(-totalCompFlow * SOO_PARAMS.Flow_Offset_SP_Max_Offset,
      Math.min(totalCompFlow * SOO_PARAMS.Flow_Offset_SP_Max_Offset, flowOffset + adj));
  }

  // ── Suction header pressure ──
  const suctionHeaderPressure = Math.max(0, jitter(SOO_PARAMS.Suction_Header_Target_Pressure, 0.05));

  // ── Discharge override check ──
  const dischargePressureOverride = compressors.some(
    c => c.status === "running" && c.dischargePressure > SOO_PARAMS.Compressor_DSCH_Prs_SP * 1.03
  );

  // ── Comm loss check (per SOO §15) ──
  const commLossOverride = wellheads.some(w => w.commLoss && w.enabled);

  // ── Panel status ──
  const hasAlarms = alarms.length > 0;
  const panelStatus: SystemState["panelStatus"] = commLossOverride
    ? "COMM FAULT"
    : hasAlarms
    ? "ALARM"
    : "RUNNING";

  return {
    wellheads,
    compressors,
    totalCompFlow,
    totalWhFlow,
    compWithOffset: totalCompFlow + flowOffset,
    flowOffset,
    whFlowPercent: maxCap > 0 ? Math.min((totalWhFlow / maxCap) * 100, 100) : 0,
    compCapacityPercent: compressors[0]?.capacity ?? 0,
    compCapacityPercent2: compressors[1]?.capacity ?? 0,
    priorityMode,
    systemState: prev.systemState,
    dischargePressureOverride,
    commLossOverride,
    timestamp: now,
    panelStatus,
    alarms,
    suctionHeaderPressure,
    staggeringActive: false,
  };
}

// SOO §8 state name lookup
export const STATE_NAMES: Record<number, string> = {
  0: "Ready to Start",
  1: "Pre-Start",
  2: "Startup",
  3: "Warm-up",
  4: "Load",
  5: "Stabilize",
  6: "Loaded",
  7: "Run",
  8: "Running",
  9: "Advanced Run",
};

export function fmt(val: number, digits = 1): string {
  return val.toFixed(digits);
}
