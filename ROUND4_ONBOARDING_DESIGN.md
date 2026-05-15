# Round 4 — The Onboarding (story · mechanics · technical)

**Operation OMNI · The Data Heist · Mission 04 of 05**
**Playable build:** `round4.html`
**Companion docs:** `ROUND3.md` (audience routing), `ROUND4_PROCESS_FLOW_STORY.md` (original bridge), `ROUND4.md` (legacy aftershock treatment)

---

## 1. Where this mission sits in the arc

| Mission | Question the player answers |
|--------|-----------------------------|
| **Mission 03 — The Human Shield** | *Who is allowed to see which truth, and through which channel?* (public / official / vault) |
| **Mission 04 — The Onboarding** | *Where does each piece of evidence belong inside the company's real onboarding process — so the leak cannot be dismissed as a meaningless pile?* |

**Bridge line (briefing-ready):**

> *Mission 03 decided what could leave the building and toward which audience. Mission 04 plugs the same ten artifacts into MegaCorp's own **new-employee onboarding pipeline** — from offer letter to performance review. If the data fits cleanly into their published process, the dump is not "random." It is **operationally meaningful**.*

There is **no save state** between HTML files. Continuity comes from story copy, recurring crew voices (Voss / Nova / Zex), and the **same ten Mission 03 filenames** reappearing as the dataset deck.

---

## 2. Story premise

After Mission 03, MegaCorp's PR position is:

- The leak is **unauthorized**, **incomplete**, **decontextualized**.
- Therefore nothing in it should be allowed to support a coherent accusation.

The crew's operational reply in Mission 04: take the **same ten leaked artifacts** and prove they each have a **natural home** inside MegaCorp's real **new-employee onboarding process** — Legal offer review → IT identity → HR compliance → HR benefits → HR payroll → IT data access → IT security creds → IT systems → HR dependents → Ops performance setup.

If every artifact slots cleanly into the **step that genuinely consumes that data type**, the company's "this is just noise" defense collapses on first inspection.

### Why onboarding (and not "regulated disclosure case file")

The previous treatment used an abstract regulated-disclosure pipeline. Stakeholder feedback (and a re-read of the brief) pushed the design toward **a real, recognizable business process**:

- Players (and reviewers) recognize **employee onboarding** instantly — it's the cleanest, most universal cross-departmental flow inside any large company.
- It produces **all ten Mission 03 file types** as natural artifacts — session logs (identity verification), background checks, health screening, payroll, customer DB access, security credentials, architecture docs, family enrollment records, performance reviews, and legal contracts.
- The branching (HR benefits + HR payroll running in parallel after the background check, then converging at IT data access) gives the **flow diagram visual texture** without becoming a tangled BPMN soup.

---

## 3. Player fantasy

The player enters a **process-modeling terminal** showing MegaCorp's onboarding flow as a **horizontal flow diagram** with ten icon nodes connected by directional arrows. The job: drag each of ten leaked data artifacts onto the **one step** in the pipeline that actually consumes that data type.

- Click a step icon → its **purpose, expected inputs, outputs, and bottleneck** appear in a floating card on the left side of the canvas.
- Up to **four candidate datasets** for the selected step surface on the right rail (one correct, three plausible distractors).
- Drag the right dataset onto the step's drop zone → the node fades to "complete," the **outgoing arrow draws itself in green** with a GSAP tween, and the next step unlocks.
- Drop the wrong dataset → node shakes, Nova explains why in the operation channel, **confidence meter drops** and does not recover.

The whole map represents the **operational counter-narrative**: structure exists; the leak is not a random pile.

---

## 4. The ten-step onboarding pipeline

