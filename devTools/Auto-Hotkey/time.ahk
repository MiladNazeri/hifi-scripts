#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

#!t::
Send, %A_YYYY%-%A_MM%-%A_DD%_%A_Hour%-%A_Min%-%A_Sec%
return

#!^t::
Send, %A_YYYY%-%A_MM%-%A_DD%
return

; # win
; ! alt
; ^ ctrl
; + shift

