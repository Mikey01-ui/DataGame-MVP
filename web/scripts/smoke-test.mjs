#!/usr/bin/env node
/**
 * Smoke test: register → login → progress → hub → mission shell.
 * Requires dev server: npm run dev
 */
import { execSync } from "node:child_process";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const email = `smoke-${Date.now()}@omni.local`;
const password = "smoketest12";
const jar = "/tmp/omni-smoke-cookies.txt";

function curl(args) {
  return execSync(`curl -s ${args}`, { encoding: "utf8" });
}

function curlStatus(args) {
  return execSync(`curl -s -o /dev/null -w "%{http_code}" ${args}`, { encoding: "utf8" }).trim();
}

try {
  curl(`-X POST "${BASE}/api/register" -H "Content-Type: application/json" -d '{"email":"${email}","password":"${password}"}'`);
  const csrf = JSON.parse(curl(`-c "${jar}" "${BASE}/api/auth/csrf"`)).csrfToken;
  const loginStatus = curlStatus(
    `-c "${jar}" -b "${jar}" -X POST "${BASE}/api/auth/callback/credentials" -H "Content-Type: application/x-www-form-urlencoded" -d "csrfToken=${csrf}&email=${email}&password=${password}&callbackUrl=${BASE}/hub"`
  );
  if (loginStatus !== "302") throw new Error(`login expected 302, got ${loginStatus}`);

  const progress = JSON.parse(curl(`-b "${jar}" "${BASE}/api/progress"`));
  if (!Array.isArray(progress.progress)) throw new Error("progress GET failed");

  const patched = JSON.parse(
    curl(
      `-b "${jar}" -X PATCH "${BASE}/api/progress" -H "Content-Type: application/json" -d '{"missionId":"m5","status":"in_progress","checkpoint":"briefing","stateJson":{"version":1,"commits":2}}'`
    )
  );
  if (patched.progress?.missionId !== "m5") throw new Error("progress PATCH failed");

  for (const [path, label] of [
    ["/hub", "hub"],
    ["/mission/m5?resume=1", "mission shell"],
    ["/omni-progress-bridge.js", "bridge script"],
  ]) {
    const status = curlStatus(`-b "${jar}" "${BASE}${path}"`);
    if (status !== "200") throw new Error(`${label} expected 200, got ${status}`);
  }

  console.log("Smoke test passed:", email);
} catch (err) {
  console.error("Smoke test failed:", err.message ?? err);
  process.exit(1);
}
