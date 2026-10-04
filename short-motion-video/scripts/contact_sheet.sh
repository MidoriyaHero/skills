#!/usr/bin/env bash
# contact_sheet.sh — render one still per beat (in parallel) and tile them into one image.
# Usage: scripts/contact_sheet.sh <CompositionId> [frames...]   (run from the Remotion project root)
# Default frames = midpoint of each beat on the 20 s / 120 BPM grid.
set -euo pipefail
COMP="${1:-Portrait}"; shift || true
FRAMES=("$@"); [ ${#FRAMES[@]} -eq 0 ] && FRAMES=(62 170 262 352 442 520 592)
OUT="out/sheet"; mkdir -p "$OUT"
for f in "${FRAMES[@]}"; do
  npx remotion still src/index.ts "$COMP" "$OUT/${COMP}_$f.jpeg" --frame "$f" --image-format jpeg --overwrite --log error &
done
wait
INPUTS=(); FILTER=""
for i in "${!FRAMES[@]}"; do INPUTS+=(-i "$OUT/${COMP}_${FRAMES[$i]}.jpeg"); FILTER+="[$i]scale=-1:720[s$i];"; done
for i in "${!FRAMES[@]}"; do FILTER+="[s$i]"; done
FILTER+="hstack=${#FRAMES[@]}"
ffmpeg -v error -y "${INPUTS[@]}" -filter_complex "$FILTER" "out/contact_sheet_${COMP}.jpg"
echo "out/contact_sheet_${COMP}.jpg"
