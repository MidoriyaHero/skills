#!/usr/bin/env bash
# render_all.sh — render every format in parallel, each with its own worker pool.
# Usage: scripts/render_all.sh [name] [CompositionId...]   e.g. render_all.sh acme Teaser-Portrait Teaser-Landscape
# Workers per process = CPU count / number of compositions (min 2).
set -euo pipefail
NAME="${1:-showreel}"; shift || true
COMPS=("$@"); [ ${#COMPS[@]} -eq 0 ] && COMPS=(Showreel-Portrait Showreel-Square Showreel-Landscape)
CPUS=$(sysctl -n hw.ncpu 2>/dev/null || nproc)
PER=$(( CPUS / ${#COMPS[@]} )); [ "$PER" -lt 2 ] && PER=2
mkdir -p out
for c in "${COMPS[@]}"; do
  npx remotion render src/index.ts "$c" "out/${NAME}-${c}.mp4" --codec h264 --crf 16 --concurrency "$PER" --overwrite --log error &
done
wait
for c in "${COMPS[@]}"; do
  printf "%-10s " "$c"; ffprobe -v error -show_entries format=duration:stream=width,height -of csv=p=0 "out/${NAME}-${c}.mp4" | tr '\n' ' '; echo
done
