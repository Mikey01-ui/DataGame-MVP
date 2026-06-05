/* Mission 5 tutorial overlay — load after Mission 5 Tutorial.html game script */
'use strict';

function shouldShowM5Tutorial() {
  try {
    const sp = new URLSearchParams(location.search);
    if (sp.has('notutorial')) return false;
  } catch (_) {}
  return true;
}

function applyMissionBaselineStateM5() {
  if (typeof GS === 'undefined') return;
  GS.frameChoices = {};
  GS.commits = 0;
  GS.score = 500;
  GS.detection = 0;
  GS.timerSec = 0;
  GS.lastSender = null;
  if (GS.timerInt) {
    clearInterval(GS.timerInt);
    GS.timerInt = null;
  }
  if (typeof CREW_ORDER !== 'undefined') {
    CREW_ORDER.forEach(function (c) {
      GS.crewState[c] = { status: 'pending', retried: false, selected: null };
    });
  }
  const pf = document.getElementById('phase-framing');
  const pb = document.getElementById('phase-briefing');
  if (pf) pf.style.display = '';
  if (pb) pb.style.display = 'none';
  document.querySelectorAll('.choice-btn').forEach(function (b) {
    b.classList.remove('selected', 'locked');
  });
  document.querySelectorAll('.echo-line').forEach(function (e) {
    e.classList.remove('show');
    e.innerHTML = '';
  });
  const fc = document.getElementById('framing-confirm');
  if (fc) {
    fc.style.display = '';
    fc.disabled = true;
  }
  if (typeof CREW_ORDER !== 'undefined') {
    CREW_ORDER.forEach(function (c) {
      const row = document.getElementById('crew-' + c);
      if (row) {
        row.classList.add('locked');
        row.classList.remove('active', 'committed', 'sceptical');
      }
      const badge = document.getElementById('badge-' + c);
      if (badge) {
        badge.className = 'crew-status-badge pending';
        badge.textContent = 'PENDING';
      }
      const q = document.getElementById('q-' + c);
      if (q) q.classList.remove('show');
      const v = document.getElementById('verdict-' + c);
      if (v) {
        v.classList.remove('show');
        v.innerHTML = '';
      }
    });
  }
  const det = document.getElementById('det-pct');
  if (det) det.textContent = '0%';
  const sb = document.getElementById('step-banner');
  if (sb) sb.textContent = 'Work with ECHO — frame each evidence card before entering the briefing room';
  hideM5VoteOverlayPreview();
}

function hideM5VoteOverlayPreview() {
  const vo = document.getElementById('vote-overlay');
  if (!vo) return;
  vo.classList.remove('active', 'm5-tut-vote-preview');
}

function m5TutShowFramingPhase() {
  const pf = document.getElementById('phase-framing');
  const pb = document.getElementById('phase-briefing');
  const fc = document.getElementById('framing-confirm');
  if (pf) pf.style.display = '';
  if (pb) pb.style.display = 'none';
  if (fc) fc.style.display = '';
  const sb = document.getElementById('step-banner');
  if (sb) sb.textContent = 'Work with ECHO — frame each evidence card before entering the briefing room';
}

function m5TutFillAllFramesForTour() {
  if (typeof GS === 'undefined' || typeof ECHO_FRAME === 'undefined' || typeof ECHO_VIZ === 'undefined') {
    return;
  }
  for (var i = 1; i <= 4; i++) {
    if (!GS.frameChoices[i]) GS.frameChoices[i] = {};
    GS.frameChoices[i].frame = ECHO_FRAME[i].correct;
    GS.frameChoices[i].viz = ECHO_VIZ[i].correct;
  }
  if (typeof checkFramingComplete === 'function') checkFramingComplete();
  var fc = document.getElementById('framing-confirm');
  if (fc) {
    fc.disabled = false;
    fc.style.display = '';
  }
}

function m5TutShowBriefingPhaseForTour() {
  var pf = document.getElementById('phase-framing');
  var pb = document.getElementById('phase-briefing');
  var fc = document.getElementById('framing-confirm');
  if (pf) pf.style.display = 'none';
  if (pb) pb.style.display = 'block';
  if (fc) fc.style.display = 'none';
  var sb = document.getElementById('step-banner');
  if (sb) {
    sb.textContent =
      'Present your dossier — answer each crew member\'s challenge to earn their commitment';
  }
}

