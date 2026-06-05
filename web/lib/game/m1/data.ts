import type { FolderFile, LeadDef, LeadId } from "@/lib/game/m1/types";

export const LEAD_ORDER: LeadId[] = ["compute", "funding", "personnel", "payload"];

export const DETECTION = {
  passivePerSec: 100 / 1500,
  decoy: 6,
  decoyClick: 3,
  wrongClick: 8,
  verifyFail: 10,
  hint: 8,
  hintCooldownMs: 30000,
};

export type HackLine = { text: string; className?: string };

export const HACK_LINES: HackLine[] = [
  { text: "GHOST TERMINAL v3.1 — SECURE SHELL", className: "ht-g" },
  { text: "Tunnel: 192.168.44.71 [megacorp-internal] · MAC spoof: done", className: "ht-a" },
  { text: "Credentials: sysadmin@megacorp.internal · 2FA bypass: OK", className: "ht-g" },
  { text: "Desktop stream: MIRRORING LIVE — read-only", className: "ht-g" },
  { text: "⚠  Any keystroke triggers host alert. Observe only.", className: "ht-o" },
  { text: "Breach window: 30 minutes", className: "ht-r" },
];

export const STICKIES = [
  { id: "sty0", className: "sticky-yellow", top: 22, right: 14, header: "THIS WEEK", body: "SFO flight Fri 6am\nJenkins call Wed\nSub-Acct 7 → do NOT escalate\nDentist Thurs" },
  { id: "sty1", className: "sticky-pink", top: 220, right: 14, body: "CFO verbal 09/14\n$47.2M — keep off tracker\ndo not log" },
  { id: "sty2", className: "sticky-blue", top: 378, right: 14, body: "voicemail — Stanton 09/28\n847TB out. Endpoint masked.\nLab 7B standing down.\nDelete this note." },
];

export const LEAD_FA_ICONS: Record<LeadId, string> = {
  compute: "fa-microchip",
  funding: "fa-sack-dollar",
  personnel: "fa-users",
  payload: "fa-file-arrow-up",
};

export const CHANNEL_ROSTER = [
  { name: "Voss", online: true },
  { name: "Zex", online: true },
  { name: "Atlas", online: false },
  { name: "Nova", online: false },
  { name: "Kade", online: false },
] as const;

export const DEBRIEF = {
  eyebrow: "// Mission 1 — Footprint Confirmed",
  title: "OMNI Footprint Confirmed · Debrief",
  tradecraft: [
    "Clean work. You moved through four systems while the sweep was running and you didn't blink. That doesn't happen by accident.",
    "What you just built is the Footprint Dossier. The evidence chain Zex needed to commit. Compute, funding, personnel, payload, bound into one indictment. That's the artifact. That goes forward.",
    "The thing you actually did is Data Analysis. It's not a trick. It's three skills. You demonstrated all three.",
  ],
  pillars: [
    { tag: "— skill one", title: "Read the surface.", text: "Dashboards are designed to look ordinary. The compute graph read routine until you noticed where it wasn't." },
    { tag: "— skill two", title: "Pick the signal that means something.", text: "Any system this size has a thousand anomalies. Most are noise. You locked the ones that did." },
    { tag: "— skill three", title: "Tie one thread to another.", text: "One anomaly is a question. Four pointing at the same dead zone is an answer. The connection is the case." },
  ],
  cta: "CONTINUE TO MISSION 2 — FORGING THE MASTER KEY →",
};

export const BOARD_PPT = {
  workforce: {
    title: "Workforce Summary",
    divisions: [
      { name: "Operations", headcount: 420 },
      { name: "Finance", headcount: 180 },
      { name: "Sales & Marketing", headcount: 310 },
      { name: "Engineering", headcount: 890 },
      { name: "Legal", headcount: 95 },
    ],
  },
  revenue: {
    title: "Revenue by Business Unit",
    segments: [
      { label: "Enterprise", pct: 34 },
      { label: "SMB", pct: 28 },
      { label: "Classified Stakeholders", pct: 18 },
      { label: "Government", pct: 12 },
      { label: "Other", pct: 8 },
    ],
  },
};

export const HR_AUTH_ROWS = [
  { division: "Engineering Classified", hours: 2940, authorisedBy: "R. Marshall", date: "09/14/2003" },
  { division: "Product Dev", hours: 670, authorisedBy: "M. Chen", date: "09/08/2003" },
  { division: "IT Operations", hours: 340, authorisedBy: "J. Peterson", date: "09/11/2003" },
];

export const HEADCOUNT_METRICS = [
  { division: "Engineering Classified", staff: 128, avgOt: 23 },
  { division: "Engineering (Std)", staff: 520, avgOt: 4 },
  { division: "Product Dev", staff: 210, avgOt: 8 },
];

