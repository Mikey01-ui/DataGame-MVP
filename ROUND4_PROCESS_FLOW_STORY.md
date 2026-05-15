# Mission 04 — Process flow & story bridge (design note)

**Operation OMNI · The Data Heist**  
This document captures the **approved story link between Mission 03 and Mission 04** and the **intended player fantasy**: use the company’s own **process reality** to disprove the **“random / meaningless data”** defense, while keeping the **same UI shell** as earlier missions (header, confidence-style meter, Voss / Nova / Zex channel placement).

For an older alternate treatment (crisis beats, sequencing, Kelso arc), see **`ROUND4.md`**. Implementation in **`round4.html`** should converge with *this* doc when the process-flow prototype replaces prior mechanics.

---

## 1. What Mission 03 already established

In **Mission 03 (The Human Shield)**, the player works **Marshall’s disclosure queue**: real datasets with different sensitivity and harm profiles.

The core question is **audience routing**:

- **Public wall** — what can the world read without disproportionate harm?  
- **Official filing** — what belongs in accountable, non-tabloid channels?  
- **Vault / no release** — what must not be weaponized (minors, health-linked IDs, wholesale PII, named employee intelligence, etc.)?

So Round 3 answers:

> **Given ethics and identifiers, who is allowed to see which truth — and through which channel?**

That is the **release posture** of the operation: minimum necessary disclosure, Nova’s trust meter, and the crew’s credibility on *whether* they know how to handle data responsibly.

---

## 2. What Mission 04 adds (the next narrative beat)

After a leak goes live, **MegaCorp’s public line** is not only denial — it is **decontextualization**:

- The material is **cherry-picked**, **incomplete**, or **impossible to interpret**.  
- Therefore it should not support **any** clean story about **how the organization actually runs**.

**Mission 04** is the operational reply to that framing.

The crew is not re-asking “public vs vault” for every file. That work was Mission 03. Instead, the player works from a **new axis**:

> **Where does each piece of evidence sit inside *their* official process — which gate, which handover, which department-owned step — if their diagrams are honest?**

If the data **plugs cleanly into specific steps** in the process map (or **fails** to — exposing broken, redundant, or abusive flows), the leak is **not** “random noise.” It is **operationally meaningful**.

---

## 3. How Round 3 and Round 4 link (one arc, two questions)

| Mission | Question the player answers |
|--------|-----------------------------|
| **Round 3** | *Who may receive which truth, and through what channel?* (public / official / vault) |
| **Round 4** | *Where does each truth belong in **their** process — so it cannot be dismissed as meaningless?* |

**Same evidence, second axis:**

1. **Round 3** — *We chose **what** could cross the line to the outside world and **how**.*  
2. **Round 4** — *We now prove **why** that line was not arbitrary: every serious artifact **feeds a gate** they already drew.*

**Bridge line (briefing-ready):**

> *Mission 03 decided what could leave the building and toward which audience. Mission 04 shows that decision wasn’t floating in a void — each piece has a natural home in how they claim work gets done. Misalignment between **their process** and **their data** is the story.*

---

## 4. Player fantasy (simple version)

- The player enters a **digital process-modeling room** — a **flow diagram** (BPMN *flavor*, not necessarily full enterprise BPMN on v1).  
- **Steps** (and optionally **department swimlanes**) show **intake, validation, risk gates, approvals, handovers**.  
- The **same dataset identities** the player already saw in Mission 03 appear as **feeds** to place.  
- The task: **inspect steps** (purpose, required inputs, expected outputs) and **link** or **drag** each dataset to the **correct step** — the moment where that data **should** enter the chain **if the process were real**.  
- **Wrong links** suggest **randomness** or **negligence**; **Nova** (and the **confidence meter**, in the **same header position** as other missions) reflects whether the crew is **tight** or **sloppy** in defending the narrative.  
- **v1 simplification** (stakeholder feedback): linear or near-linear flow, **one primary correct placement per step**; **redundancy / inefficiency** (“this *looks* relevant but duplicates another feed”) can ship as **phase two**.

MegaCorp still claims the dump is unstructured. The player’s completed map says: **structure exists — or the company’s own model is lying.**

---

## 5. Antagonist pressure (diegetic)

**Corporate PR / legal posture**

- Leaks are **unauthorized**, **incomplete**, **misleading**.  
- Implication: nothing in the dump should support a coherent accusation.

**Player / crew counter (Mission 04)**

- We are not inventing connections. We are **mapping leak artifacts to the client’s **published or recovered process artifacts**.  
- Gaps, **wrong-stage** data, and **redundant feeds** are themselves **evidence** of **bad process hygiene** or **cover-up by clutter**.

This preserves continuity with Mission 03’s ethical rigor: Round 4 does **not** mean “throw everything at the wall”; it means **the subset you already routed responsibly still has operational teeth**.

---

## 6. UI / UX constraints (feedback from stakeholders)

- **Do not** relocate core furniture relative to Rounds 1–3 style missions: **confidence (or trust) meter**, **timer** if present, **broker chat** with **Voss / Nova / Zex** in the **established** layout.  
- **Replace** only the **central gameplay surface** — e.g. department columns become a **process canvas**; queue and inspector remain familiar.  
- **Mission Protocol** intro may **animate** a tiny flow + wrong-link dip (same pedagogical role as Round 3’s mini-routing demo).

---

## 7. Learning alignment (short)

By completing this mission, players should better:

1. See how **data enables** (or blocks) **business processes**.  
2. Spot **bottlenecks** and **confusion** from **misplaced or redundant** feeds.  
3. Align datasets with **the right moment** in the chain — **timing** and **necessity**.  
4. Connect **analytical truth** to **practical operational narrative** under pressure.

---

## 8. Sample briefing snippets (optional in-game copy)

**Voss**

> *They want the world to read our package as junk in a folder. Your job is to pin each item to **their** process spine — same files Marshall touched, different question: **which gate does this feed** if they’re not lying about how they operate?*

**Nova**

> *Mission 03 was **who may see what**. This is **where it sits in the machine** — wrong step, wrong story about blame. My confidence starts high; sloppy links cost us the same way sloppy routing did.*

**Zex**

> *Flow map quiet, narrative loud — get the diagram airtight before analysts scroll past.*

---

## 9. Implementation note

- **Canonical datasets** for continuity: reuse Mission 03 **`DATASETS`** / filenames (`round3wip.html`) unless story requires a subset.  
- **Scoring**: rules per **process step** (required feed, forbidden feed, optional redundancy flags in v2).  
- **Standalone prototype**: `round4-process-flow-visual-demo.html` was a **layout experiment**; production should **embed** the flow inside the **shared mission shell**, not a one-off frame.

---

*Document version: aligns Round 4’s intended story with Mission 03 and stakeholder direction toward a **simpler, process-first** mission while preserving **series UI consistency**.*
