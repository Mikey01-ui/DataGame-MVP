import {
  DETECTION,
  LEAD_ORDER,
  LEADS,
} from "@/lib/game/m1/data";
import type {
  ChatMessage,
  ChatTone,
  DetectionBucket,
  FolderFile,
  LeadId,
  LeadStatus,
  M1GameAction,
  M1GameState,
} from "@/lib/game/m1/types";

function nowTs() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function msgId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function pushChat(
  state: M1GameState,
  sender: "Voss" | "Zex",
  text: string,
  tone: ChatTone = "bm-d"
): ChatMessage[] {
  return [...state.messages, { id: msgId(), sender, text, tone, ts: nowTs() }];
}

function addDetection(state: M1GameState, amount: number, bucket: DetectionBucket): M1GameState {
  const caps = { decoy: "decoyDetection", click: "clickDetection", verify: "verifyDetection", hint: "hintDetection", passive: "passiveDetection" } as const;
  const next = Math.min(100, state.detection + amount);
  const patch = { detection: next, [caps[bucket]]: Math.min(100, state[caps[bucket]] + amount) } as Partial<M1GameState>;

  let breachOverlay = state.breachOverlay;
  let gameOver = state.gameOver;
  let detectionReconnected = state.detectionReconnected;

  if (next >= 100) {
    if (!state.detectionReconnected) {
      breachOverlay = true;
      detectionReconnected = true;
      patch.detection = 0;
      patch.decoyDetection = 0;
      patch.clickDetection = 0;
      patch.verifyDetection = 0;
      patch.hintDetection = 0;
      patch.passiveDetection = 0;
    } else {
      gameOver = true;
    }
  }

  const warned = { ...state.detectionWarned };
  let messages = state.messages;
  ([30, 60, 80] as const).forEach((t) => {
    if (next >= t && !warned[t]) {
      warned[t] = true;
      const copy = t === 30 ? "They're starting to notice. Tread carefully." : t === 60 ? "Detection climbing. Every mistake costs more now." : "Critical exposure. One more slip could kill the feed.";
      messages = pushChat({ ...state, messages }, "Voss", copy, "bm-err");
    }
  });

  return {
    ...state,
    ...patch,
    detectionWarned: warned,
    breachOverlay,
    gameOver,
    messages,
    detectionToast: amount >= 3 ? Math.round(amount) : state.detectionToast,
  };
}

function setLeadStatus(state: M1GameState, leadId: LeadId, status: LeadStatus, text: string): M1GameState {
  return {
    ...state,
    leadStatus: { ...state.leadStatus, [leadId]: status },
    leadStatusText: { ...state.leadStatusText, [leadId]: text },
  };
}

export function createInitialM1State(): M1GameState {
  const leadStatus = Object.fromEntries(LEAD_ORDER.map((id) => [id, "dimmed" as LeadStatus])) as Record<LeadId, LeadStatus>;
  const leadStatusText = Object.fromEntries(LEAD_ORDER.map((id) => [id, "LOCKED"])) as Record<LeadId, string>;
  return {
    phase: "hack",
    hackLine: 0,
    hackDone: false,
    locked: [],
    activeLead: null,
    verifyLead: null,
    chipIdx: [],
    leadStatus,
    leadStatusText,
    currentStep: 0,
    detection: 0,
    decoyDetection: 0,
    clickDetection: 0,
    verifyDetection: 0,
    hintDetection: 0,
    passiveDetection: 0,
    detectionReconnected: false,
    detectionWarned: { 30: false, 60: false, 80: false },
    errors: 0,
    hintsUsed: 0,
    hintCooldown: false,
    timerSec: 0,
    stepBanner: "Establishing mirror connection...",
    ebStep: "LEAD 1 OF 4",
    ebHint: "",
    synthReady: false,
    openWindows: [],
    activeWindow: null,
    desktopRevealed: false,
    anomalyLead: null,
    verifyOpen: false,
    messages: [],
    typing: false,
    introScheduled: false,
    detectionToast: null,
    gameOver: false,
    breachOverlay: false,
    debriefReveal: 0,
  };
}

export function getDetectionLabel(det: number) {
  if (det < 30) return "DARK";
  if (det < 60) return "SCANNING";
  if (det < 80) return "ALERT";
  return "CRITICAL";
}