export const VAULT_AUDIT_ROWS = [
  { department: "Operations", accesses: 12 },
  { department: "Finance", accesses: 23 },
  { department: "Engineering", accesses: 47 },
  { department: "HR", accesses: 8 },
  { department: "Executive", accesses: 31 },
];

export const INTRO_CHAT = [
  { delay: 2800, sender: "Voss" as const, text: "You have four leads on the board. Start with COMPUTE — that's where the infrastructure trail begins.", tone: "bm-d" as const },
  { delay: 5800, sender: "Voss" as const, text: "Zex won't commit without a confirmed footprint. Everything we find goes on the board.", tone: "bm-d" as const },
  { delay: 8100, sender: "Zex" as const, text: "I'll be on the channel. Not committing to anything until I see real evidence.", tone: "bm-d" as const },
];

export const SERVER_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const SERVER_LOAD = [28, 31, 44, 26, 29, 72, 35, 33, 118, 81, 38, 27];
export const SERVER_ANOMALY_INDEX = 8;

export const BUDGET_ROWS = [
  { centre: "Operations", owner: "Ops Division", amount: "$4.2M", pct: "22%", anomaly: false },
  { centre: "IT Infrastructure", owner: "IT Division", amount: "$2.8M", pct: "15%", anomaly: false },
  { centre: "R&D — Unallocated", owner: "[NO OWNER]", amount: "$7.1M", pct: "37%", anomaly: true },
  { centre: "Marketing", owner: "Mktg Division", amount: "$2.6M", pct: "14%", anomaly: false },
  { centre: "Legal & Compliance", owner: "Legal Dept.", amount: "$2.1M", pct: "11%", anomaly: false },
];

export const PERSONNEL_DIVISIONS = [
  { label: "Sales & Mktg", hours: 95, anomaly: false },
  { label: "Eng Project Alpha", hours: 1850, anomaly: false },
  { label: "Engineering Classified", hours: 2940, anomaly: true },
  { label: "Finance", hours: 62, anomaly: false },
  { label: "IT Operations", hours: 340, anomaly: false },
  { label: "Operations", hours: 185, anomaly: false },
  { label: "Legal", hours: 47, anomaly: false },
  { label: "Product Dev", hours: 670, anomaly: false },
  { label: "R&D (Std)", hours: 290, anomaly: false },
  { label: "Engineering (Std)", hours: 520, anomaly: false },
];

export const HEATMAP_FILES = [
  "ops_report_Q3.pdf",
  "contractor_roster.csv",
  "budget_summary.xls",
  "hr_headcount.doc",
  "board_minutes_Q3.pdf",
  "network_diagrams.zip",
  "system_backup_Q3.tar",
  "it_policy_2003.doc",
  "legal_contracts_Q3.pdf",
  "marketing_assets.zip",
  "CLASSIFIED_INITIATIVE.enc",
  "compliance_audit_Q3.doc",
];

export const HEATMAP_OMNI_ROW = 10;
export const HEATMAP_WEEK13 = 12;

export const HEATMAP_DATA: number[][] = [
  [4, 3, 5, 4, 6, 3, 4, 5, 3, 4, 2, 3, 4],
  [2, 1, 3, 2, 2, 1, 2, 3, 1, 2, 1, 2, 1],
  [8, 9, 7, 10, 8, 11, 9, 8, 10, 7, 6, 5, 4],
  [3, 2, 4, 3, 3, 2, 3, 4, 2, 3, 2, 1, 2],
  [1, 0, 1, 2, 1, 0, 1, 1, 0, 1, 2, 1, 0],
  [6, 5, 7, 6, 8, 6, 7, 5, 6, 7, 5, 6, 5],
  [12, 14, 11, 13, 12, 15, 13, 12, 14, 11, 13, 12, 14],
  [1, 2, 1, 1, 2, 1, 0, 1, 2, 1, 1, 0, 1],
  [5, 4, 6, 5, 7, 5, 6, 4, 5, 6, 4, 5, 4],
  [9, 11, 8, 10, 12, 10, 9, 11, 8, 7, 6, 5, 4],
  [16, 18, 15, 17, 19, 18, 16, 17, 18, 15, 4, 1, 0],
  [3, 4, 3, 5, 3, 4, 3, 4, 3, 5, 3, 4, 3],
];

