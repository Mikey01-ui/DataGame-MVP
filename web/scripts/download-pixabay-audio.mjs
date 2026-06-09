#!/usr/bin/env node
/**
 * Downloads Pixabay SFX into public/media via headless browser.
 * License: Pixabay Content License — sources logged to pixabay-sources.json
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/** @type {{ out: string, search: string, label: string }[]} */
const ASSETS = [
  { out: "public/media/m3/sfx-correct.mp3", search: "ui success chime", label: "M3 correct" },
  { out: "public/media/m3/sfx-wrong.mp3", search: "ui error buzz", label: "M3 wrong" },
  { out: "public/media/m3/sfx-detection-warn.mp3", search: "notification warning beep", label: "M3 detection warn" },
  { out: "public/media/m3/sfx-game-over.mp3", search: "game over arcade", label: "M3 game over" },
  { out: "public/media/m3/sfx-signoff-ok.mp3", search: "success chime short", label: "M3 signoff ok" },
  { out: "public/media/m3/sfx-signoff-deny.mp3", search: "denied buzzer", label: "M3 signoff deny" },
  { out: "public/media/m3/sfx-vault-wrong.mp3", search: "lock wrong metal", label: "M3 vault wrong" },
  { out: "public/media/m3/sfx-vault-bolt.mp3", search: "bolt latch metal", label: "M3 vault bolt" },
  { out: "public/media/m3/sfx-vault-open.mp3", search: "heavy door slide", label: "M3 vault open" },
  { out: "public/media/m3/sfx-vault-reveal.mp3", search: "cinematic hit short", label: "M3 vault reveal" },
  { out: "public/media/m3/ambient-terminal.mp3", search: "server room ambient", label: "M3 ambient" },
  { out: "public/media/m4/sfx-correct.mp3", search: "ui click success", label: "M4 correct" },
  { out: "public/media/m4/sfx-wrong.mp3", search: "wrong answer buzzer", label: "M4 wrong" },
  { out: "public/media/m4/sfx-detection-warn.mp3", search: "alert beep ui", label: "M4 detection warn" },
  { out: "public/media/m4/sfx-game-over.mp3", search: "game over fail", label: "M4 game over" },
  { out: "public/media/m4/ambient-process.mp3", search: "office ambient hum", label: "M4 ambient" },
];

const sources = [];

async function findFirstSoundPage(page, search) {
  const q = encodeURIComponent(search);
  await page.goto(`https://pixabay.com/sound-effects/search/${q}/`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(3000);

  const href = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a[href*="/sound-effects/"]')];
    for (const a of links) {
      const h = a.getAttribute("href") || "";
      if (h.includes("/search/")) continue;
      if (/\/sound-effects\/[a-z0-9-]+-\d+\/?$/i.test(h)) {
        return h.startsWith("http") ? h : `https://pixabay.com${h}`;
      }
    }
    return null;
  });

  if (!href) throw new Error(`No search result for "${search}"`);
  return href.split("?")[0];
}

async function resolveAudioUrl(page) {
  let audioUrl = null;
  const capture = (res) => {
    const u = res.url();
    const ct = res.headers()["content-type"] || "";
    if (audioUrl) return;
    if (u.includes("cdn.pixabay.com/audio/") && /mpeg|audio/i.test(ct)) audioUrl = u.split("?")[0];
  };
  page.on("response", capture);

  await page.locator("button.playIcon--HqLSy, button[aria-label='paused'], button[aria-label='playing']").first().click({
    timeout: 10000,
  });
  await page.waitForTimeout(4000);

  if (!audioUrl) {
    audioUrl = await page.evaluate(() => {
      const a = document.querySelector("audio");
      const src = a?.currentSrc || a?.src;
      return src && src.includes(".mp3") ? src.split("?")[0] : null;
    });
  }

  page.off("response", capture);
  if (!audioUrl || !audioUrl.endsWith(".mp3")) throw new Error("Could not resolve MP3 URL");
  return audioUrl;
}

async function downloadAsset(context, searchPage, asset) {
  const dest = path.join(ROOT, asset.out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  const soundPage = await findFirstSoundPage(searchPage, asset.search);
  const page = await context.newPage();
  try {
    await page.goto(soundPage, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(3000);
    const audioUrl = await resolveAudioUrl(page);
    const resp = await context.request.get(audioUrl);
    if (!resp.ok()) throw new Error(`HTTP ${resp.status()}`);
    const buf = await resp.body();
    if (buf.length < 500 || buf[0] !== 0xff || (buf[1] & 0xe0) !== 0xe0) {
      throw new Error(`Response is not valid MP3 (${buf.length} bytes)`);
    }
    fs.writeFileSync(dest, buf);
    sources.push({
      file: asset.out,
      label: asset.label,
      search: asset.search,
      page: soundPage,
      audioUrl,
      bytes: buf.length,
    });
    console.log(`✓ ${asset.out} (${(buf.length / 1024).toFixed(1)} KB)`);
    console.log(`  ${soundPage}`);
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const searchPage = await context.newPage();
  const failed = [];

  for (const asset of ASSETS) {
    try {
      await downloadAsset(context, searchPage, asset);
    } catch (err) {
      console.error(`✗ ${asset.out}: ${err.message}`);
      failed.push({ ...asset, error: err.message });
    }
  }

  await searchPage.close();
  await browser.close();

  const manifest = path.join(ROOT, "public/media/pixabay-sources.json");
  fs.writeFileSync(
    manifest,
    JSON.stringify(
      {
        license: "https://pixabay.com/service/license/",
        downloadedAt: new Date().toISOString(),
        sources,
        failed,
      },
      null,
      2
    )
  );
  console.log(`\nManifest: ${manifest}`);
  console.log(`OK: ${sources.length}  Failed: ${failed.length}`);
  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