export function m1Reducer(state: M1GameState, action: M1GameAction): M1GameState {
  switch (action.type) {
    case "TICK": {
      if (state.phase !== "play" || !state.hackDone || state.gameOver) return state;
      let next = { ...state, timerSec: state.timerSec + 1 };
      next = addDetection(next, DETECTION.passivePerSec, "passive");
      return next;
    }
    case "HACK_ADVANCE":
      return { ...state, hackLine: state.hackLine + 1 };
    case "HACK_DONE":
      return {
        ...setLeadStatus(state, "compute", "start", "START HERE →"),
        phase: "play",
        hackDone: true,
        desktopRevealed: true,
        stepBanner: "Select COMPUTE on the evidence board to begin",
        ebStep: "LEAD 1 OF 4",
        messages: pushChat(state, "Voss", "We're in. Marshall's desktop, live mirror, read-only.", "bm-d"),
      };
    case "SCHEDULE_INTRO":
      if (state.introScheduled) return state;
      return { ...state, introScheduled: true };
    case "SHOW_DETECTION_TOAST":
      return { ...state, detectionToast: action.amount };
    case "CLEAR_DETECTION_TOAST":
      return { ...state, detectionToast: null };
    case "ADVANCE_DEBRIEF_REVEAL":
      return { ...state, debriefReveal: state.debriefReveal + 1 };
    case "ADD_CHAT":
      return { ...state, messages: pushChat(state, action.sender, action.text, action.tone ?? "bm-d") };
    case "LEAD_CLICK": {
      const { leadId } = action;
      if (state.locked.includes(leadId) || state.activeLead === leadId) return state;
      const stepLead = LEAD_ORDER[state.currentStep];
      if (leadId !== stepLead) {
        return { ...state, messages: pushChat(state, "Voss", "Finish the active lead first.", "bm-err") };
      }
      const lead = LEADS[leadId];
      let next = state;
      if (state.activeLead && state.activeLead !== leadId) {
        next = setLeadStatus(next, state.activeLead, "dimmed", "CLICK TO INVESTIGATE");
      }
      next = setLeadStatus(next, leadId, "mission", "INVESTIGATING...");
      return {
        ...next,
        activeLead: leadId,
        stepBanner: `${lead.label} LEAD ACTIVE: ${lead.seek}`,
        ebHint: `TARGET: ${lead.label}`,
        messages: pushChat(next, "Voss", lead.clue, "bm-ok"),
      };
    }
    case "OPEN_FOLDER": {
      const winId = `win-${action.folderKey}`;
      const opens = state.openWindows.includes(winId) ? state.openWindows : [...state.openWindows, winId];
      let next: M1GameState = { ...state, openWindows: opens, activeWindow: winId };
      const lead = state.activeLead ? LEADS[state.activeLead] : null;
      if (lead && lead.folderKey === action.folderKey) {
        next = { ...next, messages: pushChat(next, "Voss", lead.folderMsg, "bm-d") };
      }
      return next;
    }
    case "FILE_INTERACT":
      return openFileAction(state, action.folderKey, action.file);
    case "WRONG_DATA_CLICK": {
      let next = addDetection({ ...state, errors: state.errors + 1 }, DETECTION.wrongClick, "click");
      return { ...next, messages: pushChat(next, "Voss", "Wrong target. Re-read the data.", "bm-err") };
    }
    case "FOCUS_WINDOW":
      return { ...state, activeWindow: action.windowId };
    case "CLOSE_WINDOW":
      return {
        ...state,
        openWindows: state.openWindows.filter((w) => w !== action.windowId),
        activeWindow: state.activeWindow === action.windowId ? null : state.activeWindow,
      };
    case "TRIGGER_ANOMALY": {
      const { leadId } = action;
      if (state.leadStatus[leadId] === "active") return state;
      return setLeadStatus(
        { ...state, anomalyLead: leadId },
        leadId,
        "active",
        "ANOMALY FOUND"
      );
    }
    case "DISMISS_ANOMALY":
      return { ...state, anomalyLead: null };
    case "OPEN_VERIFY": {
      const lead = LEADS[action.leadId];
      return {
        ...state,
        verifyLead: action.leadId,
        chipIdx: new Array(lead.params.length).fill(null),
        verifyOpen: true,
        anomalyLead: null,
      };
    }
    case "SELECT_CHIP": {
      const chips = [...state.chipIdx];
      chips[action.paramIdx] = action.chipIdx;
      return { ...state, chipIdx: chips };
    }
    case "CONFIRM_VERIFY": {
      if (!state.verifyLead) return state;
      const lead = LEADS[state.verifyLead];
      const allOk = lead.params.every((p, i) => state.chipIdx[i] === p.ans);
      if (!allOk) {
        let next = addDetection({ ...state, errors: state.errors + 1 }, DETECTION.verifyFail, "verify");
        next = { ...next, messages: pushChat(next, "Voss", "Verification doesn't match the data. Try again.", "bm-err") };
        return next;
      }
      const leadId = state.verifyLead;
      const locked = [...state.locked, leadId];
      let next = setLeadStatus(
        { ...state, locked, activeLead: null, verifyLead: null, verifyOpen: false, currentStep: state.currentStep + 1 },
        leadId,
        "confirmed",
        "✓ LOCKED"
      );
      next = {
        ...next,
        messages: pushChat(next, "Voss", lead.lockMsg, "bm-win"),
        stepBanner: `${lead.label} confirmed ✓. Select the next lead to continue`,
        ebHint: "",
      };
      if (locked.length === 4) {
        let fin = {
          ...next,
          synthReady: true,
          stepBanner: "All leads confirmed. Hit CONFIRM INTEL to lock in the OMNI footprint",
          ebStep: "ALL 4 LEADS CONFIRMED ✓",
        };
        fin = { ...fin, messages: pushChat(fin, "Voss", "All four leads confirmed. You can lock the footprint now.", "bm-ok") };
        fin = { ...fin, messages: pushChat(fin, "Zex", "Four departments. Same pattern. That's not a coincidence.", "bm-d") };
        return fin;
      }
      const nextLead = LEAD_ORDER[next.currentStep];
      if (nextLead) {
        next = setLeadStatus(next, nextLead, "next", "YOUR TURN →");
        next = { ...next, ebStep: `LEAD ${next.currentStep + 1} OF 4`, messages: pushChat(next, "Voss", `Next lead: ${LEADS[nextLead].label}`, "bm-ok") };
      }
      return next;
    }
    case "TOGGLE_VERIFY":
      return { ...state, verifyOpen: !state.verifyOpen };
    case "REQUEST_HINT": {
      if (!state.activeLead || state.hintCooldown) return state;
      const lead = LEADS[state.activeLead];
      let next = addDetection({ ...state, hintsUsed: state.hintsUsed + 1, hintCooldown: true }, DETECTION.hint, "hint");
      next = { ...next, messages: pushChat(next, "Voss", lead.hint, "bm-h") };
      return next;
    }
    case "HINT_COOLDOWN_CLEAR":
      return { ...state, hintCooldown: false };
    case "START_SYNTH":
      if (state.locked.length < 4) return state;
      return { ...state, phase: "synth" };
    case "SYNTH_DONE":
      return { ...state, phase: "debrief" };
    case "DISMISS_BREACH":
      return { ...state, breachOverlay: false, messages: pushChat(state, "Voss", "Feed dropped — reconnected. Don't hit 100% again.", "bm-err") };
    case "RESTART_AFTER_BREACH":
      return createInitialM1State();
    case "GAME_OVER_DISMISS":
      return createInitialM1State();
    default:
      return state;
  }
}

