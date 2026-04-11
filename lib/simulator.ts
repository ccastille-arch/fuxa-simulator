// Wellhead simulation engine - realistic ranges for Altronic DE-4000 panel
// Based on FUXA_WH__02272026_Final.json and WH 2.0 SOO (Apr 2026)

export type WellheadState = {
  id: number;
  unitId: string;
  localFlow: number;       // MSCFD - local flow meter reading
  actualFlow: number;      // MSCFD - PLC injection flow
  controlledFlow: number;  // MSCFD - desired/commanded flow
  gasPress: number;        // PSI - injection static pressure
  oilPress: number;        // PSI - injection differential pressure
  temp: number;            // °F - injection temperature
  plcSetpoint: number;     // MSCFD - PLC setpoint
  yesterdayFlow: number;   // MSCFD - yesterday total flow
  manAuto: number;         // 0=auto, 1=manual
  status: "online" | "offline" | "alarm" | "comms_fault";
  gasPriority: number;
  oilPriority: number;
};

export type CompressorState = {
  id: number;
  unitId: string;
  desiredFlow: number;     // MSCFD
  actualFlow: number;      // MSCFD - feedback from compressor
  maxFlow: number;         // MSCFD
  capacity: number;        // % capacity utilization
  status: "running" | "stopped" | "alarm" | "comms_fault";
  panelStatus: number;
  flowSP: number;          // MSCFD setpoint
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
  timestamp: Date;
  panelStatus: string;     // "RUNNING" | "IDLE" | "ALARM"
  alarms: string[];
};

// Realistic base values for a gas injection wellhead system
const BASE_WH: Partial<WellheadState>[] = [
  { unitId: "WH-01", localFlow: 487.3, actualFlow: 482.1, gasPress: 1247, oilPress: 312, temp: 94, plcSetpoint: 490, yesterdayFlow: 478.2, gasPriority: 1, oilPriority: 1 },
  { unitId: "WH-02", localFlow: 412.8, actualFlow: 408.6, gasPress: 1183, oilPress: 298, temp: 91, plcSetpoint: 415, yesterdayFlow: 401.4, gasPriority: 2, oilPriority: 3 },
  { unitId: "WH-03", localFlow: 523.1, actualFlow: 519.4, gasPress: 1318, oilPress: 335, temp: 97, plcSetpoint: 525, yesterdayFlow: 511.8, gasPriority: 3, oilPriority: 2 },
  { unitId: "WH-04", localFlow: 391.5, actualFlow: 387.9, gasPress: 1094, oilPress: 281, temp: 88, plcSetpoint: 395, yesterdayFlow: 383.7, gasPriority: 4, oilPriority: 5 },
  { unitId: "WH-05", localFlow: 456.2, actualFlow: 452.8, gasPress: 1267, oilPress: 318, temp: 93, plcSetpoint: 460, yesterdayFlow: 445.9, gasPriority: 5, oilPriority: 4 },
  { unitId: "WH-06", localFlow: 378.4, actualFlow: 374.1, gasPress: 1048, oilPress: 267, temp: 86, plcSetpoint: 380, yesterdayFlow: 368.2, gasPriority: 6, oilPriority: 7 },
  { unitId: "WH-07", localFlow: 501.7, actualFlow: 498.3, gasPress: 1302, oilPress: 329, temp: 95, plcSetpoint: 505, yesterdayFlow: 492.6, gasPriority: 7, oilPriority: 6 },
  { unitId: "WH-08", localFlow: 435.9, actualFlow: 432.6, gasPress: 1178, oilPress: 294, temp: 90, plcSetpoint: 440, yesterdayFlow: 425.4, gasPriority: 8, oilPriority: 9 },
  { unitId: "WH-09", localFlow: 468.3, actualFlow: 465.1, gasPress: 1243, oilPress: 308, temp: 92, plcSetpoint: 470, yesterdayFlow: 459.8, gasPriority: 9, oilPriority: 8 },
  { unitId: "WH-10", localFlow: 342.6, actualFlow: 338.9, gasPress: 983,  oilPress: 252, temp: 84, plcSetpoint: 345, yesterdayFlow: 331.5, gasPriority: 10, oilPriority: 10 },
];

