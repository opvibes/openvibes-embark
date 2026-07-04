Output ../public/release/gifs/agentop-tui.gif

Set Shell "bash"
Set FontSize 22
Set Width 1200
Set Height 700
Set Theme "Dracula"
Set Padding 20
Set TypingSpeed 60ms

# `agentop tui` scans this host's Claude/Codex/Gemini/Copilot project dirs
# (real data, ~20-30s the first time) then asks a short one-time config
# wizard (refresh interval / OTLP endpoint / neural animation / project
# filter) before rendering the live dashboard. Accepting the default at each
# prompt (bare Enter) selects all projects and lands on the real live view.
Type "agentop tui"
Enter
Sleep 35000ms
Enter
Sleep 3000ms
Enter
Sleep 3000ms
Enter
Sleep 3000ms
Enter
Sleep 15000ms
Ctrl+C
