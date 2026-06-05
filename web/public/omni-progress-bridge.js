/**
 * Operation OMNI — legacy mission progress bridge (pilot: Mission 5).
 * Load with ?omniBridge=1 on legacy HTML served from /legacy/.
 */
(function () {
  "use strict";

  var MISSION_ID = "m5";
  var DEBOUNCE_MS = 800;
  var timer = null;

  function bridgeEnabled() {
    try {
      var sp = new URLSearchParams(location.search);
      return sp.has("omniBridge") || sp.get("omniBridge") === "1";
    } catch (_) {
      return false;
    }
  }

  if (!bridgeEnabled()) return;

  function shouldResume() {
    try {
      return new URLSearchParams(location.search).has("resume");
    } catch (_) {
      return false;
    }
  }

  function patchProgress(body) {
    return fetch("/api/progress", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(function (err) {
      console.warn("[omni-bridge] save failed", err);
    });
  }

  function scheduleSave(payload) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      patchProgress(payload);
    }, DEBOUNCE_MS);
  }

  function snapshotState(checkpoint, status) {
    if (typeof GS === "undefined") return;
    scheduleSave({
      missionId: MISSION_ID,
      status: status || "in_progress",
      checkpoint: checkpoint,
      score: typeof GS.score === "number" ? GS.score : null,
      stateJson: {
        version: 1,
        frameChoices: GS.frameChoices || {},
        commits: GS.commits || 0,
        detection: GS.detection || 0,
        timerSec: GS.timerSec || 0,
        crewState: GS.crewState || {},
      },
    });
  }

  function hydrateFromServer(data) {
    if (!data || !data.stateJson || typeof GS === "undefined") return;
    var s = data.stateJson;
    if (s.frameChoices) GS.frameChoices = s.frameChoices;
    if (typeof s.commits === "number") GS.commits = s.commits;
    if (typeof s.detection === "number") GS.detection = s.detection;
    if (typeof s.timerSec === "number") GS.timerSec = s.timerSec;
    if (s.crewState) GS.crewState = s.crewState;

    if (data.checkpoint === "briefing" || data.checkpoint === "crew_zex") {
      var pf = document.getElementById("phase-framing");
      var pb = document.getElementById("phase-briefing");
      if (pf) pf.style.display = "none";
      if (pb) pb.style.display = "block";
    }
    if (typeof updateDetDisplay === "function") updateDetDisplay();
    if (typeof checkFramingComplete === "function") checkFramingComplete();
  }

  function loadProgress() {
    return fetch("/api/progress?missionId=" + MISSION_ID, { credentials: "include" })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (json) {
        return json && json.progress ? json.progress : null;
      });
  }

  function wrapWhenReady() {
    if (typeof confirmFraming !== "function") return false;

    var origConfirmFraming = confirmFraming;
    confirmFraming = function () {
      var result = origConfirmFraming.apply(this, arguments);
      snapshotState("briefing", "in_progress");
      return result;
    };

    if (typeof confirmAnswer === "function") {
      var origConfirmAnswer = confirmAnswer;
      confirmAnswer = function (crewId) {
        var result = origConfirmAnswer.apply(this, arguments);
        snapshotState("crew_" + crewId, "in_progress");
        return result;
      };
    }

    if (typeof showDebrief === "function") {
      var origShowDebrief = showDebrief;
      showDebrief = function () {
        snapshotState("completed", "completed");
        return origShowDebrief.apply(this, arguments);
      };
    }

    return true;
  }

  function boot() {
    loadProgress().then(function (row) {
      if (shouldResume() && row) hydrateFromServer(row);
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (wrapWhenReady() || tries > 40) clearInterval(iv);
      }, 250);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