| # | Step | Department | Correct dataset | Why this artifact fits this step |
|---|------|------------|-----------------|----------------------------------|
| 1 | **Offer Letter Review** | Legal & Compliance | `Internal_Policy_Review.md` | Offer terms, NDA, IP assignment must be Legal-approved before HR can act. |
| 2 | **Identity Verification** | IT — Security | `Session_Traffic_Log.dat` | Portal session logs + 2FA confirm the candidate accepting the offer is real. |
| 3 | **Background Check** | HR — Compliance | `Personnel_Assessment_Export.xlsx` | Criminal / education / employment verification with a risk-tier output. |
| 4 | **Health Screening** | HR — Benefits | `Health_Screening_Results.dat` | Pre-employment medical for benefits enrollment + workplace safety. |
| 5 | **Payroll & Tax Setup** | HR — Payroll | `Compensation_Review_Report.csv` | Salary, W-4, I-9, direct deposit, equity grants. |
| 6 | **Data Access Setup** | IT — Data Governance | `User_Database_Backup.csv` | Role-based access matrix to customer DB and internal tools. |
| 7 | **Security Credentials** | IT — Security | `Security_Alert_Log.txt` | Badge issuance, MFA tokens, initial security audit trail. |
| 8 | **Systems Training** | IT — Architecture | `System_Architecture.json` | Architecture / data-flow docs handed to the new hire. |
| 9 | **Dependent Enrollment** | HR — Benefits | `Community_Program_Roster.csv` | Family members, dependents, school-linked benefits. |
| 10 | **Performance Setup** | Operations — Management | `Q4_Performance_Review.pdf` | 90-day OKRs, KPIs, baseline review schedule. |

**Branching:** step 3 (Background) fans out to **4 (Health)** and **5 (Payroll)** running in parallel; both must complete before **6 (Data Access)** unlocks. Steps 7–10 are linear.

**Phase bar (top of canvas):** the ten steps roll up to four player-facing phases — **Offer · Verification · Provisioning · Integration** — which light green as their constituent steps complete.

---

## 5. Mechanics (what the player actually does)

### 5.1 Loop

1. **Inspect** — Click a step icon. The floating "Step Details" card appears on the left side of the flow canvas with:
   - Title, department lane, full **purpose** description.
   - **Expects** (short hint) / **Inputs** / **Outputs**.
   - **Bottleneck** warning ("No signed offer → candidate not legally committed", etc.).
   - **Close (×)** button in the top-right of the card so the canvas can be cleared at any time.
2. **Read the cards** — Up to four candidate dataset cards appear on the right rail. Each card shows the **filename** plus a **comma-separated list of its table headers / field names** as a clue (e.g. `dependent_name, birth_date, relationship, enrollment_id` for the community program roster).
3. **Drag and drop** — Drag a card onto the selected step's drop zone.
4. **Resolution:**
   - **Correct** → node fades to a green "done" state, badge pops in, **GSAP draws the outgoing arrow left-to-right** in matrix green, and the next step (or both parallel steps for the branch) unlocks.
   - **Wrong** → node shakes, no commitment is made, **confidence drops** (10–14 points depending on the file), Nova posts a specific explanation in the operation channel, and a heavier-strain file (`schools`, `health`, `cust_dump`, `risk_full`) costs more confidence.
   - **Locked step** → drop is rejected outright, node shakes, Nova reminds the player previous steps must finish first.

### 5.2 Sequential gating (added by stakeholder request)

- Step `n` is **only droppable** once all its predecessor edges resolve.
- Locked nodes render with a lock icon, dimmed, and ignore drag-over highlight.
- Available (next-up) nodes show a soft cyan pulse so the player always knows where to look.
- This removes the "drop anywhere it might fit" guess-and-check antipattern and forces the player to engage with the flow's actual order of operations.

### 5.3 Confidence economy

- Starts at **100%** (header meter, same position as Mission 03).
- Wrong drop = `-10%` (most files) or `-14%` (high-impact files: schools, health, cust_dump, risk_full).
- Confidence **does not heal**. Accuracy is the only fix.
- Final confidence value feeds the debrief tier (clean / strained / poor).

### 5.4 Right-rail panels

- **Available Datasets** — up to four candidate cards per selected step, with field-name hints.
- **Operation Channel** — Voss / Nova / Zex chat. System line about MegaCorp's PR push lands at mission start; Nova narrates wrong drops and Zex pushes tempo.

The old standalone "Inspector" panel was removed because step details now live inside the flow canvas itself (left-anchored floating card).

---

## 6. Cast / channel voices (current)

| Voice | Role in Mission 04 |
|-------|---------------------|
| **Voss** | Mission lead — frames the onboarding map as the **published-process counter-narrative** to MegaCorp's "random dump" claim. |
| **Nova** | Ethics + confidence — explains every wrong drop with the structural reason ("session logs verify identity, not contract terms"). Her trust meter is the visible cost of sloppy mapping. |
| **Zex** | Momentum — pushes tempo, reminds the crew analysts will scroll past unless the map is airtight. |
| **SYSTEM** | Intercept line at mission start carrying MegaCorp's "unauthorized disclosures are incomplete and misleading…" PR posture, so the player feels the parallel narrative war. |

