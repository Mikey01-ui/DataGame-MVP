# Round 4 — The Aftershock (story & design)

**Operation OMNI · The Data Heist · Mission 04 of 05**

**Skill focus:** **Dependencies, sequencing, and operational strain** — taught as *order matters*, *locked moves until prerequisites land*, and *how hard you can push before the mirror drops*.

**Playable build:** `round4.html` (Mastermind terminal + four crisis beats + ops strain + debrief).  
**Companion doc:** `ROUND3.md` (distribution / Human Shield).

---

## Is this approach okay? (UI + GSAP demo)

**Yes.** Round 3 works because the **Mission Protocol** screen does not only *describe* routing — it **animates** a miniature version (cursor, file pick, channel buttons, step hints) so players **see the loop once** before real stakes. The same pattern fits Round 4:

- **Easier UI** = fewer unexplained affordances: label **why** buttons are grey, keep **one primary column** for “what’s happening now,” and mirror **strain** in both header and side card (already in the HTML).
- **GSAP demo** = a **non-scoring** replay that shows: *stabilize → unlock secure line → counsel handoff → close*, with **one** wrong-order example (e.g. press first → clean close greyed out) so **dependencies** land emotionally before beat 1.

This does not dumb the mission down; it **front-loads comprehension** so the story beats read as *choices*, not *interface puzzles*.

---

## 1. Where this sits in the arc

| Mission | Question the player answers |
|--------|-----------------------------|
| **Round 3 — The Human Shield** | *What may leave the building, and to **which audience**?* (public / official / vault) |
| **Round 4 — The Aftershock** | *What do we do **first** when the release is live, everyone is shouting, and a real person is scared?* |

**Bridge line (briefing):**  
*Round 3 drew the line on what could go out. Round 4 is the first morning after — when that line meets headlines, corporate pushback, and people who think they are next.*

There is **no save-state** between HTML files; continuity is **story copy** and player memory.

---

## 2. Story premise (detailed)

### 2.1 Situation at mission open

- The **disclosure package** the player helped shape in Mission 03 is **in the world** (in fiction: Proof Wall material, filings, and/or vault boundaries already decided).
- **MegaCorp** is running a **controlled narrative**: leaks are *incomplete*, *misleading*, possibly *untrustworthy*.
- **Press and feeds are loud.** Attention is scarce and volatile.
- The crew’s **mirror** into Marshall’s desktop **still works but stutters** — bandwidth and trust in the pipe are **finite**. Every dramatic or sloppy move adds **operational strain**.

### 2.2 The dramatic question

Not *which file goes where* (that was Round 3), but:

> **In what order do we act so we stabilize the op, protect a frightened contact, hand off real help, and close without turning people into content?**

### 2.3 Ethical through-line from Round 3

Round 3: **minimum necessary disclosure** and **who is entitled to see what**.  
Round 4: **minimum necessary *attention*** — *who you name*, *when you escalate*, *whether you fuel the story at a civilian’s expense*. Nova’s voice remains the moral floor; Zex pressures speed; Voss holds tempo and closure.

---

## 3. Cast / channel voices

| Voice | Role in Mission 04 |
|-------|---------------------|
| **Voss** | Mission lead: **sequencing**, discipline, **close** statements. Ends runs that spin out. |
| **Nova** | Ethics: **no performative rescue**, **no hanging targets** on the public wall for feels. |
| **Zex** | Momentum: **clock**, narrative advantage vs MegaCorp — pushes early action. |
| **Kade** | Occasional **accountability** beat (timelines, what regulators notice) — light touch. |
| **SYSTEM** | **Intercept** of MegaCorp comms — reminds the player the adversary is **shaping the story in parallel**. |

### 3.1 Key fictional contact

**Kelso (EMP-2847)** — employee already inside the horror of post-leak reality: HR wants a “voluntary chat” tomorrow. They **DM the operation channel** because it’s the only place they trust. Kelso is the **human face** of “release has consequences.”

---

## 4. Antagonist / pressure (MegaCorp)

Diegetic hook for strain and time tone:

- Corporate line: **unauthorized disclosures** are **incomplete and misleading** (and implied: forgeable, cherry-picked).
- That text appears as a **terminal intercept** at mission start so players **feel** the PR war while making ops choices.

This mission **does not** resolve the forgery debate forensically — it keeps focus on **ops and care under narrative attack**.

---

## 5. Canonical story beats (four beats, one choice each)

These are the **story scenes** implemented in `round4.html`. Flags below are **design names** for writers and engineers.

### Beat 1 — Headlines / opening posture

**Scene:** The feed is on fire. The mirror is flaky. The crew needs a **first move**.

| Choice (story) | Effect |
|----------------|--------|
| **Stabilize mirror & listening post** | Low strain. Establishes **capacity to hear** before acting. Sets flag: stable mirror path. |
| **Push more to the press immediately** | Short-term narrative spike; **raises strain**; makes Kelso’s world **louder**. Blocks the **cleanest** finale later. |
| **Go dark** | Reads as hesitation to outsiders; moderate strain; different failure mode than press juicing. |

**Story purpose:** Teach that **first move** constrains **last move**.

---

### Beat 2 — Kelso on the line

**Scene:** Kelso pings: scared, HR tomorrow, **secure channel** only feels real if the op is stable.

