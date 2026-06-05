import {
  FILES,
  STEPS,
  confidenceHit,
  correctStepForFile,
  isStepAvailable,
  stepIndex,
  wrongStepMessage,
} from "@/lib/game/m4/data";
import type { ChatMessage, M4GameAction, M4GameState } from "@/lib/game/m4/types";

function nowTs() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function pushChat(state: M4GameState, sender: string, text: string, tone: M4GameState["messages"][0]["tone"] = "bm-d"): ChatMessage[] {
  return [...state.messages, { id: `m4-${Date.now()}`, sender, text, tone, ts: nowTs() }];
}

export function createInitialM4State(): M4GameState {
  return {
    phase: "hack",
    hackLine: 0,
    hackDone: false,
    picks: {},
    selectedStepId: null,
    selectedFileId: null,
    confidence: 100,
    wrongAttempts: 0,
    submitted: false,
    timerSec: 0,
    messages: [],
    stepBanner: "Case-flow reconstruction — link each leak file to the correct onboarding gate.",
  };
}

export function m4Reducer(state: M4GameState, action: M4GameAction): M4GameState {
  switch (action.type) {
    case "TICK":
      if (state.phase !== "play") return state;
      return { ...state, timerSec: state.timerSec + 1 };
    case "HACK_ADVANCE":
      return { ...state, hackLine: state.hackLine + 1 };
    case "HACK_DONE":
      return { ...state, phase: "play", hackDone: true };
    case "SELECT_STEP": {
      const idx = stepIndex(action.stepId);
      if (idx < 0 || !isStepAvailable(idx, state.picks)) {
        return { ...state, messages: pushChat(state, "Nova", "Complete the previous steps first — the flow must proceed in order.", "bm-err") };
      }
      const step = STEPS[idx];
      return {
        ...state,
        selectedStepId: action.stepId,
        selectedFileId: null,
        stepBanner: `${step.title} — select the matching dataset from the rail`,
      };
    }
    case "ASSIGN_FILE":
    case "ASSIGN_FILE_TO_STEP": {
      const targetStepId = action.type === "ASSIGN_FILE_TO_STEP" ? action.stepId : state.selectedStepId;
      if (!targetStepId || state.submitted) return state;
      const stepIdx = stepIndex(targetStepId);
      if (!isStepAvailable(stepIdx, state.picks)) return state;
      const correct = correctStepForFile(action.fileId);
      const step = STEPS[stepIdx];
      if (!correct || correct !== targetStepId) {
        const hit = confidenceHit(action.fileId);
        return {
          ...state,
          wrongAttempts: state.wrongAttempts + 1,
          confidence: Math.max(0, state.confidence - hit),
          messages: pushChat(state, "Nova", `<strong>Wrong link.</strong> ${wrongStepMessage(action.fileId, targetStepId)} <em>(−${hit}% confidence)</em>`, "bm-err"),
        };
      }
      const picks = { ...state.picks };
      Object.keys(picks).forEach((k) => {
        if (picks[k] === targetStepId) delete picks[k];
      });
      picks[action.fileId] = targetStepId;
      const linked = Object.keys(picks).length;
      return {
        ...state,
        picks,
        selectedStepId: targetStepId,
        selectedFileId: null,
        messages: pushChat(state, "Voss", `Linked ${FILES.find((f) => f.id === action.fileId)?.name} → ${step.title}.`, "bm-ok"),
        stepBanner: linked >= 8 ? "All gates linked. Finalize the process map." : "Select the next available gate on the chain.",
      };
    }
    case "UNASSIGN_FILE": {
      if (state.submitted || !state.picks[action.fileId]) return state;
      const picks = { ...state.picks };
      delete picks[action.fileId];
      return { ...state, picks };
    }
    case "SUBMIT": {
      if (Object.keys(state.picks).length < 8) return state;
      return { ...state, submitted: true, phase: "debrief" };
    }
    case "ADD_CHAT":
      return { ...state, messages: pushChat(state, action.sender, action.text, action.tone ?? "bm-d") };
    default:
      return state;
  }
}
