export type SfxMap = Partial<Record<string, string>>;

export type AmbientConfig = {
  type: "audio";
  src: string;
  volume?: number;
};

export type MissionAudioConfig = {
  missionId: string;
  ambient?: AmbientConfig;
  sfx?: SfxMap;
};

export const M3_SFX_KEYS = [
  "correct",
  "wrong",
  "detectionWarn",
  "gameOver",
  "signoffOk",
  "signoffDeny",
  "vaultWrong",
  "vaultBolt",
  "vaultOpen",
  "vaultReveal",
] as const;

export const M4_SFX_KEYS = ["correct", "wrong", "detectionWarn", "gameOver"] as const;

export type M3SfxKey = (typeof M3_SFX_KEYS)[number];
export type M4SfxKey = (typeof M4_SFX_KEYS)[number];
