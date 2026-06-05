import type { LeakFile, OnboardingStep } from "@/lib/game/m4/types";

export const HACK_LINES = [
  { text: "OPERATION OMNI — MISSION 04 OF 05", className: "ht-g" },
  { text: "CONTINUITY BRIDGE · POST–MISSION 03", className: "ht-g" },
  { text: "Payload: STRUCTURE_QUEUE.enc — reconstruct cross-dept disclosure case", className: "ht-a" },
  { text: "Objective: PLACE EACH LEAK AT THE RIGHT HANDOFF", className: "ht-g" },
  { text: "⚡ 8 DATASETS · PROCESS GATES", className: "ht-o" },
  { text: "Channel: BUNDLE REVIEW", className: "ht-g" },
];

export const INTRO_CHAT = [
  { delay: 1200, sender: "Voss", text: "Same eight Mission 03 previews. <strong>Click an icon</strong> on the chain — four candidates appear top-right. Correct drop fades that step and <strong>greens the outgoing arrow</strong>. Nova's confidence starts at 100%.", tone: "bm-d" as const },
];

export const STEPS: OnboardingStep[] = [
  { id: "offer-review", lane: "Legal & Compliance", deptCls: "dept-legal", title: "Offer Letter Review", bottleneck: "No signed offer → candidate not legally committed", purpose: "Legal reviews the offer terms, NDA, and IP assignment clauses. HR cannot proceed until Legal signs off.", inputs: "Draft offer letter, compensation terms, NDA templates, IP agreements.", outputs: "Approved offer package ready for candidate signature.", okFile: "memo_847" },
  { id: "identity-verify", lane: "IT — Security", deptCls: "dept-it", title: "Identity Verification", bottleneck: "Unverified identity → cannot create secure credentials", purpose: "IT Security runs identity verification using portal sessions, device fingerprints, and 2FA.", inputs: "Portal session logs, IP traces, device metadata, 2FA verification records.", outputs: "Verified identity profile linked to employee record.", okFile: "web_logs" },
  { id: "background-check", lane: "HR — Compliance", deptCls: "dept-hr", title: "Background Check", bottleneck: "Failed background → offer rescinded before Day 1", purpose: "HR Compliance runs criminal, education, and employment verification.", inputs: "Background check results, criminal records, education verification, employment history.", outputs: "Risk assessment score and compliance clearance for hire.", okFile: "risk_full" },
  { id: "health-screen", lane: "HR — Benefits", deptCls: "dept-hr", title: "Health Screening", bottleneck: "Missing health data → cannot enroll in benefits", purpose: "HR Benefits collects pre-employment health screening results for insurance enrollment.", inputs: "Drug screening results, physical exam data, vaccination records.", outputs: "Health clearance and benefits eligibility confirmation.", okFile: "health" },
  { id: "payroll-setup", lane: "HR — Payroll", deptCls: "dept-hr", title: "Payroll & Tax Setup", bottleneck: "Incomplete tax forms → cannot process first paycheck", purpose: "HR Payroll configures salary, tax withholdings, and direct deposit.", inputs: "Salary data, tax forms (W-4, I-9), direct deposit info, equity grant details.", outputs: "Active payroll record ready for first pay cycle.", okFile: "payroll" },
  { id: "data-access", lane: "IT — Data Governance", deptCls: "dept-it", title: "Data Access Setup", bottleneck: "No data access → cannot perform job duties", purpose: "IT Data Gov provisions database and system access based on role.", inputs: "Role access matrix, database permissions, customer data scope.", outputs: "Provisioned access to all required data systems.", okFile: "cust_dump" },
  { id: "dependent-benefits", lane: "HR — Benefits", deptCls: "dept-hr", title: "Dependent Enrollment", bottleneck: "Missing dependent info → family not covered", purpose: "HR Benefits enrolls family members in health, dental, and life insurance.", inputs: "Dependent names, birth dates, SSNs, school enrollment data.", outputs: "Full family benefits package activated.", okFile: "schools" },
  { id: "performance-goals", lane: "Operations — Management", deptCls: "dept-ops", title: "Performance Setup", bottleneck: "No goals → cannot measure success or bonus eligibility", purpose: "Management sets 90-day objectives and KPIs aligned with team goals.", inputs: "Team OKRs, individual goals, success metrics, bonus structure.", outputs: "Documented performance plan and probation review schedule.", okFile: "omni_exec" },
];

