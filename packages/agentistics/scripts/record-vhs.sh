#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$DIR/public/release/gifs"

for tape in "$DIR"/vhs/*.tape; do
  echo "Recording $(basename "$tape")..."
  (cd "$DIR/vhs" && vhs "$(basename "$tape")")
done

echo "Done. GIFs in $DIR/public/release/gifs/"