export function tryAnomaly(
  state: M1GameState,
  leadId: LeadId,
  valid: boolean
): M1GameState {
  if (!state.hackDone) return state;
  if (valid) {
    if (state.activeLead !== leadId) {
      const gate = state.locked.includes(leadId)
        ? "That's already confirmed."
        : `Select ${LEADS[leadId].label} on the board before you log evidence.`;
      return { ...state, messages: pushChat(state, "Voss", gate, state.locked.includes(leadId) ? "bm-d" : "bm-err") };
    }
    return m1Reducer(state, { type: "TRIGGER_ANOMALY", leadId });
  }
  let next = addDetection({ ...state, errors: state.errors + 1 }, DETECTION.wrongClick, "click");
  next = { ...next, messages: pushChat(next, "Voss", "Wrong target. Re-read the data.", "bm-err") };
  return next;
}

export function openFileAction(
  state: M1GameState,
  folderKey: string,
  file: { kind: string; openTarget?: string; message?: string }
): M1GameState {
  if (!state.hackDone) return state;
  if (file.kind === "unopenable" || file.kind === "decoy") {
    let next = addDetection(state, file.kind === "unopenable" ? DETECTION.decoy : DETECTION.decoyClick, "decoy");
    if (file.message) next = { ...next, messages: pushChat(next, "Voss", file.message, "bm-err") };
    return next;
  }
  if (file.openTarget) {
    const opens = state.openWindows.includes(file.openTarget) ? state.openWindows : [...state.openWindows, file.openTarget];
    return { ...state, openWindows: opens, activeWindow: file.openTarget };
  }
  return state;
}

export function getDetectionClass(detection: number) {
  if (detection < 30) return "det-green";
  if (detection < 60) return "det-amber";
  return "det-red";
}

export function getDebriefRating(detection: number) {
  if (detection <= 5) return "GHOST — completely undetected";
  if (detection <= 15) return "CLEAN TRACE — barely a footprint";
  if (detection <= 35) return "EXPOSED EDGE — they sensed something";
  if (detection <= 55) return "PARTIAL EXPOSURE — the sweep got close";
  if (detection <= 75) return "HIGH RISK — MegaCorp nearly closed the feed";
  return "COMPROMISED — the operation nearly collapsed";
}