export const FILES: LeakFile[] = [
  { id: "omni_exec", name: "Q4_Performance_Review.pdf", desc: "goal_title, metric_target, review_date" },
  { id: "risk_full", name: "Personnel_Assessment_Export.xlsx", desc: "criminal_flag, education_verified, risk_score" },
  { id: "health", name: "Health_Screening_Results.dat", desc: "test_type, result_status, exam_date" },
  { id: "web_logs", name: "Session_Traffic_Log.dat", desc: "session_id, ip_address, 2fa_verified" },
  { id: "cust_dump", name: "User_Database_Backup.csv", desc: "table_name, permission_level, schema_access" },
  { id: "memo_847", name: "Internal_Policy_Review.md", desc: "NDA_Clause, IP_Assignment, signatory" },
  { id: "payroll", name: "Compensation_Review_Report.csv", desc: "base_salary, tax_withholding, equity_grant" },
  { id: "schools", name: "Community_Program_Roster.csv", desc: "dependent_name, birth_date, relationship" },
];

export const STEP_FLOW_ICONS: Record<string, string> = {
  "offer-review": "fa-file-signature",
  "identity-verify": "fa-fingerprint",
  "background-check": "fa-user-check",
  "health-screen": "fa-heart-pulse",
  "payroll-setup": "fa-money-bill-wave",
  "data-access": "fa-database",
  "dependent-benefits": "fa-people-roof",
  "performance-goals": "fa-chart-line",
};

export const STEP_DATA_HINT: Record<string, string> = {
  "offer-review": "Offer letter, NDA, IP clauses (Legal)",
  "identity-verify": "Session logs, 2FA verification (IT)",
  "background-check": "Criminal, education, employment check (HR)",
  "health-screen": "Drug test, physical, vaccination records (HR)",
  "payroll-setup": "W-4, I-9, direct deposit, salary (HR)",
  "data-access": "Database permissions, role access (IT)",
  "dependent-benefits": "Family info, school enrollment (HR)",
  "performance-goals": "OKRs, KPIs, 90-day objectives (Ops)",
};

export const WRONG_STEP_OVERRIDES: Record<string, Record<string, string>> = {
  memo_847: { "identity-verify": "The offer letter is <strong>Legal's first step</strong> — it must be approved before IT can verify identity.", "background-check": "Legal reviews the <strong>offer terms</strong> first, then HR runs background checks." },
  web_logs: { "offer-review": "Session logs verify <strong>identity</strong>, not <strong>contract terms</strong> — wrong starting step.", "background-check": "Portal logs are for <strong>identity verification</strong>, not <strong>background screening</strong>." },
  risk_full: { "health-screen": "Background checks are <strong>risk assessment</strong>, not <strong>health screening</strong> — different HR lane.", "identity-verify": "This is <strong>HR compliance data</strong>, not <strong>IT identity verification</strong>." },
  health: { "background-check": "Health screening is <strong>benefits enrollment</strong>, not <strong>compliance risk check</strong>.", "payroll-setup": "Medical data goes to <strong>health screening</strong>, not <strong>payroll setup</strong>." },
  payroll: { "health-screen": "Compensation data is for <strong>payroll setup</strong>, not <strong>health screening</strong>.", "data-access": "Tax forms and salary go to <strong>HR Payroll</strong>, not <strong>IT Data Governance</strong>." },
  cust_dump: { "payroll-setup": "System access isn't <strong>payroll</strong> — this is <strong>IT data provisioning</strong>." },
  schools: { "performance-goals": "Dependent info is for <strong>benefits enrollment</strong>, not <strong>performance goals</strong>." },
  omni_exec: { "dependent-benefits": "Performance reviews set <strong>goals</strong>, not <strong>benefits enrollment</strong>." },
};

