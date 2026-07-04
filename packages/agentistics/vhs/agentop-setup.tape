Output ../public/release/gifs/agentop-setup.gif

Set Shell "bash"
Set FontSize 22
Set Width 1200
Set Height 700
Set Theme "Dracula"
Set Padding 20
Set TypingSpeed 60ms

# Live wizard order confirmed against the real binary: solo(0) / central(1) /
# member(2). Down once lands on "central"; entering it safely reports the
# real "central mode needs the agentistics repo" message when run outside a
# checkout (findCentralScript() can't locate central.sh from this cwd) — no
# docker/central side effects either way.
Type "agentop setup"
Enter
Sleep 2000ms
Down
Sleep 600ms
Enter
Sleep 1500ms
Ctrl+C
