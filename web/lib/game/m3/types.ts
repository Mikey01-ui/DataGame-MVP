export type Channel = "public" | "official" | "vault";
export type ChatTone = "bm-d" | "bm-ok" | "bm-err" | "bm-h" | "bm-win";
export type ChatSender = "Voss" | "Zex" | "Nova";

export type Dataset = {
  id: string;
  file: string;
  correct: Channel;
  classification: string;
  identifiers: string;
  harmIfPublic: string;
  note: string;
  wrongRationale: Partial<Record<Channel, string>>;
};

export type ChatMessage = {
  id: string;
  sender: ChatSender;
  text: string;
  tone: ChatTone;
  ts: string;
};

export type M3Phase = "hack" | "desktop" | "play" | "signoff" | "debrief";

export type M3GameState = {
  phase: M3Phase;
  hackLine: number;
  hackDone: boolean;
  budget: number;
  budgetStart: number;
  novaTrust: number;
  assigned: Partial<Record<string, Channel>>;
  selectedId: string | null;
  timerSec: number;
  wrongRoutes: number;
  catastrophic: number;
  hintsUsed: number;
  hintCooldown: boolean;
  signOffStarted: boolean;
  messages: ChatMessage[];
  stepBanner: string;
  vaultOpen: boolean;
};

export type M3GameAction =
  | { type: "TICK" }
  | { type: "HACK_ADVANCE" }
  | { type: "HACK_DONE" }
  | { type: "OPEN_VAULT" }
  | { type: "CLOSE_VAULT" }
  | { type: "VAULT_UNLOCKED" }
  | { type: "SELECT_DATASET"; id: string }
  | { type: "ASSIGN_CHANNEL"; channel: Channel }
  | { type: "REQUEST_HINT" }
  | { type: "HINT_COOLDOWN_CLEAR" }
  | { type: "REQUEST_SIGNOFF" }
  | { type: "SIGNOFF_DONE" }
  | { type: "ADD_CHAT"; sender: ChatSender; text: string; tone?: ChatTone };