export const FLOW_NODE_POSITIONS = [
  { x: 7, y: 35 },
  { x: 22, y: 35 },
  { x: 37, y: 35 },
  { x: 52, y: 18 },
  { x: 52, y: 52 },
  { x: 67, y: 35 },
  { x: 82, y: 22 },
  { x: 82, y: 52 },
];

export const DATASET_CANDIDATE_CAP = 4;

export const FLOW_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [5, 6], [5, 7],
];

const candidateCache: Record<string, string[]> = {};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getDatasetCandidatesForStep(stepId: string | null, picks: Record<string, string>): LeakFile[] {
  if (!stepId) return [];
  const st = STEPS.find((s) => s.id === stepId);
  if (!st) return [];

  const assignedHere = FILES.find((f) => picks[f.id] === st.id);
  if (assignedHere) {
    const remaining = FILES.filter((f) => !picks[f.id]);
    return remaining.slice(0, Math.min(DATASET_CANDIDATE_CAP, remaining.length));
  }

  const cachedIds = candidateCache[stepId];
  if (cachedIds) {
    const stillValid = cachedIds.every((fid) => !picks[fid]) && cachedIds.includes(st.okFile);
    if (stillValid) return cachedIds.map((fid) => FILES.find((f) => f.id === fid)!).filter(Boolean);
    delete candidateCache[stepId];
  }

  const pool = FILES.filter((f) => !picks[f.id]);
  if (pool.length === 0) return [];

  const correctF = pool.find((f) => f.id === st.okFile);
  const wrongPool = pool.filter((f) => f.id !== st.okFile);
  const out: LeakFile[] = [];
  if (correctF) out.push(correctF);
  const need = Math.min(DATASET_CANDIDATE_CAP - out.length, wrongPool.length);
  shuffle(wrongPool).slice(0, need).forEach((f) => out.push(f));
  const finalOrder = shuffle(out);
  candidateCache[stepId] = finalOrder.map((f) => f.id);
  return finalOrder;
}

export function resetCandidateCache() {
  Object.keys(candidateCache).forEach((k) => delete candidateCache[k]);
}

export function stepIndex(stepId: string) {
  return STEPS.findIndex((s) => s.id === stepId);
}

export function isStepAvailable(stepIdx: number, picks: Record<string, string>) {
  if (stepIdx === 0) return true;
  const predecessors = FLOW_EDGES.filter(([, to]) => to === stepIdx).map(([from]) => from);
  if (predecessors.length === 0) return true;
  return predecessors.every((predIdx) => {
    const pred = STEPS[predIdx];
    return pred && Object.values(picks).includes(pred.id);
  });
}

export function isStepSatisfied(stepId: string, picks: Record<string, string>) {
  const st = STEPS.find((s) => s.id === stepId);
  if (!st) return false;
  return picks[st.okFile] === stepId;
}

export function correctStepForFile(fileId: string) {
  return STEPS.find((s) => s.okFile === fileId)?.id ?? null;
}

export function confidenceHit(fileId: string) {
  return ["schools", "health", "cust_dump", "risk_full"].includes(fileId) ? 14 : 10;
}

export function wrongStepMessage(fileId: string, wrongStepId: string) {
  const override = WRONG_STEP_OVERRIDES[fileId]?.[wrongStepId];
  if (override) return override;
  const f = FILES.find((x) => x.id === fileId);
  const wrong = STEPS.find((s) => s.id === wrongStepId);
  return `${f?.name} does not belong at ${wrong?.title}.`;
}

export const DEBRIEF = {
  eyebrow: "// Mission 04 — Debrief",
  title: "The Onboarding — Spine Complete",
  cta: "ENTER THE FINAL BRIEF →",
};