---

## 7. UI / UX (current build)

### 7.1 Layout (gameplay screen)

- **Header strip** — terminal label, mission slug ("MISSION 04 / THE ONBOARDING"), confidence meter, timer, LIVE indicator. Same furniture as Mission 03.
- **Sort banner + help line** — concise restating of the onboarding-mapping objective + the 1-2-3 of inspect / drag / lock.
- **Main row (flex):**
  - **Left** — `#flow-canvas-wrap`:
    - Distribution header ("OMNI — NEW EMPLOYEE ONBOARDING FLOW").
    - **Phase bar** (Offer · Verification · Provisioning · Integration) with chevron-cut tiles.
    - **`.fc-canvas`** — relative-positioned flow canvas with grid overlay, ambient corner gradients, and rounded border.
    - **`.fc-node` elements** absolute-positioned in `%` coordinates via `FLOW_NODE_POSITIONS`, centered using negative margins so transforms (hover lift, shake, GSAP scale pop) don't fight the layout.
    - **SVG `#fc-edges`** drawn behind the nodes with two arrow markers (`arrow-pending`, `arrow-done`).
    - **Floating step-detail card** (`#r4-step-pop`) anchored bottom-left of the canvas — hidden by default, shown on step click, dismissible with its own × button.
    - **Footer** — "Linked: n / 10" counter and the `FINALIZE PROCESS MAP` submit button.
  - **Right** — `#right-rail`:
    - **Available Datasets** panel — up to four candidate `.ds-card` items with filename + field-header description + "LEAK FILE" tag.
    - **Operation channel** — broker chat with the three crew voices.

### 7.2 Visual design (post-redesign)

- Flow canvas: dark linear gradient + radial color washes (cyan top-left, purple bottom-right, faint green centre) + 40px grid overlay at low opacity.
- Nodes: 82×82 rounded "tile" boxes with glassy gradient, subtle inner highlight, soft drop shadow. Icons (Font Awesome) at 30px with text-shadow for depth.
- Available (next-up) nodes: 2.5s cyan box-shadow pulse.
- Selected node: 2px amber border with a soft amber halo pulse.
- Completed node: green-tint background + green border + checkmark badge bottom-right.
- Locked node: opacity .4, lock icon top-right, no hover lift.
- Edges (arrows): thinner stroke (2 px pending / 2.5 px done), small 7-px chevron arrowheads, completed edges glow matrix-green and pulse gently.
- **Completion animation:** when a step is solved, the outgoing edge animates with GSAP — `strokeDasharray` set to path length, `strokeDashoffset` tweened from full length to 0 over 0.9 s with `power2.inOut`, arrowhead reattached on complete. After draw, the edge picks up the steady pulse. Each edge is tracked in a `FC_ANIMATED_EDGES` Set so re-renders don't replay the animation.
- Node "pop" on correct drop: GSAP `fromTo` on `.fc-node-box`, scale 1 → 1.18 with `back.out(2)` ease, yoyo once.

### 7.3 Intro / walkthrough

Three intro pages before the game opens:

1. **Page 0 — Intelligence brief.** Frames MegaCorp's "random dump" PR line and the crew's counter: map the leak to MegaCorp's own onboarding pipeline.
2. **Page 1 — Crew voices.** Voss (defensibility), Nova (confidence economy), Zex (tempo).
3. **Page 2 — Mission Protocol + live walkthrough.**
   - Three numbered step-cards: **Inspect the Step**, **Drag to the Open Step**, **Confidence**.
   - **GSAP walkthrough demo** (`startR4ProtocolDemo`) — a non-scoring autoplay: a cursor visits chips for `Session_Traffic_Log.dat`, demonstrates a **wrong drop** on "Offer" (confidence dips to 86%), corrects to **"Identity"**, then jumps to a second file `System_Architecture.json` and lands it on **"Systems"**. Updated hint copy explains the order-locked behavior and the green arrow drawing to the next stage.
   - Pauses on page transition (`stopR4ProtocolDemo`).

### 7.4 Hack overlay + debrief

