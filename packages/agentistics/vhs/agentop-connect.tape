Output ../public/release/gifs/agentop-connect.gif

Set Shell "bash"
Set FontSize 22
Set Width 1200
Set Height 500
Set Theme "Dracula"
Set Padding 20
Set TypingSpeed 60ms

# NOTE: port 48080 (the site's documented default) is owned on this recording
# host by an unrelated shared container we must not touch/reuse, so this
# capture points at a disposable central on 48090 instead (brought up from
# /home/mithrandir/agentistics with PROJECT=capture-central ENV_FILE=central.capture.env,
# see scripts/record-vhs.sh). CAPTURE_TOKEN must be exported (a real token
# minted via the central's Team Manager API) before running this tape.
Type "agentop member connect --endpoint http://localhost:48090 --token $CAPTURE_TOKEN"
Enter
Sleep 2500ms
Type "agentop member status"
Enter
Sleep 1500ms

# Leave member mode again so this host's real, shared solo/en preferences
# (agentistics-preferences.json) aren't left mutated for other tapes/users
# after this recording finishes.
Hide
Type "agentop member leave"
Enter
Sleep 1500ms
Show
