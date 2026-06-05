import { FILES } from "@/lib/game/m4/data";
import { M4_TUT_DEMO_LINKS } from "@/lib/game/m4/tutorialSteps";

export type M4TutorialDemoApi = {
  applyBaseline: () => void;
  selectStep: (stepId: string) => void;
  dismissStepPop: () => void;
  selectFile: (fileId: string) => void;
  assignToStep: (fileId: string, stepId: string) => void;
};

function xyCenter(el: Element | null, fx = 0.52, fy = 0.46) {
  if (!el) return { x: window.innerWidth * 0.45, y: window.innerHeight * 0.35 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width * fx, y: r.top + r.height * fy };
}

function ensureCursor(): HTMLElement {
  let cur = document.getElementById("m4-tut-demo-cursor");
  if (!cur) {
    cur = document.createElement("div");
    cur.id = "m4-tut-demo-cursor";
    cur.className = "m4-tut-demo-cursor";
    cur.innerHTML = '<span class="m4-tut-demo-cursor__ico"><i class="fas fa-mouse-pointer"></i></span>';
    document.body.appendChild(cur);
  } else if (cur.parentElement !== document.body) {
    document.body.appendChild(cur);
  }
  cur.style.display = "block";
  cur.style.zIndex = "2147483646";
  return cur;
}

function ensureChip(): HTMLElement {
  let chip = document.getElementById("m4-tut-demo-drag-ghost");
  if (!chip) {
    chip = document.createElement("div");
    chip.id = "m4-tut-demo-drag-ghost";
    chip.className = "m4-tut-demo-drag-ghost";
    document.body.appendChild(chip);
  } else if (chip.parentElement !== document.body) {
    document.body.appendChild(chip);
  }
  chip.style.zIndex = "2147483645";
  return chip;
}

function cleanupDemoLayers(gsap: typeof import("gsap").default) {
  const cur = document.getElementById("m4-tut-demo-cursor");
  if (cur) {
    gsap.killTweensOf(cur);
    cur.remove();
  }
  const chip = document.getElementById("m4-tut-demo-drag-ghost");
  if (chip) {
    gsap.killTweensOf(chip);
    chip.remove();
  }
}

export function skipM4TutorialDemo(root: HTMLElement, api: M4TutorialDemoApi) {
  api.applyBaseline();
  M4_TUT_DEMO_LINKS.forEach(({ stepId, fileId }) => {
    api.selectStep(stepId);
    api.dismissStepPop();
    api.assignToStep(fileId, stepId);
  });
  root.querySelectorAll(".fc-node.drag-target").forEach((n) => n.classList.remove("drag-target"));
}

