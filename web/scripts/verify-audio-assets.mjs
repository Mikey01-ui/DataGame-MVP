#!/usr/bin/env node
/**
 * Verifies mission media.json audio paths resolve to files under public/.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const missionsDir = join(root, "content", "missions");

function stripQuery(src) {
  return src.split("?")[0];
}

function collectUrls(media) {
  const urls = [];
  if (media.ambient?.src) urls.push(media.ambient.src);
  if (media.sfx) urls.push(...Object.values(media.sfx));
  return urls;
}

let missing = 0;
let checked = 0;

for (const missionId of ["m3", "m4"]) {
  const jsonPath = join(missionsDir, missionId, "media.json");
  if (!existsSync(jsonPath)) {
    console.error(`Missing config: ${jsonPath}`);
    missing++;
    continue;
  }
  const media = JSON.parse(readFileSync(jsonPath, "utf8"));
  for (const src of collectUrls(media)) {
    checked++;
    const rel = stripQuery(src);
    const file = join(publicDir, rel);
    if (!existsSync(file)) {
      console.error(`[${missionId}] missing file for ${src} -> ${file}`);
      missing++;
    }
  }
}

if (missing > 0) {
  console.error(`Audio verify failed: ${missing} issue(s), ${checked} path(s) checked`);
  process.exit(1);
}

console.log(`Audio verify passed: ${checked} asset path(s) OK`);
