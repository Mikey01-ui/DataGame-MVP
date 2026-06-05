export type LeadId = "compute" | "funding" | "personnel" | "payload";

export type LeadStatus =
  | "locked"
  | "dimmed"
  | "start"
  | "next"
  | "mission"
  | "active"
  | "confirmed";

export type DetectionBucket = "decoy" | "click" | "verify" | "hint" | "passive";

export type ChatTone = "bm-d" | "bm-ok" | "bm-err" | "bm-win" | "bm-h";

export type VerifyParam = {
  label: string;
  opts: string[];
  ans: number;
  err: string;
  crossRef?: boolean;
};

export type LeadDef = {
  id: LeadId;
  label: string;
  icon: string;
  folderKey: string;
  evidenceFile: string;
  iconId: string;
  seek: string;
  clue: string;
  folderMsg: string;
  lockMsg: string;
  hint: string;
  params: VerifyParam[];
  anomalyTitle: string;
  anomalyText: string;
  zexAnomaly?: string;
};

export type FolderFile = {
  name: string;
  kind: "evidence" | "crossref" | "decoy" | "unopenable" | "redherring";
  openTarget?: string;
  message?: string;
};

export type ChatMessage = {
  id: string;
  sender: "Voss" | "Zex";
  text: string;
  tone: ChatTone;
  ts: string;
};

export type M1GameState = {
  phase: "hack" | "play" | "synth" | "debrief" | "done";
  hackLine: number;
  hackDone: boolean;
  locked: LeadId[];
  activeLead: LeadId | null;
  verifyLead: LeadId | null;
  chipIdx: (number | null)[];
  leadStatus: Record<LeadId, LeadStatus>;
  leadStatusText: Record<LeadId, string>;
  currentStep: number;
  detection: number;
  decoyDetection: number;
  clickDetection: number;
  verifyDetection: number;
  hintDetection: number;
  passiveDetection: number;
  detectionReconnected: boolean;
  detectionWarned: Record<30 | 60 | 80, boolean>;
  errors: number;
  hintsUsed: number;
  hintCooldown: boolean;
  timerSec: number;
  stepBanner: string;
  ebStep: string;
  ebHint: string;
  synthReady: boolean;
  openWindows: string[];
  activeWindow: string | null;
  desktopRevealed: boolean;
  anomalyLead: LeadId | null;
  verifyOpen: boolean;
  messages: ChatMessage[];
  typing: boolean;
  introScheduled: boolean;
  detectionToast: number | null;
  gameOver: boolean;
  breachOverlay: boolean;
  debriefReveal: number;
};

export type M1GameAction =
  | { type: "TICK" }
  | { type: "HACK_ADVANCE" }
  | { type: "HACK_DONE" }
  | { type: "LEAD_CLICK"; leadId: LeadId }
  | { type: "OPEN_FOLDER"; folderKey: string }
  | { type: "FILE_INTERACT"; folderKey: string; file: FolderFile }
  | { type: "WRONG_DATA_CLICK" }
  | { type: "CLOSE_WINDOW"; windowId: string }
  | { type: "FOCUS_WINDOW"; windowId: string }
  | { type: "TRIGGER_ANOMALY"; leadId: LeadId }
  | { type: "DISMISS_ANOMALY" }
  | { type: "OPEN_VERIFY"; leadId: LeadId }
  | { type: "SELECT_CHIP"; paramIdx: number; chipIdx: number }
  | { type: "CONFIRM_VERIFY" }
  | { type: "TOGGLE_VERIFY" }
  | { type: "REQUEST_HINT" }
  | { type: "HINT_COOLDOWN_CLEAR" }
  | { type: "START_SYNTH" }
  | { type: "SYNTH_DONE" }
  | { type: "DISMISS_BREACH" }
  | { type: "RESTART_AFTER_BREACH" }
  | { type: "GAME_OVER_DISMISS" }
  | { type: "SCHEDULE_INTRO" }
  | { type: "SHOW_DETECTION_TOAST"; amount: number }
  | { type: "CLEAR_DETECTION_TOAST" }
  | { type: "ADVANCE_DEBRIEF_REVEAL" }
  | { type: "ADD_CHAT"; sender: "Voss" | "Zex"; text: string; tone?: ChatTone };
