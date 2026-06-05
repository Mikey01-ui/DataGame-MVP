export type M4TutorialStep = {
  selector: string | null;
  pad: number;
  phase: "tour" | "demo";
  title: string;
  html: string;
  demo?: boolean;
};

export const M4_TUTORIAL_STEPS: M4TutorialStep[] = [
  {
    selector: "#flow-row",
    pad: 8,
    phase: "tour",
    title: "Eight-gate flow",
    html:
      "<p>Tap a <strong>gate icon</strong> on the spine to open expectations for that handoff. Clicking highlights the gate (gold ring) and loads candidates in the rail.</p>",
  },
  {
    selector: ".datasets-panel",
    pad: 8,
    phase: "tour",
    title: "Purple = ready to drop (while dragging)",
    html:
      "<p>Pick the file whose headers match <strong>Expects</strong>, then <strong>drag</strong> it toward the matching gate on the flow.</p>" +
      "<p>While your file is over that icon, the gate turns <strong>purple</strong> with a dashed ring — that is the drop zone. <strong>Release only when you see purple.</strong></p>",
  },
  {
    selector: ".flow-canvas-footer",
    pad: 8,
    phase: "tour",
    title: "Links & finalize",
    html:
      "<p>Track <strong>Linked · 8 / 8</strong> here. When everything's green, press <strong>FINALIZE PROCESS MAP</strong> to lock the map.</p>",
  },
  {
    selector: null,
    pad: 0,
    phase: "demo",
    demo: true,
    title: "Watch it once",
    html:
      "<p>Watch: click gate → read brief → <strong>×</strong> → pick file → drag over the gate until it turns <strong>purple</strong>, then release.</p>" +
      "<p><strong>Skip demo</strong> jumps ahead; <strong>Start mission</strong> opens Mission 4 gameplay.</p>",
  },
];

export const M4_TUT_DEMO_LINKS = [
  { stepId: "offer-review", fileId: "memo_847" },
  { stepId: "identity-verify", fileId: "web_logs" },
] as const;
