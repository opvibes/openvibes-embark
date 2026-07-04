Output ../public/release/gifs/agentop-central-up.gif

Set Shell "bash"
Set FontSize 20
Set Width 1200
Set Height 700
Set Theme "Dracula"
Set Padding 20
Set TypingSpeed 40ms

# `agentop central` shells out to central.sh, which it only finds when the
# cwd is (or is under) the agentistics repo checkout — so we cd there first.
# PROJECT/ENV_FILE point at a disposable capture-only compose project+port
# (48090) so this never touches the shared team-mode central already running
# on this host at the site's documented default port 48080. This bookkeeping
# is host/recording-specific, not part of the normal `agentop central up`
# flow a real user follows, so it's hidden from the public-facing GIF.
Hide
Type "cd /home/mithrandir/agentistics"
Enter
Sleep 500ms
Type "export PROJECT=capture-central ENV_FILE=central.capture.env"
Enter
Sleep 500ms
Show
Type "agentop central up"
Enter
Sleep 1000ms
# central.capture.env already exists, and stdin is a real TTY here, so
# central.sh asks "Re-run interactive setup? [y/N]" — accept the default (No).
Enter
Sleep 25000ms
Type "agentop central status"
Enter
Sleep 1500ms
