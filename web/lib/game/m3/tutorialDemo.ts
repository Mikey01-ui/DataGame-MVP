import { m3TutDrillFileName, m3TutGetDocumentPreview } from "@/lib/game/m3/tutorialDrill";

export type M3TutorialDemoApi = {
  applyBaseline: () => void;
  selectDataset: (id: string, opts?: { silentBanner?: boolean }) => void;
  routeFile: (id: string, choice: "public" | "official" | "vault") => void;
  setBanner: (text: string) => void;
  getInspectorBodyEl: () => HTMLElement | null;
};

function viewportPos(el: Element, kind: "file" | "btn") {
  const er = el.getBoundingClientRect();
  if (kind === "btn") {
    return { x: er.left + er.width * 0.5, y: er.top + er.height * 0.42 };
  }
  return { x: er.left + 16, y: er.top + er.height * 0.5 };
}

function ensureCursor(): HTMLElement {
  let cur = document.getElementById("m3-tut-demo-cursor");
  if (!cur) {
    cur = document.createElement("div");
    cur.id = "m3-tut-demo-cursor";
    cur.className = "m3-tut-demo-cursor";
    cur.innerHTML = '<span class="m3-tut-demo-cursor__ico"><i class="fas fa-mouse-pointer"></i></span>';
    document.body.appendChild(cur);
  } else if (cur.parentElement !== document.body) {
    document.body.appendChild(cur);
  }
  cur.style.display = "block";
  cur.style.zIndex = "2147483646";
  return cur;
}

function removeCursor(gsap: typeof import("gsap").default) {
  const cur = document.getElementById("m3-tut-demo-cursor");
  if (cur) {
    gsap.killTweensOf(cur);
    cur.remove();
  }
}

export async function runM3TutorialDemo(
  root: HTMLElement,
  api: M3TutorialDemoApi,
  callbacks: { onComplete: () => void }
): Promise<() => void> {
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    callbacks.onComplete();
    return () => {};
  }

  const gsap = (await import("gsap")).default;
  api.applyBaseline();

  const file1 = root.querySelector<HTMLElement>('.r2-file[data-id="payroll"]');
  const file2 = root.querySelector<HTMLElement>('.r2-file[data-id="omni_exec"]');
  const ibody = api.getInspectorBodyEl();
  const chOff = root.querySelector<HTMLElement>("#ch-official");
  const chPub = root.querySelector<HTMLElement>("#ch-public");
  if (!file1 || !file2 || !ibody || !chOff || !chPub) {
    callbacks.onComplete();
    return () => {};
  }

  const curEl = ensureCursor();
  const H1 = "1 — Click a file to open the inspector.";
  const H2 = "2 — Read harm profile and audience — who gets hurt if this spreads?";
  const H3 = "3 — Choose PUBLIC WALL, OFFICIAL FILING, or NO RELEASE.";
  const HGap = " ";

  gsap.set(curEl, { opacity: 0, x: window.innerWidth * 0.35, y: 120 });

  const sceneTl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out" },
    onComplete: callbacks.onComplete,
  });

  const cu = 1.05;
  const readHold = 2.4;
  const afterH3 = 0.18;

  sceneTl.call(() => api.setBanner(H1), undefined, 0);
  sceneTl.to(curEl, { opacity: 1, duration: 0.35 }, 0.2);
  sceneTl.to(
    curEl,
    {
      x: () => viewportPos(file1, "file").x,
      y: () => viewportPos(file1, "file").y,
      duration: 1.0,
      ease: "power2.inOut",
    },
    0.45
  );
  sceneTl.call(() => {
    api.selectDataset("payroll", { silentBanner: true });
    api.setBanner(HGap);
  }, undefined, 1.55);
  sceneTl.to(ibody, { opacity: 0, duration: 0.12 }, 1.65);
  sceneTl.call(() => {
    ibody.innerHTML = m3TutGetDocumentPreview("payroll");
  }, undefined, 1.78);
  sceneTl.to(ibody, { opacity: 1, duration: 0.45 }, 1.82);
  sceneTl.call(() => api.setBanner(H2), undefined, 1.9);

  const tH3A = 1.9 + readHold;
  sceneTl.call(() => api.setBanner(H3), undefined, tH3A);
  sceneTl.to(
    curEl,
    {
      x: () => viewportPos(chOff, "btn").x,
      y: () => viewportPos(chOff, "btn").y,
      duration: cu,
      ease: "power2.inOut",
    },
    tH3A + afterH3
  );
  sceneTl.call(() => chOff.classList.add("clicked"), undefined, tH3A + afterH3 + cu + 0.05);
  sceneTl.call(() => {
    chOff.classList.remove("clicked");
    api.routeFile("payroll", "official");
  }, undefined, tH3A + afterH3 + cu + 0.3);

  const tEndA = tH3A + afterH3 + cu + 0.55;
  sceneTl.to(curEl, { opacity: 0, duration: 0.28 }, tEndA);
  sceneTl.call(() => api.setBanner("Next file…"), undefined, tEndA + 0.12);
  sceneTl.to(ibody, { opacity: 0, duration: 0.22 }, tEndA + 0.18);

  const tB0 = tEndA + 0.75;
  const tH2B = tB0 + 2.0;
  const tH3B = tH2B + readHold;

  sceneTl.call(() => api.setBanner(H1), undefined, tB0);
  sceneTl.to(curEl, { opacity: 1, duration: 0.3 }, tB0 + 0.12);
  sceneTl.to(
    curEl,
    {
      x: () => viewportPos(file2, "file").x,
      y: () => viewportPos(file2, "file").y,
      duration: 0.95,
      ease: "power2.inOut",
    },
    tB0 + 0.18
  );
  sceneTl.call(() => {
    api.selectDataset("omni_exec", { silentBanner: true });
    api.setBanner(HGap);
  }, undefined, tB0 + 1.2);
  sceneTl.call(() => {
    ibody.innerHTML = m3TutGetDocumentPreview("omni_exec");
  }, undefined, tB0 + 1.3);
  sceneTl.to(ibody, { opacity: 1, duration: 0.45 }, tB0 + 1.32);
  sceneTl.call(() => api.setBanner(H2), undefined, tB0 + 1.38);

  sceneTl.call(() => api.setBanner(H3), undefined, tH3B);
  sceneTl.to(
    curEl,
    {
      x: () => viewportPos(chPub, "btn").x,
      y: () => viewportPos(chPub, "btn").y,
      duration: cu,
      ease: "power2.inOut",
    },
    tH3B + afterH3
  );
  sceneTl.call(() => chPub.classList.add("clicked"), undefined, tH3B + afterH3 + cu + 0.05);
  sceneTl.call(() => {
    chPub.classList.remove("clicked");
    api.routeFile("omni_exec", "public");
  }, undefined, tH3B + afterH3 + cu + 0.3);

  const tEndB = tH3B + afterH3 + cu + 0.55;
  sceneTl.to(curEl, { opacity: 0, duration: 0.3 }, tEndB);
  sceneTl.call(
    () => api.setBanner("Demo complete — tap Start mission when ready."),
    undefined,
    tEndB + 0.12
  );

  sceneTl.play(0);

  return () => {
    sceneTl.kill();
    removeCursor(gsap);
    gsap.killTweensOf(ibody);
    ibody.style.opacity = "1";
  };
}