const BASE_COMP: Partial<CompressorState>[] = [
  { unitId: "COMP-01", desiredFlow: 1250, maxFlow: 1500, capacity: 83, flowSP: 1250, panelStatus: 1 },
  { unitId: "COMP-02", desiredFlow: 1180, maxFlow: 1500, capacity: 79, flowSP: 1180, panelStatus: 1 },
  { unitId: "COMP-03", desiredFlow: 1320, maxFlow: 1500, capacity: 88, flowSP: 1320, panelStatus: 1 },
  { unitId: "COMP-04", desiredFlow: 890,  maxFlow: 1500, capacity: 59, flowSP: 890,  panelStatus: 0 },
];

// Add small realistic noise to a value
function jitter(val: number, pct = 0.008): number {
  return val * (1 + (Math.random() - 0.5) * 2 * pct);
}

let currentState: SystemState | null = null;

export function initState(): SystemState {
  const wellheads: WellheadState[] = BASE_WH.map((b, i) => ({
    id: i + 1,
    unitId: b.unitId!,
    localFlow: b.localFlow!,
    actualFlow: b.actualFlow!,
    controlledFlow: b.plcSetpoint!,
    gasPress: b.gasPress!,
    oilPress: b.oilPress!,
    temp: b.temp!,
    plcSetpoint: b.plcSetpoint!,
    yesterdayFlow: b.yesterdayFlow!,
    manAuto: 0,
    status: i < 9 ? "online" : "comms_fault",
    gasPriority: b.gasPriority!,
    oilPriority: b.oilPriority!,
  }));

  const compressors: CompressorState[] = BASE_COMP.map((b, i) => ({
    id: i + 1,
    unitId: b.unitId!,
    desiredFlow: b.desiredFlow!,
    actualFlow: b.desiredFlow! * 0.97,
    maxFlow: b.maxFlow!,
    capacity: b.capacity!,
    status: i < 3 ? "running" : "stopped",
    panelStatus: b.panelStatus!,
    flowSP: b.flowSP!,
  }));

  const totalCompFlow = compressors.reduce((s, c) => s + (c.status === "running" ? c.actualFlow : 0), 0);
  const totalWhFlow = wellheads.reduce((s, w) => s + w.actualFlow, 0);

  currentState = {
    wellheads,
    compressors,
    totalCompFlow,
    totalWhFlow,
    compWithOffset: totalCompFlow * 1.02,
    flowOffset: totalCompFlow * 0.02,
    whFlowPercent: Math.min((totalWhFlow / 5000) * 100, 100),
    compCapacityPercent: 83,
    compCapacityPercent2: 79,
    priorityMode: 0,
    timestamp: new Date(),
    panelStatus: "RUNNING",
    alarms: [],
  };
  return currentState;
}

export function tickState(prev: SystemState): SystemState {
  const wellheads = prev.wellheads.map((w, i) => {
    const base = BASE_WH[i];
    return {
      ...w,
      localFlow: Math.max(0, jitter(base.localFlow!, 0.012)),
      actualFlow: Math.max(0, jitter(base.actualFlow!, 0.015)),
      controlledFlow: Math.max(0, jitter(base.plcSetpoint!, 0.005)),
      gasPress: Math.max(0, jitter(base.gasPress!, 0.01)),
      oilPress: Math.max(0, jitter(base.oilPress!, 0.01)),
      temp: Math.max(60, jitter(base.temp!, 0.008)),
    };
  });

  const compressors = prev.compressors.map((c, i) => {
    const base = BASE_COMP[i];
    const running = c.status === "running";
    return {
      ...c,
      actualFlow: running ? Math.max(0, jitter(base.desiredFlow!, 0.02)) : 0,
      capacity: running ? Math.min(100, jitter(base.capacity!, 0.02)) : 0,
    };
  });

  const totalCompFlow = compressors.reduce((s, c) => s + c.actualFlow, 0);
  const totalWhFlow = wellheads.reduce((s, w) => s + w.actualFlow, 0);
  const maxCap = compressors.reduce((s, c) => s + (c.status === "running" ? c.maxFlow : 0), 0);

  return {
    ...prev,
    wellheads,
    compressors,
    totalCompFlow,
    totalWhFlow,
    compWithOffset: totalCompFlow + prev.flowOffset,
    whFlowPercent: Math.min((totalWhFlow / maxCap) * 100, 100),
    compCapacityPercent: compressors[0]?.capacity ?? 0,
    compCapacityPercent2: compressors[1]?.capacity ?? 0,
    timestamp: new Date(),
  };
}

export function fmt(val: number, digits = 1): string {
  return val.toFixed(digits);
}