function m5TutScrollTargetsIntoView(targets) {
  if (!targets || !targets.length) return;
  var panel = document.getElementById('brief-panel');
  var el = targets[0];
  if (panel && el && panel.contains(el)) {
    try {
      el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
    } catch (_) {
      panel.scrollTop = panel.scrollHeight;
    }
  } else if (el) {
    try {
      el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
    } catch (_) {}
  }
}

function showM5VoteOverlayPreview() {
  const vo = document.getElementById('vote-overlay');
  if (!vo) return;
  const tally = document.getElementById('vote-tally');
  const outcome = document.getElementById('vote-outcome');
  const sub = document.getElementById('vote-sub');
  const voss = document.getElementById('vote-voss-line');
  if (tally) {
    tally.innerHTML =
      '<div class="vote-pip commit" title="ZEX">Z</div>' +
      '<div class="vote-pip commit" title="ATLAS">A</div>' +
      '<div class="vote-pip commit" title="NOVA">N</div>' +
      '<div class="vote-pip sceptical" title="KADE">K</div>';
  }
  if (outcome) outcome.textContent = '3 OF 4 COMMITS — OPERATION SHIPS';
  if (sub) sub.textContent = 'You needed three specialists on board. Detection meter still applies during framing and crew Q&A.';
  if (voss) voss.textContent = 'VOSS: Threshold met. Briefing closed.';
  vo.classList.add('active', 'm5-tut-vote-preview');
}

function bootMissionQuietLayoutM5() {
  applyMissionBaselineStateM5();
  const gp = document.getElementById('gp-root');
  if (gp) gp.classList.add('active');
  document.documentElement.classList.add('gp-html-active');
}

function beginMission() {
  beginMissionFromTutorial();
}

function beginMissionFromTutorial() {
  applyMissionBaselineStateM5();
  document.body.classList.remove('m5-primer-intro', 'm5-tutorial-active');
  const intro = document.getElementById('intro-root');
  if (intro) intro.style.display = 'none';
  document.querySelectorAll('.ambient-glow,.scanlines,.bg-grid,.corner').forEach(function (e) {
    e.style.display = 'none';
  });
  if (typeof initGame === 'function') initGame();
}

const M5_TUT_STEPS = [
  {
    selector: '#phase-framing',
    pad: 8,
    phase: 'tour',
    title: 'Frame each card with ECHO',
    html:
      '<p>Four evidence cards from Ops 1–4. For each one, pick a <strong>framing type</strong> (risk / opportunity / neutral) and a <strong>visualisation</strong>.</p>' +
      '<p>Read the <strong>ECHO</strong> line under the card — it tells you what each crew member needs to hear.</p>'
  },
  {
    selector: '#echo-1',
    pad: 6,
    phase: 'tour',
    title: 'ECHO feedback is your hint',
    html:
      '<p>After each choice, ECHO reacts in one line — that wording is your hint for framing and visualisation.</p>' +
      '<p>Read it before you lock all four cards.</p>'
  },
  {
    selector: '#framing-confirm',
    pad: 14,
    phase: 'tour',
    title: 'Enter the briefing room',
    html:
      '<p>When all four cards have framing + visualisation, press <strong>ENTER THE BRIEFING ROOM</strong> (bottom of the dossier panel) to present to the crew.</p>'
  },
  {
    selector: '#crew-zex',
    pad: 10,
    phase: 'tour',
    title: 'Crew challenges',
    html:
      '<p>Each specialist asks one multiple-choice question. Pick an answer, then <strong>SUBMIT</strong>.</p>' +
      '<p>One retry per person costs +10% detection. You need <strong>3 of 4 commits</strong> to ship.</p>'
  },
  {
    selector: '#vote-overlay',
    pad: 12,
    phase: 'tour',
    title: 'Win condition — 3 of 4',
    html:
      '<p>After all four crew challenges, specialists vote. <strong>Three commits</strong> ships the operation — you do not need all four.</p>' +
      '<p>VOSS closes the session; the debrief shows who stayed sceptical.</p>'
  },
  {
    selector: null,
    pad: 0,
    phase: 'demo',
    demo: true,
    title: 'Watch it once',
    html:
      '<p>Watch: pick framing + viz on card 1 → read ECHO → answer <strong>ZEX</strong>\'s challenge.</p>' +
      '<p><strong>Skip demo</strong> jumps ahead. <strong>Start mission</strong> opens the full briefing.</p>'
  }
];

