Output ../public/release/gifs/agentop-start-en.gif

Set Shell "bash"
Set FontSize 22
Set Width 1200
Set Height 700
Set Theme "Dracula"
Set Padding 20
Set TypingSpeed 60ms

# Live menu order confirmed against the real binary (v1.7.0):
#   0 agentistics · 1 agentistics central · 2 Connect to a central ·
#   3 Stop a running service… (only shown when something is running) ·
#   4 Switch to Português · 5 Quit
# Navigate down through the launcher, then back up to "agentistics" and enter
# its "how should it run?" submenu — a safe, real demo that doesn't touch the
# central or docker (we never actually pick a run mode).
Type "agentop start"
Enter
Sleep 1500ms
Down
Sleep 500ms
Down
Sleep 500ms
Up
Sleep 500ms
Up
Sleep 800ms
Enter
Sleep 1200ms
Down
Sleep 500ms
Down
Sleep 500ms
Up
Sleep 800ms
Ctrl+C
Sleep 500ms
Type "q"
Sleep 500ms