export async function runM4TutorialDemo(
  root: HTMLElement,
  api: M4TutorialDemoApi,
  callbacks: { onComplete: () => void }
): Promise<() => void> {
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    skipM4TutorialDemo(root, api);
    callbacks.onComplete();
    return () => {};
  }

  const gsap = (await import("gsap")).default;
  api.applyBaseline();

  const curEl = ensureCursor();
  const chipEl = ensureChip();
  gsap.killTweensOf([curEl, chipEl]);
  chipEl.style.display = "none";
  gsap.set(curEl, { x: window.innerWidth * 0.38, y: 96, opacity: 1 });
  gsap.set(chipEl, { opacity: 0, scale: 0.92, x: -9999, y: -9999 });

  const durGate = 0.72;
  const durClose = 0.56;
  const durRail = 0.68;
  const durLift = 0.22;
  const durDrag = 0.98;
  const pauseRead = 0.52;

  let killed = false;
  const tl = gsap.timeline({
    onComplete: () => {
      if (!killed) callbacks.onComplete();
    },
  });

  M4_TUT_DEMO_LINKS.forEach((link) => {
    const nodeSel = `#flow-row .fc-node[data-step-id="${link.stepId}"]`;
    const cardSel = `#r4-file-list .ds-card[data-file-id="${link.fileId}"]`;
    const pair = { dx: 28, dy: 18, tx: 0, ty: 0 };

    const gateBox = root.querySelector(`${nodeSel} .fc-node-box`) ?? root.querySelector(nodeSel);
    const gatePt = xyCenter(gateBox);

    tl.to(curEl, { duration: durGate, ease: "power2.out", x: gatePt.x, y: gatePt.y });
    tl.call(() => {
      api.selectStep(link.stepId);
    });
    tl.to({}, { duration: pauseRead });

    tl.to(curEl, {
      duration: durClose,
      ease: "power2.out",
      x: () => {
        const btn = root.querySelector("#r4-step-pop .r4-step-pop-close");
        return btn ? btn.getBoundingClientRect().left + 6 : gatePt.x;
      },
      y: () => {
        const btn = root.querySelector("#r4-step-pop .r4-step-pop-close");
        return btn ? btn.getBoundingClientRect().top + 6 : gatePt.y;
      },
    });

    tl.call(() => {
      api.dismissStepPop();
    });
    tl.to({}, { duration: 0.14 });

    tl.to(curEl, {
      duration: durRail,
      ease: "power2.out",
      x: () => xyCenter(root.querySelector(cardSel), 0.48, 0.42).x,
      y: () => xyCenter(root.querySelector(cardSel), 0.48, 0.42).y,
    });

    tl.call(() => {
      api.selectFile(link.fileId);
      const card = root.querySelector(cardSel);
      const f = FILES.find((x) => x.id === link.fileId);
      chipEl.textContent = f?.name ?? "Dataset";
      chipEl.style.display = "block";
      const cr = card?.getBoundingClientRect() ?? { left: 40, top: 220, width: 140, height: 48 };
      gsap.set(chipEl, { x: cr.left + 10, y: cr.top + 8, opacity: 1, scale: 1 });
    });

    tl.to(curEl, {
      duration: durLift,
      ease: "power2.out",
      x: () => {
        const cx = parseFloat(String(gsap.getProperty(chipEl, "x")));
        return (Number.isFinite(cx) ? cx : 80) + 34;
      },
      y: () => {
        const cy = parseFloat(String(gsap.getProperty(chipEl, "y")));
        return (Number.isFinite(cy) ? cy : 220) + 16;
      },
    });

    tl.call(() => {
      const gx = parseFloat(String(gsap.getProperty(chipEl, "x")));
      const gy = parseFloat(String(gsap.getProperty(chipEl, "y")));
      const px = parseFloat(String(gsap.getProperty(curEl, "x")));
      const py = parseFloat(String(gsap.getProperty(curEl, "y")));
      const cr = root.querySelector(cardSel)?.getBoundingClientRect();
      const safeGx = Number.isFinite(gx) ? gx : (cr?.left ?? 0) + 10;
      const safeGy = Number.isFinite(gy) ? gy : (cr?.top ?? 0) + 8;
      pair.dx = (Number.isFinite(px) ? px : safeGx + 28) - safeGx;
      pair.dy = (Number.isFinite(py) ? py : safeGy + 18) - safeGy;
      const box = root.querySelector(`${nodeSel} .fc-node-box`);
      const r = box?.getBoundingClientRect() ?? { left: safeGx + 80, top: safeGy - 60, width: 82, height: 82 };
      const cw = chipEl.offsetWidth || 160;
      const ch = chipEl.offsetHeight || 36;
      pair.tx = r.left + (r.width - cw) * 0.5;
      pair.ty = r.top + (r.height - ch) * 0.4;
      root.querySelector(nodeSel)?.classList.add("drag-target");
    });

    tl.to(chipEl, {
      duration: durDrag,
      ease: "power2.inOut",
      opacity: 1,
      x: () => pair.tx,
      y: () => pair.ty,
    });
    tl.to(
      curEl,
      {
        duration: durDrag,
        ease: "power2.inOut",
        x: () => pair.tx + pair.dx,
        y: () => pair.ty + pair.dy,
      },
      "<"
    );

    tl.call(() => {
      root.querySelector(nodeSel)?.classList.remove("drag-target");
      api.assignToStep(link.fileId, link.stepId);
      chipEl.style.display = "none";
      gsap.set(chipEl, { opacity: 0 });
    });
    tl.to({}, { duration: 0.38 });
  });

  return () => {
    killed = true;
    tl.kill();
    cleanupDemoLayers(gsap);
    root.querySelectorAll(".fc-node.drag-target").forEach((n) => n.classList.remove("drag-target"));
  };
}
