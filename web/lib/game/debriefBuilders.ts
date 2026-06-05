import { FILES as M4_FILES, STEPS as M4_STEPS } from "@/lib/game/m4/data";
import { DATASETS as M3_DATASETS } from "@/lib/game/m3/data";
import { ECHO_FRAME, ECHO_VIZ, CREW_ORDER } from "@/lib/game/m5/data";
import type { M2GameState } from "@/lib/game/m2/types";
import type { M3GameState } from "@/lib/game/m3/types";
import type { M4GameState } from "@/lib/game/m4/types";
import type { M5GameState } from "@/lib/game/m5/types";
import type { MissionDebriefConfig } from "@/components/missions/shared/MissionDebriefScreen";

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

export function buildM3Debrief(state: M3GameState): MissionDebriefConfig {
  const correctN = M3_DATASETS.filter((d) => state.assigned[d.id] === d.correct).length;
  const acc = Math.round((correctN / 10) * 100);
  const trust = Math.round(state.novaTrust);
  const tc = trustClass(trust);
  const success = correctN === 10 && state.catastrophic === 0 && trust >= 45;

  if (!success) {
    return {
      eyebrow: "// Mission 03 — Sign-off denied",
      title: state.catastrophic > 0 ? "PUBLIC CHANNEL BREACH" : "ROUTING TRUST TOO LOW",
      metrics: [
        { value: formatTimer(state.timerSec), label: "TIME" },
        { value: `${acc}%`, label: "ACCURACY" },
        { value: String(state.hintsUsed), label: "HINTS USED" },
        { value: `${trust}%`, label: "NOVA TRUST", valueClass: tc },
      ],
      breakdownTitle: "ROUTING SUMMARY",
      breakdownRows: [
        { label: "Correct assignments", value: `${correctN} / 10` },
        { label: "Wrong route attempts", value: String(state.wrongRoutes) },
        { label: "Public-wall breaches", value: String(state.catastrophic) },
        { label: "Final Nova trust", value: `${trust}%`, valueClass: tc, total: true },
      ],
      rating: state.catastrophic > 0 ? "ETHICS BREAK — Vault material surfaced on the wrong audience." : "MAP REJECTED — Distribution posture not defensible.",
      tradecraft: [
        { html: state.catastrophic > 0 ? "Material that should stay sealed was routed to the <strong>public</strong> channel." : "Too many misroutes — the distribution map did not reflect a defensible ethics posture." },
        { html: "<span class=\"tc-subhead\">Real-world translation</span> Privacy and ethics are about <strong>appropriate disclosure</strong> — which audiences may receive which data under which safeguards." },
      ],
      cta: "REVIEW & CONTINUE TO MISSION 4 →",
    };
  }

  const rating = trust >= 85 ? "SIGNED — Distribution map matches minimum necessary disclosure." : trust >= 55 ? "SIGNED — Acceptable, with friction on the trust line." : "SIGNED — Borderline; review misroutes before release.";

  return {
    eyebrow: "// Mission 03 — Complete",
    title: "THE HUMAN SHIELD — SIGNED",
    metrics: [
      { value: formatTimer(state.timerSec), label: "TIME" },
      { value: `${acc}%`, label: "ACCURACY" },
      { value: String(state.hintsUsed), label: "HINTS USED" },
      { value: `${trust}%`, label: "NOVA TRUST", valueClass: tc },
    ],
    breakdownTitle: "ROUTING SUMMARY",
    breakdownRows: [
      { label: "Correct assignments", value: "10 / 10" },
      { label: "Wrong route attempts", value: String(state.wrongRoutes) },
      { label: "Hints used", value: String(state.hintsUsed) },
      { label: "Final Nova trust", value: `${trust}%`, valueClass: tc, total: true },
    ],
    rating,
    tradecraft: [
      { html: "You separated <strong>public proof</strong>, <strong>official accountability</strong>, and <strong>material that must not ship</strong>. Nova's sign-off means the crew stands behind <em>how</em> this leaks." },
      { html: "<p class=\"tc-quote\">\"We had the access. We chose the boundaries.\"</p>" },
      { html: "<span class=\"tc-subhead\">Real-world translation</span> <strong>Minimum necessary</strong> disclosure applies to <strong>audiences</strong>: regulators, press, and the public are not interchangeable." },
    ],
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