function m5TutResetFooterPosition() {
  const footer = document.getElementById('m5-tut-footer');
  if (!footer) return;
  footer.classList.remove('m5-tut-footer--placed', 'm5-tut-footer--dragging');
  footer.style.left = '';
  footer.style.top = '';
  footer.style.bottom = '';
  footer.style.transform = '';
}

function wireM5TutorialFooterDrag() {
  const footer = document.getElementById('m5-tut-footer');
  const handle = document.getElementById('m5-tut-drag-handle');
  if (!footer || !handle || footer.dataset.dragWired === '1') return;
  footer.dataset.dragWired = '1';

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  function clampPos(left, top) {
    const pad = 8;
    const w = footer.offsetWidth;
    const h = footer.offsetHeight;
    return {
      left: Math.max(pad, Math.min(window.innerWidth - w - pad, left)),
      top: Math.max(pad, Math.min(window.innerHeight - h - pad, top))
    };
  }

  function ensurePlaced() {
    if (footer.classList.contains('m5-tut-footer--placed')) return;
    const r = footer.getBoundingClientRect();
    footer.classList.add('m5-tut-footer--placed');
    footer.style.bottom = 'auto';
    footer.style.transform = 'none';
    footer.style.left = r.left + 'px';
    footer.style.top = r.top + 'px';
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const p = clampPos(startLeft + (e.clientX - startX), startTop + (e.clientY - startY));
    footer.style.left = p.left + 'px';
    footer.style.top = p.top + 'px';
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    footer.classList.remove('m5-tut-footer--dragging');
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', endDrag);
    document.removeEventListener('pointercancel', endDrag);
  }

  handle.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    e.preventDefault();
    ensurePlaced();
    dragging = true;
    footer.classList.add('m5-tut-footer--dragging');
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseFloat(footer.style.left) || 0;
    startTop = parseFloat(footer.style.top) || 0;
    if (handle.setPointerCapture) handle.setPointerCapture(e.pointerId);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);
  });

  window.addEventListener('resize', function () {
    if (!footer.classList.contains('m5-tut-footer--placed')) return;
    const p = clampPos(parseFloat(footer.style.left) || 0, parseFloat(footer.style.top) || 0);
    footer.style.left = p.left + 'px';
    footer.style.top = p.top + 'px';
  });
}

