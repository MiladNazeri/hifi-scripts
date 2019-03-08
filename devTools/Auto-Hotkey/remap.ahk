; Script to help remap your keyboard in a secondary mode
Suspend On

isFlashOn := true
isOn := false
msgOn := "Y E S"
msgOff := "N O"
currentMessage := msgOff
baseCapsLockMessage := "Caps:"
capsLockStatus := 0

caplockState := baseCapsLockMessage + msgOff
; Toggle suspense with Ctrl + 6
;^6::Suspend, toggle
CapsLock & `;::
^`;::
Suspend, toggle
isOn := !isOn
if (isOn){
    currentMessage := msgOn
} else {
    currentMessage := msgOff
}

; GetKeyState, capLockStatus, CapsLock, T
; if (capLockStatus = D) {
;     MsgBox, "on d"
;     caplockState := baseCapsLockMessage + msgOn
; } else {
;     MsgBox, "off d"
;     caplockState := baseCapsLockMessage + msgOff
; }
#Persistent
ToolTip, %currentMessage%
SetTimer, RemoveToolTip, -400

if (isFlashOn){
    SysGet, MonitorCount, MonitorCount
    Loop, %MonitorCount%
    {
        WinGetPos, x, y,,,%A_Index%
        SysGet, MonitorName, MonitorName, %A_Index%
        SysGet, Monitor, Monitor, %A_Index%
        SysGet, MonitorWorkArea, MonitorWorkArea, %A_Index%
        centerHorizontal := MonitorLeft
        centerVertical := MonitorTop
        CustomColor := "000000"  ; Can be any RGB color (it will be made transparent below).
        ; Gui, %A_Index%: +LastFound +AlwaysOnTop -Caption +ToolWindow  ; +ToolWindow avoids a taskbar button and an alt-tab menu item. 
        ; Gui, %A_Index%: Color, %CustomColor%
        ; Gui, %A_Index%: Font, s40 cFFFFFF ; Set a large fount size (32-point).
        ; Gui, %A_Index%: Add, Text,, %currentMessage%  ; XX & YY serve to auto-size the window.
        ; Gui, %A_Index%: Show, x%centerHorizontal% y%centerVertical% NoActivate  ; NoActivate avoids deactivating the currently active window.
        if (!x) {
            Progress,%A_Index%: m zh0 fs8 w30 x%centerHorizontal% y%centerVertical%, %currentMessage%,, %A_Index%
        } else {
            Progress,%A_Index%: m zh0 fs8 w30 x%x% y%y%,%currentMessage%,, %A_Index%
        }
    }
    ; sleep 300
    ; Gui, 1: Destroy
    ; Gui, 2: Destroy
}
return

RemoveToolTip:
ToolTip
return

0::
Progress, 1: OFF
Progress, 2: OFF
return

^0::
isFlashOn := !isFlashOn
return


6::
FileRead, FileContents, %A_WorkingDir%\snippets.txt
Gui, 3: Font, s16, Verdana
Gui, 3: +AlwaysOnTop -Caption +ToolWindow 
Gui, 3: Add, Text,gClose, %FileContents% 
Gui, 3: SHOW, xCenter yCenter
return

Close:
Gui, 3: Destroy
return

; https://autohotkey.com/docs/KeyList.htm
; ` escape a character
; # Windows key
; + Shift
; ^ Ctrl
; ! Alt

; Arrow keys
i::Up
j::Left
k::Down
l::Right
,::^Left  ; This does control Left and right to skip between words = default windows function
.::^Right 

; Standard Navigation
u::Home
o::End
p::PgUp
`;::PgDn

; Additonal function keys
n::Tab
h::Backspace
y::Delete
1::Esc
4::^w ; close window

; cut copy and paste
c::^c 
v::^v
x::^x

; VS Code things
q::^+o ; opens up the symbols finder
w::^+[ ; fold
e::^+] ; unfold
g::^g ; Go to line
r::+!Down ; Copies the line down
z::^z ; undo
f::^f ; finds
7::+Up ; shift up to highlight above current line
8::+Down ; high light below
9::^+\ ; go to the end of the current bracket
a::+F12 ; find all references to the current high light
s::^s ; saves a file
d::^/ ; turns line into a comment
b::+!g ; Smart Grow
5::^d ; add the next occurance of highlighted item
2::^#!2 ; Git commit all
3::^b ; Files
^w::^#!w ; Fold region 1

t::Click
^t::Click, right
'::WheelUp
/::WheelDown
; 6::MouseMove, % A_CaretX, % A_CaretY
; ^i::MouseMove, 0, -20, 0, R  ; Win+UpArrow hotkey => Move cursor upward
; ^k::MouseMove, 0, 20, 0, R  ; Win+DownArrow => Move cursor downward
; ^j::MouseMove, -20, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
; ^l::MouseMove, 20, 0, 0, R  ; Win+RightArrow => Move cursor to the right
; +i::MouseMove, 0, -5, 0, R  ; Win+UpArrow hotkey => Move cursor upward
; +k::MouseMove, 0, 5, 0, R  ; Win+DownArrow => Move cursor downward
; +j::MouseMove, -5, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
; +l::MouseMove, 5, 0, 0, R  ; Win+RightArrow => Move cursor to the right
; !i::MouseMove, 0, -175, 0, R  ; Win+UpArrow hotkey => Move cursor upward
; !k::MouseMove, 0, 175, 0, R  ; Win+DownArrow => Move cursor downward
; !j::MouseMove, -175, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
; !l::MouseMove, 175, 0, 0, R  ; Win+RightArrow => Move cursor to the right
; 6::MouseMove, % A_CaretX, % A_CaretY
UP::MouseMove, 0, -40, 0, R  ; Win+UpArrow hotkey => Move cursor upward
DOWN::MouseMove, 0, 40, 0, R  ; Win+DownArrow => Move cursor downward
LEFT::MouseMove, -40, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
RIGHT::MouseMove, 40, 0, 0, R  ; Win+RightArrow => Move cursor to the right
^!UP::MouseMove, 0, -10, 0, R  ; Win+UpArrow hotkey => Move cursor upward
^!DOWN::MouseMove, 0, 10, 0, R  ; Win+DownArrow => Move cursor downward
^!LEFT::MouseMove, -10, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
^!RIGHT::MouseMove, 10, 0, 0, R  ; Win+RightArrow => Move cursor to the right
^UP::MouseMove, 0, -250, 0, R  ; Win+UpArrow hotkey => Move cursor upward
^DOWN::MouseMove, 0, 250, 0, R  ; Win+DownArrow => Move cursor downward
^LEFT::MouseMove, -250, 0, 0, R  ; Win+LeftArrow => Move cursor to the left
^RIGHT::MouseMove, 250, 0, 0, R  ; Win+RightArrow => Move cursor to the right





; Suspend means it's not runningSysGet, MonitorCount, MonitorCount
    ; Gui, 1: +AlwaysOnTop +Disabled -SysMenu +Owner -Caption ; +Owner avoids a taskbar button.
    ; Gui, 1: Add, Text,, %currentMessage%
    ; Gui, 1: Show, Center NoActivate, Title of Window  ; NoActivate avoids deactivating the currently active window.
; Progress,2: B zh0 fs15 x2900 y924 w80, %currentMessage%