export const LEADS: Record<LeadId, LeadDef> = {
  compute: {
    id: "compute",
    label: "COMPUTE",
    icon: "⚡",
    folderKey: "it",
    evidenceFile: "server_report.xls",
    iconId: "di-it",
    seek: "Look for unusual load patterns that don't match the normal baseline.",
    clue: "Something this scale doesn't run on air. OMNI needed serious compute resources. Open the IT Systems folder.",
    folderMsg: "That folder contains system diagnostics. Look for unusual load patterns.",
    lockMsg: "September hit nearly 3× the yearly average. Logged.",
    hint: "IT Systems → server_report.xls → Server Load tab. One month stands above the rest.",
    anomalyTitle: "ANOMALY CONFIRMED",
    anomalyText:
      "September hit 118% — dwarfing every other month. Tooltip: Ticket: Archived — DO NOT REOPEN",
    params: [
      {
        label: "WHICH MONTH HAD THE SPIKE?",
        opts: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        ans: 8,
        err: "One month stands way above the rest on the chart",
      },
      {
        label: "WHAT WAS THE LOAD PERCENTAGE?",
        opts: ["24%", "44%", "72%", "81%", "100%", "118%", "142%", "200%", "400%"],
        ans: 5,
        err: "Check the Y-axis value for the September bar",
      },
      {
        label: "WHAT DOES THE TICKET SAY?",
        opts: ['"Normal load"', '"Ticket: Archived — DO NOT REOPEN"', '"Scheduled maintenance"', '"Flagged for review"'],
        ans: 1,
        err: "Hover the September bar for the ticket text",
      },
    ],
  },
  funding: {
    id: "funding",
    label: "FUNDING",
    icon: "◈",
    folderKey: "finance",
    evidenceFile: "budget_Q3.xls",
    iconId: "di-finance",
    seek: "Look for budget lines with no owner and amounts that don't add up.",
    clue: "An operation like OMNI has to be funded. Open the Finance folder.",
    folderMsg: "Quarterly reports and budget breakdowns. Look for unallocated funding.",
    lockMsg: "$7.1 million with no owner. Logged.",
    zexAnomaly: "Hidden budget lines are how you fund things that don't officially exist.",
    hint: "Finance → budget_Q3.xls → Budget Allocation. One line has no owner.",
    anomalyTitle: "ANOMALY CONFIRMED",
    anomalyText: "$7.1M sits under R&D — Unallocated with no department owner.",
    params: [
      {
        label: "WHICH COST CENTRE HAS NO OWNER?",
        opts: ["Operations", "IT Infrastructure", "R&D — Unallocated", "Marketing", "Legal & Compliance"],
        ans: 2,
        err: "Hover each bar — one has no owner",
      },
      {
        label: "WHAT IS THE ALLOCATED AMOUNT?",
        opts: ["$2.8M", "$4.2M", "$6.4M", "$7.1M", "$8.3M"],
        ans: 3,
        err: "Find the bar with no owner",
      },
      {
        label: "HIGHEST HEADCOUNT DIVISION (BOARD REPORT)?",
        opts: ["Operations", "Finance", "Sales & Marketing", "Engineering", "Legal"],
        ans: 3,
        err: "Check board_report_Q3.ppt Workforce Summary",
        crossRef: true,
      },
      {
        label: "% Q3 REVENUE FROM CLASSIFIED STAKEHOLDERS?",
        opts: ["12%", "18%", "28%", "42%", "51%"],
        ans: 1,
        err: "Check Revenue by Business Unit on the board report",
        crossRef: true,
      },
    ],
  },
  personnel: {
    id: "personnel",
    label: "PERSONNEL",
    icon: "◉",
    folderKey: "hr",
    evidenceFile: "overtime_Sep.doc",
    iconId: "di-hr",
    seek: "Look for redacted project codes and overtime hours that don't belong to any official project.",
    clue: "Someone was putting serious hours into a project that wasn't meant to exist. HR records.",
    folderMsg: "Staffing records and workforce reports. Look for abnormal overtime.",
    lockMsg: "2,940 hours on a project that officially doesn't exist. Logged.",
    hint: "HR → overtime_Sep.doc → September Breakdown. One division is on a different scale.",
    anomalyTitle: "ANOMALY CONFIRMED",
    anomalyText: "Engineering Classified logged 2,940h on a redacted project code.",
    params: [
      {
        label: "HOW MANY OVERTIME HOURS WERE LOGGED?",
        opts: ["185h", "340h", "520h", "670h", "2,940h"],
        ans: 4,
        err: "Find the redacted project code dot",
      },
      {
        label: "WHICH DIVISION LOGGED THESE HOURS?",
        opts: ["Sales & Marketing", "Engineering (Std)", "Product Development", "Engineering Classified", "Operations"],
        ans: 3,
        err: "Hover each dot for the project code",
      },
      {
        label: "AVG OT PER EMPLOYEE IN ENG. CLASSIFIED?",
        opts: ["8h", "13h", "18h", "23h", "47h"],
        ans: 3,
        err: "Open staffing_metrics_Sep.xls",
        crossRef: true,
      },
      {
        label: "WHO AUTHORISED THE CLASSIFIED OVERTIME?",
        opts: ["M. Chen", "J. Peterson", "L. Torres", "R. Simmons", "R. Marshall"],
        ans: 4,
        err: "Check auth_log_Sep.doc in HR",
        crossRef: true,
      },
    ],
  },
  payload: {
    id: "payload",
    label: "PAYLOAD",
    icon: "⬡",
    folderKey: "vault",
    evidenceFile: "access_heatmap.xls",
    iconId: "di-vault",
    seek: "Look for files with heavy access that suddenly drop to zero.",
    clue: "DataVault logs every access. Find the file that went dark.",
    folderMsg: "Weekly access patterns — find heavy use that stops cold.",
    lockMsg: "Heavy access for ten weeks, then a hard cutoff. Logged.",
    zexAnomaly: "Whoever killed that access knew exactly what they were doing.",
    hint: "DataVault → access_heatmap.xls. Find heavy use that cuts to zero.",
    anomalyTitle: "PATTERN ANOMALY CONFIRMED",
    anomalyText: "CLASSIFIED_INITIATIVE.enc was accessed heavily then killed in Week 13.",
    params: [
      {
        label: "WHICH FILE DROPPED TO ZERO?",
        opts: ["ops_report_Q3.pdf", "contractor_roster.csv", "budget_summary.xls", "CLASSIFIED_INITIATIVE.enc", "system_backup_Q3.tar"],
        ans: 3,
        err: "Find the file that was hot then went dark",
      },
      {
        label: "IN WHICH WEEK DID ACCESS DROP?",
        opts: ["Week 9", "Week 10", "Week 11", "Week 12", "Week 13"],
        ans: 4,
        err: "Look at the last weeks on the heatmap row",
      },
      {
        label: "WHICH DEPARTMENT LOGGED MOST ACCESSES?",
        opts: ["Operations", "Finance", "Engineering", "HR", "Executive"],
        ans: 2,
        err: "Check access_audit_Q3.xls",
        crossRef: true,
      },
      {
        label: "HOW MANY ACCESSES DID THAT DEPARTMENT LOG?",
        opts: ["12", "23", "31", "47", "64"],
        ans: 3,
        err: "Read the department column in the audit file",
        crossRef: true,
      },
    ],
  },
};