function openM5Tutorial() {
  const shell = document.getElementById('m5-tutorial');
  if (!shell || !M5_TUT_STEPS.length) {
    beginMissionFromTutorial();
    return;
  }

  let stepIx = 0;
  let finishedTutorial = false;
  let demoPlaybackDone = false;
  let demoStartRaf = null;
  let ro = null;
  let demoTl = null;
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const strips = ['m5-tut-strip-t', 'm5-tut-strip-b', 'm5-tut-strip-l', 'm5-tut-strip-r'].map(function (id) {
    return document.getElementById(id);
  });
  const hi = document.getElementById('m5-tut-highlight');
  const full = document.getElementById('m5-tut-full');

  function primeTutorialStep() {
    const step = M5_TUT_STEPS[stepIx];
    hideM5VoteOverlayPreview();
    window.__M5_TUT_DEMO_SILENT = !!(
      step &&
      (step.demo || step.selector === '#crew-zex' || step.selector === '#vote-overlay')
    );

    if (step && step.selector === '#vote-overlay') {
      showM5VoteOverlayPreview();
    } else if (step && step.selector === '#crew-zex') {
      m5TutShowBriefingPhaseForTour();
      if (typeof activateCrew === 'function') {
        window.__M5_TUT_DEMO_SILENT = true;
        activateCrew('zex');
      }
    } else {
      m5TutShowFramingPhase();
      if (step && step.selector === '#framing-confirm') {
        m5TutFillAllFramesForTour();
      }
      if (stepIx === 1 && typeof selectFrame === 'function') {
        const opp = document.querySelector('#frame-btns-1 .choice-btn[onclick*="opportunity"]');
        if (opp) selectFrame(1, 'opportunity', opp);
      }
    }
  }

  function finalizeM5DemoStep() {
    window.__M5_TUT_DEMO_SILENT = false;
    shell.classList.remove('m5-tut-demo-playing');
    if (full) full.classList.remove('m5-tut-full--demo-reveal');
    applyMissionBaselineStateM5();
    demoPlaybackDone = true;
    const nb = document.getElementById('m5-tut-next');
    if (nb) {
      nb.disabled = false;
      nb.textContent = 'Start mission';
    }
    const bod = document.getElementById('m5-tut-body');
    if (bod) {
      bod.innerHTML =
        '<p><strong>Replay done.</strong> Frame cards with ECHO, then win <strong>3 of 4</strong> crew commits.</p>' +
        '<p>Tap <strong>Start mission</strong> for the full run.</p>';
    }
    reflowTutorial();
  }

  function skipM5DemoPlayback() {
    if (demoStartRaf != null) {
      cancelAnimationFrame(demoStartRaf);
      demoStartRaf = null;
    }
    if (demoTl && typeof demoTl.kill === 'function') {
      demoTl.kill();
      demoTl = null;
    }
    window.__M5_TUT_DEMO_SILENT = true;
    shell.classList.remove('m5-tut-demo-playing');
    const cur = document.getElementById('m5-tut-demo-cursor');
    if (cur) {
      if (typeof gsap !== 'undefined') gsap.killTweensOf(cur);
      cur.remove();
    }
    applyMissionBaselineStateM5();
    if (typeof selectFrame === 'function') {
      const opp = document.querySelector('#frame-btns-1 .choice-btn[onclick*="opportunity"]');
      const node = document.querySelector('#viz-btns-1 .choice-btn[onclick*="node"]');
      if (opp) selectFrame(1, 'opportunity', opp);
      if (node) selectViz(1, 'node', node);
    }
    finalizeM5DemoStep();
  }

  function runM5TutorialGsapDemo() {
    if (finishedTutorial) return;
    if (prefersReducedMotion || typeof gsap === 'undefined') {
      skipM5DemoPlayback();
      return;
    }

    window.__M5_TUT_DEMO_SILENT = true;
    shell.classList.add('m5-tut-demo-playing');
    applyMissionBaselineStateM5();
    reflowTutorial();

    var curEl = document.getElementById('m5-tut-demo-cursor');
    if (!curEl) {
      curEl = document.createElement('div');
      curEl.id = 'm5-tut-demo-cursor';
      curEl.className = 'm5-tut-demo-cursor';
      curEl.innerHTML = '<span class="m5-tut-demo-cursor__ico"><i class="fas fa-mouse-pointer"></i></span>';
      document.body.appendChild(curEl);
    }
    curEl.style.display = 'block';
    curEl.style.zIndex = '2147483646';
    gsap.killTweensOf(curEl);
    gsap.set(curEl, { x: window.innerWidth * 0.35, y: 120, opacity: 1 });

    function xy(el, fx, fy) {
      if (!el) return { x: 200, y: 200 };
      var r = el.getBoundingClientRect();
      return {
        x: r.left + (typeof fx === 'number' ? fx : r.width * 0.5),
        y: r.top + (typeof fy === 'number' ? fy : r.height * 0.45)
      };
    }

    var oppBtn = document.querySelector('#frame-btns-1 .choice-btn[onclick*="opportunity"]');
    var nodeBtn = document.querySelector('#viz-btns-1 .choice-btn[onclick*="node"]');
    var zexOpt = null;

    demoTl = gsap.timeline({
      onComplete: function () {
        demoTl = null;
        finalizeM5DemoStep();
      }
    });

    demoTl.to(curEl, { duration: 0.7, ease: 'power2.out', x: function () { return xy(oppBtn).x; }, y: function () { return xy(oppBtn).y; } });
    demoTl.call(function () {
      if (oppBtn && typeof selectFrame === 'function') selectFrame(1, 'opportunity', oppBtn);
    });
    demoTl.to({}, { duration: 0.5 });
    demoTl.to(curEl, { duration: 0.65, ease: 'power2.out', x: function () { return xy(nodeBtn).x; }, y: function () { return xy(nodeBtn).y; } });
    demoTl.call(function () {
      if (nodeBtn && typeof selectViz === 'function') selectViz(1, 'node', nodeBtn);
    });
    demoTl.to({}, { duration: 0.6 });

    demoTl.call(function () {
      if (typeof confirmFraming === 'function') {
        for (var i = 2; i <= 4; i++) {
          if (!GS.frameChoices[i]) GS.frameChoices[i] = {};
          if (!GS.frameChoices[i].frame && typeof ECHO_FRAME !== 'undefined') {
            GS.frameChoices[i].frame = ECHO_FRAME[i].correct;
          }
          if (!GS.frameChoices[i].viz && typeof ECHO_VIZ !== 'undefined') {
            GS.frameChoices[i].viz = ECHO_VIZ[i].correct;
          }
        }
        checkFramingComplete();
        confirmFraming();
      }
    });
    demoTl.to({}, { duration: 0.8 });

    demoTl.call(function () {
      if (typeof CREW_QUESTIONS !== 'undefined' && typeof selectCrewOpt === 'function') {
        zexOpt = document.querySelector('#opts-zex .crew-opt');
        if (zexOpt && CREW_QUESTIONS.zex) {
          selectCrewOpt('zex', CREW_QUESTIONS.zex.ans, zexOpt);
        }
      }
    });
    demoTl.to(curEl, {
      duration: 0.75,
      ease: 'power2.out',
      x: function () {
        return zexOpt ? xy(zexOpt).x : xy(document.getElementById('crew-zex')).x;
      },
      y: function () {
        return zexOpt ? xy(zexOpt).y : xy(document.getElementById('crew-zex')).y;
      }
    });
    demoTl.call(function () {
      if (typeof confirmAnswer === 'function') confirmAnswer('zex');
    });
    demoTl.to({}, { duration: 0.5 });
    demoTl.to(curEl, { opacity: 0, duration: 0.35 });
    demoTl.call(function () {
      curEl.style.display = 'none';
      window.__M5_TUT_DEMO_SILENT = false;
    });
  }

  function finishTutorial() {
    if (finishedTutorial) return;
    finishedTutorial = true;
    if (demoStartRaf != null) {
      cancelAnimationFrame(demoStartRaf);
      demoStartRaf = null;
    }
    if (demoTl && typeof demoTl.kill === 'function') {
      demoTl.kill();
      demoTl = null;
    }
    window.__M5_TUT_DEMO_SILENT = false;
    var demoCur = document.getElementById('m5-tut-demo-cursor');
    if (demoCur) {
      if (typeof gsap !== 'undefined') gsap.killTweensOf(demoCur);
      demoCur.remove();
    }
    shell.classList.remove('m5-tut-demo-playing');
    hideM5VoteOverlayPreview();
    document.removeEventListener('keydown', escHandler);
    window.removeEventListener('resize', reflowTutorial);
    window.removeEventListener('scroll', reflowTutorial, true);
    if (ro && typeof ro.disconnect === 'function') ro.disconnect();
    shell.classList.remove('active');
    shell.setAttribute('aria-hidden', 'true');
    strips.forEach(function (el) {
      if (el) el.classList.remove('m5-tut-strip--show');
    });
    if (full) full.classList.remove('show');
    if (hi) {
      hi.classList.remove('show', 'animate-pulse');
    }
    document.body.classList.remove('m5-tutorial-active');
    beginMissionFromTutorial();
  }

  function escHandler(ev) {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      finishTutorial();
    }
  }

  function clampHole(domRect, pad, vw, vh) {
    const xl = Math.max(0, domRect.left - pad);
    const yt = Math.max(0, domRect.top - pad);
    const xr = Math.min(vw, domRect.right + pad);
    const yb = Math.min(vh, domRect.bottom + pad);
    return {
      left: xl,
      top: yt,
      width: Math.max(32, xr - xl),
      height: Math.max(32, yb - yt)
    };
  }

  function layoutShades(ax) {
    const topEl = strips[0];
    const botEl = strips[1];
    const leftEl = strips[2];
    const rightEl = strips[3];
    if (!topEl || !botEl || !leftEl || !rightEl) return;
    topEl.style.cssText = 'top:0;left:0;width:100vw;height:' + ax.top + 'px';
    leftEl.style.cssText = 'top:' + ax.top + 'px;left:0;width:' + ax.left + 'px;height:' + ax.height + 'px';
    rightEl.style.cssText =
      'top:' + ax.top + 'px;left:' + (ax.left + ax.width) + 'px;width:' +
      Math.max(0, window.innerWidth - ax.left - ax.width) + 'px;height:' + ax.height + 'px';
    botEl.style.cssText =
      'top:' + (ax.top + ax.height) + 'px;left:0;width:100vw;height:' +
      Math.max(0, window.innerHeight - ax.top - ax.height) + 'px';
    strips.forEach(function (el) {
      el.classList.add('m5-tut-strip--show');
    });
  }

  function queryTutorialTargets(step) {
    if (!step.selector) return [];
    const el = document.querySelector(step.selector);
    return el ? [el] : [];
  }

  function boundingRectUnion(elements) {
    if (!elements.length) return null;
    var minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
    elements.forEach(function (el) {
      var r = el.getBoundingClientRect();
      minL = Math.min(minL, r.left);
      minT = Math.min(minT, r.top);
      maxR = Math.max(maxR, r.right);
      maxB = Math.max(maxB, r.bottom);
    });
    return { left: minL, top: minT, right: maxR, bottom: maxB };
  }

  function reflowTutorial() {
    var step = M5_TUT_STEPS[stepIx];
    var pad = typeof step.pad === 'number' ? step.pad : 8;
    var targets = queryTutorialTargets(step);

    if (!step.selector || !targets.length) {
      strips.forEach(function (el) {
        if (el) el.classList.remove('m5-tut-strip--show');
      });
      if (full) {
        full.classList.add('show');
        if (step.demo && shell.classList.contains('m5-tut-demo-playing')) {
          full.classList.add('m5-tut-full--demo-reveal');
        } else {
          full.classList.remove('m5-tut-full--demo-reveal');
        }
      }
      if (hi) hi.classList.remove('show');
      return;
    }

    if (full) full.classList.remove('show', 'm5-tut-full--demo-reveal');
    m5TutScrollTargetsIntoView(targets);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var uni = boundingRectUnion(targets);
        if (!uni || !hi) return;
        if (uni.right - uni.left < 8 || uni.bottom - uni.top < 8) return;
        var ax = clampHole(uni, pad, window.innerWidth, window.innerHeight);
        hi.style.display = '';
        hi.classList.add('show');
        if (!prefersReducedMotion) hi.classList.add('animate-pulse');
        else hi.classList.remove('animate-pulse');
        hi.style.left = ax.left + 'px';
        hi.style.top = ax.top + 'px';
        hi.style.width = ax.width + 'px';
        hi.style.height = ax.height + 'px';
        layoutShades(ax);
      });
    });
  }

  function renderFooter() {
    var step = M5_TUT_STEPS[stepIx];
    document.getElementById('m5-tut-counter').textContent =
      'Step ' + (stepIx + 1) + ' / ' + M5_TUT_STEPS.length;
    var phaseEl = document.getElementById('m5-tut-phase');
    if (phaseEl) {
      phaseEl.textContent = step.phase === 'demo' ? 'DEMO' : 'NEW IN M05';
    }
    document.getElementById('m5-tut-title').textContent = step.title || '';
    document.getElementById('m5-tut-body').innerHTML = step.html || '';
    var nextBtn = document.getElementById('m5-tut-next');
    if (nextBtn) {
      nextBtn.textContent =
        step.phase === 'demo'
          ? (demoPlaybackDone ? 'Start mission' : 'Skip demo')
          : stepIx >= M5_TUT_STEPS.length - 1
            ? 'Start mission'
            : 'Next';
    }
  }

  function goToTutorialStep() {
    primeTutorialStep();
    var step = M5_TUT_STEPS[stepIx];
    if (step && step.demo) {
      demoPlaybackDone = false;
      shell.classList.add('m5-tut-demo-playing');
    } else {
      shell.classList.remove('m5-tut-demo-playing');
    }
    renderFooter();
    reflowTutorial();
    var nb = document.getElementById('m5-tut-next');
    if (nb) nb.disabled = false;
    if (step && step.demo) {
      if (demoStartRaf != null) cancelAnimationFrame(demoStartRaf);
      demoStartRaf = requestAnimationFrame(function () {
        demoStartRaf = null;
        runM5TutorialGsapDemo();
      });
    }
  }

  document.getElementById('m5-tut-next').onclick = function () {
    var cur = M5_TUT_STEPS[stepIx];
    if (cur && cur.demo && !demoPlaybackDone) {
      skipM5DemoPlayback();
      return;
    }
    stepIx++;
    if (stepIx >= M5_TUT_STEPS.length) {
      finishTutorial();
      return;
    }
    goToTutorialStep();
  };
  document.getElementById('m5-tut-skip').onclick = finishTutorial;
  document.addEventListener('keydown', escHandler);
  window.addEventListener('resize', reflowTutorial);
  window.addEventListener('scroll', reflowTutorial, true);
  var gp = document.getElementById('gp-root');
  if (gp && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(reflowTutorial);
    ro.observe(gp);
  }

  document.body.classList.add('m5-tutorial-active');
  document.body.classList.remove('m5-primer-intro');
  shell.classList.add('active');
  shell.setAttribute('aria-hidden', 'false');
  m5TutResetFooterPosition();
  wireM5TutorialFooterDrag();
  goToTutorialStep();
}

