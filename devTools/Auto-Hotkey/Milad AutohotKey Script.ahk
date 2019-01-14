#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

#!t::
Send, %A_YYYY%-%A_MM%-%A_DD%-%A_Hour%:%A_Min%
return

#!^t::
Send, %A_YYYY%-%A_MM%-%A_DD%
return

#!m::
Send, Milad is awesome

#!^s::
Send, ^!s
Sleep, 100
WinActivate, MINGW64:/d/Dropbox (milad productions)/_ROLC/Organize/O_Projects/Hifi/Scripts/DJ-Tools
Send, sync {Enter}
Sleep, 100
WinActivate, miladn @ do-re-milad - Version 0.69.0