| Choice (story) | Effect |
|----------------|--------|
| **Secure line — short, calm instructions** | Requires stable mirror. Sets **calmed contact**; Nova affirms “no theatre on the wall.” |
| **Public reassurance naming their situation** | **Spotlight harm**; Nova shuts it down in-channel; high strain; **risk flag** for debrief tone. |
| **Leave on read** | Abandonment with a timer; strain; no calm handoff path. |

**Story purpose:** **Dependency** — infrastructure and care before spectacle.

---

### Beat 3 — Counsel handoff

**Scene:** Vetted counsel exists through a **cut-out**. Panic + screenshots = bad handoff unless the person is **ready**.

| Choice (story) | Effect |
|----------------|--------|
| **Vetted contact via secure path** | Requires calmed Kelso. **Clean handoff**; Kade may note timeline hygiene. |
| **Emergency referral** | Only makes sense when Kelso was **not** calmed — **burns** backup credibility; higher strain. |
| **Pull more docs first** | Data hunger vs **human clock**; delays relief; raises strain. |

**Story purpose:** **Handoffs** only work when upstream emotional state matches.

---

### Beat 4 — Finale / close

**Scene:** MegaCorp tightens the story. Mirror window **shortens**. One structured close.

| Choice (story) | Effect |
|----------------|--------|
| **Clean close** | Minimal factual line + confirm counsel path — only if **calm + handoff** and **no early-press** path from beat 1. Lowest strain option here. |
| **Rough close** | Always available; honest operational cost; Voss acknowledges **debt to Kelso** next time. |
| **Counter-press harder** | Wins headline oxygen; **high strain**; Nova charges **human cost**. |

**Story purpose:** **Optimization** isn’t martyr heroics — it’s **order + restraint** when the story tempts escalation.

---

## 6. Operational strain (diegetic meaning)

- **Not** a second “Nova trust meter” — it’s **ops/bandwidth**: mirror, channel noise, crew focus.
- **Low:** mirror stable, room to sequence.  
- **High:** connection fragile; at **100%** the **mirror drops** — mission fails into debrief (Voss: re-sequence when there’s bandwidth).

Strain **visual language** in UI: green → amber → red fills; copy under the bar escalates (*mirror stable* → *channel tight* → *hot* → *connection fragile*).

---

## 7. Endings (debrief tiers — story read)

| Tier | Meaning (fiction) |
|------|-------------------|
| **CLEAN SEQUENCE** | Calm contact, no spotlight harm, clean handoff, minimal close, strain stayed controlled. |
| **SOLID** | Complete without mirror loss; mixed choices. |
| **ROUGH** | High strain, spotlight risk, or aggressive counter-press — **complete** but costly. |
| **MIRROR LOST / STRAINED** | Ops **broke under load** — sequence collapsed; teachable fail. |

Debrief should **name the skill**: Round 3 = **who sees what**; Round 4 = **what happens first**, **what stays locked until then**, real-world **pipelines and handoffs**.

---

## 8. Player-facing protocol copy (reference)

Align with `round4.html` intro page 2:

1. **Order matters** — some moves stay inactive until prerequisites complete.  
2. **Ops strain** — rough or noisy choices **load** the op; hero clicks cost bandwidth.  
3. **One beat at a time** — one action per beat; advance when stable enough, not when every problem is solved.

---

## 9. Onboarding: easier UI + GSAP demo (build checklist)

Use **Mission Protocol** (`page2` before breach) for:

1. **Static** three cards (above).  
2. **Live demo panel** (like Round 3’s `#demo-panel`):  
   - Mini **crisis strip** + **three grey/locked buttons** → animate **prerequisite** completing → **unlock** one button.  
   - Optional **wrong branch**: press-first glow → finale “clean close” stays **locked** with on-screen **why**.  
3. **Step hint** (`aria-live`) updating each demo phase: *“Watch: stabilize unlocks secure reply.”*  
4. GSAP: stagger fades, cursor or highlight ring, `demo-step-hint` text swaps — **match Round 3 timing feel** (not faster than learners can read).

**UI clarity rules for main terminal:**

- One **beat title** + short body; **lock note** line when anything is disabled.  
- Action buttons: **title + subtitle**; show **Requires: …** in hint line where relevant.  
- Strain in **two places** (header + side) so it’s never missed.

---

## 10. How this maps to *Functional Gameplay & Learning Design*

**Mission 4: The Aftershock** develops **operational thinking**. Gameplay makes **dependencies** visible (locked actions, copy explaining *why*). **Bottlenecks** appear as **one meaningful choice per beat** and a **single strain budget** for the mirror. **Sequencing** is tested when the **same mission** yields **clean vs rough** outcomes based on **order**. **Optimization** appears as **lower strain** and **clean close** without trading human cost for headlines — debrief ties to **pipelines**, **blocked-until-upstream**, and **team handoffs**.

---

## 11. Hub (`index.html`)

**Title:** The Aftershock  
**Blurb (short):** After Mission 03: **sequence** crisis moves, watch **ops strain**, help Kelso without burning the mirror.

---

## 12. Open build choices (for later)

- Expand **GSAP demo** in `round4.html` to parity with `round3wip.html` demo depth.  
- Voice Bible pass on Voss / Nova / Zex lines.  
- Optional **future** design: **evidence structuring** mission (counter “random/forged”) as alternate or Mission 05 beat — orthogonal to this **sequencing** design; see team roadmap.

---

*Last updated: story bible + UX/GSAP onboarding notes aligned with current `round4.html` build.*
