/**
 * Fixed prev/next arrows to jump between mission HTML files (playtest chain).
 * Add to each mission: <body data-playtest-mission="1">
 * and <script src="playtest-mission-nav.js" defer></script> before </body>.
 */
(function () {
  'use strict';

  var CHAIN = ['Mission 1.html', 'Mission 2.html', 'Mission 3.html', 'Mission 4.html', 'Mission 5.html'];

  function inject() {
    var raw = document.body.getAttribute('data-playtest-mission');
    if (raw === null || raw === '') return;
    var missionNum = parseInt(raw, 10);
    if (!missionNum || missionNum < 1 || missionNum > CHAIN.length) return;

    var i = missionNum - 1;
    var prevHref = CHAIN[(i - 1 + CHAIN.length) % CHAIN.length];
    var nextHref = CHAIN[(i + 1) % CHAIN.length];

    var css = document.createElement('style');
    css.setAttribute('data-playtest-mission-nav', '');
    css.textContent =
      '.playtest-mnav{position:fixed;inset:0;pointer-events:none;z-index:480}' +
      '.playtest-mnav a{pointer-events:auto}' +
      '.playtest-mnav__btn{position:fixed;top:50%;margin-top:-22px;width:44px;height:44px;display:flex;' +
      'align-items:center;justify-content:center;border-radius:4px;' +
      'border:2px solid rgba(247,148,33,.58);background:rgba(30,15,26,.93);color:#f79421;' +
      'font-family:system-ui,-apple-system,sans-serif;font-size:1.25rem;font-weight:700;line-height:1;' +
      'text-decoration:none;box-shadow:0 4px 18px rgba(0,0,0,.42),0 0 28px rgba(247,148,33,.07);' +
      'transition:border-color .2s ease,background .2s ease,color .2s ease,box-shadow .2s ease,transform .2s ease}' +
      '.playtest-mnav__btn:focus-visible{outline:2px solid var(--purple-light,#8f44e8);outline-offset:2px}' +
      '.playtest-mnav__btn:hover{border-color:rgba(247,148,33,.98);background:rgba(247,148,33,.14);color:#ffa234;' +
      'box-shadow:0 6px 26px rgba(247,148,33,.28);transform:scale(1.06)}' +
      '.playtest-mnav__btn--prev{left:clamp(10px,2vw,20px)}' +
      '.playtest-mnav__btn--next{right:clamp(10px,2vw,20px)}';
    document.head.appendChild(css);

    var wrap = document.createElement('div');
    wrap.className = 'playtest-mnav';
    wrap.setAttribute('role', 'navigation');
    wrap.setAttribute('aria-label', 'Jump between missions');

    var prev = document.createElement('a');
    prev.className = 'playtest-mnav__btn playtest-mnav__btn--prev';
    prev.href = prevHref;
    prev.setAttribute('aria-label', 'Previous mission');
    prev.textContent = '\u2190';

    var next = document.createElement('a');
    next.className = 'playtest-mnav__btn playtest-mnav__btn--next';
    next.href = nextHref;
    next.setAttribute('aria-label', 'Next mission');
    next.textContent = '\u2192';

    wrap.appendChild(prev);
    wrap.appendChild(next);
    document.body.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