- **Hack overlay** (mission-open hacker-style intro): `ONBOARD_FLOW.enc` payload, "PLACE EACH DATASET AT THE CORRECT ONBOARDING STEP," "10 ARTIFACTS · 10 STEPS · 4 PHASES."
- **Debrief overlay**: tier (clean / strained / poor) derived from confidence and wrong-attempt count, plus a "real-world translation" paragraph framing why mapping data to a real process matters operationally.

---

## 8. Technical structure (file map)

Everything lives in **`round4.html`** as a self-contained build. Key globals:

| Constant / function | Purpose |
|---------------------|---------|
| `STEPS` | Array of 10 step objects (`id`, `lane`, `title`, `purpose`, `inputs`, `outputs`, `bottleneck`, `okFile`). |
| `FILES` | Array of 10 datasets (`id`, `name`, `desc` for the field-header hint). |
| `STEP_DATA_HINT` | Short one-line "what this step expects" hint shown in the floating card. |
| `STEP_FLOW_ICONS` | Font Awesome icon class per step id. |
| `FLOW_NODE_POSITIONS` | `{x, y}` percentages controlling the on-canvas node layout. |
| `FLOW_EDGES` | `[fromIdx, toIdx]` pairs defining the directional connections (including the branch at step 2 and merge at step 5). |
| `WRONG_STEP_OVERRIDES` | File-specific Nova lines for the most informative wrong-step mistakes. |
| `DATASET_CANDIDATE_CAP` | 4 — limits how many cards surface for any selected step. |
| `getDatasetCandidatesForStep` | Builds the four-card candidate set (correct answer + three distractors from the remaining pool). |
| `renderFlowNodes` | Renders the ten flow nodes (with available / locked / selected / done state classes) and the underlying SVG. |
| `layoutFlowDiagramEdges` | Sizes the SVG, builds arrow markers, draws each edge path, queues GSAP draw-on animation for newly-completed edges. |
| `animateEdgeDraw` | The GSAP stroke-dashoffset tween. Fallback CSS transition if GSAP is missing. |
| `isStepAvailable` / `isStepSatisfied` | Sequential gating logic. |
| `assignToStep` | The drop handler: blocks locked steps, applies wrong-placement penalties, locks correct placements, and triggers the celebration pop. |
| `updateStepPop` | Renders the floating step-detail card (with the × close button). |
| `closeStepPop` | Manually hides the floating card. |
| `updatePhaseBar` | Lights phase chevrons green as their step ranges complete. |
| `startR4ProtocolDemo` / `stopR4ProtocolDemo` | GSAP timeline driving the live walkthrough on intro page 2. |
| `FC_ANIMATED_EDGES` | `Set<string>` tracking which edges have already played their draw-on animation in this session. Cleared on `beginMission`. |

External libraries: **GSAP 3.12.5** (CDN), **Font Awesome 6.5.1** (CDN), Google Fonts (Space Grotesk, DM Sans, Share Tech Mono).

---

## 9. Learning alignment

By the end of Mission 04 players should be able to:

1. **Recognize a real cross-department process** (onboarding) and identify the data each step consumes.
2. Distinguish between **plausible distractors** and the **one artifact that actually feeds a step** — using table headers / fields as the signal rather than the filename alone.
3. Respect **process ordering**: locked steps are not "optional later" but actual prerequisites, mirroring real-world handoff dependencies.
4. See how **misplacing data costs trust** in a way that does not heal — the same posture they internalized in Mission 03's audience routing.
5. Carry forward the operational narrative: *the leak is structured because the company's process is structured; randomness is MegaCorp's story, not the evidence's reality.*

---

## 10. Open items / phase-two candidates

- **Save-state bridge** between Mission 03 and Mission 04 (currently story-only continuity).
- **Branching difficulty** — randomize whether Health or Payroll resolves first inside the parallel branch for replay variety.
- **Optional "redundancy" flags** — second-pass mode where some files would *also* plausibly feed a wrong-but-related step, training players to spot misleading clutter rather than just missing data.
- **Accessibility pass** — keyboard-only drag-and-drop fallback, prefers-reduced-motion gate on the GSAP draw-on (probably collapse to instant fade-in).
- **Mobile pass** — current build keeps the canvas scrollable horizontally below 1024 px; small-screen layout could benefit from a vertical stack.

---

*Document version: aligns Mission 04's current onboarding implementation (`round4.html`) with the design intent established in `ROUND4_PROCESS_FLOW_STORY.md` and the audience-routing setup from `ROUND3.md`.*
