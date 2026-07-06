Output ../public/release/gifs/agentop-start-pt.gif

Set Shell "bash"
Set FontSize 22
Set Width 1200
Set Height 700
Set Theme "Dracula"
Set Padding 20
Set TypingSpeed 60ms

# Same launcher, demonstrating the EN -> PT toggle. Confirmed live: index 4 is
# "Switch to Português"; selecting it re-renders the banner/menu/status lines
# in Portuguese in place (verified against the real binary before recording).
Type "agentop start"
Enter
Sleep 1500ms
Down
Down
Down
Down
Sleep 800ms
Enter
Sleep 1800ms
Type "q"
Sleep 500ms

# Toggle back to English (hidden) so this host's real, shared lang preference
# (agentistics-preferences.json) isn't left in Portuguese for other tapes/users.
# The visible instance above is still alive at the top of its (now Portuguese)
# menu — Ctrl+C it first so the next "agentop start" is a fresh process.
Hide
Ctrl+C
Sleep 500ms
Type "agentop start"
Enter
Sleep 1500ms
Down
Down
Down
Down
Sleep 500ms
Enter
Sleep 1000ms
Ctrl+C
Sleep 500ms
Show
