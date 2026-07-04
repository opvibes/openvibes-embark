#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$DIR/public/release/gifs"

# agentop-start-en.tape and agentop-start-pt.tape navigate the launcher's
# menu by a fixed Down/Up keystroke count that assumes 6 items, which
# requires the "Stop a running service..." entry to be visible — it only
# appears while something (agentistics or agentistics central) is running.
# Recording those two tapes on a host with nothing running silently lands
# the keystrokes on the wrong item (no error from VHS). Warn loudly instead
# of failing silently.
if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q . && ! pgrep -f "agentop (server|central|tui|watch)" >/dev/null 2>&1; then
  echo "WARNING: no agentistics/agentistics-central service appears to be running." >&2
  echo "         agentop-start-en.tape and agentop-start-pt.tape assume a 6-item menu" >&2
  echo "         (with 'Stop a running service...' visible) — start one first, e.g.:" >&2
  echo "         cd /home/mithrandir/agentistics && agentop central up" >&2
fi

for tape in "$DIR"/vhs/*.tape; do
  echo "Recording $(basename "$tape")..."
  (cd "$DIR/vhs" && vhs "$(basename "$tape")")
done

echo "Done. GIFs in $DIR/public/release/gifs/"