function playM5TutorialEnterFromBrief() {
  var hadFlag = false;
  try {
    hadFlag = !!sessionStorage.getItem('m5TutorialEnter');
    if (hadFlag) sessionStorage.removeItem('m5TutorialEnter');
  } catch (_) {}
  if (!hadFlag) return;
  document.documentElement.classList.remove('m5-enter-from-brief');
  var intro = document.getElementById('intro-root');
  var gp = document.getElementById('gp-root');
  var tut = document.getElementById('m5-tutorial');
  if (!gp) return;
  var reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof gsap === 'undefined' || reduced) {
    if (intro) {
      intro.style.opacity = '1';
      intro.style.transform = '';
    }
    gp.style.opacity = '1';
    gp.style.transform = '';
    if (tut) tut.style.opacity = '1';
    return;
  }
  if (intro) {
    gsap.fromTo(intro, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.72, ease: 'power2.out' });
  }
  gsap.fromTo(gp, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.72, ease: 'power2.out', delay: 0.06 });
  if (tut) {
    gsap.fromTo(tut, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power2.out', delay: 0.12 });
  }
}

function beginM5BriefingPrimer() {
  try {
    sessionStorage.setItem('m5TutorialEnter', '1');
  } catch (_) {}
  if (!shouldShowM5Tutorial()) {
    beginMissionFromTutorial();
    return;
  }
  const intro = document.getElementById('intro-root');
  const gp = document.getElementById('gp-root');
  const tut = document.getElementById('m5-tutorial');
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  bootMissionQuietLayoutM5();
  openM5Tutorial();

  if (typeof gsap !== 'undefined' && !reduced && intro && gp) {
    gsap.to(intro, {
      opacity: 0,
      y: -10,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: function () {
        intro.style.display = 'none';
      }
    });
    gsap.fromTo(gp, { opacity: 0.35 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' });
    if (tut) gsap.fromTo(tut, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 });
  } else {
    if (intro) intro.style.display = 'none';
    if (gp) {
      gp.style.opacity = '1';
      gp.style.transform = '';
    }
    if (tut) tut.style.opacity = '1';
  }
}

function bootM5TutorialPage() {
  function tickPrimerClock() {
    const el = document.getElementById('m5-primer-clock');
    if (el) el.textContent = new Date().toTimeString().slice(0, 8);
  }
  tickPrimerClock();
  setInterval(tickPrimerClock, 1000);

  if (!shouldShowM5Tutorial()) {
    beginMissionFromTutorial();
    return;
  }

  document.body.classList.add('m5-primer-intro');
  const gp = document.getElementById('gp-root');
  if (gp) gp.classList.add('active');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootM5TutorialPage);
} else {
  bootM5TutorialPage();
}
