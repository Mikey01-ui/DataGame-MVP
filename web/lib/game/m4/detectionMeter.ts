import type { DetectionBand } from "@/lib/game/m3/detectionMeter";

export {
  getDetectionBand,
  getDetectionBarClass,
  getDetectionClass,
  getDetectionIcon,
} from "@/lib/game/m3/detectionMeter";

export const M4_DETECTION_INFO: Record<
  DetectionBand,
  { color: string; desc: string; cause: string }
> = {
  DARK: {
    color: "var(--green)",
    desc: "Handoff audit is quiet. Nova's custody story still reads as a regulated process — not a random dump.",
    cause: "Detection rises on wrong gate links, hints, and slowly over time. At 100% the audit trips and the mission ends.",
  },
  SCANNING: {
    color: "var(--orange)",
    desc: "MegaCorp analysts are noticing timeline gaps. Wrong handoffs are showing up in the audit trail.",
    cause: "Line up each step's Expects line with dataset table headers before you drop.",
  },
  ALERT: {
    color: "var(--red)",
    desc: "Exposure is climbing. Every mis-link makes the onboarding map look like chaos.",
    cause: "Use the step brief and hint sparingly; return strip undoes a chip if you mis-link.",
  },
  CRITICAL: {
    color: "var(--red)",
    desc: "One more bad handoff and analysts call this a random pile — not a defensible disclosure.",
    cause: "At 100% detection the handoff audit fails and the operation is exposed.",
  },
};
