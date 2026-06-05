import type { Channel, Dataset } from "@/lib/game/m3/types";

export const CHANNEL_LABELS: Record<Channel, string> = {
  public: "PUBLIC WALL",
  official: "OFFICIAL FILING",
  vault: "NO RELEASE",
};

export const BUDGET_START = 50000;
export const HINT_COST = 2500;
export const WRONG_ROUTE_COST = 750;
export const SIGNOFF_TRUST_MIN = 45;

export const HACK_LINES = [
  { text: "OPERATION OMNI — MISSION 03 OF 05", className: "ht-g" },
  { text: "BREACH VECTOR — MARSHALL.DESKTOP", className: "ht-g" },
  { text: "Session: RDP_MIRROR_ACTIVE", className: "ht-a" },
  { text: "Vault: LOCKED · 4-LETTER COMBO REQUIRED", className: "ht-o" },
  { text: "Queue: ENCRYPTED · 10 FILES STAGED", className: "ht-a" },
  { text: "Bypass: COMPLETE", className: "ht-g" },
];

export const INTRO_CHAT = [
  { delay: 400, sender: "Voss" as const, text: "Ten files. Three channels — public wall, official filing, or no release. Read harm profile before you route.", tone: "bm-d" as const },
  { delay: 2200, sender: "Zex" as const, text: "Hardest part isn't getting the data. It's acting like we have standards after we broke in. Route.", tone: "bm-d" as const },
];

export const DATASETS: Dataset[] = [
  { id: "omni_exec", file: "Q4_Performance_Review.pdf", correct: "public", classification: "Internal — Management", identifiers: "None — aggregates only", harmIfPublic: "Low — no personal records", note: "Board-level ROI; safe for public narrative.", wrongRationale: { official: "Aggregates and ROI — no PII. Use public accountability, not sealed process.", vault: "Nothing here justifies hiding it. Safe business metrics for the public wall." } },
  { id: "risk_full", file: "Personnel_Assessment_Export.xlsx", correct: "vault", classification: "HR — named employees & model scores", identifiers: "Names, employee IDs, model scores", harmIfPublic: "Severe — re-identification & stigma", note: "Never appropriate for press; vault only.", wrongRationale: { public: "Names, IDs, and scores weaponize real people. NO RELEASE.", official: "Raw HR intelligence on named employees — vault, not filing." } },
  { id: "pipeline", file: "System_Architecture.json", correct: "public", classification: "Internal — Technical", identifiers: "System IDs only", harmIfPublic: "Low — infrastructure evidence", note: "Helps public understand OMNI without PII.", wrongRationale: { official: "Technical map, not sealed investigation — public wall.", vault: "No people in this file — safe to publish." } },
  { id: "health", file: "Health_Screening_Results.dat", correct: "vault", classification: "Restricted — Health", identifiers: "Employee IDs + vitals", harmIfPublic: "Severe — HIPAA-class harm", note: "Regulatory path if ever needed — not mass disclosure.", wrongRationale: { public: "Health + identifiers is a privacy catastrophe. NO RELEASE.", official: "Raw health dump — vault default, not official filing." } },
  { id: "web_logs", file: "Session_Traffic_Log.dat", correct: "official", classification: "Security ops — sessions & partial IPs", identifiers: "Sessions, partial IPs", harmIfPublic: "High if dumped — regulator context OK", note: "Official channels can evaluate; not front page.", wrongRationale: { public: "Session logs are fingerprinty — official filing, not press wall.", vault: "Regulators may need this — official, not hidden entirely." } },
  { id: "cust_dump", file: "User_Database_Backup.csv", correct: "vault", classification: "Full customer PII", identifiers: "Names, addresses, accounts", harmIfPublic: "Severe — civilian harm", note: "Does not belong in public or opportunistic leaks.", wrongRationale: { public: "Full customer table = mass doxx. NO RELEASE.", official: "Wholesale backup doesn't get disclosed through our channels." } },
  { id: "memo_847", file: "Internal_Policy_Review.md", correct: "public", classification: "Internal", identifiers: "None in body", harmIfPublic: "Low — organizational admission", note: "Supports narrative without doxxing individuals.", wrongRationale: { official: "Policy admission in plain language — public wall.", vault: "Company's own words are the story — don't hide it." } },
  { id: "payroll", file: "Compensation_Review_Report.csv", correct: "official", classification: "Comp review — masked rows", identifiers: "Masked IDs; flagged pay bands", harmIfPublic: "Medium–high — official process for equity", note: "Redacted for filing; not a public spreadsheet drop.", wrongRationale: { public: "Pay investigation material — official filing under process.", vault: "Blocks accountable oversight — route official." } },
  { id: "schools", file: "Community_Program_Roster.csv", correct: "vault", classification: "Restricted — Minors", identifiers: "Students, guardians", harmIfPublic: "Unacceptable — children", note: "Vault. Full stop.", wrongRationale: { public: "Minors and guardians — NO RELEASE, full stop.", official: "Kids don't get disclosed through this pipeline — vault." } },
  { id: "api_abuse", file: "Security_Alert_Log.txt", correct: "public", classification: "Internal — Security", identifiers: "None — sanitized log", harmIfPublic: "Low — technical evidence", note: "Pre-redacted; OK for public wall.", wrongRationale: { official: "Sanitized technical evidence — public wall.", vault: "Clean alert trail strengthens the story — publish it." } },
];

export const DEBRIEF = {
  title: "THE HUMAN SHIELD",
  eyebrow: "// Mission 03",
  cta: "CONTINUE TO MISSION 4 — THE ONBOARDING →",
};

export function trustDelta(correct: Channel, choice: Channel): { d: number; catastrophic: boolean } {
  if (choice === correct) return { d: 0, catastrophic: false };
  if (correct === "vault" && choice === "public") return { d: -42, catastrophic: true };
  if (correct === "official" && choice === "public") return { d: -30, catastrophic: false };
  if (correct === "vault" && choice === "official") return { d: -18, catastrophic: false };
  if (correct === "public" && choice === "vault") return { d: -12, catastrophic: false };
  if (correct === "public" && choice === "official") return { d: -10, catastrophic: false };
  if (correct === "official" && choice === "vault") return { d: -10, catastrophic: false };
  return { d: -10, catastrophic: false };
}

export function wrongExplain(ds: Dataset, choice: Channel): string {
  if (ds.wrongRationale[choice]) return `Not the right channel. ${ds.wrongRationale[choice]}`;
  return "Not the right channel. Re-read identifiers and harm if public, then try again.";
}
