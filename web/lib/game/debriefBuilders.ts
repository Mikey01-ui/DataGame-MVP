import { FILES as M4_FILES, STEPS as M4_STEPS } from "@/lib/game/m4/data";
import {
  DATASETS as M3_DATASETS,
  DETECTION,
  M3_CHANNEL_LEARNING,
  SIGNOFF_DETECTION_MAX,
} from "@/lib/game/m3/data";
import { getDetectionClass } from "@/lib/game/m3/detectionMeter";
import type { Channel } from "@/lib/game/m3/types";
import { ECHO_FRAME, ECHO_VIZ, CREW_ORDER } from "@/lib/game/m5/data";
import type { M2GameState } from "@/lib/game/m2/types";
import type { M3GameState } from "@/lib/game/m3/types";
import type { M4GameState } from "@/lib/game/m4/types";
import type { M5GameState } from "@/lib/game/m5/types";
import type { DebriefRow, MissionDebriefConfig } from "@/components/missions/shared/MissionDebriefScreen";

function formatTimer(sec: number) {
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

function trustClass(trust: number) {
  if (trust >= 70) return "det-green";
  if (trust >= 40) return "det-amber";
  return "det-red";
}

export function buildM2Debrief(state: M2GameState): MissionDebriefConfig {
  const acc = Math.max(0, Math.round(((8 - (state.wrongRulings + state.verifyErrors)) / 8) * 100));
  let score = state.score;
  if (state.wrongRulings === 0 && state.verifyErrors === 0) score += 300;
  if (state.hintsUsed === 0) score += 150;

  const feedback: string[] = [];
  if (state.wrongRulings === 0) {
    feedback.push("FLAWLESS RULINGS — All four ownership disputes resolved correctly on first attempt.");
  } else {
    feedback.push(`RULING ERRORS: ${state.wrongRulings} incorrect ruling(s). The deciding factor is the verified steward and lineage.`);
  }
  if (state.verifyErrors === 0) {
    feedback.push("PERFECT VERIFICATION — All evidence questions answered correctly.");
  } else {
    feedback.push(`VERIFICATION ERRORS: ${state.verifyErrors} incorrect answer(s). Every answer is in the Inspector metadata.`);
  }
  if (state.hintsUsed > 0) {
    feedback.push(`HINTS USED: ${state.hintsUsed}. Open the Inspector before requesting a hint.`);
  } else {
    feedback.push("NO HINTS — All decisions made directly from evidence.");
  }

  return {
    eyebrow: "// Mission 02 — Complete",
    title: "Master Key Compiled — Vault Access Granted",
    metrics: [
      { value: formatTimer(state.timerSec), label: "TIME" },
      { value: `${acc}%`, label: "ACCURACY" },
      { value: String(state.hintsUsed), label: "HINTS USED" },
      { value: String(score), label: "SCORE" },
    ],
    breakdownTitle: "TRIBUNAL SUMMARY",
    breakdownRows: [
      { label: "Wrong rulings", value: String(state.wrongRulings) },
      { label: "Verify errors", value: String(state.verifyErrors) },
      { label: "Hints used", value: String(state.hintsUsed) },
      { label: "Tokens forged", value: "4 / 4", total: true },
    ],
    rating: state.wrongRulings === 0 && state.verifyErrors === 0 ? "FLAWLESS — Governance map is clean." : "COMPLETE — Review errors before Mission 3.",
    tradecraft: [
      { html: feedback.map((f) => f).join("<br><br>") },
      { html: "<span class=\"tc-subhead\">Real-world translation</span> You ruled on four data ownership conflicts using stewardship records, lineage, and classification. Ownership follows the <strong>verified Data Steward</strong> — not origin, usage, or unverified fields." },
      { html: "<strong>1. Origin is not ownership.</strong> <strong>2. Usage is not ownership.</strong> <strong>3. A pipe is not an owner.</strong> <strong>4. Unverified fields can't settle disputes.</strong> <strong>5. Regulation overrides everything.</strong>" },
    ],
    cta: "CONTINUE TO MISSION 3 — THE HUMAN SHIELD →",
  };
}

function m3AccuracyClass(acc: number) {
  if (acc === 100) return "det-green";
  if (acc >= 80) return "det-amber";
  return "det-red";
}

function m3BreakdownRows(state: M3GameState, correctN: number, detection: number, detCls: string): DebriefRow[] {
  const rows: DebriefRow[] = [
    { label: "Time on mission", value: formatTimer(state.timerSec) },
    { label: "Correct assignments", value: `${correctN} / 10` },
    { label: "Wrong route attempts", value: String(state.wrongRoutes) },
    { label: "Hints used", value: String(state.hintsUsed) },
  ];
  if (state.hintsUsed > 0) {
    rows.push({ label: "Detection from hints", value: `+${state.hintsUsed * DETECTION.hint}%` });
  }
  if (state.catastrophic > 0) {
    rows.push({ label: "Public-wall breaches", value: String(state.catastrophic), valueClass: "det-red" });
  }
  rows.push({ label: "Final detection", value: `${detection}%`, valueClass: detCls, total: true });
  return rows;
}

const M3_ETHICS_SKILLS: Record<Channel, { who: string; skill: string; realUse: string }> = {
  public: {
    who: "AUDIENCE FIT",
    skill: "Only material safe for open publication — aggregates, technical proof, policy admissions without unjustified PII.",
    realUse: "Press briefings, public accountability reports, sanitized evidence packs.",
  },
  official: {
    who: "ACCOUNTABLE DISCLOSURE",
    skill: "Sensitive data for regulators, labour boards, or counsel under proper process — not tabloid dumps.",
    realUse: "Regulatory filings, sealed counsel briefs, labour-board submissions.",
  },
  vault: {
    who: "HARM PREVENTION",
    skill: "Health data, minors, raw customer PII — harm outweighs any headline, even when you have access.",
    realUse: "Default-deny lists, DPO escalation, data that never leaves controlled storage.",
  },
};

function m3MissionTeachesBlock() {
  return (
    "<span class=\"tc-subhead\">What this mission trains</span> " +
    "Mission 03 is <strong>data ethics</strong>. Mission 2 established <strong>who owns which data</strong>; this round asks <strong>who may receive it</strong> and <strong>how it should be used</strong> — " +
    "matching sensitivity to audience through <strong>minimum necessary disclosure</strong>, not dumping everything because the vault is open."
  );
}

function m3YourRoundBlock(state: M3GameState, acc: number, outcome: "signed" | "denied" | "compromised") {
  const placed = Object.keys(state.assigned).length;
  const parts: string[] = [];

  if (outcome === "compromised") {
    parts.push(
      `Detection hit <strong>100%</strong> before sign-off. You placed <strong>${placed}/10</strong> files in <strong>${formatTimer(state.timerSec)}</strong> — ` +
        "the ethics framework was right, but wrong routes and exposure cost you the mirror.",
    );
  } else if (outcome === "denied") {
    parts.push(
      `You routed <strong>${acc}%</strong> correctly in <strong>${formatTimer(state.timerSec)}</strong> (${placed}/10 files on the map). ` +
        "Nova withheld sign-off because the distribution posture wasn't defensible — ethics isn't only about access, it's about <strong>audience entitlement</strong>.",
    );
  } else if (acc === 100 && state.wrongRoutes === 0) {
    parts.push(
      `In <strong>${formatTimer(state.timerSec)}</strong> you routed all 10 files with no wrong attempts. ` +
        "You read <strong>identifiers</strong> and <strong>harm if public</strong> before every channel pick — that's data ethics applied under pressure.",
    );
  } else {
    parts.push(
      `In <strong>${formatTimer(state.timerSec)}</strong> you finished at <strong>${acc}%</strong> accuracy with <strong>${state.wrongRoutes}</strong> wrong attempt(s) along the way. ` +
        "You showed you can separate what the <strong>public</strong>, <strong>official bodies</strong>, and <strong>vault</strong> each deserve — the judgment Nova signs off on.",
    );
  }

  if (state.hintsUsed > 0) {
    parts.push(
      `You requested <strong>${state.hintsUsed}</strong> hint(s) (+${state.hintsUsed * DETECTION.hint}% detection) when harm profiles were unclear — in practice that's escalating to a <strong>DPO or privacy counsel</strong> before release.`,
    );
  } else if (outcome === "signed") {
    parts.push("No hints — you worked from the inspector evidence alone.");
  }

  if (state.catastrophic > 0) {
    parts.push(
      `<strong>${state.catastrophic}</strong> file(s) with vault-class sensitivity were sent toward the <strong>public wall</strong> — the core ethics failure this mission trains you to avoid.`,
    );
  }

  return `<span class="tc-subhead">What you applied this round</span> ${parts.join(" ")}`;
}

function m3RealWorldBlock() {
  return (
    "<span class=\"tc-subhead\">In the real world</span> " +
    "You'd use the same judgment building a <strong>regulatory disclosure</strong>, a <strong>FOIA or subject-access response</strong>, a <strong>responsible press package</strong>, or an <strong>internal ethics review</strong>. " +
    "Data stewards and privacy officers ask: <em>Who is the audience? What is the lawful basis? What harm if this goes wide?</em> — " +
    "GDPR, HIPAA, and sector rules encode <strong>who may process what</strong>, not just whether a field exists on a drive."
  );
}

function m3ExampleBlock() {
  return (
    "<span class=\"tc-subhead\">Example</span> " +
    "A team obtains a <strong>customer database backup</strong>, a <strong>board policy memo</strong>, and <strong>session traffic logs</strong>. " +
    "Ethics says: publish the memo (public accountability), file the logs with regulators (official process), and <strong>never</strong> release the customer CSV — " +
    "even though all three prove wrongdoing. <strong>Impact without doxxing.</strong>"
  );
}

function m3LearningRows(state: M3GameState) {
  return (["public", "official", "vault"] as Channel[]).map((ch) => {
    const meta = M3_ETHICS_SKILLS[ch];
    const files = M3_DATASETS.filter((d) => d.correct === ch);
    const routed = files.filter((d) => state.assigned[d.id] === ch).length;
    const ok = routed === files.length;
    const example = M3_CHANNEL_LEARNING[ch].example;
    return {
      who: meta.who,
      text: `${meta.skill} <em>In practice: ${meta.realUse}</em> This round: <strong>${routed}/${files.length}</strong> routed correctly. <em>Mission file: ${example}</em>`,
      ok,
    };
  });
}

function m3Tradecraft(state: M3GameState, acc: number, outcome: "signed" | "denied" | "compromised") {
  return [
    { html: m3MissionTeachesBlock() },
    { html: m3YourRoundBlock(state, acc, outcome) },
    { html: m3RealWorldBlock() },
    { html: m3ExampleBlock() },
  ];
}

const M3_LEARNING_TITLE = "HOW YOU APPLIED DATA ETHICS";

export function buildM3Debrief(state: M3GameState): MissionDebriefConfig {
  const correctN = M3_DATASETS.filter((d) => state.assigned[d.id] === d.correct).length;
  const acc = Math.round((correctN / 10) * 100);
  const accCls = m3AccuracyClass(acc);
  const detection = Math.round(state.detection);
  const detCls = getDetectionClass(detection);
  const detectionMaxed = detection >= 100 || state.phase === "failed";
  const success = !detectionMaxed && correctN === 10 && state.catastrophic === 0 && detection <= SIGNOFF_DETECTION_MAX;
  const breakdownRows = m3BreakdownRows(state, correctN, detection, detCls);
  const learningRows = m3LearningRows(state);

  if (detectionMaxed) {
    return {
      eyebrow: "// Mission 03 — Mirror compromised",
      title: "DETECTION THRESHOLD EXCEEDED",
      metrics: [
        { value: formatTimer(state.timerSec), label: "TIME" },
        { value: `${acc}%`, label: "ACCURACY", valueClass: accCls },
        { value: String(state.wrongRoutes), label: "WRONG ROUTES" },
        { value: "100%", label: "DETECTION", valueClass: "det-red" },
      ],
      breakdownTitle: "ROUTING SUMMARY",
      breakdownRows: breakdownRows.map((r) => (r.label === "Final detection" ? { ...r, value: "100%", valueClass: "det-red" } : r)),
      rating: "FEED DROPPED — MegaCorp closed the mirror before sign-off.",
      tradecraft: m3Tradecraft(state, acc, "compromised"),
      learningRows,
      learningTitle: M3_LEARNING_TITLE,
      cta: "RETRY MISSION →",
    };
  }

  if (!success) {
    return {
      eyebrow: "// Mission 03 — Sign-off denied",
      title: state.catastrophic > 0 ? "PUBLIC CHANNEL BREACH" : "ROUTING DETECTION TOO HIGH",
      metrics: [
        { value: formatTimer(state.timerSec), label: "TIME" },
        { value: `${acc}%`, label: "ACCURACY", valueClass: accCls },
        { value: String(state.hintsUsed), label: "HINTS USED" },
        { value: `${detection}%`, label: "DETECTION", valueClass: detCls },
      ],
      breakdownTitle: "ROUTING SUMMARY",
      breakdownRows,
      rating: state.catastrophic > 0 ? "ETHICS BREAK — Vault material surfaced on the wrong audience." : "MAP REJECTED — Distribution posture not defensible.",
      tradecraft: m3Tradecraft(state, acc, "denied"),
      learningRows,
      learningTitle: M3_LEARNING_TITLE,
      cta: "REVIEW & CONTINUE TO MISSION 4 →",
    };
  }

  const rating =
    detection <= 15
      ? "SIGNED — Distribution map matches minimum necessary disclosure."
      : detection <= 35
        ? "SIGNED — Acceptable, with friction on the detection line."
        : "SIGNED — Borderline; review misroutes before release.";

  return {
    eyebrow: "// Mission 03 — Complete",
    title: "THE HUMAN SHIELD — SIGNED",
    metrics: [
      { value: formatTimer(state.timerSec), label: "TIME" },
      { value: `${acc}%`, label: "ACCURACY", valueClass: accCls },
      { value: String(state.hintsUsed), label: "HINTS USED" },
      { value: `${detection}%`, label: "DETECTION", valueClass: detCls },
    ],
    breakdownTitle: "ROUTING SUMMARY",
    breakdownRows,
    rating,
    tradecraft: [
      ...m3Tradecraft(state, acc, "signed"),
      { html: "<p class=\"tc-quote\">\"We had the access. We chose the boundaries.\"</p>" },
    ],
    learningRows,
    learningTitle: M3_LEARNING_TITLE,
    cta: "CONTINUE TO MISSION 4 — THE ONBOARDING →",
  };
}

export function buildM4Debrief(state: M4GameState): MissionDebriefConfig {
  const correct = Object.entries(state.picks).filter(([fileId, stepId]) => M4_STEPS.find((s) => s.id === stepId)?.okFile === fileId).length;
  const conf = Math.round(state.confidence);
  const wa = state.wrongAttempts;
  const confCls = conf >= 85 ? "det-green" : conf >= 50 ? "det-amber" : "det-red";
  const solidBar = Math.max(1, Math.ceil(M4_FILES.length * 0.75));
  const tier = correct === M4_FILES.length ? "CLEAN STRUCTURE" : correct >= solidBar ? "SOLID" : "NEEDS REWORK";

  const rating =
    correct === M4_FILES.length && wa === 0
      ? "SPINE COMPLETE — Every handoff matches the published case-flow."
      : correct === M4_FILES.length
        ? "SPINE COMPLETE — Map holds; review confidence hits before release."
        : correct >= solidBar
          ? "USABLE — Adjust the red nodes before you brief externally."
          : "REWORK — Too many mis-links for a credible narrative.";

  const stumb =
    wa > 0
      ? ` You took <strong>${wa}</strong> wrong ${wa === 1 ? "stab" : "stabs"} — confidence finished at <strong>${conf}%</strong>.`
      : " Nova confidence stayed at <strong>100%</strong>.";

  return {
    eyebrow: "// Mission 04 — Map finalized",
    title: `THE ONBOARDING — ${tier}`,
    metrics: [
      { value: formatTimer(state.timerSec), label: "TIME" },
      { value: `${correct}/${M4_FILES.length}`, label: "HANDOFFS CORRECT" },
      { value: `${conf}%`, label: "NOVA CONFIDENCE", valueClass: confCls },
      { value: String(wa), label: "WRONG DROPS" },
    ],
    breakdownTitle: "FLOW SUMMARY",
    breakdownRows: [
      { label: "Artifacts placed correctly", value: `${correct} / ${M4_FILES.length}` },
      { label: "Wrong drop attempts", value: String(wa) },
      { label: "Outcome band", value: tier, total: true },
    ],
    rating,
    tradecraft: [
      { html: "Mission 03 trained <strong>who may receive which data</strong>. Mission 04 trains <strong>how artifacts travel between departments</strong> in one disclosure case." },
      { html: `You placed <strong>${correct} of ${M4_FILES.length}</strong> feeds on the correct gates.${stumb}` },
      { html: "<span class=\"tc-subhead\">Real-world translation</span> A defensible disclosure ties each artifact to a <strong>gate and owner</strong> in the regulated flow." },
    ],
    cta: "ENTER THE FINAL BRIEF →",
  };
}

export function buildM5Debrief(state: M5GameState): MissionDebriefConfig {
  const ships = state.ships ?? state.commits >= 3;
  let wrongF = 0;
  let wrongV = 0;
  for (let i = 1; i <= 4; i++) {
    const c = state.frameChoices[i];
    if (c?.frame && c.frame !== ECHO_FRAME[i].correct) wrongF++;
    if (c?.viz && c.viz !== ECHO_VIZ[i].correct) wrongV++;
  }
  const det = Math.round(state.detection);
  const detCls = det < 35 ? "det-green" : det < 70 ? "det-amber" : "det-red";

  const LEARNING: Record<string, { who: string; text: string }> = {
    zex: { who: "ZEX · Data Analysis", text: "A node map proves things are <strong>connected</strong> — not that they are switched on." },
    atlas: { who: "ATLAS · Governance", text: "Governance follows <strong>verified, formal accountability</strong> — not the creator or heaviest user." },
    nova: { who: "NOVA · Ethics", text: "When the <strong>purpose of collection is harmful</strong>, a dataset must be dropped — not just anonymised." },
    kade: { who: "KADE · Data Flows", text: "A bottleneck is a <strong>convergence point</strong> — if it fails, everything downstream stalls." },
  };

  return {
    eyebrow: ships ? "// Mission 5 — Operation Shipped" : "// Mission 5 — Operation Aborted",
    title: ships ? "OMNI Exposed · Debrief" : "Operation Aborted · Debrief",
    metrics: [
      { value: formatTimer(state.timerSec), label: "TIME" },
      { value: `${state.commits}/4`, label: "COMMITS" },
      { value: String(state.score), label: "SCORE" },
      { value: `${det}%`, label: "DETECTION", valueClass: detCls },
    ],
    breakdownTitle: "PERFORMANCE BREAKDOWN",
    breakdownRows: [
      { label: "Framing accuracy", value: wrongF === 0 ? "PERFECT" : `${wrongF} wrong`, valueClass: wrongF === 0 ? "det-green" : "det-red" },
      { label: "Visualisation accuracy", value: wrongV === 0 ? "PERFECT" : `${wrongV} wrong`, valueClass: wrongV === 0 ? "det-green" : "det-red" },
      ...CREW_ORDER.map((c) => ({
        label: LEARNING[c].who.split(" · ")[0],
        value: state.crewState[c].status === "committed" ? "COMMITTED" : "SCEPTICAL",
        valueClass: state.crewState[c].status === "committed" ? "det-green" : "det-red",
      })),
      { label: "Crew commits", value: `${state.commits} / 4`, valueClass: detCls, total: true },
    ],
    rating: ships ? "Operation shipped. The room committed. That is the only metric that matters." : "Operation aborted. Review which framing and crew answers cost you the vote.",
    tradecraft: [
      { html: ships ? "Four operations. Four objections answered. The crew committed and the hack ships." : "The dossier was real — the room did not commit. Review framing and crew challenges." },
    ],
    learningRows: CREW_ORDER.map((c) => ({
      who: LEARNING[c].who,
      text: LEARNING[c].text,
      ok: state.crewState[c].status === "committed",
    })),
    cta: "OPERATION COMPLETE — RETURN TO HUB →",
  };
}