export const FOLDERS: Record<string, FolderFile[]> = {
  it: [
    { name: "metrics_Q3.xls", kind: "redherring" },
    { name: "backup_archive.tar", kind: "unopenable", message: "That archive is useless. Detection's up." },
    { name: "personal_notes.txt", kind: "decoy", message: "Personal notes — not relevant." },
    { name: "server_report.xls", kind: "evidence", openTarget: "win-server" },
  ],
  finance: [
    { name: "budget_Q3.xls", kind: "evidence", openTarget: "win-budget" },
    { name: "expenditure_q3.xls", kind: "redherring" },
    { name: "board_report_Q3.ppt", kind: "crossref", openTarget: "win-board" },
    { name: "travel.csv", kind: "unopenable", message: "Travel claims. Stay on budget files." },
  ],
  hr: [
    { name: "absence_log_Q3.xls", kind: "redherring" },
    { name: "reviews_Q2.doc", kind: "unopenable", message: "Q2 reviews — nothing relevant." },
    { name: "auth_log_Sep.doc", kind: "crossref", openTarget: "win-hr-auth" },
    { name: "staffing_metrics_Sep.xls", kind: "crossref", openTarget: "win-headcount" },
    { name: "overtime_Sep.doc", kind: "evidence", openTarget: "win-personnel" },
  ],
  vault: [
    { name: "user_activity_Q3.xls", kind: "redherring" },
    { name: "ops_report_Q3.pdf", kind: "unopenable", message: "Ops summary — not the pattern." },
    { name: "access_audit_Q3.xls", kind: "crossref", openTarget: "win-vault-audit" },
    { name: "access_heatmap.xls", kind: "evidence", openTarget: "win-vault-heatmap" },
  ],
  misc: [
    { name: "golf_scores.xls", kind: "decoy", message: "Dead end." },
    { name: "photo.jpg", kind: "decoy", message: "Wrong file." },
    { name: "books.txt", kind: "decoy", message: "Nothing relevant." },
  ],
};

export const DESKTOP_ICONS = [
  { id: "di-it", label: "IT_Systems", top: 22, left: 14, folder: "it" },
  { id: "di-finance", label: "Finance", top: 106, left: 14, folder: "finance" },
  { id: "di-hr", label: "HR_Records", top: 190, left: 14, folder: "hr" },
  { id: "di-vault", label: "DataVault", top: 274, left: 14, folder: "vault" },
  { id: "di-misc", label: "Misc", top: 358, left: 14, folder: "misc" },
];
