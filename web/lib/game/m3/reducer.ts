import {
  BUDGET_START,
  CHANNEL_LABELS,
  DATASETS,
  HINT_COST,
  SIGNOFF_TRUST_MIN,
  WRONG_ROUTE_COST,
  trustDelta,
  wrongExplain,
} from "@/lib/game/m3/data";
import type { Channel, ChatMessage, ChatSender, ChatTone, M3GameAction, M3GameState } from "@/lib/game/m3/types";

function nowTs() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function msgId() {
  return `m3-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function pushChat(state: M3GameState, sender: ChatSender, text: string, tone: ChatTone = "bm-d"): ChatMessage[] {
  return [...state.messages, { id: msgId(), sender, text, tone, ts: nowTs() }];
}

export function createInitialM3State(): M3GameState {
  return {
    phase: "hack",
    hackLine: 0,
    hackDone: false,
    budget: BUDGET_START,
    budgetStart: BUDGET_START,
    novaTrust: 100,
    assigned: {},
    selectedId: null,
    timerSec: 0,
    wrongRoutes: 0,
    catastrophic: 0,
    hintsUsed: 0,
    hintCooldown: false,
    signOffStarted: false,
    messages: [],
    stepBanner: "Establishing secure connection…",
    vaultOpen: false,
  };
}

export function getTrustClass(trust: number) {
  if (trust < 50) return "nt-red";
  if (trust < 75) return "nt-amber";
  return "nt-green";
}

export function m3Reducer(state: M3GameState, action: M3GameAction): M3GameState {
  switch (action.type) {
    case "TICK":
      if (state.phase !== "play" && state.phase !== "signoff") return state;
      return { ...state, timerSec: state.timerSec + 1 };
    case "HACK_ADVANCE":
      return { ...state, hackLine: state.hackLine + 1 };
    case "HACK_DONE":
      return {
        ...state,
        phase: "desktop",
        hackDone: true,
        stepBanner: "Marshall's desktop — double-click Data Vault to unlock the disclosure queue.",
      };
    case "OPEN_VAULT":
      return { ...state, vaultOpen: true };
    case "CLOSE_VAULT":
      return { ...state, vaultOpen: false };
    case "VAULT_UNLOCKED":
      return {
        ...state,
        phase: "play",
        vaultOpen: false,
        stepBanner: "Pick a file. Route it to the channel that matches audience + harm profile.",
        messages: pushChat(state, "Nova", "Vault unsealed. Route each file by audience and harm profile before I sign off.", "bm-d"),
      };
    case "SELECT_DATASET": {
      const ds = DATASETS.find((d) => d.id === action.id);
      if (!ds) return state;
      const locked = !!state.assigned[action.id];
      return {
        ...state,
        selectedId: action.id,
        stepBanner: locked
          ? `Routed to ${CHANNEL_LABELS[state.assigned[action.id]!]}. Select another file.`
          : "Choose PUBLIC (press), OFFICIAL (regulators/counsel), or NO RELEASE (vault).",
      };
    }
    case "ASSIGN_CHANNEL": {
      const id = state.selectedId;
      if (!id || state.assigned[id] || !state.hackDone) return state;
      const ds = DATASETS.find((d) => d.id === id);
      if (!ds) return state;
      const { d, catastrophic } = trustDelta(ds.correct, action.channel);
      const isCorrect = action.channel === ds.correct;
      let next: M3GameState = { ...state };
      if (isCorrect) {
        next.assigned = { ...state.assigned, [id]: action.channel };
        next.messages = pushChat(next, "Voss", `Routed: ${ds.file} → ${CHANNEL_LABELS[action.channel]}.`, "bm-ok");
      } else {
        next.wrongRoutes = state.wrongRoutes + 1;
        next.budget = Math.max(0, state.budget - WRONG_ROUTE_COST);
        next.messages = pushChat(next, "Voss", `${wrongExplain(ds, action.channel)} Choose a different release channel.`, "bm-err");
      }
      if (d !== 0) {
        next.novaTrust = Math.max(0, state.novaTrust + d);
        if (catastrophic) next.catastrophic = state.catastrophic + 1;
      }
      const n = Object.keys(next.assigned).length;
      if (n >= 10) {
        next.stepBanner = "All files routed. Request Nova sign-off.";
      }
      return next;
    }
    case "REQUEST_HINT": {
      if (state.hintCooldown || !state.selectedId || state.assigned[state.selectedId]) {
        return { ...state, messages: pushChat(state, "Voss", "Select a file you have not routed yet.", "bm-err") };
      }
      const ds = DATASETS.find((d) => d.id === state.selectedId);
      if (!ds) return state;
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        budget: Math.max(0, state.budget - HINT_COST),
        hintCooldown: true,
        messages: pushChat(state, "Voss", `[HINT] ${ds.note} Correct channel: ${CHANNEL_LABELS[ds.correct]}.`, "bm-h"),
      };
    }
    case "HINT_COOLDOWN_CLEAR":
      return { ...state, hintCooldown: false };
    case "REQUEST_SIGNOFF": {
      if (Object.keys(state.assigned).length < 10 || state.signOffStarted) return state;
      const trustOk = state.novaTrust >= SIGNOFF_TRUST_MIN;
      return {
        ...state,
        signOffStarted: true,
        phase: "signoff",
        messages: pushChat(
          state,
          "Nova",
          trustOk
            ? "Distribution map reviewed. I sign off — proceed to Mission 4."
            : "Trust is too low. Nova withheld sign-off — review your routing choices.",
          trustOk ? "bm-win" : "bm-err"
        ),
      };
    }
    case "SIGNOFF_DONE":
      return { ...state, phase: "debrief" };
    case "ADD_CHAT":
      return { ...state, messages: pushChat(state, action.sender, action.text, action.tone ?? "bm-d") };
    default:
      return state;
  }
}
