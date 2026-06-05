export type DetectionBand = "DARK" | "SCANNING" | "ALERT" | "CRITICAL";

export const DETECTION_INFO: Record<
  DetectionBand,
  { color: string; desc: string; cause: string }
> = {
  DARK: {
    color: "var(--green)",
    desc: "You're running dark. Marshall's mirror hasn't flagged unusual routing activity yet.",
    cause:
      "Detection rises on wrong channel picks, hints, and slowly over time. At 100% the operation fails.",
  },
  SCANNING: {
    color: "var(--orange)",
    desc: "Security is noticing patterns in the disclosure queue. Stay precise on audience and harm.",
    cause: "Vault-only material routed to PUBLIC costs the most. Official vs public mistakes add up too.",
  },
  ALERT: {
    color: "var(--red)",
    desc: "MegaCorp is actively sweeping the mirror. Every mis-route is costly now.",
    cause: "Read identifiers and harm-if-public before assigning PUBLIC, OFFICIAL, or NO RELEASE.",
  },
  CRITICAL: {
    color: "var(--red)",
    desc: "You're one slip from losing the feed. Route only what the file evidence supports.",
    cause: "At 100% detection the mirror drops and the mission ends.",
  },
};

export function getDetectionBand(detection: number): DetectionBand {
  if (detection < 30) return "DARK";
  if (detection < 60) return "SCANNING";
  if (detection < 80) return "ALERT";
  return "CRITICAL";
}

export function getDetectionClass(detection: number) {
  if (detection < 30) return "det-green";
  if (detection < 60) return "det-amber";
  return "det-red";
}

export function getDetectionBarClass(detection: number) {
  if (detection < 30) return "det-bar-green";
  if (detection < 60) return "det-bar-amber";
  return "det-bar-red";
}

export function getDetectionIcon(detection: number) {
  if (detection < 30) return "fa-shield-alt";
  if (detection < 60) return "fa-eye";
  if (detection < 80) return "fa-exclamation-triangle";
  return "fa-skull";
}

export function getDetectionLabel(detection: number) {
  return getDetectionBand(detection);
}
