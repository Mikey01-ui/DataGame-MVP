#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
M3="$ROOT/public/media/m3"
M4="$ROOT/public/media/m4"

mkdir -p "$M3" "$M4"

gen_sfx() {
  local out="$1"
  local filter="$2"
  ffmpeg -y -hide_banner -loglevel error -f lavfi -i "$filter" -codec:a libmp3lame -q:a 6 "$out"
}

# M3 SFX
gen_sfx "$M3/sfx-correct.mp3" "sine=frequency=880:duration=0.12" 
gen_sfx "$M3/sfx-wrong.mp3" "sine=frequency=180:duration=0.28"
gen_sfx "$M3/sfx-detection-warn.mp3" "sine=frequency=440:duration=0.2"
gen_sfx "$M3/sfx-game-over.mp3" "sine=frequency=110:duration=0.5"
gen_sfx "$M3/sfx-signoff-ok.mp3" "sine=frequency=660:duration=0.35"
gen_sfx "$M3/sfx-signoff-deny.mp3" "sine=frequency=220:duration=0.4"
gen_sfx "$M3/sfx-vault-wrong.mp3" "anoisesrc=d=0.25:c=white:a=0.3"
gen_sfx "$M3/sfx-vault-bolt.mp3" "anoisesrc=d=0.2:c=pink:a=0.4"
gen_sfx "$M3/sfx-vault-open.mp3" "sine=frequency=80:duration=0.6"
gen_sfx "$M3/sfx-vault-reveal.mp3" "sine=frequency=1200:duration=0.15"
ffmpeg -y -hide_banner -loglevel error -f lavfi -i "anoisesrc=d=8:c=pink:a=0.08" -af "lowpass=f=200" -codec:a libmp3lame -q:a 6 "$M3/ambient-terminal.mp3"

# M4 SFX (distinct frequencies from M3)
gen_sfx "$M4/sfx-correct.mp3" "sine=frequency=784:duration=0.12"
gen_sfx "$M4/sfx-wrong.mp3" "sine=frequency=160:duration=0.28"
gen_sfx "$M4/sfx-detection-warn.mp3" "sine=frequency=520:duration=0.2"
gen_sfx "$M4/sfx-game-over.mp3" "sine=frequency=95:duration=0.5"
ffmpeg -y -hide_banner -loglevel error -f lavfi -i "anoisesrc=d=8:c=brown:a=0.07" -af "lowpass=f=180" -codec:a libmp3lame -q:a 6 "$M4/ambient-process.mp3"

echo "Generated placeholder audio in $M3 and $M4"
